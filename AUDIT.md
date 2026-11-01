# Linacre.site — UX & technical audit

Updated: 2026-11-01

Auditor: Arena.ai agent

Scope: working tree on `arena/94e21f5b-linacre-site`; code, tests, local preview and production build. The live production site was **not** re-inspected during this pass.

## Executive snapshot

A substantial responsive refresh is implemented in this branch. It modernizes the site shell and navigation, adds a CSS-built 3D studio object, improves the project catalogue and mobile audio controls, and splits secondary routes and project details into lazy-loaded chunks. Existing navigation/catalogue behavior is covered by component tests.

The release is **not deployed**. This sandbox has no Vercel CLI or Vercel environment credentials. The deployment workflow runs on `main` and requires three Vercel repository secrets; the GitHub connection returned HTTP 403 when asked to list Actions secrets, so their presence could not be verified. Production publication remains blocked on an authorized deploy path.

| Area                | Current result                                                                                                                                                                                                                          |
| ------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Main navigation     | Responsive primary navigation, grouped native `More` disclosure, Escape dismissal, outside-click dismissal, and mobile menu. The Games item always renders its Gamepad icon.                                                            |
| Homepage            | New studio hero, project search and catalogue, featured work, and a decorative CSS 3D monolith.                                                                                                                                         |
| Responsive behavior | Dedicated layout rules cover wide desktop, tablet/mobile at 899px, compact mobile at 680px, and very narrow screens at 380px. CSS was reviewed and component interactions tested; visual overlap is not browser-confirmed.              |
| Accessibility       | Skip link, semantic navigation, accessible labels/status, keyboard shortcuts, Escape handling, focus visibility, reduced-motion behavior, and a usable mobile volume control are present.                                               |
| Performance         | Secondary routes and the project-detail dialog are lazy-loaded; featured-card entrance animation uses CSS. The largest initial entry chunk is 274.87 kB (85.75 kB gzip), down from 522.77 kB before splitting; no 500 kB chunk warning. |
| Catalogue           | 24 curated projects and 77 verified instant-play games.                                                                                                                                                                                 |
| Dependencies        | `npm audit --audit-level=moderate`: 0 vulnerabilities.                                                                                                                                                                                  |
| Production build    | Successful; 15 routes prerendered and sitemap contains 14 URLs.                                                                                                                                                                         |
| Test/build quality  | 158 tests pass; TypeScript passes; lint exits 0 with 168 warnings.                                                                                                                                                                      |
| Live status         | Not checked in this pass; the prior live-site observations below are a historical snapshot from 2026-08-21.                                                                                                                             |

## Changes made in this refresh

- Replaced the older, denser header with a sticky studio header, clearer route grouping, a three-column desktop `More` panel, and a compact responsive mobile navigation.
- Kept the Gamepad icon unconditional in the Games navigation item.
- Reworked the home page into a studio introduction with direct actions, shared project search, catalogue totals, featured work, and grouped/filterable project cards.
- Added the `HeroMonolith` CSS 3D object: six layered faces, orbit details, no external 3D asset or WebGL requirement, hidden from assistive technology, and static under reduced-motion settings.
- Added/lifted 3D interaction on project cards and improved responsive catalogue controls.
- Added a mobile-accessible ambient-volume slider, reduced visualizer update frequency, and stopped the ambient canvas loop while the document is hidden.
- Added lazy route loading and deferred the project-detail modal until a project is selected; replaced the featured-card Motion entrance with CSS animation.
- Corrected root-absolute public manifest/icon URLs and synchronized PWA/runtime theme colors.
- Updated stale “300+ games” labels to the verified count of 77, and refreshed the generated Games hub with a featured-game ribbon.
- Refreshed vulnerable dependency resolutions and added `minimatch`/`qs` overrides; a clean install audit reported zero vulnerabilities.

## Verification

Commands run successfully on the current changes:

- `npm run typecheck`
- `npm test` — 17 files, 158 tests passed. The test run still prints a jsdom “Not implemented: navigation to another Document” message, but exits successfully.
- `npm run lint` — exit 0, 168 warnings, 0 errors.
- `npm audit --audit-level=moderate` — 0 vulnerabilities.
- `npm run build` — 77 games refreshed, 15 routes prerendered, sitemap with 14 URLs; largest initial entry chunk 274.87 kB / 85.75 kB gzip.
- Local preview smoke check — `/`, `/games`, `/manifest.json`, `/favicon.svg`, `/icon-192.png`, `/about`, and `/tools` returned HTTP 200.

## Remaining audit items / release blockers

1. **Browser visual QA:** No browser executable was available in the sandbox. Responsive behavior was checked in CSS and jsdom component tests, but real viewport screenshots, keyboard focus traversal, console checks, and the no-overlap requirement still need browser verification—especially around the `More` panel at 900–1200px and the mobile audio popover.
2. **Lint backlog:** Lint passes but reports 168 warnings, primarily existing `any` types and React Hooks warnings in older components/utilities. These were not expanded into a repository-wide cleanup in this UX refresh.
3. **Live-site drift:** Production was not inspected during this pass. The observations from 2026-08-21 below should not be treated as current production facts.
4. **Production deployment:** `.github/workflows/deploy.yml` deploys on pushes to `main` or manual dispatch, but only when `VERCEL_TOKEN`, `VERCEL_ORG_ID`, and `VERCEL_PROJECT_ID` are configured. Those secrets were not readable from the current GitHub connection (HTTP 403), and no local Vercel credentials/CLI were present. The current branch has not been deployed.

## Historical live-site audit snapshot — 2026-08-21

The following notes are retained from the previous audit and were **not revalidated** on 2026-11-01.

- The previous audit reported the live deployment as stale relative to `main`, citing `/tools` returning 404, an outdated “Low Stakes Guide” card, the Games hub not being visible, and a project-showcase upgrade not being live.
- It recorded 70 external project/repository URLs returning HTTP 200, a 23-URL sitemap, complete SEO head metadata, machine-readable files, a custom 404 page, roughly 610 KB of JS/CSS, and green CI at that time.
- It identified the Vercel deploy workflow as gated on the three secrets listed above and recommended enabling them to support automatic production deployment.
- Actions recorded at that time included adding PixelPoke Arena metadata and banner artwork, adding `.github/workflows/deploy.yml`, updating `AGENTS.md`, and reporting green CI.
- Earlier optional hardening notes identified oversized components (`Lab.tsx`, `DevPlayground.tsx`, `AgentsHub.tsx`, `IdentityHub.tsx`) and a Vite warning about `audioEngine.ts` being both statically and dynamically imported. These are not release blockers for the current refresh.
