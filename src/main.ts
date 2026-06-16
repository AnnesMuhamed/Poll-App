/**
 * Entry point of the Poll-App. Renders the home screen into the DOM.
 */

import "./styles/main.css";
import "./styles/publish-toast.css";
import { renderHome } from "./components/home";
import { renderSurveyView } from "./components/survey-view";
import { showPublishToast } from "./components/publish-toast";
import { renderListCard } from "./components/survey-card";
import {
  buildQuestion,
  renderAnswerRow,
  renderCreateSurveyDialog,
  readCreateSurveyForm,
  isCreateSurveyFormValid,
  updatePublishButton,
} from "./components/create-survey-dialog";
import type { CreatedSurvey, StoredSurvey, SurveyFilter } from "./types/survey";
import {
  createStoredSurvey,
  getSurvey,
  upsertSurvey,
  toggleVote,
  isExpired,
  getHomeSurveys,
} from "./services/survey-store";
import { requireElement } from "./utils/dom";

const APP_ROOT: HTMLElement = requireElement("app");

showHome();

/**
 * Renders the home screen and resets the page to its dark theme.
 */
function showHome(): void {
  document.body.classList.remove("light-page");
  APP_ROOT.innerHTML = renderHome();
}

/**
 * Renders a stored survey on a light page. The dialog markup is added
 * again so the "Create survey" button keeps working from this view.
 * @param survey The survey to display.
 */
function showSurvey(survey: StoredSurvey): void {
  document.body.classList.add("light-page");
  APP_ROOT.innerHTML = renderSurveyView(survey) + renderCreateSurveyDialog();
}

/**
 * Reads the dialog form, stores the survey and shows its live view.
 */
function publishSurvey(): void {
  if (!isCreateSurveyFormValid()) return;
  const form: CreatedSurvey = readCreateSurveyForm();
  const survey: StoredSurvey = createStoredSurvey(form);
  upsertSurvey(survey);
  showPublishToast((): void => {
    closeModal();
    showSurvey(survey);
  });
}

/**
 * Reads the survey id of the currently shown survey view.
 * @returns The survey id, or null when none is shown.
 */
function currentSurveyId(): string | null {
  return document
    .querySelector("[data-survey-id]")
    ?.getAttribute("data-survey-id") ?? null;
}

/**
 * Applies a vote for the clicked answer and refreshes the view.
 * @param button The clicked answer checkbox.
 */
function vote(button: HTMLElement): void {
  const survey: StoredSurvey | undefined = getSurvey(currentSurveyId() ?? "");
  if (!survey || isExpired(survey)) return;
  const qIndex: number = Number(button.getAttribute("data-q"));
  const letter: string | null = button.getAttribute("data-letter");
  if (!letter) return;
  toggleVote(survey, qIndex, letter);
  upsertSurvey(survey);
  showSurvey(survey);
}

/**
 * Marks the current survey as completed and returns to the home screen.
 */
function completeSurvey(): void {
  const survey: StoredSurvey | undefined = getSurvey(currentSurveyId() ?? "");
  if (survey) {
    survey.completed = true;
    upsertSurvey(survey);
  }
  showHome();
}

/**
 * Opens a stored survey from its home card. Seed cards are ignored.
 * @param card The clicked survey card.
 */
function openSurvey(card: HTMLElement): void {
  const survey: StoredSurvey | undefined = getSurvey(
    card.getAttribute("data-survey-id") ?? "",
  );
  if (survey) showSurvey(survey);
}

/**
 * Reads the active Active/Past tab on the home screen.
 * @returns The current tab filter.
 */
function getActiveTabFilter(): SurveyFilter {
  const tab: Element | null = document.querySelector(".tabs__tab--active");
  if (tab?.getAttribute("data-filter") === "past") return "past";
  return "active";
}

/**
 * Reads the category chosen in the home sort dropdown.
 * @returns The selected category, or null when none is chosen.
 */
