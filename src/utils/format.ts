/**
 * Formatting helpers for survey labels.
 */

/**
 * Builds the "Ends in X Day(s)" label for a survey.
 * @param days Remaining days until the deadline.
 * @returns Human-readable end label.
 */
export function formatEndsIn(days: number): string {
  const unit: string = days === 1 ? "Day" : "Days";
  return `Ends in ${days} ${unit}`;
}
