# CLAUDE.md — project rules for the AI agent

## What this is
`linacre.site` — David Linacre's personal site and playground. Two halves:
- **Public:** terminal-styled intro, searchable toolkit of free dev tools, AI
  Lab (`index.html`), and a learning path (`learn.html`). Built in public.
- **Private:** a Clerk-gated personal dashboard (`dashboard.html` +
  `login.html`) — David's own toolbox he can reach from anywhere.

## Pages
| File             | Purpose                                    | In sitemap? |
| ---------------- | ------------------------------------------ | ----------- |
| `index.html`     | Home: hero, toolkit, projects, Lab, changelog | yes      |
| `learn.html`     | Roadmap + learning resources               | yes         |
| `dashboard.html` | Private toolbox (Clerk-gated)              | no (robots-disallowed) |
| `login.html`     | Clerk sign-in                              | no (robots-disallowed) |
| `404.html`       | Custom 404                                 | no          |

## Stack & constraints
- **Zero frameworks, zero build steps.** Plain HTML, CSS, and vanilla JS.
  Each page is self-contained (inline CSS + JS).
- **One approved external dependency:** ClerkJS from CDN, on `login.html` and
  `dashboard.html` only. Do **not** add other dependencies, frameworks, or
  build steps without asking first.
- Hosted on **Vercel** (auto-deploys from `main`; every PR gets a preview URL).
- Security headers + CSP live in `vercel.json`. If you add an external
  script/image/frame source anywhere, you MUST add it to the CSP or it will
  be silently blocked in production.

## Security rules (non-negotiable)
- **Never commit real secrets.** The Clerk *publishable* key (`pk_...`) is
  public and fine; API keys, secret keys, and tokens are not. `.env` is
  gitignored — keep it that way.
- **The dashboard is a static file behind a client-side gate.** Clerk hides
  the UI, not the file — anyone can read `dashboard.html`'s source. Templates
  and placeholders only. Anything genuinely secret needs a real backend
  (ask David before adding one).
- The Lab's markdown link renderer must keep its `https?:` whitelist.

## Conventions
- Accessibility is non-negotiable: **WCAG AA**, keyboard-navigable, respect
  `prefers-reduced-motion`.
- Keep Lighthouse ≥ 90 performance / ≥ 95 a11y, best-practices, SEO.
- All external links: `target="_blank" rel="noopener"`.
- Keep copy short and in sentence case. No emoji in card titles.
- Nav order everywhere: Toolkit · Learn · Lab · Dashboard · GitHub. Keep it
  consistent across all pages when you touch any nav.
- `.road` / `.step` CSS in `index.html` is shared by the changelog — don't
  remove it even though the roadmap section is gone.

## When you add or remove a page
- Update nav on **all** pages, `sitemap.xml` (public pages only), and
  `robots.txt` (disallow private pages).
- Decide whether it belongs in `sw.js` precache (public + static only) and
  bump the `CACHE` version in `sw.js`.

## Before opening a PR
- Verify no broken links (`*.html`).
- Confirm the toolkit filter (search + category chips + ★ my stack) still works.
- Load every page once — check nav, console errors, and that the Lab still
  reaches Ollama/LiteLLM endpoints (CSP regressions are silent).
- Keep the diff minimal and explain what changed in the PR description.

## Handy
- Live: https://linacre.site (deploy = push to `main`)
- Primary contact: david@linacre.site · repo owner: @LIN4CRE
- Clerk publishable key placeholder: `login.html` + `dashboard.html`
  (`data-clerk-publishable-key`) — David fills this from the Clerk dashboard.
- Full audit history: `CODE-REVIEW.md`.
