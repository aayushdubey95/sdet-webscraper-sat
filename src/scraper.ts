import { chromium } from "@playwright/test";
import { futureDate } from "./utils";

/**
 * Scrapes hotel data from Booking.com for given search criteria.
 */
async function main() {
  const browser = await chromium.launch({ headless: true });
  // Always create a fresh context, clearing any stored data
  const context = await browser.newContext({
    storageState: undefined // ensures no reuse
    });

  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.clear();
    sessionStorage.clear();
    });

  const city = "Mumbai";
  const checkIn = futureDate(30);
  const checkOut = futureDate(35);

  await page.goto("https://www.booking.com/", {
    waitUntil: "domcontentloaded",
  });

  // Enter city
  await page.getByLabel("Where are you going?").fill(city);

  // Select dates
  await page.locator(`span[data-date='${checkIn}']`).click();
  await page.locator(`span[data-date='${checkOut}']`).click();

  // Configure guests: 2 adults + 1 infant
  await page.getByTestId("searchbox-form-button-icon").click();
  await page.getByTestId("occupancy-popup").isVisible();

  /**
   * Avoiding unnecessary crawling
   * 
   * Adults are 2 by default on booking.com, so no change needed there.
   * Increase children from 0 to 1 because default on booking.com is 0.
   */ 
  await page.locator('#group_children')
    .locator('xpath=../button[last()]')
    .click();
  await page.getByTestId('kids-ages-select').waitFor({ state: 'visible' });
  await page.getByTestId('kids-ages-select').click();
  await page.selectOption("select[name='age']", "1");
  await page.getByTestId("occupancy-popup").getByRole("button", { name: "Done" }).click();

  // Submit search
  await page.locator("button[type='submit']").click();
  await page.waitForLoadState("domcontentloaded");
  
  await browser.close();
}

main();
