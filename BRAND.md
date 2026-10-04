# 易AI / Easy AI Brand Assets

## Direction

The Chinese brand is **易AI** and the approved English name is **Easy AI**, with
a space and uppercase AI. The positioning remains: **让 AI 易懂、易用、易落地。**

The selected symbol is **the refined direction A EAI whale**, developed from
the previously selected direction 08. Its rounded E suggests a whale head,
the shared A retains an open counter, and the two I shapes form a rising tail.
Keep its horizontal proportions and open silhouette,
without an enclosing frame. Both lockups retain the complete name: `易AI` in
Chinese and `Easy AI` in English. The symbol is not a replacement for the Chinese
character. This is the selected implementation for the local preview,
not a trademark clearance or registration claim.

White and graphite provide the main surfaces; cobalt blue identifies the brand,
actions and selected states. Pale blue supports the hero and highlighting.
Small sage and neutral gray service accents distinguish the business categories.
The rejected open-e, folded-gateway and framed concepts are not part of this
release. Previous symbols and their exports are archived outside the site in
`../yi-ai-template-archive/`. The `previous-eai-08-*.tar.gz` archive contains the
previous master, exports and regeneration scripts for rollback.

## Files

- `assets/logo/mark.svg`: editable symbol master.
- `assets/logo/mark-small.svg`: eye-free optical master for 16px and 24px.
- `assets/logo/generated/easyai-shortlist-08-refined.jpg`: earlier direction 08 reference.
- `public/brand/logo-zh.svg`: Chinese primary lockup.
- `public/brand/logo-en.svg`: English primary lockup.
- `logo-zh-mono.svg` / `logo-en-mono.svg`: graphite monochrome.
- `logo-zh-inverse.svg` / `logo-en-inverse.svg`: light wordmark for dark backgrounds.
- `logo-symbol.svg`: symbol without wording.
- `logo-symbol-small.svg`: optical symbol for widths up to 24px.
- `logo-symbol-mono.svg` / `logo-symbol-inverse.svg`: single-color symbols.
- Matching PNGs: transparent raster versions, 256px high.
- `public/brand/favicon.svg`: eye-free small website icon.
- `test-results/easyai-logo-board.png`: presentation of the identity and variants.

Wordmarks use outlines, not live SVG text; they do not depend on installed fonts.
Their 72-unit viewBox includes room below the English y descender. The mark is
fitted into a 100-by-64 viewport to retain the approved symbol-to-word proportion.
Keep the original aspect ratio and allow at least half the symbol's width as clear
space around a lockup. Use the symbol alone at small sizes; do not squeeze the full
name into a favicon. Do not stretch, add shadows, or place the blue mark on a
low-contrast background.

## Color and Typography

| Use                | Value          |
| ------------------ | -------------- |
| Cobalt             | `#245BDB`      |
| Graphite           | `#20242C`      |
| Pale blue          | `#E6EFFF`      |
| Latin typography   | Manrope        |
| Chinese typography | Noto Sans SC   |
| Codes and labels   | JetBrains Mono |

Typography is self-hosted, with variable weights and `font-display: swap`.
Headings use 600 weight, the main promise uses 500, and body copy uses 400.
Main paragraphs use 17px desktop / 16px mobile with generous line height.
Sizes change at fixed breakpoints; letter spacing remains zero.
Chinese text is subset to the site's copy; new characters fall back to local
system fonts until the subset is regenerated. Font licenses are in `public/fonts/`.
The font license applies to the fonts; it is not a trademark assurance for the name.

## Regenerate

Normal `pnpm build` uses the already generated assets and does not require Python.
To intentionally regenerate font subsets and vector outlines, download these
reviewed source files from Google Fonts commit
`1edf95b4328bc5997ca93d2c0c7205272ec7347f`:

- `ofl/manrope/Manrope[wght].ttf`, saved as `Manrope.ttf`.
- `ofl/notosanssc/NotoSansSC[wght].ttf`, saved as `NotoSansSC.ttf`.
- `ofl/jetbrainsmono/JetBrainsMono[wght].ttf`, saved as `JetBrainsMono.ttf`
  (subset to basic Latin for codes, numbers and labels).

Keep source files in a separate font-source directory, not in `public/`.
Use Python 3.9+ with `fonttools[woff]==4.60.2`, `brotli==1.2.0` and
`zopfli==0.2.3.post1`:

```sh
python scripts/prepare-brand.py --font-source /path/to/font-source
pnpm build
BROWSER_EXECUTABLE=/path/to/browser pnpm assets:brand
pnpm build
pnpm test
```

The asset command reads the built route manifest and produces the hero bitmap,
26 sharing images, transparent PNGs
and the logo presentation using a local Chromium-based browser. These commands
make no paid image API calls. Review the image exports and responsive screenshots
before replacing a release.
Pass `--skip-fonts` to `prepare-brand.py` when only changing the logo.
The font subset includes local Markdown articles as well as Astro and TypeScript.

## Motion

The header lockup is static. The hero shows the isometric three-layer illustration,
not the logo; its copy and illustration enter once, and the illustration's light
beam runs a finite two cycles, then stops. Never animate individual paths or distort
the silhouette. Reduced-motion preferences remove entrance and page transitions.
Do not add continuous floating, spinning, parallax or other looping brand motion.

## Image Generation and Cleanup

The owner approved applying the refined whale A on 2026-09-19. Its source is
`../brand-explorations/whale-eai/a-refined.svg`. The curves were refined offline;
this replacement does not submit image jobs or require a credential.

The earlier direction 08 1024px shortlist image
was generated with `gpt-image-2.5-sunburst`, medium quality, using the
owner-authorized `ccg-ai-image` skill. Its prompt is
`assets/logo/shortlist-08-prompt.txt`; the source and receipt are under
`assets/logo/generated/`. Applying the selection makes no new image API call.

The earlier raster concept was normalized to one blue and traced for reference.
The selected whale master now contains four clean paths, with the small eye cut
into the head. `mark.svg` and `mark-small.svg` are the production sources;
the raw trace is not the final mark. `trace-logo.py` preserves reference output
without overwriting the cleaned master; use
`--source assets/logo/generated/easyai-shortlist-08-refined.jpg --prefix easyai-eai`
to inspect the earlier direction. Do not overwrite the whale master with a trace.
Optional tracing uses Pillow 11.3.0 and
vtracer 0.6.15; neither is required for normal builds.

`generate-logo.py` is an explicit paid design utility, not a dependency of any
build or test. It requires a separately installed, reviewed skill and an
environment-only credential. Existing receipts prevent accidental resubmission;
`--job` resumes the same task. Generation charges depend on the service account;
no exact cost or exclusivity claim is made. No key is distributed.
