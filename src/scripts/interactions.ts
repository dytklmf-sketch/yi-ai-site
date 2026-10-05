const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const menu = document.querySelector<HTMLDetailsElement>('.mobile-menu');
// Keep aria-expanded in step immediately; the native toggle event arrives a task later.
const closeMenu = () => {
  if (!menu) return;
  menu.open = false;
  menu.querySelector('summary')?.setAttribute('aria-expanded', 'false');
};
const header = document.querySelector<HTMLElement>('[data-header]');
const darkHero = document.body.classList.contains('has-dark-hero')
  ? document.querySelector<HTMLElement>('main > .hero')
  : null;
const progress = document.querySelector<HTMLElement>('[data-reading-progress]');
const progressTarget = document.querySelector<HTMLElement>('.article-body');
const animations = new Set<Animation>();
const play = (element: Element, frames: Keyframe[], options: KeyframeAnimationOptions) => {
  const animation = element.animate(frames, options);
  animations.add(animation);
  animation.finished.catch(() => {}).finally(() => animations.delete(animation));
  return animation;
};

// Scroll-driven state is batched into one frame.
let frame = 0;
const onScroll = () => {
  frame = 0;
  const y = window.scrollY;
  header?.classList.toggle('is-scrolled', y > 8);
  if (header && darkHero)
    header.classList.toggle('is-solid', darkHero.getBoundingClientRect().bottom <= header.offsetHeight);
  if (progress && progressTarget) {
    const box = progressTarget.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - innerHeight * 0.6)));
    progress.style.setProperty('--progress', ratio.toFixed(4));
  }
  highlightSection();
};
const requestScroll = () => {
  if (!frame) frame = requestAnimationFrame(onScroll);
};
window.addEventListener('scroll', requestScroll, { passive: true });
window.addEventListener('resize', requestScroll);
window.addEventListener('pageshow', requestScroll);

const fragmentId = (hash: string) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};
const sectionLinks = [...document.querySelectorAll<HTMLAnchorElement>('[data-section-nav] a[href^="#"]')];
const sectionTargets = [...new Set(sectionLinks.map((link) => document.getElementById(fragmentId(link.hash))))].filter(
  (target): target is HTMLElement => target !== null
);
function highlightSection() {
  if (!sectionTargets.length) return;
  const subnav = document.querySelector('.subnav')?.getBoundingClientRect().bottom || 0;
  const inset = Math.max(header?.getBoundingClientRect().bottom || 0, subnav) + 48;
  const active = sectionTargets.findLast((target) => target.getBoundingClientRect().top <= inset);
  sectionLinks.forEach((link) => {
    const current = active?.id === fragmentId(link.hash);
    if (current) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
    // Keep the active tab visible in horizontally scrolling navs.
    const row = link.parentElement;
    if (current && row && row.scrollWidth > row.clientWidth) {
      const left = link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2;
      if (Math.abs(row.scrollLeft - left) > 24) row.scrollTo({ left, behavior: reduced.matches ? 'auto' : 'smooth' });
    }
  });
}
onScroll();

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

