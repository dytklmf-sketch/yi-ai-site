# Repository Guidelines

## Project Structure

This independent bilingual Astro site is derived from AstroWind.
Do not modify the upstream reference checkout or the production CCG website.

- `src/data/`: bilingual copy and centrally configured contact details.
- `src/content/guides/{zh,en}/`: paired Markdown articles; `src/content.config.ts` validates metadata.
- `src/components/yi-ai/`: page sections, including the shared `StackVisual.astro` layer illustration.
- `src/styles/site.css`: the single plain-CSS design system (tokens, components, responsive rules).
- `src/pages/[lang]/`: Chinese and English routes.
- `public/brand/`: approved logo exports, hero and sharing assets.
- `public/fonts/`: self-hosted OFL font subsets and license notices.
- `assets/logo/`: selected whale A EAI master, small-size variant and earlier concept provenance.
- `src/scripts/`: progressive interaction and motion.
- `scripts/`: offline build assertions, Playwright checks and asset generation.

## Build and Development

Use Node 22.22.3+ and `pnpm-lock.yaml`. Run `pnpm check`, `pnpm build` and
`pnpm test` for every change. Browser testing has two tiers (round 38, agreed with the owner):
small changes to a few pages run `pnpm test:quick <paths>` (about a minute: 390/768/1440,
overflow, console errors, axe, screenshots in `test-results/quick/`) and may go live after the
screenshots are reviewed; the full `pnpm test:browser` (about 12 minutes) runs once per batch
of changes, for shared components (layout, header, footer, contact, global CSS) and before handover. Set `BROWSER_EXECUTABLE` when using a locally
installed browser; otherwise install Playwright Chromium.
Install WebKit and FFmpeg with `pnpm exec playwright install webkit ffmpeg`.
Run `pnpm dev --port 4321` for development or `pnpm preview --port 4322 --background`
after building. Browser tests use `PREVIEW_URL=http://127.0.0.1:4322`.
Asset exports consume the built `dist/site-manifest.json`; rebuild after generation.

## Style and Testing

Use two-space indentation, PascalCase components and kebab-case article filenames.
Run `pnpm format`. Pair complete translations using the same `pairKey`, with
dated sources and existing service IDs. Preserve `topic` contact parameters.
Tests cover 42 HTML pages, eight widths, axe, Chromium/WebKit workflows, no-JS
reading and motion. Add focused regressions to the existing suites, not new
per-round scripts. Round scope and status live in `plan.md`. Preserve the six
service section IDs, paired article fragments, the shared topic-aware
home/contact component and the `data-*` hooks the scripts and tests rely on.
Keep muted text at 4.5:1 contrast or better; no looping motion.
No coverage percentage is configured; reports stay in `test-results/`.

## Commits and Reviews

The new local Git repository has no established commit history. Use imperative
subjects, such as `Fix article language pairing`. Describe scope, related issues,
verification and deployment implications; include UI screenshots. Do not
automatically commit or push.

## Per-Round Handoff

After each round of changes, write the round record to `docs/rounds/NN-topic.md`, keep `HANDOFF.md` (current version) and `plan.md` (open items) short, and include the round,
actual changes, absolute artifact paths, verified preview URL, tests performed,
limitations and remaining work. Never label old reports as fresh verification.
Run `pnpm package:preview` after the required checks, verify `docs/HANDOFF.md`
and the source archive include the updated guide, and link the guide and delivery
directory in the final response. Preserve prior evidence and exclude credentials.

## Security and Brand

Plain builds stay `noindex` previews. Only the approved production build
(`pnpm build:production`, https://www.yeeeai.com/) has canonical URLs, a sitemap
and indexing; route every internal URL through `withBase()`. Use local fonts/assets and no third-party tracking.
Use 易AI in Chinese and `Easy AI` in English.
CCG API is a product, not the site identity; copy names it `CCG API`, never bare `CCG` (the ccg-cli.online domain and CCG nginx are infrastructure, not copy). Do not restore the removed model screenshot.
Never fabricate equipment, authorization, customer stories or service guarantees.
Follow `BRAND.md` and retain the approved unframed whale A.
Pair it with the complete Chinese or English name; use the eye-free optical
variant at 24px and below. Never restore rejected concepts without approval.
Builds and tests never call paid image generation. Never run `generate-logo*.py`
as a test or build step.
Credentials belong only in environment variables, never in source or packages.
