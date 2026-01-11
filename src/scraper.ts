import { chromium } from "@playwright/test";
import { futureDate } from "./utils";
import * as fs from "fs";

import { HomePage } from "./pages/HomePage";
import { SearchResultsPage } from "./pages/SearchResultsPage";

/**
 * Scrapes hotel data from Booking.com for given search criteria.
 */
async function main(
  city: string = "Mumbai",
  checkInOffsetDays: number = 60,
  checkOutOffsetDays: number = 65
) {
  const browser = await chromium.launch({
    channel: "chrome",
    headless: false, 
  });

  const context = await browser.newContext({
    storageState: undefined,
  });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
  });

  await page.goto("https://www.booking.com/", {
    waitUntil: "domcontentloaded",
  });

  // Initialize POM classes
  const home = new HomePage(page);
  const resultsPage = new SearchResultsPage(page);

  await home.dismissAdPopup();

  // Enter city
  await home.enterCity(city);

  // Select dates
  await home.openDatePicker();
  await home.selectBookingDate(futureDate(checkInOffsetDays));
  await home.selectBookingDate(futureDate(checkOutOffsetDays));

  // Configure guests
  await home.openGuestsPopup();
  await home.incrementChildren();
  await home.setChildAge();
  await home.confirmGuests();

  // Submit search
  await home.clickSearch();
  await page.waitForTimeout(10000); // Needed to ensure results load before filtering, no dynamic wait works here.

  // Apply 5-star filter
  await resultsPage.applyFiveStarFilter();

  // Extract best hotel
  await resultsPage.loadAllHotels();
  const bestHotel = await resultsPage.getBestFiveStarHotel();

  // Save JSON
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, "-");
  const filePath = `scraperResults/best-hotel-${timestamp}.json`;
  fs.writeFileSync(filePath, JSON.stringify(bestHotel, null, 2));
  console.log(`Saved highest rated 5-star hotel → ${filePath}`);

  await browser.close();
}

main();