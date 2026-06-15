/**
 * Hero section of the home screen with the headline, intro text,
 * the "New survey" call to action and the illustration placeholder.
 */

/**
 * Renders the hero section.
 * @returns HTML markup of the hero.
 */
export function renderHero(): string {
  return `
    <section class="hero" aria-labelledby="hero-title">
      <div class="hero__content">
        <h1 class="hero__title" id="hero-title">Collect Feedback, Unlock Ideas</h1>
        <p class="hero__text">
          Create and share surveys in minutes – from team events to workplace
          culture. Collect opinions, engage your audience, and turn feedback
          into action.
        </p>
        <button type="button" class="button button--cta" data-action="new-survey">
          <span class="button__label">New survey</span>
          <span class="button__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v8M8 12h8" />
            </svg>
          </span>
        </button>
      </div>
      <div class="hero__media">
        <img class="hero__image" src="/phone.png" alt="Vorschau einer Umfrage auf einem Smartphone" />
      </div>
    </section>
  `;
}
