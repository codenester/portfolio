# Rithea Sreng · Portfolio

Source for my personal portfolio site: a fully prerendered static site built with SvelteKit and
deployed on Railway.

Live: https://rithea-sreng.up.railway.app

## Stack

- SvelteKit 2.63, Svelte 5 (runes), Vite 8, TypeScript
- `@sveltejs/adapter-static`: every route is prerendered to HTML at build time, so the site ships as
  plain files with no server rendering
- No CSS framework. The two theme palettes and the three corner styles are CSS custom properties
  switched by `data-theme` and `data-shape` on `<html>`

## Layout

    src/lib/content/site.ts   all copy and data, as plain English strings
    src/lib/components/       page sections and chrome (hero, about, work, experience, ...)
    src/lib/theme.ts          theme read / apply / next
    src/app.css               font faces, design tokens, both palettes, layout
    static/fonts/             the two webfonts, self hosted
    server.js                 zero-dependency static file server for build/
    .railway/railway.ts       Railway Infrastructure as Code (start command, healthcheck)
    build/                    written by npm run build, not in version control

## Local development

    npm install
    npm run dev      # dev server on 127.0.0.1:5173
    npm run check    # svelte-check
    npm run check:icons  # the icon/mark guard: needs Pillow and numpy, finds its own python
    npm run build    # prerender the site into build/
    npm start        # serve build/ on $PORT (default 3000)

## Deployment

Railway builds this repo with Railpack, which installs devDependencies and runs `npm run build`, then
starts the result with `npm start`. The service configuration lives in `.railway/railway.ts` and sets
the start command plus a healthcheck on `/healthz`. Pushes to `main` deploy automatically.

`server.js` exists because the site needs no application server, only files served well. Two details
are deliberate: content-hashed files under `/_app/immutable` are cached for a year while HTML is
always revalidated, and non-GET/HEAD methods are rejected.

## Notes

- The site is English only, by choice.
- Fonts are self hosted: `static/fonts/manrope.woff2` and
  `static/fonts/space-grotesk.woff2` are the variable latin subsets of Manrope and
  Space Grotesk, declared with `@font-face` at the top of `src/app.css`. Refresh them
  with `node scripts/fetch-fonts.mjs` when a family or weight is added.
- Icons are [Remix Icon](https://remixicon.com) v4.9.1 (Apache-2.0), inlined at build
  time by `node scripts/build-icons.mjs` into `src/lib/components/Icon.svelte`.
- The site icon is the R mark, one transparent PNG per palette:
  `static/icon/icon-dark.png` (magenta) and `static/icon/icon-light.png` (violet).
  They are generated from the art in `assets/marks/` by
  `scripts/make-mark-icons.py`, which strips the black background, and checked by
  `scripts/check-icons.py`. `src/app.html` picks the file for the stored theme before
  the first paint, and `src/lib/theme.ts` swaps it on the in-page toggle.
- The R of the name in the hero is that same mark at 384px
  (`static/icon/mark-dark.png`, `mark-light.png`), so a 3x screen has real pixels for
  it. Both files sit in the hero heading and `[data-theme]` shows one, so the right
  colour paints immediately; both are `loading="lazy"`, which keeps the hidden one
  from downloading at all. `npm run check:icons` guards all of this.
- Both are local by construction: no CDN, no icon font, so the page makes no third
  party runtime request at all.
- Copy follows two rules: every claim is traceable to my CV, and prose avoids dashes as punctuation.
