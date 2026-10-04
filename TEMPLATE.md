# Template and Asset Provenance

## Source and License

- Reference: `https://github.com/onwidget/astrowind`
- Pinned reference commit: `14e1a691f80548dcc36370847b1a02c0d0b12821`
- License inspected locally: MIT, Copyright (c) 2023 onWidget.
- Original notice retained in `LICENSE.md`.
- Reference checkout: `../astrowind-upstream/`; it is not the running website.

The independent project began from the reference template. Its build configuration
and TypeScript/formatting conventions were retained; the seventh round replaced the
remaining template component and Tailwind styling with a plain-CSS design system. Brand layouts, page content, navigation, contact behavior and
styles were rewritten for 易AI. Unused demo source/configuration was moved to
`../yi-ai-template-archive/`, outside the application and distributable source.

Template demo pages, analytics, remote font requests, sample forms, blog content,
CMS configuration and sitemap generation are not included in the preview.
The source package needs neither the reference checkout nor the template archive.

## Dependency Baseline

Direct dependencies use exact versions and the pnpm lockfile:

- Astro 7.3.1: static generation and local preview.
- TypeScript 5.9.3: source checks.
- `@lucide/astro` 1.47.0: interface icons.
- Playwright 1.58.2 and axe-core integration 4.11.1: browser verification.

Install hooks are restricted by `pnpm-workspace.yaml` to esbuild.
Review dependency changes and run `pnpm audit` when updating the lockfile.
Audit output describes the registry's known advisories at execution time, not a
guarantee that the software is vulnerability-free.

## Assets

- `public/brand/hero-field.png`: original logo-based bitmap, generated locally by
  `scripts/brand-assets.mjs`, not a photograph or an AI infrastructure depiction.
- `public/brand/share-*.png`: 10 original bilingual, page-specific sharing images.
- `assets/logo/mark.svg`: production-cleaned Yi lettermark based on an owner-authorized
  generated concept, with outlined Chinese and English lockups in
  `public/brand/logo-*.svg`, and transparent PNG equivalents.
- `public/brand/favicon.svg`: the same compact Yi symbol.
- `public/fonts/`: self-hosted Manrope, Noto Sans SC and JetBrains Mono subsets with OFL notices.
- The model-catalog screenshot was removed at the owner's request on 2026-09-18.
  It is not included in the current project or build.

## Typography and Design Reference

Font source: `https://github.com/google/fonts`, pinned commit
`1edf95b4328bc5997ca93d2c0c7205272ec7347f`, directories `ofl/manrope`,
`ofl/notosanssc` and `ofl/jetbrainsmono`. The corresponding OFL files are redistributed unchanged.
See `BRAND.md` for local regeneration and source filenames.

The owner supplied `https://dayusea.com/` as a design reference. Its live desktop
and mobile pages were inspected on 2026-09-18. This revision adopts a more direct
service introduction, capability-led explanation, scenario entry points and
clear consultation actions. Its logo, navy/gold treatment, statistics, customers,
locations and testimonials are not copied. 易AI / Easy AI retains its own identity.

No stock customer photos, invented customer stories, equipment images, partner
logos, certifications or third-party tracking are used.
The logo concept used the supplied CCG image-generation skill on 2026-09-18;
`BRAND.md` records the prompt, task and local production cleanup. It is a brand
illustration, not evidence of real facilities or third-party endorsement.
Raster outputs use bundled font files; SVG wordmarks use outlined paths.
The supplied image-generation skill is not required at runtime and no credentials
are bundled with the site.
