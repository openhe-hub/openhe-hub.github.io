# web-app

The Astro site for the blog. Content lives outside this app, in `../assets/` —
see `../assets/README.md` for the writing workflow.

## Commands

| Command           | Action                                    |
| ----------------- | ----------------------------------------- |
| `npm run dev`     | Dev server at `localhost:4321`            |
| `npm run build`   | Production build to `./dist/`             |
| `npm run preview` | Preview the production build locally      |

## How it's wired

- `src/content.config.ts` — loads every `assets/**/*.md` as a post; category
  (`cv` / `robotics` / `blogs`) and subtopic come from the file path.
- `public/assets` — symlink to `../assets`, so videos/PDFs next to a markdown
  file are served verbatim at `/assets/...` (dereferenced into `dist/` at build).
- `src/plugins/remark-reading-time.mjs` — reading-time estimate (CJK-aware).
- Math: remark-math + rehype-katex. Code: Shiki (`min-light` / `min-dark`).
- Site metadata (name, links): `src/lib/site.ts`. Design tokens:
  `src/styles/global.css`.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml` (push to `main`). For a user
site (`<username>.github.io` repo) keep `base: '/'` in `astro.config.mjs`; for
a project repo set `base: '/<repo>'`.
