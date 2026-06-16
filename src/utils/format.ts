/**
 * Formatting helpers for survey labels.
 */

/**
 * Builds the "Ends in X Day(s)" label for a survey.
 * @param days Remaining days until the deadline.
 * @returns Human-readable end label.
 */
export function formatEndsIn(days: number): string {
  if (!Number.isFinite(days)) return "No end date";
  if (days < 0) return "Expired";
  if (days === 0) return "Ends today";
  const unit: string = days === 1 ? "Day" : "Days";
  return `Ends in ${days} ${unit}`;
}

/**
 * Formats an ISO date (yyyy-mm-dd) as dd.mm.yyyy for display.
 * @param iso The ISO date string, or an empty string.
 * @returns The formatted date, or a dash when not set.
 */
export function formatDisplayDate(iso: string): string {
  if (!iso) return "—";
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}.${month}.${year}`;
}
