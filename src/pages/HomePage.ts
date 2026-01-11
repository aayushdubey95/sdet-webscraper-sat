import { Page } from "@playwright/test";

export class HomePage {
  constructor(public page: Page) {}

  /**
   * Dismisses Ad popup on the Booking.com page, such as the Genius sign-in popup.
   * @param page - The Playwright Page object representing the browser page.
   */
  async dismissAdPopup() {
    const popupDismiss = this.page.locator(
      "button[aria-label='Dismiss sign-in info.'] span span"
    );

    try {
      await popupDismiss.waitFor({ state: "visible", timeout: 8000 });
      await popupDismiss.click();
      console.log("✔ Genius popup dismissed");
    } catch {
      console.log("ℹ No Genius popup to dismiss");
    }
  }

  /**
   * Enters the city in the search box.
   */
  async enterCity(city: string) {
    await this.page.getByLabel("Where are you going?").fill(city);
  }

  /**
   * Opens the date picker by clicking the Check-in field.
   */
  async openDatePicker() {
    await this.page.locator("[data-testid='date-display-field-start']").click();
  }

  /**
   * Selects a specific date on the Booking.com calendar (1 year range).
   * @param page - The Playwright Page object representing the browser page.
   * @param targetDate - The target date to select in YYYY-MM-DD format.
   */
  async selectBookingDate(targetDate: string) {
    const dateCell = this.page.locator(`span[data-date='${targetDate}']`);

    // If date is visible, just click
    if (await dateCell.isVisible()) {
      await dateCell.click();
      return;
    }

    // Otherwise, navigate months
    for (let i = 0; i < 12; i++) {
      const nextBtn = this.page.locator("button[aria-label='Next month']");

      if (await dateCell.isVisible()) {
        await dateCell.click();
        return;
      }

      await nextBtn.click();
      await this.page.waitForTimeout(300);
    }

    throw new Error("Date not found after navigating 12 months");
  }

  /**
   * Opens the guest selection popup.
   */
  async openGuestsPopup() {
    await this.page.getByTestId("searchbox-form-button-icon").click();
    await this.page.getByTestId("occupancy-popup").isVisible();
  }

  /**
   * Increments the number of children in the guest selection on Booking.com by 1.
   */
  async incrementChildren() {
    const input = this.page.locator("#group_children");

    // The counter wrapper is the PREVIOUS sibling div
    const counter = input.locator("xpath=preceding-sibling::div[1]");

    // Click the inner <span> of the PLUS button
    await counter.locator("button span").last().click();
  }

  /**
   * Sets child age = 1
   */
  async setChildAge() {
    await this.page.getByTestId("kids-ages-select").waitFor({ state: "visible" });
    await this.page.getByTestId("kids-ages-select").click();
    await this.page.selectOption("select[name='age']", "1");
  }

  /**
   * Confirms guest selection.
   */
  async confirmGuests() {
    await this.page
      .getByTestId("occupancy-popup")
      .getByRole("button", { name: "Done" })
      .click();

    await this.page.waitForLoadState("domcontentloaded", { timeout: 2000 });
  }

  /**
   * Clicks the Search button.
   */
  async clickSearch() {
    await this.page
      .getByRole("button", { name: /^Search$/ })
      .waitFor({ state: "visible", timeout: 5000 });

    await this.page.getByRole("button", { name: /^Search$/ }).click();
  }
}
