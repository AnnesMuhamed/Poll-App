/**
 * Top app header with the brand logo and name.
 * The logo image is added by the user.
 */

/**
 * Renders the app header.
 * @returns HTML markup of the header.
 */
export function renderAppHeader(): string {
  return `
    <header class="app-header">
      <a class="brand" href="/" aria-label="Poll App – Home">
        <img class="brand__logo" src="/orange_logo.svg" alt="Poll App" />
      </a>
    </header>
  `;
}
