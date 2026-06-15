/**
 * "Create new survey" modal dialog shown when the hero call to action
 * is clicked. Contains the survey form with questions and answers.
 */

/** Inline plus icon reused by the "Add" buttons. */
const PLUS_ICON: string = `
  <svg class="icon-plus" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 8v8M8 12h8" />
  </svg>
`;

/** Sample categories offered in the "Choose category" dropdown. */
const CATEGORIES: string[] = [
  "Team activities",
  "Health & Wellness",
  "Gaming & Entertainment",
  "Other",
];

/**
 * Renders the complete create-survey modal (hidden by default).
 * @returns HTML markup of the modal overlay.
 */
export function renderCreateSurveyDialog(): string {
  return `
    <div class="modal" data-modal hidden>
      <div class="modal__panel" role="dialog" aria-modal="true" aria-labelledby="create-survey-title">
        ${renderHeader()}
        <div class="modal__body">
          <div class="modal__top">
            <div class="modal__col">
              ${renderNameField()}
              ${renderDateField()}
            </div>
            <div class="modal__col">
              ${renderDescribingField()}
              ${renderAddQuestionButton()}
            </div>
          </div>
          <div class="questions" data-questions>${buildQuestion(1)}</div>
        </div>
        ${renderFooter()}
      </div>
    </div>
  `;
}

/**
 * Renders the modal header with the draft badge, title and cancel button.
 * @returns HTML markup of the header.
 */
function renderHeader(): string {
  return `
    <div class="modal__head">
      <div class="modal__heading">
        <span class="modal__badge">Draft</span>
        <h2 class="modal__title" id="create-survey-title">Create new survey</h2>
      </div>
      <button type="button" class="modal__cancel" data-action="close-dialog">
        <span>Cancel</span>
        <span class="modal__cancel-x" aria-hidden="true">✕</span>
      </button>
    </div>
  `;
}

/**
 * Renders the survey name field.
 * @returns HTML markup of the name field.
 */
function renderNameField(): string {
  return `
    <div class="field">
      <label class="field__label" for="survey-name">Survey name</label>
      <div class="field__control">
        <input class="input" id="survey-name" type="text" />
        ${renderTrash("input", "Clear survey name")}
      </div>
    </div>
  `;
}

/**
 * Renders the end date field together with the category dropdown.
 * @returns HTML markup of the date field.
 */
function renderDateField(): string {
  return `
    <div class="field">
      <div class="field__head">
        <label class="field__label" for="survey-end">Set end date <span class="field__hint">(optional)</span></label>
        ${renderCategoryMenu()}
      </div>
      <div class="field__control field__control--narrow">
        <input class="input" id="survey-end" type="date" />
        ${renderTrash("input", "Clear end date")}
      </div>
    </div>
  `;
}

/**
 * Renders the "Choose category" dropdown control.
 * @returns HTML markup of the category menu.
 */
function renderCategoryMenu(): string {
  return `
    <div class="sort-menu" data-sort-menu>
      <button type="button" class="sort sort--category" data-action="toggle-sort" aria-haspopup="listbox" aria-expanded="false">
        <span class="sort__label">Choose category</span>
        <span class="sort__chevron" aria-hidden="true">▾</span>
      </button>
      <ul class="sort-menu__list" role="listbox" hidden>${renderCategoryItems()}</ul>
    </div>
  `;
}

/**
 * Renders the option items of the category dropdown.
 * @returns HTML markup of the category options.
 */
function renderCategoryItems(): string {
  return CATEGORIES.map(
    (category: string): string =>
      `<li class="sort-menu__item" role="option" data-category="${category}">${category}</li>`,
  ).join("");
}

/**
 * Builds a single question block including its answers.
 * @param index One-based position of the question.
 * @returns HTML markup of the question block.
 */
export function buildQuestion(index: number): string {
  return `
    <div class="question" data-question>
      <div class="question__head">
        <span class="question__number">${index}. Question</span>
        ${renderTrash("question", "Delete question")}
      </div>
      <input class="input" type="text" placeholder="Which date would work best for you?" />
      ${renderAnswers()}
    </div>
  `;
}

/**
 * Renders the answers area of a question.
 * @returns HTML markup of the answers area.
 */
function renderAnswers(): string {
  return `
    <div class="answers">
      <div class="answers__head">
        <span class="answers__label">Answers</span>
        ${renderCheckbox()}
      </div>
      <div class="answers__list" data-answers>
        ${renderAnswerRow("A")}
        ${renderAnswerRow("B")}
      </div>
      ${renderAddAnswerButton()}
    </div>
  `;
}

/**
 * Renders the "Allow multiple answers" checkbox.
 * @returns HTML markup of the checkbox row.
 */
function renderCheckbox(): string {
  return `
    <span class="check-row">
      <button type="button" class="checkbox" data-action="toggle-check" aria-pressed="false" aria-label="Allow multiple answers">
        <img class="checkbox__empty" src="/checkbox_white.svg" alt="" />
        <img class="checkbox__filled" src="/checked.svg" alt="" />
      </button>
      <span class="check-row__text">Allow multiple answers.</span>
    </span>
  `;
}

/**
 * Builds a single answer input row.
 * @param letter Letter label of the answer (A, B, C …).
 * @returns HTML markup of the answer row.
 */
export function renderAnswerRow(letter: string): string {
  return `
    <div class="answer-row">
      <span class="answer-row__letter">${letter}.</span>
      <input class="input" type="text" />
      ${renderTrash("answer", "Delete answer")}
    </div>
  `;
}

/**
 * Renders the "Add answer" link button.
 * @returns HTML markup of the button.
 */
function renderAddAnswerButton(): string {
  return `
    <button type="button" class="link-btn" data-action="add-answer">
      <span>Add answer</span>
      ${PLUS_ICON}
    </button>
  `;
}

/**
 * Renders the describing text field.
 * @returns HTML markup of the describing text field.
 */
function renderDescribingField(): string {
  return `
    <div class="field">
      <label class="field__label" for="survey-desc">Describing text <span class="field__hint">(optional)</span></label>
      <div class="field__control field__control--textarea">
        <textarea class="input input--textarea" id="survey-desc" rows="4"></textarea>
        ${renderTrash("input", "Clear describing text")}
      </div>
    </div>
  `;
}

/**
 * Renders the "Add next question" button.
 * @returns HTML markup of the button.
 */
function renderAddQuestionButton(): string {
  return `
    <button type="button" class="add-question" data-action="add-question">
      <span>Add next question</span>
      ${PLUS_ICON}
    </button>
  `;
}

/**
 * Renders the modal footer with the publish button.
 * @returns HTML markup of the footer.
 */
function renderFooter(): string {
  return `
    <div class="modal__footer">
      <button type="button" class="publish-btn" data-action="publish">Publish</button>
    </div>
  `;
}

/**
 * Renders a trash icon button.
 * @param target Delete target type used by the click handler.
 * @param label Accessible label for the button.
 * @returns HTML markup of the trash button.
 */
function renderTrash(target: string, label: string): string {
  return `
    <button type="button" class="icon-btn icon-btn--trash" data-action="delete-field" data-target="${target}" aria-label="${label}"></button>
  `;
}
