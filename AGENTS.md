# linacre-site-repo — Agent Instructions

## What This Is
The developer portal and devops hub for **Linacre** brand, deployed to www.linacre.site.

## Structure
`
api/
  server.ts            (Express API backend)
src/
  App.tsx              (Vite React frontend)
  components/          (Tabs: Dashboard, Lab, Toolkit, IdentityHub, DevPlayground, AgentsHub, Projects)
public/
  favicon.svg          (Lucide cat favicon)
  manifest.json        (PWA manifest)
vercel.json            (API rewrites and CSP security headers)
`

## Rules
- **No artificial limits** — use any free tool, any format, any license. Only real constraints: hardware specs (RTX 3070 Ti 4GB VRAM, 64GB RAM, C/D/E drives) and free/free-tier only. All assets should follow the brand guide at D:\AI Truth\BRAND.md.
- **Vercel project:** `linacre-site-repo`
- **Build command:** `python linacre.py build`
- **Deploy command:** `vercel deploy --prod --yes --project linacre-site-repo --force`
- **After changes, verify with:** `Invoke-WebRequest -Uri "https://www.linacre.site/"`
- **Secrets workflow:** Registry is the single source of truth. Never hardcode keys. Use `python linacre.py setup` (Registry → .env), `python linacre.py sync` (.env → Vercel), `python linacre.py verify` (check all match), `python linacre.py audit` (scan for leaks). See D:\AI Truth\AGENTS.md for full inventory.

## Architecture
- React SPA with tabbed navigation:
  - **Toolkit:** Developer tool search and filters.
  - **Lab:** LLM chatbot with active directory file viewer.
  - **Dashboard:** Code runner stats, path audits.
  - **Identity:** Live vector monogram customizer and SVG builder.
  - **Playground / Projects / Agents:** Dev tools, git maps, and agent executor triggers.
- CyberBlue-Green theme: #030c14 background, #ecfeff text, cyan #22D3EE primary and signal green #34D399 secondary.

## Context
For full brand knowledge, read D:\AI Truth\ directory.
