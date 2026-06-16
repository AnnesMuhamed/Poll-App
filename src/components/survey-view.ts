/**
 * Published survey view shown after the user creates a survey and clicks
 * "Publish". Lets the user vote and shows the live results next to it.
 */

import type {
  StoredSurvey,
  StoredQuestion,
  StoredAnswer,
} from "../types/survey";
import { escapeHtml } from "../utils/dom";
import { formatDisplayDate } from "../utils/format";
import { isExpired, totalVotes, questionVotes } from "../services/survey-store";

/**
 * Renders the complete survey view for a stored survey.
 * @param survey The survey to display.
 * @returns HTML markup of the survey view.
 */
export function renderSurveyView(survey: StoredSurvey): string {
  const expired: boolean = isExpired(survey);
  return `
    <div class="survey-page" data-survey-id="${escapeHtml(survey.id)}">
      ${renderViewHeader()}
      <div class="survey-view">
        ${renderSurveyDetail(survey, expired)}
        ${renderResultsPanel(survey)}
      </div>
    </div>
  `;
}

/**
 * Renders the page header with the logo and the "New survey" button.
 * @returns HTML markup of the header.
 */
function renderViewHeader(): string {
  return `
    <header class="survey-page__header">
      <a class="brand" href="/" aria-label="Poll App – Home">
        <img class="brand__logo" src="/dark_logo.svg" alt="Poll App" />
      </a>
      <button type="button" class="button button--cta" data-action="new-survey">
        <span class="button__label">New survey</span>
        <span class="button__icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v8M8 12h8" />
          </svg>
        </span>
      </button>
    </header>
  `;
}

/**
 * Renders the survey card with its meta data and questions.
 * @param survey The survey to display.
 * @param expired Whether the survey has expired.
 * @returns HTML markup of the survey card.
 */
function renderSurveyDetail(survey: StoredSurvey, expired: boolean): string {
  const status: string = expired ? "Expired" : "Published";
  return `
    <article class="survey-detail">
      <span class="survey-detail__badge">${status}</span>
      ${renderDetailMeta(survey)}
      <h1 class="survey-detail__title">${escapeHtml(survey.title)}</h1>
      <p class="survey-detail__desc">${escapeHtml(survey.description)}</p>
      <div class="survey-detail__questions">${renderQuestions(survey, expired)}</div>
      <div class="survey-detail__footer">
        <button type="button" class="complete-btn" data-action="complete-survey">Complete survey</button>
      </div>
    </article>
  `;
}

/**
 * Renders the end date and category line of the survey card.
 * @param survey The survey to display.
 * @returns HTML markup of the meta line.
 */
function renderDetailMeta(survey: StoredSurvey): string {
  const category: string = survey.category || "—";
  return `
    <div class="survey-detail__meta">
      <span class="survey-detail__ends">Ends on ${escapeHtml(formatDisplayDate(survey.endDate))}</span>
      <span class="survey-detail__category">Category: ${escapeHtml(category)}</span>
    </div>
  `;
}

/**
 * Renders every question block of the survey.
 * @param survey The survey to display.
 * @param expired Whether voting is disabled.
 * @returns HTML markup of the question blocks.
 */
function renderQuestions(survey: StoredSurvey, expired: boolean): string {
  return survey.questions
    .map((question: StoredQuestion, index: number): string =>
      renderQuestion(question, index, survey.selections, expired),
    )
    .join("");
}

/**
 * Renders a single question block including its answers.
 * @param question The question to display.
 * @param index Zero-based index of the question.
 * @param selections The user's current selections.
 * @param expired Whether voting is disabled.
 * @returns HTML markup of the question block.
 */