function getSelectedListCategory(): string | null {
  const selected: Element | null = document.querySelector(
    ".survey-list [data-selected]",
  );
  if (!selected || selected.hasAttribute("hidden")) return null;
  const text: string = selected.textContent?.trim() ?? "";
  return text === "" ? null : text;
}

/**
 * Re-renders the survey grid using the active tab and category filter.
 */
function refreshSurveyGrid(): void {
  const grid: Element | null = document.querySelector(".survey-list__grid");
  if (!grid) return;
  const filter: SurveyFilter = getActiveTabFilter();
  const category: string | null = getSelectedListCategory();
  grid.innerHTML = getHomeSurveys(
    filter,
    category ?? undefined,
  )
    .map(renderListCard)
    .join("");
}

/**
 * Re-renders the survey grid for the chosen filter tab.
 * @param _tab The activated filter tab.
 */
function applyHomeFilter(_tab: HTMLElement): void {
  refreshSurveyGrid();
}

/**
 * Marks the given tab as active and resets its siblings.
 * @param tab The tab button that was activated.
 */
function activateTab(tab: HTMLElement): void {
  const tablist: Element | null = tab.closest(".tabs");
  if (!tablist) return;
  tablist.querySelectorAll(".tabs__tab").forEach((element: Element): void => {
    const isActive: boolean = element === tab;
    element.classList.toggle("tabs__tab--active", isActive);
    element.setAttribute("aria-selected", String(isActive));
  });
}

/**
 * Opens or closes the dropdown that belongs to the given sort button.
 * @param button The sort toggle button.
 */
function toggleSortMenu(button: HTMLElement): void {
  const list: Element | null | undefined = button
    .closest(".sort-menu")
    ?.querySelector(".sort-menu__list");
  if (!list) return;
  const isOpen: boolean = button.getAttribute("aria-expanded") === "true";
  button.setAttribute("aria-expanded", String(!isOpen));
  list.toggleAttribute("hidden", isOpen);
}

/**
 * Closes every open sort dropdown on the page.
 */
function closeSortMenus(): void {
  document
    .querySelectorAll(".sort-menu__list:not([hidden])")
    .forEach((list: Element): void => {
      list.setAttribute("hidden", "");
      list
        .closest(".sort-menu")
        ?.querySelector(".sort")
        ?.setAttribute("aria-expanded", "false");
    });
}

/**
 * Applies the clicked dropdown option to its trigger label.
 * @param item The selected option element.
 */
function selectSortItem(item: HTMLElement): void {
  const menu: Element | null = item.closest(".sort-menu");
  const category: string | null = item.getAttribute("data-category");
  const selected: Element | null | undefined =
    menu?.querySelector("[data-selected]");
  if (selected && category) {
    selected.textContent = category;
    selected.removeAttribute("hidden");
  }
  menu
    ?.querySelectorAll(".sort-menu__item--active")
    .forEach((el: Element): void => el.classList.remove("sort-menu__item--active"));
  item.classList.add("sort-menu__item--active");
  closeSortMenus();
  if (item.closest(".survey-list")) refreshSurveyGrid();
}

/**
 * Opens the create-survey modal.
 */
function openModal(): void {
  document.querySelector("[data-modal]")?.removeAttribute("hidden");
  document.body.classList.add("modal-open");
  updatePublishButton();
}

/**
 * Closes the create-survey modal.
 */
function closeModal(): void {
  document.querySelector("[data-modal]")?.setAttribute("hidden", "");
  document.body.classList.remove("modal-open");
}

/**
 * Appends a new answer row to the question of the given button.
 * @param button The "Add answer" button.
 */
function addAnswer(button: HTMLElement): void {
  const list: Element | null | undefined = button
    .closest(".question")
    ?.querySelector("[data-answers]");
  if (!list) return;
  const letter: string = String.fromCharCode(
    "A".charCodeAt(0) + list.children.length,
  );
  list.insertAdjacentHTML("beforeend", renderAnswerRow(letter));
  updatePublishButton();
}

/**
 * Appends a new question block to the form.
 */
