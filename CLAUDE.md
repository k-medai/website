# Working in this repository

This is the website of the Medical AI Lab (PNU MAIL), https://www.k-medai.com. It is an Astro static site; every push to `main` is built by GitHub Actions and published to GitHub Pages within about a minute. README.md says where each kind of content lives.

## Rules

- Content only. Edit the data files under `src/data/` and photos under `public/img/`. Do not change layout, styles, fonts, the logo, the 3D scenes, `astro.config.mjs` or `.github/workflows/` unless explicitly asked.
- Keep existing text exactly as it is. Add or change only what you are asked to; never rewrite, translate or "improve" titles, author lists or wording.
- Enter data exactly as given. If something needed for an entry is missing (author order, month, venue, year), ask instead of guessing.
- Never publish personal e-mail addresses or phone numbers of students. Only the contact in `src/data/site.ts` is public.
- Before committing, run `npm run build` (run `npm install` first if `node_modules` is missing). The build must finish without errors; a broken JSON file fails the build and the site keeps its previous version.
- Commit messages: one short English line, e.g. `Add KSC 2026 papers` or `Update Dasom Noh photo`. No trailers, no `Co-Authored-By` lines, no mention of Claude or AI.
- Push to `main` only. Do not create branches, pull requests or tags, and never force-push. Do not touch the GitHub Pages settings or DNS.

## Publications (`src/data/publications.json`)

- Copy the format of the neighbouring entries (see "Publication entry" in README.md).
- Use the next unused id (`p<N>`). Ids are permanent because `/publications/#<id>` links point to them; never renumber or reuse them.
- Order inside a year: International (Journal), International (Conference), Domestic (Journal), Domestic (Conference), Patent; newest first within each group.
- `meta` = authors (corresponding author marked `*`), venue, Month Year. Use English names for international venues and Korean names for domestic ones. `lang` is `"en"` for an English title and `"ko"` for a Korean title.
- Set `featured: true` only when asked. Featured entries also need `authors` and a short `venue` (e.g. `MICCAI 2026`).

## Other content

- People: `src/data/people.json`. Put the original photo in `assets/people/<slug>.jpg` and run `npm run photos`; it writes the 4:5 crop to `public/img/people/`. `assets/` is git-ignored, so commit the generated file under `public/img/`.
- Conference photos: `assets/conferences/<slug>/` then `npm run photos`. The first file by name becomes the lead photo. Add the conference to `src/data/conferences.json` with the publication ids under `papers`.
- Awards, grants, seminars, courses, research areas and physical lab: the JSON files listed in README.md. Seminar slides need `npm run slides` and `npm run slides:pages`.

## Checklist for every change

1. Edit the data file(s) and any generated images.
2. `npm run build` passes.
3. `git add` the changed files, commit with a short English message, `git push origin main`.
4. Tell the user which page to check (e.g. https://www.k-medai.com/publications/) and that it goes live in about a minute.