// Height animation for disclosures; the menu sheet fades and slides instead.
document.querySelectorAll<HTMLDetailsElement>('.faq-list details, .mobile-menu, .mobile-toc').forEach((details) => {
  const summary = details.querySelector('summary');
  const content = summary?.nextElementSibling as HTMLElement | null;
  const sheet = details.classList.contains('mobile-menu');
  let running: Animation | undefined;
  let desiredOpen = details.open;
  details.addEventListener('toggle', () => {
    if (!details.open) {
      running?.cancel();
      running = undefined;
      desiredOpen = false;
    }
    if (sheet) summary?.setAttribute('aria-expanded', String(details.open));
  });
  summary?.addEventListener('click', async (event) => {
    if (reduced.matches || !content || typeof content.animate !== 'function') return;
    event.preventDefault();
    const opening = running ? !desiredOpen : !details.open;
    const fromHeight = details.open ? content.getBoundingClientRect().height : 0;
    const fromOpacity = details.open ? getComputedStyle(content).opacity : '0';
    desiredOpen = opening;
    running?.cancel();
    running = undefined;
    if (opening) details.open = true;
    const height = content.getBoundingClientRect().height;
    const frames: Keyframe[] = sheet
      ? [
          { opacity: fromOpacity, transform: details.open && !opening ? 'none' : 'translateY(-8px)' },
          { opacity: opening ? 1 : 0, transform: opening ? 'none' : 'translateY(-8px)' },
        ]
      : [
          { opacity: fromOpacity, height: `${fromHeight}px`, overflow: 'hidden' },
          { opacity: opening ? 1 : 0, height: `${opening ? height : 0}px`, overflow: 'hidden' },
        ];
    const animation = play(content, frames, { duration: sheet ? 240 : 300, easing: 'cubic-bezier(.22,1,.36,1)' });
    if (sheet && opening) {
      content.querySelectorAll<HTMLElement>('nav a').forEach((link, i) =>
        play(
          link,
          [
            { opacity: 0, transform: 'translateY(10px)' },
            { opacity: 1, transform: 'none' },
          ],
          {
            duration: 420,
            delay: 40 + i * 35,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'backwards',
          }
        )
      );
    }
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
    if (target === menu) closeMenu();
    else target.open = false;
    target.querySelector('summary')?.focus();
  }
});
document.addEventListener('click', (event) => {
  if (!menu?.open || !(event.target instanceof Element)) return;
  if (!menu.contains(event.target) || event.target.closest('.mobile-sheet a')) closeMenu();
});
menu?.addEventListener('focusout', (event) => {
  if (event.relatedTarget instanceof Node) {
    if (!menu.contains(event.relatedTarget)) closeMenu();
  } else {
    // Browsers can omit the next target when focus leaves the document.
    requestAnimationFrame(() => {
      if (document.activeElement !== document.body && !menu.contains(document.activeElement)) closeMenu();
    });
  }
});
menu?.querySelector('summary')?.setAttribute('aria-expanded', 'false');
window.matchMedia('(min-width: 1200px)').addEventListener('change', (event) => {
  if (event.matches) closeMenu();
});
reduced.addEventListener('change', (event) => {
  if (event.matches) animations.forEach((animation) => animation.cancel());
});

// Service filters for the FAQ and the guide grid (progressive: without JS every item stays listed).
const serviceFilter = (group: HTMLElement, items: HTMLElement[]) => {
  const buttons = [...group.querySelectorAll<HTMLButtonElement>('button[data-filter]')];
  group.hidden = false;
  buttons.forEach((button) =>
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      items.forEach((item) => {
        const show = filter === 'all' || item.dataset.service === filter;
        if (!show && item instanceof HTMLDetailsElement) item.open = false;
        item.hidden = !show;
        if (show && !reduced.matches) play(item, [{ opacity: 0 }, { opacity: 1 }], { duration: 260 });
      });
    })
  );
};
document.querySelectorAll<HTMLElement>('[data-faq-filter]').forEach((group) => {
  const list = group.closest('.faq-layout')?.querySelector('.faq-list');
  if (list) serviceFilter(group, [...list.querySelectorAll<HTMLElement>('details[data-service]')]);
});
document.querySelectorAll<HTMLElement>('[data-filter-group]').forEach((group) => {
  const section = group.closest('section');
  if (section) serviceFilter(group, [...section.querySelectorAll<HTMLElement>('.guide-card[data-service]')]);
});

// Progressive reveal: content is visible in HTML and only hidden once the observer is ready.
if (!reduced.matches && 'IntersectionObserver' in window) {
  const targets = [...document.querySelectorAll<HTMLElement>('[data-reveal]')].filter(
    (element) => element.getBoundingClientRect().top > innerHeight * 0.92
  );
  if (targets.length) {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target, isIntersecting }) => {
          if (!isIntersecting) return;
          target.classList.add('is-in');
          observer.unobserve(target);
        }),
      // No bottom inset: in full-screen chapters the last line of a section may sit at the very bottom edge.
      { threshold: 0 }
    );
    targets.forEach((element) => observer.observe(element));
    document.querySelectorAll('[data-reveal]').forEach((element) => {
      if (!targets.includes(element as HTMLElement)) element.classList.add('is-in');
    });
    document.documentElement.classList.add('reveal-ready');
    reduced.addEventListener('change', (event) => {
      if (event.matches) {
        observer.disconnect();
        document.querySelectorAll('[data-reveal]').forEach((element) => element.classList.add('is-in'));
      }
    });
  }
}

// Round 40: the resident contact button — copy the WeChat ID, and close when the reader clicks elsewhere.
const fab = document.querySelector<HTMLDetailsElement>('[data-contact-fab]');
fab?.querySelector<HTMLButtonElement>('[data-fab-copy]')?.addEventListener('click', async (event) => {
  const button = event.currentTarget as HTMLButtonElement;
  const status = fab.querySelector<HTMLElement>('.contact-fab-status');
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
    await navigator.clipboard.writeText(button.dataset.fabCopy || '');
    if (status) status.textContent = button.dataset.success || '';
  } catch {
    if (status) status.textContent = button.dataset.failure || '';
    const id = fab.querySelector<HTMLElement>('.contact-fab-id');
    if (id) {
      id.focus();
      const range = document.createRange();
      range.selectNodeContents(id);
      getSelection()?.removeAllRanges();
      getSelection()?.addRange(range);
    }
  }
});
document.addEventListener('click', (event) => {
  if (fab?.open && !fab.contains(event.target as Node)) fab.open = false;
});
