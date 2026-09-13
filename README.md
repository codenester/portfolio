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
- Both are local by construction: no CDN, no icon font, so the page makes no third
  party runtime request at all.
- Copy follows two rules: every claim is traceable to my CV, and prose avoids dashes as punctuation.
