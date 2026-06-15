/**
 * Active/Past survey list with filter tabs, a sort control and the
 * grid of dark survey cards.
 */

import type { Survey } from "../types/survey";
import { escapeHtml } from "../utils/dom";
import { renderListCard } from "./survey-card";

/**
 * Renders the survey list section including the toolbar.
 * @param surveys Surveys to display in the grid.
 * @returns HTML markup of the section.
 */
export function renderSurveyList(surveys: Survey[]): string {
  const cards: string = surveys.map(renderListCard).join("");
  const categories: string[] = [...new Set(surveys.map((s) => s.category))];
  return `
    <section class="survey-list" aria-label="Surveys">
      <div class="survey-list__toolbar">
        ${renderTabs()}
        ${renderSort(categories)}
      </div>
      <div class="survey-list__grid">${cards}</div>
    </section>
  `;
}

/**
 * Renders the Active/Past filter tabs.
 * @returns HTML markup of the tabs.
 */
function renderTabs(): string {
  return `
    <div class="tabs" role="tablist" aria-label="Filter surveys">
      <button
        type="button"
        role="tab"
        class="tabs__tab tabs__tab--active"
        aria-selected="true"
        data-filter="active"
      >Active survey</button>
      <button
        type="button"
        role="tab"
        class="tabs__tab"
        aria-selected="false"
        data-filter="past"
      >Past survey</button>
    </div>
  `;
}

/**
 * Renders the "Sort by categories" control with its dropdown menu.
 * @param categories Category names shown as menu options.
 * @returns HTML markup of the sort control.
 */
function renderSort(categories: string[]): string {
  return `
    <div class="sort-menu" data-sort-menu>
      <button
        type="button"
        class="sort"
        data-action="toggle-sort"
        aria-haspopup="listbox"
        aria-expanded="false"
      >
        <span class="sort__label">Sort by categories</span>
        <span class="sort__chevron" aria-hidden="true">▾</span>
      </button>
      <ul class="sort-menu__list" role="listbox" hidden>
        ${renderSortItems(categories)}
      </ul>
    </div>
  `;
}

/**
 * Renders the list items of the sort dropdown.
 * @param categories Category names to render.
 * @returns HTML markup of the option list items.
 */
function renderSortItems(categories: string[]): string {
  return categories
    .map(
      (category: string): string =>
        `<li class="sort-menu__item" role="option" data-category="${escapeHtml(category)}">${escapeHtml(category)}</li>`,
    )
    .join("");
}