function addQuestion(): void {
  const container: Element | null = document.querySelector("[data-questions]");
  if (!container) return;
  const next: number = container.querySelectorAll(".question").length + 1;
  const button: Element | null = container.querySelector(".add-question");
  if (button) button.insertAdjacentHTML("beforebegin", buildQuestion(next));
  else container.insertAdjacentHTML("beforeend", buildQuestion(next));
  updatePublishButton();
}

/**
 * Re-numbers all question headings after a removal.
 * @param container The questions container element.
 */
function renumberQuestions(container: Element): void {
  container
    .querySelectorAll(".question__number")
    .forEach((el: Element, index: number): void => {
      el.textContent = `${index + 1}. Question`;
    });
}

/**
 * Handles a trash button click depending on its delete target.
 * @param trash The clicked trash button.
 */
function deleteField(trash: HTMLElement): void {
  const target: string | null = trash.getAttribute("data-target");
  if (target === "answer") {
    trash.closest(".answer-row")?.remove();
    updatePublishButton();
    return;
  }
  if (target === "question") {
    removeQuestion(trash);
    updatePublishButton();
    return;
  }
  const input: HTMLInputElement | null | undefined = trash
    .closest(".field")
    ?.querySelector("input, textarea");
  if (input) input.value = "";
  updatePublishButton();
}

/**
 * Removes a question block, or clears the first one so at least one
 * question always remains. Renumbers the remaining questions.
 * @param trash The clicked trash button inside the question.
 */
function removeQuestion(trash: HTMLElement): void {
  const container: Element | null = document.querySelector("[data-questions]");
  const block: Element | null = trash.closest(".question");
  if (!container || !block) return;
  const isFirstQuestion: boolean = block === container.querySelector(".question");
  if (isFirstQuestion) {
    clearInputs(block);
    return;
  }
  block.remove();
  renumberQuestions(container);
}

/**
 * Clears the value of every input and textarea inside the given element.
 * @param scope The element whose fields are cleared.
 */
function clearInputs(scope: Element): void {
  scope
    .querySelectorAll("input, textarea")
    .forEach((field: Element): void => {
      (field as HTMLInputElement | HTMLTextAreaElement).value = "";
    });
}

/**
 * Toggles the checked state of a custom checkbox.
 * @param button The checkbox button.
 */
function toggleCheck(button: HTMLElement): void {
  const pressed: boolean = button.getAttribute("aria-pressed") === "true";
  button.setAttribute("aria-pressed", String(!pressed));
}

/** Map of data-action values to their handlers. */
const ACTIONS: Record<string, (element: HTMLElement) => void> = {
  "new-survey": openModal,
  "close-dialog": closeModal,
  "toggle-sort": toggleSortMenu,
  "add-answer": addAnswer,
  "add-question": addQuestion,
  "delete-field": deleteField,
  "toggle-check": toggleCheck,
  publish: publishSurvey,
  vote: vote,
  "complete-survey": completeSurvey,
  "open-survey": openSurvey,
};

APP_ROOT.addEventListener("click", (event: MouseEvent): void => {
  const target: HTMLElement = event.target as HTMLElement;
  const tab: HTMLElement | null = target.closest(".tabs__tab");
  if (tab) {
    activateTab(tab);
    applyHomeFilter(tab);
    return;
  }
  const actionEl: HTMLElement | null = target.closest("[data-action]");
  const action: string | null | undefined = actionEl?.getAttribute("data-action");
  if (actionEl && action && ACTIONS[action]) {
    ACTIONS[action](actionEl);
    return;
  }
  const item: HTMLElement | null = target.closest(".sort-menu__item");
  if (item) {
    selectSortItem(item);
    return;
  }
  if (target.matches("[data-modal]")) {
    closeModal();
    return;
  }
  closeSortMenus();
});

APP_ROOT.addEventListener("input", (event: Event): void => {
  const target: HTMLElement = event.target as HTMLElement;
  if (!target.closest("[data-modal]")) return;
  updatePublishButton();
});

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  if (event.key === "Escape") closeModal();
});
