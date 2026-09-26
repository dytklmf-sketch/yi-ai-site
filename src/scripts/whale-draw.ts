/**
 * whale-draw.ts — animates the whale mark SVG paths with stroke-dashoffset
 * on first page load only. Respects prefers-reduced-motion.
 *
 * How it works: each path gets a measured totalLength, then starts hidden
 * (dashoffset = length) and animates to 0 over a staggered duration.
 * The fill fades in simultaneously so the reveal reads as "drawing then filling."
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

const TARGET_ID = 'hero-whale-draw';

const draw = () => {
  const svg = document.getElementById(TARGET_ID) as SVGSVGElement | null;
  if (!svg) return;

  const paths = [...svg.querySelectorAll<SVGPathElement>('[data-draw]')];
  if (!paths.length) return;

  // Skip animation if the user prefers reduced motion — just show filled.
  if (reduced.matches) {
    svg.style.opacity = '1';
    return;
  }

  // Offsets per path — in order: head, ea-ligature, tail-flukes, lower-i
  const delays = [0, 120, 60, 220]; // ms
  const durations = [520, 680, 380, 260]; // ms

  paths.forEach((path, i) => {
    const len = path.getTotalLength();

    // Start state: invisible stroke, transparent fill
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    path.style.fill = 'transparent';
    path.style.stroke = 'var(--dark-accent, #3D6FF0)';
    path.style.strokeWidth = '1.5';

    const startTime = performance.now() + (delays[i] ?? 0);
    const dur = durations[i] ?? 500;
    const fillDelay = dur * 0.6; // fill starts at 60% of stroke completion

    const ease = (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    let fillStarted = false;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      if (elapsed < 0) { requestAnimationFrame(tick); return; }

      const strokeT = Math.min(1, elapsed / dur);
      path.style.strokeDashoffset = `${len * (1 - ease(strokeT))}`;

      // Once stroke is >60% done, fade in fill
      if (elapsed >= fillDelay && !fillStarted) {
        fillStarted = true;
        const fillDur = dur * 0.5;
        const fillStart = now;
        const fillTick = (t: number) => {
          const fp = Math.min(1, (t - fillStart) / fillDur);
          const alpha = ease(fp);
          // Parse the fill color from data-fill or fall back to parent's fill
          const targetFill = path.dataset.fill ?? 'var(--dark-accent, #3D6FF0)';
          path.style.fill = targetFill;
          path.style.opacity = `${alpha}`;
          if (fp < 1) requestAnimationFrame(fillTick);
          else {
            path.style.stroke = 'none';
            path.style.fill = targetFill;
            path.style.opacity = '1';
          }
        };
        requestAnimationFrame(fillTick);
      }

      if (strokeT < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  });

  // Fade the whole SVG in from 0 first (it starts hidden via CSS)
  svg.animate([{ opacity: 0 }, { opacity: 1 }], {
    duration: 200,
    fill: 'forwards',
    easing: 'ease-out',
  });
};

if (document.readyState === 'complete') {
  draw();
} else {
  window.addEventListener('load', draw, { once: true });
}
