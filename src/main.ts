/**
 * Entry point of the Poll-App. Renders the home screen into the DOM.
 */

import "./styles/main.css";
import { renderHome } from "./components/home";
import { requireElement } from "./utils/dom";

const APP_ROOT: HTMLElement = requireElement("app");

APP_ROOT.innerHTML = renderHome();

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
      list.closest(".sort-menu")?.querySelector(".sort")
        ?.setAttribute("aria-expanded", "false");
    });
}

APP_ROOT.addEventListener("click", (event: MouseEvent): void => {
  const element: HTMLElement = event.target as HTMLElement;
  const tab: HTMLElement | null = element.closest(".tabs__tab");
  if (tab) {
    activateTab(tab);
    return;
  }
  const sortToggle: HTMLElement | null = element.closest(
    '[data-action="toggle-sort"]',
  );
  if (sortToggle) {
    toggleSortMenu(sortToggle);
    return;
  }
  closeSortMenus();
});
