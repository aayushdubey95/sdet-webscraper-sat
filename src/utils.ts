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
