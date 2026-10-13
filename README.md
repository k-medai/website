# Medical AI Lab (PNU MAIL) website

Source of https://www.k-medai.com, the website of the Medical AI Lab, Department of Biomedical Convergence Engineering, Pusan National University. Built with [Astro](https://astro.build) and deployed to GitHub Pages.

## Development

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # writes dist/
npm run preview
```

Requires Node 22 or later.

## Editing content

All content lives in `src/data/`. Edit, commit and push to `main`; the site redeploys automatically.

| Content | File | Notes |
| --- | --- | --- |
| Site text (tagline, about, recruiting, contact, partners, menu) | `src/data/site.ts` | `stats.partners` is the only hand-set number |
| Members | `src/data/people.json` | Photos in `public/img/people/<slug>.jpg` (4:5); initials are shown if missing |
| Publications and patents | `src/data/publications.json` | `featured: true` shows the item on the home page (newest 4); give those entries `authors` and a short `venue` (e.g. `MICCAI 2026`) |
| Research areas and projects | `src/data/research.json` | `whatWeDo` = home cards, `projects` = Research page |
| Awards | `src/data/awards.json` | Newest first |
| Grants | `src/data/grants.json` | |
| Seminars | `src/data/seminars.json` | See below |
| Conferences | `src/data/conferences.json` | Photos in `public/img/conferences/<slug>/` are picked up automatically (first file = lead photo); `papers` links to publication ids; `cover` (e.g. `50% 40%`) picks the visible part of a portrait lead photo |
| Physical lab | `src/data/lablife.json` | `photos`: paths under `public/img/lablife/` |
| Courses | `src/data/courses.json` | |
| Logo and icons | `public/img/logo.png`, `public/favicon.ico`, `public/img/icon-*.png`, `public/apple-touch-icon.png` | Regenerate icons with `node scripts/icons.mjs` |

Student e-mail addresses are intentionally not published.

### Publication entry

```json
{
  "id": "p1",
  "year": "2026",
  "type": "International (Journal)",
  "title": "Paper title",
  "meta": "Author A, Author B, Sunyoung Kwon*, Venue, Month 2026",
  "award": "Best Paper Award",
  "links": [{ "label": "link", "href": "https://..." }],
  "lang": "en",
  "featured": false
}
```

`type` is one of `International (Journal)`, `International (Conference)`, `Domestic (Journal)`, `Domestic (Conference)`, `Patent`. `year` is a string; use `"~2019"` for older items. Every entry can be linked as `/publications/#<id>`.

### Photos

Put originals in `assets/people/<slug>.jpg`, `assets/conferences/<slug>/` or `assets/lablife/<slug>/` (`assets/` is git-ignored) and run:

```bash
npm run photos    # people: face-centred 4:5 crop; others: 1600px, written to public/img/
```

Image sizes are read at build time, so nothing else is needed.

### Seminars

Add an entry, then run `npm run slides` (thumbnails) and `npm run slides:pages` (page images for the in-site viewer; needs `pdftoppm`):

```json
{ "date": "2026.10.02", "title": "Talk title", "presenter": "Name",
  "slides": { "drive": "<Google Drive file ID>", "name": "file.pdf", "ext": "pdf" } }
```

Drive files must be shared as "anyone with the link". A PDF kept in the repo works too: `"slides": { "file": "/files/seminars/<file>.pdf", "ext": "pdf" }`.

## 3D scenes

- **Hero**: `src/components/DockingHero.astro` animates protein–ligand complexes from `src/data/complexes/*.json` (PDB 1IEP, 3ERT, 2ITY, 2EUF, 5DS3). To add one, download the PDB file, convert it, and list it in `COMPLEXES` (optionally `VARIANTS`):

  ```bash
  curl -L -o 1M17.pdb https://files.rcsb.org/download/1M17.pdb
  npm run pdb -- 1M17.pdb A AQ4 src/data/complexes/1m17.json   # <pdb> <chain> <ligand residue> <output>
  ```

- **What We Do cards**: `src/components/AreaScene.astro` (metastasis, molecule graph, ECG). The `SPEED` constant scales all three. Molecules are PubChem 3D coordinates in `src/data/molecules/*.json`.
- Static posters (`public/img/hero-poster.jpg`, `public/img/scene-*.jpg`, `og.jpg`) are shown without WebGL and while loading. Append `?still=1` to a URL to freeze the scenes for capturing.

## Fonts and colours

English text uses Times (system Times New Roman, Tinos fallback) and Korean text Noto Sans KR, both self-hosted in `public/fonts/`. Rebuild the Korean subset with `npm run fonts` (source TTF in `assets/fonts/`). Colour tokens are in `src/styles/global.css`.

## Pages

`/` · `/people/` · `/research/` · `/publications/` · `/course/` · `/activity/` (awards, conferences, grants, seminars, physical lab) · `/contact/` · `/join/`. Old Google Sites URLs are redirected in `astro.config.mjs`. The home page scrolls one screen at a time (script at the bottom of `src/pages/index.astro`).

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml` (Node 22, `npm ci && npm run build`) and publishes `dist/` to GitHub Pages. The custom domain `www.k-medai.com` is set in the Pages settings, `public/CNAME` and `astro.config.mjs`.

DNS (Squarespace): `www` is a CNAME to `k-medai.github.io`; the apex `k-medai.com` redirects to `www`. Leave the MX records and the `service` A record untouched.
