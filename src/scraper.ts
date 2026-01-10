import { chromium } from "@playwright/test";

/**
 * Scrapes hotel data from Booking.com for given search criteria.
 */
async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto("https://www.booking.com/", {
    waitUntil: "domcontentloaded",
  });

  await browser.close();
}

main();
