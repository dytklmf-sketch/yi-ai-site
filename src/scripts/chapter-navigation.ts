export {};

const root = document.documentElement;
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const desktop = window.matchMedia('(min-width: 1200px) and (min-height: 800px) and (pointer: fine)');
const sections = [...document.querySelectorAll<HTMLElement>('.home-chapter')];
const wheelGestureGap = 200;
// Increased cooldown so the inertial tail of a single trackpad swipe cannot
// trigger a second chapter jump before the first animation finishes.
const motionTailCooldown = 600;
// Raised threshold: small spurious delta events below this are swallowed
// during cooldown. 32 was too low for high-momentum Magic Trackpad flings.
const smallTailDelta = 60;
let frame = 0;
let idle = 0;
let pointerDown = false;
let lastWheel = 0;
let wheelDirection = 0;
let wheelAmount = 0;
let gestureUsed = false;
let travelDirection = 0;
let paging = false;
let gestureCooldownUntil = 0;

const positions = () => {
  const inset = parseFloat(getComputedStyle(root).scrollPaddingTop) || 0;
  const available = window.innerHeight - inset;
  const limit = Math.max(0, root.scrollHeight - window.innerHeight);
  return sections.map((element, index) => {
    const box = element.getBoundingClientRect();
    const start = Math.max(0, Math.min(window.scrollY + box.top - inset, limit));
    // The final chapter includes the natural-flow footer, without creating another snap point.
    const end = index === sections.length - 1 ? limit : Math.min(limit, start + Math.max(0, box.height - available));
    return { element, start, end };
  });
};

const stop = (preserveCooldown = false) => {
  cancelAnimationFrame(frame);
  clearTimeout(idle);
  frame = 0;
  root.removeAttribute('data-chapter-scrolling');
  if (!preserveCooldown) gestureCooldownUntil = 0;
};

const moveTo = (end: number, focus?: HTMLElement, settling = false) => {
  stop();
  const start = window.scrollY;
  const distance = end - start;
  travelDirection = Math.sign(distance);
  const finish = (preserveMotionCooldown = false) => {
    stop(preserveMotionCooldown);
    if (focus) {
      focus.setAttribute('tabindex', '-1');
      focus.focus({ preventScroll: true });
    }
  };
  if (reduced.matches || Math.abs(distance) < 1) {
    window.scrollTo({ top: end, behavior: 'instant' });
    finish();
    return;
  }
  root.setAttribute('data-chapter-scrolling', '');
  const duration = settling ? 420 : Math.min(1000, 640 + Math.abs(distance) * 0.12);
  gestureCooldownUntil = performance.now() + duration + motionTailCooldown;
  const started = performance.now();
  const tick = (now: number) => {
    const progress = Math.min(1, Math.max(0, (now - started) / duration));
    const eased = progress ** 3 * (progress * (progress * 6 - 15) + 10);
    window.scrollTo({ top: start + distance * eased, behavior: 'instant' });
    if (progress < 1) frame = requestAnimationFrame(tick);
    else finish(true);
  };
  frame = requestAnimationFrame(tick);
};

const settle = () => {
  if (!paging || frame || pointerDown || readingFAQ()) return;
  // Long sections have a readable interval; ordinary sections have one exact resting position.
  const destinations = positions().map(({ start, end }) => Math.max(start, Math.min(end, window.scrollY)));
  const nearest = destinations.reduce((a, b) => (Math.abs(a - window.scrollY) < Math.abs(b - window.scrollY) ? a : b));
  if (Math.abs(nearest - window.scrollY) > 1) moveTo(nearest, undefined, true);
};
const scheduleSettle = () => {
  clearTimeout(idle);
  if (paging && !frame && !pointerDown) idle = window.setTimeout(settle, 160);
};
const readingFAQ = () => document.querySelector('.faq-list details[open]') !== null;
const step = (direction: number, keyboard = false) => {
  if (frame && direction === travelDirection) return;
  const points = positions();
  const next =
    direction > 0
      ? points.find(({ start }) => start > window.scrollY + 2)
      : points.findLast(({ end }) => end < window.scrollY - 2);
  if (next) moveTo(direction > 0 ? next.start : next.end, keyboard ? next.element : undefined);
  else settle();
};
const canReadWithinSection = (direction: number) =>
  positions().some(
    ({ start, end }) =>
      end - start > 2 &&
      window.scrollY >= start - 1 &&
      window.scrollY <= end + 1 &&
      (direction > 0 ? window.scrollY < end - 1 : window.scrollY > start + 1)
  );
const editable = (target: EventTarget | null) =>
  target instanceof Element &&
  target.closest('input, textarea, select, [contenteditable="true"], [role="slider"], [role="textbox"]');

