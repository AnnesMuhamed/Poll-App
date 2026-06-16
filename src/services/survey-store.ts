/**
 * Persists created surveys in localStorage and provides the vote logic,
 * expiry checks and the survey card models used by the home screen.
 */

import type {
  Survey,
  SurveyFilter,
  CreatedSurvey,
  CreatedQuestion,
  CreatedAnswer,
  StoredSurvey,
  StoredQuestion,
  StoredAnswer,
} from "../types/survey";

/** localStorage key under which all surveys are stored. */
const STORAGE_KEY: string = "poll-app:surveys";

/** Number of milliseconds in a single day. */
const DAY_MS: number = 24 * 60 * 60 * 1000;

/**
 * Loads all stored surveys from localStorage.
 * @returns The list of stored surveys (empty when none exist).
 */
export function loadSurveys(): StoredSurvey[] {
  const raw: string | null = localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as StoredSurvey[];
  } catch {
    return [];
  }
}

/**
 * Persists the given surveys to localStorage.
 * @param surveys The surveys to save.
 */
function saveSurveys(surveys: StoredSurvey[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(surveys));
}

/**
 * Returns a single stored survey by its id.
 * @param id The survey id to look up.
 * @returns The matching survey, or undefined.
 */
export function getSurvey(id: string): StoredSurvey | undefined {
  return loadSurveys().find((survey: StoredSurvey): boolean => survey.id === id);
}

/**
 * Inserts or replaces a survey by its id and persists the result.
 * @param survey The survey to store.
 */
export function upsertSurvey(survey: StoredSurvey): void {
  const surveys: StoredSurvey[] = loadSurveys();
  const index: number = surveys.findIndex(
    (item: StoredSurvey): boolean => item.id === survey.id,
  );
  if (index >= 0) surveys[index] = survey;
  else surveys.push(survey);
  saveSurveys(surveys);
}

/**
 * Converts the dialog form into a fresh stored survey with zeroed votes.
 * @param form The survey data read from the dialog.
 * @returns A new stored survey.
 */
export function createStoredSurvey(form: CreatedSurvey): StoredSurvey {
  return {
    id: `survey-${Date.now().toString(36)}`,
    title: form.title,
    category: form.category,
    endDate: form.endDate,
    description: form.description,
    questions: form.questions.map(toStoredQuestion),
    selections: [],
    completed: false,
  };
}

/**
 * Converts a form question into a stored question with vote counters.
 * @param question The question read from the form.
 * @returns The stored question.
 */
function toStoredQuestion(question: CreatedQuestion): StoredQuestion {
  return {
    title: question.title,
    allowMultiple: question.allowMultiple,
    answers: question.answers.map(toStoredAnswer),
  };
}

/**
 * Converts a form answer into a stored answer with a zeroed counter.
 * @param answer The answer read from the form.
 * @returns The stored answer.
 */
function toStoredAnswer(answer: CreatedAnswer): StoredAnswer {
  return { letter: answer.letter, text: answer.text, votes: 0 };
}

/**
 * Toggles the current user's vote for an answer and updates the tallies.
 * Single-choice questions clear the previous pick first.
 * @param survey The survey to update (mutated in place).
 * @param qIndex Zero-based index of the question.
 * @param letter Letter of the answer to toggle.
 */
export function toggleVote(
  survey: StoredSurvey,
  qIndex: number,
  letter: string,
): void {
  const question: StoredQuestion | undefined = survey.questions[qIndex];
  if (!question) return;
  if (survey.selections.includes(`${qIndex}:${letter}`)) {
    removeVote(survey, question, qIndex, letter);
    return;
  }
  if (!question.allowMultiple) clearQuestionVotes(survey, question, qIndex);
  addVote(survey, question, qIndex, letter);
}

/**
 * Adds a vote for one answer and records the selection.
 * @param survey The survey being voted on.
 * @param question The affected question.
 * @param qIndex Index of the question.
 * @param letter Letter of the chosen answer.
 */
function addVote(
  survey: StoredSurvey,
  question: StoredQuestion,
  qIndex: number,
  letter: string,
): void {
  const answer: StoredAnswer | undefined = findAnswer(question, letter);
  if (!answer) return;
  answer.votes += 1;
  survey.selections.push(`${qIndex}:${letter}`);
}

/**
 * Removes a vote for one answer and clears its selection.
 * @param survey The survey being voted on.
 * @param question The affected question.
 * @param qIndex Index of the question.
 * @param letter Letter of the answer to clear.
 */
function removeVote(
  survey: StoredSurvey,
  question: StoredQuestion,
  qIndex: number,
  letter: string,
): void {
  const answer: StoredAnswer | undefined = findAnswer(question, letter);
  if (answer && answer.votes > 0) answer.votes -= 1;
  const key: string = `${qIndex}:${letter}`;
  survey.selections = survey.selections.filter(
    (selection: string): boolean => selection !== key,
  );
}

/**
 * Clears every selected answer of a single-choice question.
 * @param survey The survey being voted on.
 * @param question The affected question.
 * @param qIndex Index of the question.
 */
