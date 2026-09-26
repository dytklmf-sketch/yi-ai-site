# 易AI / Easy AI Independent Brand Website

Local bilingual brand-and-guides edition: **让 AI 真正用起来，在业务中落地。**
CCG is a model-service product entry, not the site identity or application backend.

## Third-Round Refinement

The current execution plan and acceptance record are in `plan.md`. The complete
handoff map, absolute paths, review prompt and per-round update procedure are in
`HANDOFF.md`.
The homepage retains seven chapters, with three equal service cards, four
cooperation steps, three featured guides and six categorized FAQs. Each service
card separates its detail link from a topic-aware inquiry. The final chapter and
contact page share `ContactPanel.astro` and `src/scripts/contact.ts`.
Topic choices survive reloads, language changes and browser Back without storing
customer information. Articles translate section fragments between paired headings;
service pages use a six-part contents navigation and consistent section IDs.
Guide dates reflect editorial changes, not cosmetic updates.

## Run Locally

Requires Node.js 22.22.3+ and pnpm 11.19.0. The first edition was verified with
Node.js 24.19.0. Dependencies are pinned in `package.json` and `pnpm-lock.yaml`.

```sh
pnpm install --frozen-lockfile
pnpm dev --port 4321
```

Open `http://127.0.0.1:4321/zh/` or `http://127.0.0.1:4321/en/`.
The server binds only to loopback. Choose another port if it is occupied.

To inspect the production HTML locally:

```sh
pnpm build
pnpm preview --port 4322 --background
pnpm exec astro preview status
pnpm exec astro preview stop
```

Astro supports background development with `pnpm dev --background`; use
`pnpm exec astro dev status` and `pnpm exec astro dev stop` to manage it.
No deployment is performed by these commands.

## Pages and Content

Both `/zh/` and `/en/` have a homepage plus:

- `workbuddy/`: enterprise AI applications and WorkBuddy procurement consulting.
- `model-services/`: model APIs, supply cooperation, and the CCG product entry.
- `infrastructure/`: confirmed self-built data-center capability.
- `contact/`: inquiry topic, selectable/copyable WeChat ID, and email inquiry.
- `about/`: confirmed positioning, capabilities and product relationships.
- `resources/`: six practical guides, organized by the three services.
- `resources/{pairKey}/`: articles with contents, sources and related inquiries.

There are 26 content pages, plus the root entry and 404: 28 generated HTML files.
`src/data/routes.ts` produces `dist/site-manifest.json`, the shared inventory for
metadata, language counterparts, asset generation and tests.

Edit Chinese copy in `src/data/zh.ts`, English copy in `src/data/en.ts`, and contact
details/product links in `src/data/yi-ai.ts`. The approved Chinese brand is 易AI;
the English name is `Easy AI`, with a space and uppercase AI. Schema metadata retains both names.
Templates are in `src/pages/`; shared metadata/navigation is in
`src/layouts/YiAiLayout.astro`; styling is in `src/styles/yi-ai.css`.
Business processes, quotation inputs and scope are in `src/data/service-details.ts`.
About/resource copy is in `src/data/editorial.ts`.

Guides live in `src/content/guides/zh/` and `src/content/guides/en/`.
Every guide requires `lang`, `pairKey`, `title`, `description`, `service`,
`updatedAt`, `order` and HTTPS `sources` in its frontmatter. Match the `pairKey`
in both languages. The build rejects missing language pairs and duplicate keys.
Use an actual editorial update date, not a date refreshed only to appear recent.
Regenerate font subsets after introducing new Chinese characters.

There is no CMS, login, database, form endpoint, CCG API dependency, remote font request,
or tracking script. Contact choices populate an email in the visitor's mail client.
Without JavaScript, the content, navigation, FAQ, email links, and selectable
WeChat ID remain available; the visitor should state their topic in the email.
The optional QR configuration remains unset; no placeholder QR is shown.

## Motion and Layout

The header mark stays still. The desktop hero symbol moves once by 6px;
supporting copy enters within 600ms. Below-fold groups reveal once with native
IntersectionObserver and Web Animations, without hidden-by-default content.
Cards move only on hover-capable pointers; menus and FAQ use native details.
Same-origin page transitions use CSS `@view-transition` without a client router.
Reduced-motion preferences disable nonessential animation and displacement.

Below 1200px navigation collapses. Phone layouts have a fixed consultation entry,
except on the contact page, with reserved bottom space for safe-area and focus.
Body text is 17px desktop / 16px phone; cards use 8px corners, buttons 12px.
No loops, tracking, animation library or nested scroll container is included.
The expanded homepage route rail and article cards can exceed a phone viewport;
they retain native scrolling and reachable links rather than shrinking the text.