window.addEventListener(
  'wheel',
  (event) => {
    if (
      !paging ||
      readingFAQ() ||
      event.ctrlKey ||
      event.metaKey ||
      Math.abs(event.deltaY) <= Math.abs(event.deltaX) ||
      editable(event.target)
    ) {
      return;
    }
    const direction = Math.sign(event.deltaY);
    if (canReadWithinSection(direction)) {
      stop();
      gestureUsed = false;
      return;
    }
    if (!event.cancelable) return;
    const now = performance.now();
    const wheelMagnitude =
      Math.abs(event.deltaY) * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? innerHeight : 1);
    if (gestureCooldownUntil > now && direction === travelDirection && wheelMagnitude < smallTailDelta) {
      event.preventDefault();
      lastWheel = now;
      wheelDirection = direction;
      wheelAmount = 0;
      gestureUsed = true;
      return;
    }
    event.preventDefault();
    if (now - lastWheel > wheelGestureGap || direction !== wheelDirection) {
      wheelAmount = 0;
      gestureUsed = false;
    }
    lastWheel = now;
    wheelDirection = direction;
    wheelAmount += wheelMagnitude;
    // Consume the gesture, including its inertial tail, only once.
    if (!gestureUsed && wheelAmount >= 10) {
      gestureUsed = true;
      step(direction);
    }
  },
  { passive: false }
);

document.addEventListener('click', (event) => {
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey ||
    reduced.matches ||
    !(event.target instanceof Element)
  ) {
    return;
  }
  const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
  if (!link || link.hasAttribute('download') || (link.target && link.target !== '_self')) return;
  const point = positions().find(({ element }) => `#${element.id}` === link.hash);
  if (!point) return;
  event.preventDefault();
  moveTo(point.start, event.detail === 0 ? point.element : undefined);
  if (location.hash !== link.hash) history.pushState(history.state, '', link.hash);
});

document.addEventListener('keydown', (event) => {
  if (event.defaultPrevented || event.ctrlKey || event.metaKey || event.altKey || editable(event.target)) return;
  const spaceOnControl =
    event.key === ' ' && event.target instanceof Element && event.target.closest('a, button, summary');
  const direction = ['PageDown', 'ArrowDown', ' '].includes(event.key)
    ? event.shiftKey
      ? -1
      : 1
    : ['PageUp', 'ArrowUp'].includes(event.key)
      ? -1
      : 0;
  if (
    paging &&
    !readingFAQ() &&
    !spaceOnControl &&
    (direction || event.key === 'Home' || event.key === 'End') &&
    !canReadWithinSection(direction)
  ) {
    event.preventDefault();
    if (event.repeat) return;
    if (direction) step(direction, true);
    else {
      const points = positions();
      const point = event.key === 'Home' ? points[0] : points[points.length - 1];
      moveTo(point.start, point.element);
    }
  } else if (event.key === 'Tab' || event.key === 'Escape') {
    stop();
    scheduleSettle();
  }
});

document.addEventListener('focusin', () => {
  if (!paging) return;
  // Native focus scrolling must not compete with a previous chapter transition.
  stop();
  scheduleSettle();
});
window.addEventListener('scroll', scheduleSettle, { passive: true });
window.addEventListener(
  'pointerdown',
  () => {
    pointerDown = true;
    stop();
  },
  { passive: true }
);
const releasePointer = () => {
  pointerDown = false;
  scheduleSettle();
};
window.addEventListener('pointerup', releasePointer, { passive: true });
window.addEventListener('pointercancel', releasePointer, { passive: true });

const restoreHistory = () => {
  stop();
  gestureUsed = false;
  const point = positions().find(({ element }) => `#${element.id}` === location.hash);
  if (point) window.scrollTo({ top: point.start, behavior: 'instant' });
  scheduleSettle();
};
window.addEventListener('popstate', restoreHistory);
window.addEventListener('hashchange', restoreHistory);
window.addEventListener('pagehide', () => stop());
const updateMode = () => {
  stop();
  paging = desktop.matches && !reduced.matches;
  root.toggleAttribute('data-chapter-paging', paging);
  gestureUsed = false;
  pointerDown = false;
  scheduleSettle();
};
window.addEventListener('resize', updateMode);
window.addEventListener('pageshow', updateMode);
desktop.addEventListener('change', updateMode);
reduced.addEventListener('change', updateMode);
document.querySelectorAll('.faq-list details').forEach((details) =>
  details.addEventListener('toggle', () => {
    stop();
    if (!readingFAQ()) scheduleSettle();
  })
);
updateMode();
