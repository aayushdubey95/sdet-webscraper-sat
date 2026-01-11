/**
 * Generates a future date string in the format YYYY-MM-DD.
 *
 * This function adds the specified number of days to today's date
 * and returns the result formatted exactly as required by Booking.com
 * date-picker selectors (data-date="YYYY-MM-DD").
 *
 * @param daysAhead - Number of days from today to compute the future date.
 * @returns A future date string formatted as YYYY-MM-DD.
 */
export function futureDate(daysAhead: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  return d.toISOString().split("T")[0];
}

/**
 * Selects a specific date on the Booking.com calendar (1 year range).
 * @param page - The Playwright Page object representing the browser page.
 * @param targetDate - The target date to select in YYYY-MM-DD format.
 */
export async function selectBookingDate(page, targetDate: string) {
  const dateCell = page.locator(`span[data-date='${targetDate}']`);

  // If date is visible, just click
  if (await dateCell.isVisible()) {
    await dateCell.click();
    return;
  }

  // Otherwise, navigate months
  for (let i = 0; i < 12; i++) {
    const nextBtn = page.locator("button[aria-label='Next month']");

    // If date appeared, click it
    if (await dateCell.isVisible()) {
      await dateCell.click();
      return;
    }

    await nextBtn.click();
    await page.waitForTimeout(300);
  }

  throw new Error("Date not found after navigating 12 months");
}

/**
 * Dismisses Ad popup on the Booking.com page, such as the Genius sign-in popup.
 * @param page - The Playwright Page object representing the browser page.
 */
export async function dismissAdPopup(page) {
  // Wait up to 5 seconds for Genius popup to appear
  const popupDismiss = page.locator(
    "button[aria-label='Dismiss sign-in info.'] span span"
  );

  try {
    // If popup appears, click it
    await popupDismiss.waitFor({ state: "visible", timeout: 8000 });
    await popupDismiss.click();
    console.log("✔ Genius popup dismissed");
  } catch {
    // If popup never appears, continue silently
    console.log("ℹ No Genius popup to dismiss");
  }
}

/**
 * Increments the number of children in the guest selection on Booking.com by 1.
 * @param page
 */
export async function incrementChildren(page) {
  const input = page.locator("#group_children");

  // The counter wrapper is the PREVIOUS sibling div
  const counter = input.locator("xpath=preceding-sibling::div[1]");

  // Click the inner <span> of the PLUS button
  await counter.locator("button span").last().click();
}