function renderQuestion(
  question: StoredQuestion,
  index: number,
  selections: string[],
  expired: boolean,
): string {
  const hint: string = question.allowMultiple
    ? `<p class="view-q__hint">More than one answers are possible.</p>`
    : "";
  const rows: string = question.answers
    .map((answer: StoredAnswer): string =>
      renderAnswer(answer, index, selections, expired),
    )
    .join("");
  return `
    <div class="view-q">
      <h3 class="view-q__title">${index + 1}. ${escapeHtml(question.title)}</h3>
      ${hint}
      <ul class="view-q__answers">${rows}</ul>
    </div>
  `;
}

/**
 * Renders a single answer row with a votable checkbox.
 * @param answer The answer to display.
 * @param qIndex Zero-based index of the question.
 * @param selections The user's current selections.
 * @param expired Whether voting is disabled.
 * @returns HTML markup of the answer row.
 */
function renderAnswer(
  answer: StoredAnswer,
  qIndex: number,
  selections: string[],
  expired: boolean,
): string {
  const pressed: boolean = selections.includes(`${qIndex}:${answer.letter}`);
  const disabled: string = expired ? " disabled" : "";
  return `
    <li class="view-a">
      <button type="button" class="checkbox" data-action="vote" data-q="${qIndex}" data-letter="${escapeHtml(answer.letter)}" aria-pressed="${pressed}" aria-label="Select answer ${escapeHtml(answer.letter)}"${disabled}>
        <img class="checkbox__empty" src="/dark_checkbox.svg" alt="" />
        <img class="checkbox__filled" src="/checked.svg" alt="" />
      </button>
      <span class="view-a__text"><strong>${escapeHtml(answer.letter)}.</strong> ${escapeHtml(answer.text)}</span>
    </li>
  `;
}

/**
 * Renders the live results panel next to the survey.
 * @param survey The survey whose results are shown.
 * @returns HTML markup of the results panel.
 */
function renderResultsPanel(survey: StoredSurvey): string {
  const hasVotes: boolean = totalVotes(survey) > 0;
  const body: string = hasVotes ? renderResults(survey) : renderResultsEmpty();
  return `
    <aside class="survey-results" aria-label="Survey results">
      <h2 class="survey-results__title">Survey results <span class="survey-results__live">LIVE</span></h2>
      ${body}
    </aside>
  `;
}

/**
 * Renders the placeholder shown when no votes exist yet.
 * @returns HTML markup of the empty results state.
 */
function renderResultsEmpty(): string {
  return `
    <p class="survey-results__info">Results will be shown here after participants complete the survey.</p>
    <p class="survey-results__empty">There are no answers yet.</p>
  `;
}

/**
 * Renders the result blocks for every question.
 * @param survey The survey whose results are shown.
 * @returns HTML markup of all result blocks.
 */
function renderResults(survey: StoredSurvey): string {
  return survey.questions
    .map((question: StoredQuestion, index: number): string =>
      renderResultBlock(question, index + 1),
    )
    .join("");
}

/**
 * Renders the result bars of a single question.
 * @param question The question to summarise.
 * @param number The one-based question number.
 * @returns HTML markup of the result block.
 */
function renderResultBlock(question: StoredQuestion, number: number): string {
  const sum: number = questionVotes(question);
  const rows: string = question.answers
    .map((answer: StoredAnswer): string => renderResultRow(answer, sum))
    .join("");
  return `
    <div class="result-q">
      <h3 class="result-q__title">${number}. ${escapeHtml(question.title)}</h3>
      <div class="result-q__rows">${rows}</div>
    </div>
  `;
}

/**
 * Renders a single result row with a percentage bar.
 * @param answer The answer to summarise.
 * @param sum The total votes within the question.
 * @returns HTML markup of the result row.
 */
function renderResultRow(answer: StoredAnswer, sum: number): string {
  const percent: number = sum === 0 ? 0 : Math.round((answer.votes / sum) * 100);
  return `
    <div class="result-row">
      <span class="result-row__letter">${escapeHtml(answer.letter)}</span>
      <span class="result-bar"><span class="result-bar__fill" style="width:${percent}%"></span></span>
      <span class="result-row__pct">${percent}%</span>
    </div>
  `;
}