function clearQuestionVotes(
  survey: StoredSurvey,
  question: StoredQuestion,
  qIndex: number,
): void {
  question.answers.forEach((answer: StoredAnswer): void => {
    if (survey.selections.includes(`${qIndex}:${answer.letter}`)) {
      removeVote(survey, question, qIndex, answer.letter);
    }
  });
}

/**
 * Finds an answer of a question by its letter.
 * @param question The question to search.
 * @param letter The answer letter to find.
 * @returns The matching answer, or undefined.
 */
function findAnswer(
  question: StoredQuestion,
  letter: string,
): StoredAnswer | undefined {
  return question.answers.find(
    (answer: StoredAnswer): boolean => answer.letter === letter,
  );
}

/**
 * Returns the total number of votes across all questions.
 * @param survey The survey to total.
 * @returns The sum of every answer's votes.
 */
export function totalVotes(survey: StoredSurvey): number {
  return survey.questions.reduce(
    (sum: number, question: StoredQuestion): number => sum + questionVotes(question),
    0,
  );
}

/**
 * Returns the total number of votes within a single question.
 * @param question The question to total.
 * @returns The sum of the question's answer votes.
 */
export function questionVotes(question: StoredQuestion): number {
  return question.answers.reduce(
    (sum: number, answer: StoredAnswer): number => sum + answer.votes,
    0,
  );
}

/**
 * Returns the whole days left until the end date.
 * @param endDate ISO date (yyyy-mm-dd) or an empty string.
 * @returns Remaining days, or Infinity when no end date is set.
 */
export function daysLeft(endDate: string): number {
  if (!endDate) return Number.POSITIVE_INFINITY;
  const end: number = new Date(`${endDate}T00:00:00`).getTime();
  if (Number.isNaN(end)) return Number.POSITIVE_INFINITY;
  return Math.ceil((end - startOfToday()) / DAY_MS);
}

/**
 * Returns true when the survey's end date lies in the past.
 * @param survey The survey to check.
 * @returns Whether the survey has expired.
 */
export function isExpired(survey: StoredSurvey): boolean {
  return daysLeft(survey.endDate) < 0;
}

/**
 * Returns today's date at midnight as a timestamp.
 * @returns Milliseconds since epoch for the start of today.
 */
function startOfToday(): number {
  const now: Date = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
}

/** Maximum number of cards shown in the "Ending soon" row. */
const ENDING_SOON_LIMIT: number = 3;

/**
 * Returns the three surveys closest to their end date for the home row.
 * Combines user-created and seed surveys, sorted by remaining days.
 * @returns Up to three surveys ending soonest.
 */
export function getEndingSoonHomeSurveys(): Survey[] {
  return sortByEndDate(
    loadSurveys().filter(isEndingSoonStored).map(toSurveyCard),
  ).slice(0, ENDING_SOON_LIMIT);
}

/**
 * Returns the survey cards shown on the home screen for a filter tab.
 * @param filter The selected filter tab.
 * @param category Optional category to filter by.
 * @returns Survey card models for the grid.
 */
export function getHomeSurveys(
  filter: SurveyFilter,
  category?: string,
): Survey[] {
  const created: Survey[] = loadSurveys()
    .filter((survey: StoredSurvey): boolean => survey.completed)
    .map(toSurveyCard);
  let surveys: Survey[];
  if (filter === "past") surveys = created.filter(isPastCard);
  else {
    surveys = created.filter(
      (survey: Survey): boolean => !isPastCard(survey),
    );
  }
  if (!category) return surveys;
  return surveys.filter((survey: Survey): boolean =>
    matchesCategory(survey.category, category),
  );
}

/**
 * Returns true when a stored survey belongs in the ending-soon row.
 * @param survey The stored survey to check.
 * @returns Whether the survey is active and has an end date.
 */
function isEndingSoonStored(survey: StoredSurvey): boolean {
  if (!survey.completed || survey.endDate === "") return false;
  return !isExpired(survey);
}

/**
 * Sorts survey cards by remaining days, earliest end date first.
 * @param surveys The surveys to sort.
 * @returns A new sorted array.
 */
function sortByEndDate(surveys: Survey[]): Survey[] {
  return [...surveys].sort(
    (a: Survey, b: Survey): number => a.endsInDays - b.endsInDays,
  );
}

/**
 * Builds a home card model from a stored survey.
 * @param survey The stored survey to convert.
 * @returns The card model.
 */
function toSurveyCard(survey: StoredSurvey): Survey {
  return {
    id: survey.id,
    category: survey.category || "General",
    title: survey.title || "Untitled survey",
    endsInDays: daysLeft(survey.endDate),
  };
}

/**
 * Returns true when a card model represents an expired survey.
 * @param survey The card model to check.
 * @returns Whether the survey has expired.
 */
function isPastCard(survey: Survey): boolean {
  return Number.isFinite(survey.endsInDays) && survey.endsInDays < 0;
}

/**
 * Returns true when a survey category matches the filter value.
 * @param surveyCategory Category shown on the card.
 * @param filterCategory Category chosen in the dropdown.
 * @returns Whether both categories match.
 */
function matchesCategory(
  surveyCategory: string,
  filterCategory: string,
): boolean {
  return (
    surveyCategory.trim().toLowerCase() === filterCategory.trim().toLowerCase()
  );
}
