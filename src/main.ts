/**
 * Entry point of the Poll-App. Renders the home screen into the DOM.
 */

import "./styles/main.css";
import { renderHome } from "./components/home";
import { renderSurveyView } from "./components/survey-view";
import {
  buildQuestion,
  renderAnswerRow,
  renderCreateSurveyDialog,
  readCreateSurveyForm,
} from "./components/create-survey-dialog";
import type { CreatedSurvey } from "./types/survey";
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
 * Renders the published survey on a light page. The dialog markup is added
 * again so the "Create survey" button keeps working from this view.
 * @param survey The survey to display.
 */
function showSurvey(survey: CreatedSurvey): void {
  document.body.classList.add("light-page");
  APP_ROOT.innerHTML = renderSurveyView(survey) + renderCreateSurveyDialog();
}

/**
 * Reads the dialog form, closes it and shows the created survey.
 */
function publishSurvey(): void {
  const survey: CreatedSurvey = readCreateSurveyForm();
  closeModal();
  showSurvey(survey);
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
  const selected: Element | null | undefined =
    menu?.querySelector("[data-selected]");
  if (selected) {
    selected.textContent = item.textContent;
    selected.removeAttribute("hidden");
  }
  menu
    ?.querySelectorAll(".sort-menu__item--active")
    .forEach((el: Element): void => el.classList.remove("sort-menu__item--active"));
  item.classList.add("sort-menu__item--active");
  closeSortMenus();
}

/**
 * Opens the create-survey modal.
 */
function openModal(): void {
  document.querySelector("[data-modal]")?.removeAttribute("hidden");
  document.body.classList.add("modal-open");
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
    return;
  }
  if (target === "question") {
    removeQuestion(trash);
    return;
  }
  const input: HTMLInputElement | null | undefined = trash
    .closest(".field")
    ?.querySelector("input, textarea");
  if (input) input.value = "";
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
};

APP_ROOT.addEventListener("click", (event: MouseEvent): void => {
  const target: HTMLElement = event.target as HTMLElement;
  const tab: HTMLElement | null = target.closest(".tabs__tab");
  if (tab) {
    activateTab(tab);
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

document.addEventListener("keydown", (event: KeyboardEvent): void => {
  if (event.key === "Escape") closeModal();
});
