# 易AI / Easy AI Independent Brand Website

Local bilingual brand-and-guides edition: **让 AI 真正用起来，在业务中落地。**
CCG API is a model-service product entry, not the site identity or application backend. Site copy always names it `CCG API` (`modelProduct.name`).

## Seventh-Round Redesign

The current plan and acceptance record are in `plan.md`; the handoff map, review
prompt and per-round procedure are in `HANDOFF.md`.
The site is organized around one idea: 易AI works across three layers, the
application layer (WorkBuddy), the model layer (model services and supply) and the
compute layer (self-built infrastructure). `StackVisual.astro` draws those layers
as one isometric illustration, reused in the dark homepage hero, the layer cards
and the service page heroes.

The homepage runs hero → three layer cards with a sticky illustration → the
易懂 · 易用 · 易落地 promise → four cooperation stages → three featured guides →
filterable FAQ → the shared inquiry panel. Hovering or focusing a hero route
lights up its layer; reading a layer card syncs the illustration. Service, about,
resources, article and contact pages share `PageHero.astro`, a sticky section
nav or table of contents, reading progress and a phone inquiry bar.
Topic choices survive reloads, language changes and browser Back without storing
customer information. Articles translate section fragments between paired headings;
service pages keep a six-part contents navigation and stable section IDs.

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
- `model-services/`: model APIs, supply cooperation, and the CCG API product entry.
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
`src/layouts/YiAiLayout.astro`; styling is one plain-CSS design system in `src/styles/site.css`
(no utility framework); page sections live in `src/components/yi-ai/`.
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

The header lockup stays still. The hero copy and illustration enter once within
about a second; the illustration's light beam runs twice and stops. Below-fold
groups reveal once with IntersectionObserver; content is visible in the HTML and
is only hidden after the observer is ready, so no-JS and missing-observer readers
see everything, and revealed content never fades back out. Cards lift only on
hover-capable pointers. The menu sheet and FAQ use native `details` with Web
Animations layered on top. Reduced-motion preferences remove entrance motion,
reveals and hover displacement. There is no looping motion, animation library,
client router or scroll hijacking; pages scroll natively.

Navigation collapses into a sheet below 1200px. Phones get a fixed consultation
bar, except on the contact page, which hides over the first screen and the closing
inquiry band. Body text is 17px desktop / 16px phone. Colours come from CSS custom
properties: night `#070B16`, cobalt `#245BDB`, ink `#111726`; muted text keeps at
least 4.5:1 contrast on every light surface. Headings use Manrope / Noto Sans SC;
codes, numbers and labels use a local JetBrains Mono subset.

## Validation

```sh
pnpm check
pnpm build
pnpm test
pnpm exec playwright install chromium webkit ffmpeg
PREVIEW_URL=http://127.0.0.1:4322 pnpm test:browser
pnpm audit
```

Start the static preview before browser checks. Alternatively set `BROWSER_EXECUTABLE`
to a locally installed Chromium-based browser. On Linux, WebKit also needs its
system libraries (`pnpm exec playwright install-deps webkit`).
Run `check` and `build` sequentially: they share Astro's generated content cache.

`scripts/test-build.mjs` asserts the static output: 28 pages, noindex (or, for a
production build, canonical/sitemap/base-path URLs), brand assets, fonts, homepage structure and the 20KB JavaScript budget.
`scripts/test-browser.mjs` checks 26 content routes at eight widths (320, 360, 390,
768, 1024, 1200, 1440 and 1920px) for overflow, fonts, logos and hero routes, runs
axe at 390 and 1440px, then covers internal links, language counterparts, the menu,
contact topics, clipboard success and fallback, keyboard input, no-JavaScript
reading and the 404. It finishes with `scripts/test-enhancements.mjs` in Chromium
and WebKit: language round trips, article contents and reading progress, service
section navigation, header states, the route/layer illustration sync, FAQ filter
and animation, menu focus handling at five breakpoints, the phone inquiry bar,
200% equivalent reflow, reduced motion, missing observer fallback and a motion
recording. Reports and screenshots go to `test-results/`.
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
`BRAND.md`. Manrope, Noto Sans SC and JetBrains Mono are self-hosted with OFL notices, not fetched
from Google during page visits.

## Publication

A plain `pnpm build` is a local preview: every page has `noindex, nofollow`,
`robots.txt` disallows crawling, `_headers` adds a noindex header and there is no
sitemap or canonical URL.

The owner approved publication at **https://ccg-cli.online/yi_ai/** (2026-09-30).
`SITE_ORIGIN` and `SITE_BASE` switch the build to production (see
`scripts/site-indexing.mjs`): every internal URL gets the `/yi_ai` prefix through
`withBase()` in `src/data/yi-ai.ts`, pages carry absolute canonical, `og:url`,
`og:image` and `hreflang` (with `x-default`) links, and `sitemap.xml` lists all 26
routes with language alternates. The entry page and 404 stay noindex.

```sh
pnpm build:production   # SITE_ORIGIN=https://ccg-cli.online SITE_BASE=/yi_ai
pnpm test:production    # production assertions
scripts/deploy-ccg.sh   # build, test and publish on this server
scripts/deploy-ccg.sh --rollback
```

The server's nginx serves `/var/www/yi_ai` (a symlink to a timestamped directory
in `/var/www/releases/`) through `/etc/nginx/snippets/yi-ai-site.conf`, included
once in the `ccg-cli.online` HTTPS server. Browser tests run against the root
preview build, so run `pnpm build` again after a production build before local
testing. Crawlers only read `robots.txt` at the origin root, which belongs to CCG;
submit `https://ccg-cli.online/yi_ai/sitemap.xml` in search consoles instead.
GEO visibility and search inclusion are not guaranteed by the site implementation.

See `IMPLEMENTATION_PLAN.md` for status and `LAUNCH_CHECKLIST.md` for deliberately
deferred publication/material requirements. The pre-upgrade snapshot is outside
this repository at `../yi-ai-template-archive/before-site-upgrade-20260919-235417.tar.gz`.
For recovery, extract into a separate directory first; do not automatically
overwrite current work. Local Git was initialized without commits or a remote.
