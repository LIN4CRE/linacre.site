# CLAUDE.md — project rules for the AI agent

## What this is
`linacre.site` — David Linacre's personal developer portfolio, toolkit directory, and AI playground. It contains:
- **Public Sandbox & Portfolio:** A terminal-styled landing page, a searchable developer toolkit, an AI playground (the Lab), and a learning path.
- **Private Console:** A session-persisted developer dashboard showing MCP server guides, env blueprints, and local credentials.

---

## Stack & Architecture

### 1. Technology Stack
- **Frontend:** React 19, TypeScript, Vite 6, TailwindCSS 4, Motion (formerly Framer Motion).
- **Backend Proxy:** Express server (`api/server.ts`) proxying LLM endpoints (Gemini, OpenAI, Claude, Ollama, LiteLLM) to secure API keys and handle streaming.
- **Hosting:** Vercel (monitored via `vercel.json`).

### 2. Key Directories & Files
- [App.tsx](file:///v:/LIN4CRE/linacre-site-repo/src/App.tsx): Router, scroll-to-top handler, and lazy-loading wrapping.
- [src/components/](file:///v:/LIN4CRE/linacre-site-repo/src/components/): Sub-pages (`Lab.tsx`, `Toolkit.tsx`, `Dashboard.tsx`, `DevPlayground.tsx`, `Learn.tsx`, `CommandPalette.tsx`).
- [api/server.ts](file:///v:/LIN4CRE/linacre-site-repo/api/server.ts): Express server proxying chat streams with a multi-provider fallback cascade.

---

## Build & Dev Commands

- **Run Dev Server (Express + Vite):**
  ```powershell
  npm run dev
  ```
- **Run Production Build:**
  ```powershell
  npm run build
  ```
- **Run TypeScript Compiler Verification:**
  ```powershell
  npm run lint
  ```

---

## Development Constraints

### 1. Bundle Optimizations
Heavy sub-pages (`Lab`, `IdentityHub`, `DevPlayground`, `Dashboard`) MUST be lazy-loaded using `React.lazy()` and rendered within a `<Suspense>` wrapper in `App.tsx` to keep the main bundle chunk size below Vite's 500kB warning threshold.

### 2. Tab Navigation & Viewport State
Every tab change must reset the global viewport scroll state to `(0, 0)` immediately via scroll hooks to avoid layout rendering anomalies in the single-page application.

### 3. API Error Resilience & Fallbacks
All backend chat endpoints must run a fallback cascade on error: **Gemini ➔ OpenAI ➔ Claude ➔ Local Mock Response**. Streaming connections must use lazy header flushing to allow early API initialization errors to trigger fallbacks before headers are sent to the client.

### 4. Client Disconnection Sync
Always monitor socket connection termination using the response close event `res.on('close')` rather than the request object event, to prevent premature stream termination on request body consumption.

### 5. Security & Escaping
- Never commit real secrets. Use the gitignored `.env` file for key values.
- All HTML rendering from user-controlled patterns (e.g. Regex highlights, markdown parsed links) must be sanitised/escaped to prevent Cross-Site Scripting (XSS).
- The dashboard bypass session is saved locally via `localStorage` (key: `linacre_dashboard_auth`).

---

## Before Opening a PR
1. Run `npm run lint` and verify there are no compilation errors.
2. Run `npm run build` and ensure the bundle builds successfully.
3. Test that the `/api/keys/status` and `/api/chat/stream` endpoints function correctly.
