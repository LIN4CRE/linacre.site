# CLAUDE.md — project rules for the AI agent

## What this is
`linacre.site` — David Linacre's personal site: a terminal-styled intro plus a
searchable directory of free developer tools. Built in public.

## Stack & constraints
- **Zero frameworks.** Plain HTML, CSS, and vanilla JS in a single `index.html`.
- Do **not** add React, build steps, or dependencies without asking first.
- Hosted on **Vercel** (auto-deploys from `main`; every PR gets a preview URL).

## Conventions
- Accessibility is non-negotiable: keep it **WCAG AA**, keyboard-navigable, and
  respect `prefers-reduced-motion`.
- Keep Lighthouse ≥ 90 performance / ≥ 95 a11y, best-practices, SEO.
- All external links: `target="_blank" rel="noopener"`.
- Keep copy short and in sentence case. No emoji in card titles.

## Before opening a PR
- Verify no broken links (`*.html`).
- Confirm the toolkit filter (search + category chips) still works.
- Keep the diff minimal and explain what changed in the PR description.

## Handy
- Primary contact: david@linacre.site
- Repo owner: @LIN4CRE
