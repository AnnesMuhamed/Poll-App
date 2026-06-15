/**
 * Published survey view shown after the user creates a survey and clicks
 * "Publish". Renders the survey on a light page next to a results panel.
 */

import type {
  CreatedSurvey,
  CreatedQuestion,
  CreatedAnswer,
} from "../types/survey";
import { escapeHtml } from "../utils/dom";

/**
 * Renders the complete published survey view.
 * @param survey The survey created through the dialog.
 * @returns HTML markup of the survey view.
 */
export function renderSurveyView(survey: CreatedSurvey): string {
  return `
    <div class="survey-page">
      ${renderViewHeader()}
      <div class="survey-view">
        ${renderSurveyDetail(survey)}
        ${renderResultsPanel()}
      </div>
    </div>
  `;
}

/**
 * Renders the page header with the logo and the "Create survey" button.
 * @returns HTML markup of the header.
 */
function renderViewHeader(): string {
  return `
    <header class="survey-page__header">
      <a class="brand" href="/" aria-label="Poll App – Home">
        <img class="brand__logo" src="/dark_logo.svg" alt="Poll App" />
      </a>
      <button type="button" class="create-survey-btn" data-action="new-survey">Create survey</button>
    </header>
  `;
}

/**
 * Renders the survey card with its meta data and questions.
 * @param survey The survey to display.
 * @returns HTML markup of the survey card.
 */
function renderSurveyDetail(survey: CreatedSurvey): string {
  return `
    <article class="survey-detail">
      <span class="survey-detail__badge">Published</span>
      ${renderDetailMeta(survey)}
      <h1 class="survey-detail__title">${escapeHtml(survey.title)}</h1>
      <p class="survey-detail__desc">${escapeHtml(survey.description)}</p>
      <div class="survey-detail__questions">${renderQuestions(survey.questions)}</div>
      <div class="survey-detail__footer">
        <button type="button" class="complete-btn">Complete survey</button>
      </div>
    </article>
  `;
}

/**
 * Renders the end date and category line of the survey card.
 * @param survey The survey to display.
 * @returns HTML markup of the meta line.
 */
function renderDetailMeta(survey: CreatedSurvey): string {
  const endDate: string = survey.endDate || "—";
  const category: string = survey.category || "—";
  return `
    <div class="survey-detail__meta">
      <span class="survey-detail__ends">Ends on ${escapeHtml(endDate)}</span>
      <span class="survey-detail__category">Category: ${escapeHtml(category)}</span>
    </div>
  `;
}

/**
 * Renders all question blocks of the survey.
 * @param questions The questions to display.
 * @returns HTML markup of the question blocks.
 */
function renderQuestions(questions: CreatedQuestion[]): string {
  return questions
    .map((question: CreatedQuestion, index: number): string =>
      renderQuestion(question, index + 1),
    )
    .join("");
}

/**
 * Renders a single question block including its answers.
 * @param question The question to display.
 * @param number The one-based question number.
 * @returns HTML markup of the question block.
 */
function renderQuestion(question: CreatedQuestion, number: number): string {
  const hint: string = question.allowMultiple
    ? `<p class="view-q__hint">More than one answers are possible.</p>`
    : "";
  return `
    <div class="view-q">
      <h3 class="view-q__title">${number}. ${escapeHtml(question.title)}</h3>
      ${hint}
      <ul class="view-q__answers">${renderAnswers(question.answers)}</ul>
    </div>
  `;
}

/**
 * Renders all answer rows of a question.
 * @param answers The answers to display.
 * @returns HTML markup of the answer rows.
 */
function renderAnswers(answers: CreatedAnswer[]): string {
  return answers.map(renderAnswer).join("");
}

/**
 * Renders a single answer row with a selectable checkbox.
 * @param answer The answer to display.
 * @returns HTML markup of the answer row.
 */
function renderAnswer(answer: CreatedAnswer): string {
  return `
    <li class="view-a">
      <button type="button" class="checkbox" data-action="toggle-check" aria-pressed="false" aria-label="Select answer">
        <img class="checkbox__empty" src="/dark_checkbox.svg" alt="" />
        <img class="checkbox__filled" src="/checked.svg" alt="" />
      </button>
      <span class="view-a__text"><strong>${escapeHtml(answer.letter)}.</strong> ${escapeHtml(answer.text)}</span>
    </li>
  `;
}

/**
 * Renders the live results panel shown next to the survey.
 * @returns HTML markup of the results panel.
 */
function renderResultsPanel(): string {
  return `
    <aside class="survey-results" aria-label="Survey results">
      <h2 class="survey-results__title">Survey results <span class="survey-results__live">LIVE</span></h2>
      <p class="survey-results__info">Results will be shown here after participants complete the survey.</p>
      <p class="survey-results__empty">There are no answers yet.</p>
    </aside>
  `;
}
