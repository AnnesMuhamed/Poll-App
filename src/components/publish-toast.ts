/**
 * Success toast after publish. The create modal stays open while a banner
 * slides in from the viewport right edge to the publish button, waits,
 * then both fade out before the survey view opens.
 */

/** How long the toast stays visible after the slide-in (ms). */
const TOAST_STAY_MS: number = 3000;

/** Duration of the slide-in animation (ms). */
const TOAST_SLIDE_MS: number = 450;

/** Duration of the shared fade-out (ms). */
const TOAST_EXIT_MS: number = 350;

/**
 * Renders the publish success toast markup.
 * @returns HTML of the toast.
 */
export function renderPublishToast(): string {
  return `
    <div class="publish-toast" role="status" aria-live="polite">
      <p class="publish-toast__text">Your survey is now published</p>
      <button type="button" class="publish-toast__close" data-action="close-toast" aria-label="Close notification">✕</button>
    </div>
  `;
}

/**
 * Shows the toast, keeps the modal open, then runs the callback.
 * @param onDone Called once when the toast finishes or is dismissed.
 */
export function showPublishToast(onDone: () => void): void {
  const modal: Element | null = document.querySelector("[data-modal]");
  const button: HTMLButtonElement | null = document.querySelector(
    "[data-modal] .publish-btn",
  );
  if (!modal || !button) {
    onDone();
    return;
  }
  const targetRect: DOMRect = button.getBoundingClientRect();
  button.classList.add("publish-btn--hidden");
  modal.classList.add("modal--publish-success");
  const layer: HTMLDivElement = buildToastLayer(modal, targetRect, onDone);
  document.body.appendChild(layer);
  const toast: HTMLElement | null = layer.querySelector(".publish-toast");
  if (toast) positionToast(toast, targetRect);
  requestAnimationFrame((): void => {
    requestAnimationFrame((): void => {
      toast?.classList.add("publish-toast--visible");
    });
  });
}

/**
 * Builds the toast layer and wires dismiss plus auto-hide.
 * @param modal The open create-survey modal element.
 * @param targetRect Publish button position captured before it is hidden.
 * @param onDone Callback after toast and modal fade out.
 * @returns The toast layer element.
 */
function buildToastLayer(
  modal: Element,
  targetRect: DOMRect,
  onDone: () => void,
): HTMLDivElement {
  const layer: HTMLDivElement = document.createElement("div");
  layer.className = "publish-toast-layer";
  layer.innerHTML = renderPublishToast();
  let finished: boolean = false;
  const finish = (): void => {
    if (finished) return;
    finished = true;
    dismissToast(modal, layer, onDone);
  };
  layer
    .querySelector("[data-action='close-toast']")
    ?.addEventListener("click", finish);
  window.setTimeout(finish, TOAST_SLIDE_MS + TOAST_STAY_MS);
  return layer;
}

/**
 * Places the toast on the publish row and sets its off-screen start offset.
 * @param toast The toast element to position.
 * @param rect Target rectangle of the publish button.
 */
function positionToast(toast: HTMLElement, rect: DOMRect): void {
  toast.style.top = `${rect.top + rect.height / 2}px`;
  toast.style.right = `${window.innerWidth - rect.right}px`;
  const offScreenX: number =
    window.innerWidth - toast.getBoundingClientRect().left + 40;
  toast.style.setProperty("--toast-start-x", `${offScreenX}px`);
}

/**
 * Fades out toast and modal together, then runs the callback.
 * @param modal The create-survey modal element.
 * @param layer The toast layer element.
 * @param onDone Callback after the fade-out finishes.
 */
function dismissToast(
  modal: Element,
  layer: HTMLDivElement,
  onDone: () => void,
): void {
  layer.querySelector(".publish-toast")?.classList.add("publish-toast--leaving");
  modal.classList.add("modal--leaving");
  window.setTimeout((): void => {
    layer.remove();
    modal.classList.remove("modal--publish-success", "modal--leaving");
    onDone();
  }, TOAST_EXIT_MS);
}
