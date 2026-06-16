/**
 * "Ending soon surveys" section: a row of highlighted cream cards.
 */

import type { Survey } from "../types/survey";
import { renderEndingCard } from "./survey-card";

/**
 * Renders the "ending soon" section.
 * @param surveys Surveys that are ending soon.
 * @returns HTML markup of the section.
 */
export function renderEndingSoon(surveys: Survey[]): string {
  if (surveys.length === 0) return "";
  const cards: string = surveys.map(renderEndingCard).join("");
  return `
    <section class="ending-soon" aria-labelledby="ending-soon-title">
      <h3 class="ending-soon__title" id="ending-soon-title">Ending soon surveys</h3>
      <div class="ending-soon__grid">${cards}</div>
    </section>
  `;
}
