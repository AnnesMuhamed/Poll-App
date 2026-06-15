/**
 * Card representations of a survey: the cream "ending soon" card and
 * the dark card used in the active survey list.
 */

import type { Survey } from "../types/survey";
import { escapeHtml } from "../utils/dom";
import { formatEndsIn } from "../utils/format";

/**
 * Renders a cream "ending soon" card with a folder-style tab.
 * @param survey The survey to display.
 * @returns HTML markup of the card.
 */
export function renderEndingCard(survey: Survey): string {
  return `
    <article
      class="ending-card"
      role="link"
      tabindex="0"
      data-action="open-survey"
      data-survey-id="${escapeHtml(survey.id)}"
      aria-label="${escapeHtml(survey.title)} – open survey"
    >
      <p class="ending-card__category">${escapeHtml(survey.category)}</p>
      <h4 class="ending-card__title">${escapeHtml(survey.title)}</h4>
      <span class="ending-card__badge">${formatEndsIn(survey.endsInDays)}</span>
    </article>
  `;
}

/**
 * Renders a dark survey card for the active survey list.
 * @param survey The survey to display.
 * @returns HTML markup of the card.
 */
export function renderListCard(survey: Survey): string {
  return `
    <article
      class="list-card"
      role="link"
      tabindex="0"
      data-action="open-survey"
      data-survey-id="${escapeHtml(survey.id)}"
      aria-label="${escapeHtml(survey.title)} – open survey"
    >
      <p class="list-card__category">${escapeHtml(survey.category)}</p>
      <h4 class="list-card__title">${escapeHtml(survey.title)}</h4>
      <span class="list-card__badge">${formatEndsIn(survey.endsInDays)}</span>
    </article>
  `;
}