The homepages use seven viewport-height chapters, with the footer naturally following
the final inquiry chapter instead of becoming a separate paged screen.
Desktop layouts at least 1200px wide and 800px high, with a fine pointer, use explicit
page-by-page navigation: one vertical wheel gesture turns one chapter, including
the gesture's inertial tail. PageUp/Down, arrow keys, Home/End and chapter links
share the same 640–1000ms easing. Reverse gestures and new chapter links can
redirect a transition. Native wheel scrolling is prevented only in this mode.
Side anchors indicate the current section; fragment links and browser history
remain usable. Keyboard navigation focuses the destination.
Ordinary chapters have one resting position below the header. Scrollbar dragging
and other scroll paths settle to a complete chapter after release, without a
distance cutoff. The footer is also a complete desktop screen.
Oversized sections retain a readable interval, so expanded answers are not skipped.
Phones, short windows and reduced-motion users keep native reading. Native CSS
snapping provides the no-JavaScript fallback; articles and business pages retain
their continuous reading layout. Browser zoom and editable controls are not paged.

Content groups begin their single 600ms entrance before they come into view;
content already visible after a fast scroll is never faded back to zero.
The timing controller is loaded only on the two homepages.

## Validation

```sh
pnpm check
pnpm build
pnpm test
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:round-four
pnpm exec playwright install chromium webkit ffmpeg
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:browser
pnpm audit
```

Start the static preview before browser checks. Alternatively set `BROWSER_EXECUTABLE`
to a locally installed Chromium-based browser; a browser download is then unnecessary.
Run `check` and `build` sequentially: they share Astro's generated content cache.
Browser checks cover 26 content routes at eight widths (320, 360, 390, 768,
1024, 1200, 1440 and 1920px), axe accessibility scans,
internal links, language counterparts, contact interactions, keyboard input,
no-JavaScript reading, and 404 behavior. Enhanced tests run Chromium and WebKit
round trips, article contents, reduced motion, missing observer fallback,
200% equivalent reflow and motion screenshots/recordings.
`scripts/test-chapter-transition.mjs` adds frame-by-frame continuity, interrupted
navigation, keyboard focus and simulated small-delta wheel regressions in both engines.
`scripts/test-page-turning.mjs` covers single-page gestures, momentum, arbitrary
midpoint resting positions, dragging, keyboard paging and the desktop footer.
`scripts/test-round-three.mjs` covers bilingual 1200x800, 1440x960 and 1524x1227
chapter geometry, inline consultation, persistent topics and paired article sections.
`scripts/test-round-four.mjs` covers first-visit service routes, fixed-bar reachability,
short mobile windows, contact feedback stability, topic-aware email links and both engines.
Simulated wheel input is not a physical touchpad hardware benchmark.
Reports/screenshots go to `test-results/`; executable JavaScript stays below
the existing 20KB per-page budget.
Performance figures are local, unthrottled browser observations, not Lighthouse
scores or production Core Web Vitals. Tests do not contact model providers.
After validation, `pnpm package:preview` writes verified archives, screenshots,
recordings and reports to `../../outputs/easyai-site-upgrade/`.

## Assets and Provenance

See `TEMPLATE.md` for the AstroWind source, license, customization, and asset origin.
Build first, then generate brand PNGs with
`BROWSER_EXECUTABLE=/path/to/browser pnpm assets:brand`, then build again.
The generator consumes the built route manifest and wraps each of the 26 titles
into its own 1200-by-630 sharing image. It requires no image service.
The owner requested removal of the model-catalog screenshot; the image and capture
script are no longer included. The product entry is a plain external link.
Do not fabricate data-center photography. The selected A whale logo is an offline
vector refinement of the earlier skill-generated EAI concept. Normal builds,
tests and asset exports require no image API or credentials.
The outlined logo, transparent exports and font-subset workflow are documented in
`BRAND.md`. Manrope and Noto Sans SC are self-hosted with OFL notices, not fetched
from Google during page visits.

## Publication Gate

This edition is a local preview. Every page has `noindex, nofollow`; `robots.txt`
disallows crawling; `_headers` contains an additional noindex header for hosts
that support that file. There is no sitemap or production canonical URL.
Locale alternates and sharing-image paths are local preview references.

After the owner approves a formal domain and publication, separately configure
the site origin, absolute canonical/locale/share URLs, sitemap, crawl rules,
host-specific headers, and a genuine HTTP 404. Recheck accessibility and metadata
on that host before search submission. Do not publish this directory on CCG or
remove indexing safeguards without explicit authorization. GEO visibility and
search inclusion are not guaranteed by the site implementation.

See `IMPLEMENTATION_PLAN.md` for status and `LAUNCH_CHECKLIST.md` for deliberately
deferred publication/material requirements. The pre-upgrade snapshot is outside
this repository at `../yi-ai-template-archive/before-site-upgrade-20260919-235417.tar.gz`.
For recovery, extract into a separate directory first; do not automatically
overwrite current work. Local Git was initialized without commits or a remote.
