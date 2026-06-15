/**
 * Small DOM helper functions shared across the app.
 */

/**
 * Returns a required element by its ID or throws an error.
 * @param id ID of the requested element.
 * @returns The found HTML element.
 */
export function requireElement(id: string): HTMLElement {
  const element: HTMLElement | null = document.getElementById(id);
  if (element === null) {
    throw new Error(`Element with id "${id}" was not found.`);
  }
  return element;
}

/**
 * Escapes user-generated text for safe output in HTML.
 * @param value Arbitrary, potentially unsafe text.
 * @returns The HTML-escaped text.
 */
export function escapeHtml(value: string): string {
  const container: HTMLDivElement = document.createElement("div");
  container.textContent = value;
  return container.innerHTML;
}
