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

APP_ROOT.addEventListener("click", (event: MouseEvent): void => {
  const target: HTMLElement | null = (event.target as HTMLElement).closest(
    ".tabs__tab",
  );
  if (target) activateTab(target);
});
