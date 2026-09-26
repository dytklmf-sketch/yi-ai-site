const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
const header = document.querySelector<HTMLElement>('.site-header');
const animations = new Set<Animation>();
const play = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
  const animation = element.animate(frames, options);
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  return animation;
};

const headerState = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
headerState();
window.addEventListener('scroll', headerState, { passive: true });

const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-section-nav] a[href^="#"]')];
const fragmentId = (hash: string) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};
const sectionTargets = [...new Set(sectionLinks.map((link) => document.getElementById(fragmentId(link.hash))))].filter(
  (target): target is HTMLElement => target !== null
);
if (sectionTargets.length) {
  let pending = false;
  const highlightSection = () => {
    const inset =
      Math.max(
        header?.getBoundingClientRect().bottom || 0,
        parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0
      ) + 24;
    const active = sectionTargets.findLast((target) => target.getBoundingClientRect().top <= inset);
    sectionLinks.forEach((link) => {
      if (active?.id === fragmentId(link.hash)) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    pending = false;
  };
  window.addEventListener(
    'scroll',
    () => {
      if (!pending) {
        pending = true;
        requestAnimationFrame(highlightSection);
      }
    },
    { passive: true }
  );
  window.addEventListener('resize', highlightSection);
  window.addEventListener('pageshow', highlightSection);
  highlightSection();
}
const fragmentPairs: Record<string, string> | undefined = (() => {
  const pairs = document.querySelector<HTMLElement>('[data-language-fragments]')?.dataset.languageFragments;
  return pairs ? JSON.parse(pairs) : undefined;
})();
const syncLanguageFragment = () => {
  const id = fragmentId(location.hash);
  const corresponding = fragmentPairs ? fragmentPairs[id] : document.getElementById(id)?.id;
  document.querySelectorAll<HTMLAnchorElement>('.language-link, .footer-bottom a[lang]').forEach((link) => {
    const url = new URL(link.href);
    url.hash = corresponding || '';
    link.href = url.href;
  });
};
window.addEventListener('hashchange', syncLanguageFragment);
window.addEventListener('popstate', syncLanguageFragment);
window.addEventListener('pageshow', syncLanguageFragment);
document.addEventListener('click', (event) => {
  if (event.target instanceof Element && event.target.closest('.language-link, .footer-bottom a[lang]')) {
    syncLanguageFragment();
  }
});
syncLanguageFragment();

document.querySelectorAll<HTMLDetailsElement>('.faq-list details, .mobile-menu, .mobile-toc').forEach((details) => {
  const summary = details.querySelector('summary');
  const content = summary?.nextElementSibling;
  let running: Animation | undefined;
  let desiredOpen = details.open;
  details.addEventListener('toggle', () => {
    if (!details.open) {
      const previous = running;
      running = undefined;
      previous?.cancel();
      desiredOpen = false;
    }
  });
  summary?.addEventListener('click', async (event) => {
    if (reduced.matches || !content || typeof content.animate !== 'function') return;
    event.preventDefault();
    const opening = !details.open || (running ? !desiredOpen : false);
    const fromHeight = details.open ? content.getBoundingClientRect().height : 0;
    const fromOpacity = details.open ? getComputedStyle(content).opacity : '0';
    const currentClip = details.open ? getComputedStyle(content).clipPath : 'inset(0 0 100% 0)';
    const fromClip = currentClip === 'none' ? 'inset(0)' : currentClip;
    desiredOpen = opening;
    const previous = running;
    running = undefined;
    previous?.cancel();
    if (opening) details.open = true;
    const height = content.getBoundingClientRect().height;
    const flowContent = !details.classList.contains('mobile-menu');
    const animation = play(
      content,
      [
        {
          opacity: fromOpacity,
          ...(flowContent ? { height: `${fromHeight}px`, overflow: 'hidden' } : { clipPath: fromClip }),
        },
        {
          opacity: opening ? 1 : 0,
          ...(flowContent
            ? { height: `${opening ? height : 0}px`, overflow: 'hidden' }
            : { clipPath: opening ? 'inset(0)' : 'inset(0 0 100% 0)' }),
        },
      ],
      { duration: 220, easing: 'ease-out' }
    );
    running = animation;
    await animation.finished.catch(() => {});
    // A canceled animation must never overwrite a newer click or external close.
    if (running !== animation || !details.open) return;
    running = undefined;
    details.open = opening;
  });
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  const active = document.activeElement?.closest<HTMLDetailsElement>('details[open]');
  const target = menu?.open ? menu : active;
  if (target) {
    target.open = false;
    target.querySelector('summary')?.focus();
  }
});
document.addEventListener('click', (event) => {
  if (menu?.open && event.target instanceof Node && !menu.contains(event.target)) menu.open = false;
});
menu?.addEventListener('focusout', (event) => {
  if (event.relatedTarget instanceof Node) {
    if (!menu.contains(event.relatedTarget)) menu.open = false;
  } else {
    // Browsers can omit the next target when focus leaves the document.
    requestAnimationFrame(() => {
      if (!menu.contains(document.activeElement)) menu.open = false;
    });
  }
});
window.matchMedia('(min-width: 1200px)').addEventListener('change', (event) => {
  if (event.matches && menu) menu.open = false;
});
reduced.addEventListener('change', (event) => {
  if (event.matches) animations.forEach((animation) => animation.cancel());
});

const chapterNav = document.querySelector<HTMLElement>('.chapter-nav');
const chapterLinks = [...document.querySelectorAll<HTMLAnchorElement>('.chapter-nav a')];
const initialChapter = chapterLinks.find((link) => link.hash === location.hash)?.hash;
if (
  initialChapter &&
  (performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming)?.type !== 'back_forward'
) {
  // WebKit can settle on the first snap point instead of an incoming fragment.
  const restoreFragment = () =>
    requestAnimationFrame(() => {
      if (window.scrollY === 0 && location.hash === initialChapter) {
        document.getElementById(initialChapter.slice(1))?.scrollIntoView({ block: 'start', behavior: 'instant' });
      }
    });
  if (document.readyState === 'complete') restoreFragment();
  else window.addEventListener('load', restoreFragment, { once: true });
}
if (chapterLinks.length && chapterNav) {
  const sections = [...document.querySelectorAll<HTMLElement>('.home-chapter')];
  const inquiry = document.getElementById('inquiry');
  let scheduled = false;
  const updateChapterNav = () => {
    const active = sections.findLast((section) => section.getBoundingClientRect().top <= innerHeight * 0.45);
    const blue = inquiry?.getBoundingClientRect();
    chapterLinks.forEach((link) => {
      if (link.hash === `#${active?.id}`) link.setAttribute('aria-current', 'step');
      else link.removeAttribute('aria-current');
      const box = link.getBoundingClientRect();
      const midpoint = box.top + box.height / 2;
      link.dataset.tone = blue && midpoint >= blue.top && midpoint < blue.bottom ? 'inverse' : 'default';
    });
    scheduled = false;
  };
  const scheduleChapterNav = () => {
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(updateChapterNav);
    }
  };
  window.addEventListener('scroll', scheduleChapterNav, { passive: true });
  window.addEventListener('resize', scheduleChapterNav);
  window.addEventListener('pageshow', scheduleChapterNav);
  updateChapterNav();
}

// Elements stay visible in HTML and until an animation actually starts.
if (!reduced.matches && 'IntersectionObserver' in window && typeof Element.prototype.animate === 'function') {
  const home = document.documentElement.classList.contains('home-story');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(({ target, isIntersecting }) => {
        if (!isIntersecting) return;
        observer.unobserve(target);
        const content = home ? target.querySelector<HTMLElement>('.site-container') : (target as HTMLElement);
        if (!content) return;
        const delay = home ? 0 : Math.min(2, Math.max(0, Number(content.dataset.delay) || 0)) * 60;
        // Start home groups while still offscreen; never hide text already visible after a fast scroll.
        const alreadyVisible = home && content.getBoundingClientRect().top < window.innerHeight;

        // Service cards on home use diagonal entry; everything else uses fade-up
        const isServiceCard = content.closest?.('.service-card') !== null ||
          (target as HTMLElement).classList?.contains('service-card');

        const fromTransform = alreadyVisible
          ? 'none'
          : isServiceCard
            ? 'translate(-10px, 14px)'
            : 'translateY(8px)';

        play(
          content,
          [
            { opacity: alreadyVisible ? 1 : 0, transform: fromTransform },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: home ? 600 : 400,
            delay,
            easing: home ? 'cubic-bezier(.22,1,.36,1)' : 'cubic-bezier(.2,.65,.3,1)',
            fill: 'backwards',
          }
        );
      });
    },
    home ? { threshold: 0, rootMargin: '0px 0px -4% 0px' } : { threshold: 0.08 }
  );
  const targets = home ? '.home-chapter:not(#intro)' : '[data-reveal]';
  document.querySelectorAll<HTMLElement>(targets).forEach((element) => {
    // Do not animate both a group and its children.
    if (home || !element.querySelector('[data-reveal]')) observer.observe(element);
  });
  reduced.addEventListener('change', (event) => {
    if (event.matches) {
      observer.disconnect();
    }
  });
}

// Process timeline connector line — add .is-visible when the section enters viewport
const processTimeline = document.querySelector<HTMLElement>('.process-timeline');
if (processTimeline) {
  const lineObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        processTimeline.classList.add('is-visible');
        lineObserver.disconnect();
      }
    },
    { threshold: 0.2 }
  );
  lineObserver.observe(processTimeline);
}
