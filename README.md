<p align="center"><img src="https://raw.githubusercontent.com/LIN4CRE/linacre.site/main/.github/banner.png" alt="linacre.site banner" width="100%"></p>

# linacre.site

David Linacre's personal developer portfolio and toolkit directory, deployed at [linacresite.vercel.app](https://linacresite.vercel.app) (canonical domain: linacre.site).

It's a single-page React app with a tabbed interface covering several self-contained mini-apps:

- **Toolkit** — a searchable, filterable directory of free developer tools, with a command palette (`Cmd+K` / `/`) and localStorage-backed bookmarking, plus a releases/changelog timeline.
- **Learn** — a curated, step-by-step learning roadmap and list of free learning resources for self-taught engineers.
- **Lab** — a live AI chat playground with a mock file-tree workspace viewer, backed by an Express API route that proxies chat requests to Gemini (via `@google/genai`) with an OpenAI fallback.
- **Dashboard** — a password-gated panel with a Chart.js radar chart, MCP server directory, and reusable "skill template" snippets.
- **Identity** — a live brand/monogram customizer: pick colors, fonts, frame shapes, and animation styles for an SVG emblem and export the result.
- **Playground** — an interactive C code playground/step-through tool.
- **Projects** — a filterable, editable showcase of personal projects, with local CRUD via localStorage.
- **Agents** — a lighthearted animated "agent hub" simulating background dev/devops/security/librarian agents with status logs.

The app is a PWA (manifest + service worker), supports light/dark themes, and shows an offline banner when connectivity drops.

## Tech stack

- **Frontend:** React 19 + TypeScript, Vite 6, Tailwind CSS 4 (`@tailwindcss/vite`)
- **UI/animation:** `motion` (Framer Motion successor), `lucide-react` icons, `chart.js` / `react-chartjs-2`
- **Backend:** Express server (`api/server.ts`), bundled with `esbuild`; proxies AI chat requests to Google Gemini (`@google/genai`) with an OpenAI HTTP fallback; runs Vite in middleware mode during development and serves the static build in production
- **Tooling:** `linacre.py` — a Python CLI for local dev orchestration and personal secrets management (not required to just build/run the site)
- **Deployment:** [Vercel](https://vercel.com) (see `vercel.json` for build command, API rewrites, and CSP/security headers)

## Running locally

```bash
npm install
npm run dev       # Vite middleware + Express API on http://localhost:3000
npm run lint      # type-check
npm run build     # production build (Vite client + esbuild server)
npm run start     # run the production build locally
npm run preview   # preview the built client only (no API)
```

`npm run dev` is wired through `python linacre.py dev`, which will install deps and attempt to sync a local `.env` on first run. You can skip the Python wrapper and just run `npm install && npx tsx api/server.ts`.

The AI chat feature in Lab requires a `GEMINI_API_KEY` (and optionally `OPENAI_API_KEY` as fallback) in a local `.env` — without one, that feature simply won't respond while the rest of the site works normally.

## Deployment

Deployed to Vercel. `vercel.json` configures the build command (`npm run build`), rewrites `/api/*` to the bundled Express server, and sets CSP/security headers.
