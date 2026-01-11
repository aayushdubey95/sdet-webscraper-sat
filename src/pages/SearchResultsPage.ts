import { Page } from "@playwright/test";

export class SearchResultsPage {
  constructor(public page: Page) {}

  /**
   * Applies the 5-star filter.
   * Uses working Indian DOM filter logic.
   */
  async applyFiveStarFilter() {
    await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });
    await this.page
      .locator(
        " [data-testid='filters-group']:has-text('Property rating') div[data-testid='filters-group-label-container']:has-text('5 stars')"
      )
      .waitFor({ state: "visible", timeout: 10000 });

    await this.page
      .locator(
        " [data-testid='filters-group']:has-text('Property rating') div[data-testid='filters-group-label-container']:has-text('5 stars')"
      )
      .click();

    await this.page.waitForLoadState("domcontentloaded", { timeout: 5000 });

    await this.page
      .locator("button[data-testid='filter:class=5']")
      .waitFor({ state: "visible", timeout: 8000 });
  }

  /**
   * Scrolls to bottom to load all hotel results.
   */
  async loadAllHotels() {
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  }

  /**
   * Extracts only the highest-rated 5-star hotel.
   */
  async getBestFiveStarHotel() {
    const hotels = this.page.getByTestId("property-card");
    const count = await hotels.count();

    let bestHotel = {
      name: "",
      rating: 0,
      price: "",
      url: "",
    };

    for (let i = 0; i < count; i++) {
      const hotel = hotels.nth(i);

      try {
        const name = await hotel
          .locator("div[data-testid='title']")
          .innerText()
          .catch(() => "");

        // Rating
        let rating = 0;
        try {
          const ratingText = await hotel
            .locator("div[data-testid='review-score'] div")
            .filter({ hasText: /^\d+(\.\d+)?$/ })
            .innerText();

          rating = parseFloat(ratingText);
        } catch {
          rating = 0;
        }

        // Price
        let price = "₹0";
        try {
          const priceText = await hotel
            .locator("span[data-testid='price-and-discounted-price']")
            .innerText();
          price = priceText.replace(/\s+/g, " ").trim();
        } catch {
          price = "₹0";
        }

        // URL
        const url = await hotel
          .locator("a")
          .first()
          .getAttribute("href")
          .catch(() => null);

        if (rating > bestHotel.rating) {
          bestHotel = { name, rating, price, url };
        }
      } catch {
        continue;
      }
    }

    return bestHotel;
  }
}
