import { chromium } from "@playwright/test";
import { dismissAdPopup, futureDate, selectBookingDate, incrementChildren } from "./utils";
import * as fs from "fs";

/**
 * Scrapes hotel data from Booking.com for given search criteria.
 */
async function main( city: string = "Mumbai", checkInOffsetDays: number = 60, checkOutOffsetDays: number = 65) {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false, // If we set it true then we'll have to give proxies to load Indian version of booking.com.
  });

  // Always create a fresh context, clearing any stored data.
  const context = await browser.newContext({
    storageState: undefined, // ensures no reuse
   });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

  // Load the actual homepage we're using chrome channel 
  await page.goto("https://www.booking.com/", {
    waitUntil: "domcontentloaded",
  });

  await dismissAdPopup(page);

  // Enter city (default: Mumbai)
  await page.getByLabel("Where are you going?").fill(city);

  // Select dates (default: 60 and 65 days in future)
 await page.locator("[data-testid='date-display-field-start']").click();
 await selectBookingDate(page, futureDate(checkInOffsetDays));
 await selectBookingDate(page, futureDate(checkOutOffsetDays));

  // Configure guests: 2 adults + 1 infant
  await page.getByTestId("searchbox-form-button-icon").click();
  await page.getByTestId("occupancy-popup").isVisible();

  /**
   * Avoiding unnecessary crawling
   * 
   * Adults are 2 by default on booking.com, so no change needed there.
   * Increase children from 0 to 1 because default on booking.com is 0.
   */ 
  await incrementChildren(page);

  await page.getByTestId('kids-ages-select').waitFor({ state: 'visible' });
  await page.getByTestId('kids-ages-select').click();
  await page.selectOption("select[name='age']", "1");
  await page.getByTestId("occupancy-popup").getByRole("button", { name: "Done" }).click();
  await page.waitForLoadState("domcontentloaded", { timeout: 2000 });

  // Submit search
  await page.getByRole("button", { name: /^Search$/ }).waitFor({ state: 'visible', timeout: 5000 });
  await page.getByRole("button", { name: /^Search$/ }).click();
  await page.waitForTimeout(8000); // wait for results to load, no dynamic wait is working reliably here.

  // Apply 5-star filter
  await page.locator(" [data-testid='filters-group']:has-text('Property rating') div[data-testid='filters-group-label-container']:has-text('5 stars')").waitFor({ state: "visible", timeout: 10000 });
  await page.locator(" [data-testid='filters-group']:has-text('Property rating') div[data-testid='filters-group-label-container']:has-text('5 stars')").click();
  await page.waitForLoadState("domcontentloaded", { timeout: 10000 });
  await page.locator("button[data-testid='filter:class=5']").waitFor({ state: "visible", timeout: 8000 });

  // Extract hotel cards.
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight)); // scroll to bottom to load all hotels.
  const hotels = page.getByTestId("property-card");
  const count = await hotels.count();

  let bestHotel = {
  name: "",
  rating: 0,
  price: "",
  url: ""
};

  for (let i = 0; i < count; i++) {
   const hotel = hotels.nth(i);

  try {
    // Grab name of hotel and clean spacing
    const name = await hotel
      .locator("div[data-testid='title']")
      .innerText()
      .catch(() => "");

    // Grab & Extract only the numeric rating (e.g., 7.9)
    let rating = 0;
    try {
      const ratingText = await hotel
        .locator("div[data-testid='review-score'] div")
        .filter({ hasText: /^\d+(\.\d+)?$/ })
        .innerText();

      rating = parseFloat(ratingText);
    } catch {
      rating = 0; // no rating available
    }

    // Grab price (preserving INR ₹ symbol)
    let price = "₹0";
    try {
      const priceText = await hotel
        .locator("span[data-testid='price-and-discounted-price']")
        .innerText();

      // Clean spacing but KEEP ₹
      price = priceText.replace(/\s+/g, " ").trim();
    } catch {
      price = "₹0";
    }

    // Grab hotel URL
    const url = await hotel
      .locator("a")
      .first()
      .getAttribute("href")
      .catch(() => null);

    // Compare & store only if rating is higher
    if (rating > bestHotel.rating) {
      bestHotel = { name, rating, price, url };
    }
  } catch {
    continue;
  }
}

  // Save best hotel to JSON file.
  fs.writeFileSync("best-hotel.json", JSON.stringify(bestHotel, null, 2));
  console.log("Saved highest rated 5-star hotel to best-hotel.json");

  await browser.close();
}

main();
