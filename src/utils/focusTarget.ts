const FOCUSABLE = 'a[href], button, input, select, textarea, [tabindex]';

// In-page jumps must move keyboard focus too, or the next Tab resumes from the old spot.
// preventScroll: the caller owns the scroll (smooth or converging), focus must not jump it.
export function focusTarget(el: Element | null | undefined) {
  if (!(el instanceof HTMLElement)) return;
  if (!el.matches(FOCUSABLE)) {
    el.setAttribute('tabindex', '-1');
    el.dataset.jumpTarget = '';
  }
  el.focus({ preventScroll: true });
}
