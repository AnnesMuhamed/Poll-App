/**
 * Composes the complete home screen from its sections.
 */

import { getEndingSoonHomeSurveys, getHomeSurveys } from "../services/survey-store";
import { renderAppHeader } from "./app-header";
import { renderHero } from "./hero";
import { renderEndingSoon } from "./ending-soon";
import { renderSurveyList } from "./survey-list";
import { renderCreateSurveyDialog } from "./create-survey-dialog";

/**
 * Renders the entire home screen markup.
 * @returns HTML markup of the home screen.
 */
export function renderHome(): string {
  return `
    <div class="page">
      ${renderAppHeader()}
      <main class="home">
        ${renderHero()}
        <section class="surveys" aria-labelledby="surveys-title">
          <h2 class="surveys__title" id="surveys-title">Your surveys</h2>
          ${renderEndingSoon(getEndingSoonHomeSurveys())}
          ${renderSurveyList(getHomeSurveys("active"))}
        </section>
      </main>
      ${renderCreateSurveyDialog()}
    </div>
  `;
}
