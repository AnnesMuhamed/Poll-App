/**
 * Active/Past survey list with filter tabs, a sort control and the
 * grid of dark survey cards.
 */

import type { Survey } from "../types/survey";
import { CATEGORIES } from "../data/categories";
import { escapeHtml } from "../utils/dom";
import { renderListCard } from "./survey-card";

/**
 * Renders the survey list section including the toolbar.
 * @param surveys Surveys to display in the grid.
 * @returns HTML markup of the section.
 */
export function renderSurveyList(surveys: Survey[]): string {
  const cards: string = surveys.map(renderListCard).join("");
  return `
    <section class="survey-list" aria-label="Surveys">
      <div class="survey-list__toolbar">
        ${renderTabs()}
        ${renderSort()}
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
 * @returns HTML markup of the sort control.
 */
function renderSort(): string {
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
        ${renderSortItems()}
      </ul>
      <span class="sort-menu__selected" data-selected hidden></span>
    </div>
  `;
}

/**
 * Renders the list items of the sort dropdown.
 * @returns HTML markup of the option list items.
 */
function renderSortItems(): string {
  return CATEGORIES
    .map(
      (category: string): string =>
        `<li class="sort-menu__item" role="option" data-category="${escapeHtml(category)}">${escapeHtml(category)}</li>`,
    )
    .join("");
}
