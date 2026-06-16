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
        <button type="button" class="hero__cta-mobile" data-action="new-survey" aria-label="New survey">
          <img class="hero__cta-mobile-img" src="/add_new_survey_btn.svg" alt="" width="172" height="48" />
        </button>
      </div>
      <div class="hero__media">
        <div class="hero__phone">
          <img class="hero__image" src="/phone.png" alt="Vorschau einer Umfrage auf einem Smartphone" />
          <img class="hero__icon hero__icon--bubble" src="/typing%20bubble.svg" alt="" aria-hidden="true" />
          <img class="hero__icon hero__icon--question" src="/Questin%20mark.svg" alt="" aria-hidden="true" />
          <img class="hero__icon hero__icon--star" src="/star.svg" alt="" aria-hidden="true" />
          <img class="hero__icon hero__icon--check" src="/check.svg" alt="" aria-hidden="true" />
        </div>
      </div>
    </section>
  `;
}
