<p align="center">
  <img src="https://raw.githubusercontent.com/LIN4CRE/linacre.site/main/.github/banner.png" alt="linacre.site banner" width="100%">
</p>

<p align="center">
  <a href="https://www.linacre.site/"><img src="https://img.shields.io/badge/live-linacre.site-22D3EE?style=for-the-badge&logo=vercel&logoColor=white"></a>
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white">
  <img src="https://img.shields.io/badge/Gemini_3.6_Flash-8E75FF?style=for-the-badge&logo=google&logoColor=white">
  <img src="https://img.shields.io/badge/license-MIT-34D399?style=for-the-badge">
</p>

---

# 🏛️ linacre.site — Enterprise Developer Portal & Autonomous AI Ecosystem

**linacre.site** is an offline-first developer portal, multi-model AI orchestration lab, and personal software engine engineered by **David Linacre**. Built with React 19, TypeScript, Vite 6, and Express 4, deployed globally across Vercel Edge with zero-downtime static prerendering across all 24 routes.

---

## ⚡ System Architecture

```mermaid
flowchart TD
    subgraph Client ["Client Browser (PWA Shell)"]
        ReactSPA["React 19 SPA Container"]
        SWCache["Service Worker Cache (sw.js)"]
        StateStore["LocalStorage & IndexedDB State"]
    end

    subgraph Edge ["Vercel Edge & Content Delivery"]
        EdgeCDN["Vercel Global CDN"]
        CSP["Content Security Policy Engine"]
        StaticPre["Prerender Snapshot Engine (24 Routes)"]
    end

    subgraph Backend ["Serverless API Backend (api/server.ts)"]
        ExpressApp["Express API Engine"]
        AuthMiddleware["SHA-256 Timing-Safe Auth Guard"]
        RateLimiter["IP Sliding Window Rate Limiter"]
    end

    subgraph LLM ["AI Engine Integration"]
        Gemini["Google Gemini 3.6 Flash API"]
        OpenAI["OpenAI GPT-4o Fallback"]
        Claude["Anthropic Claude 3.5 Sonnet"]
        LocalOllama["Local Docker Ollama Instance"]
    end

    ReactSPA --> EdgeCDN
    EdgeCDN --> StaticPre
    ReactSPA --> ExpressApp
    ExpressApp --> AuthMiddleware
    ExpressApp --> RateLimiter
    ExpressApp --> Gemini
    ExpressApp --> OpenAI
    ExpressApp --> Claude
    ExpressApp --> LocalOllama
```

---

## 🌟 Key Application Hubs

- ⚡ **AI Lab (`/lab`):** Unified multi-provider model sandbox with active streaming proxies for Gemini 3.6 Flash, OpenAI, Claude, and local Docker Ollama nodes. Features pre-tuned Quick-Start Engineering Templates (*Code Audit*, *PostgreSQL Schema Designer*, *Regex Builder*, *OpenAPI 3.0 Spec Generator*).
- ✨ **Identity Studio (`/identity`):** Real-time AI prompt emblem generator powered by Gemini 3.6 Flash with dynamic brand palette matching and SVG/PNG vector exports.
- 🧰 **Developer Playground (`/playground`):** Client-side engineering utilities including JSON-to-TypeScript Generator with JSDoc headers, 5-field Cron Expression Explainer & Schedule Builder, JWT Inspector, RegEx Evaluator, and WebAssembly compiler testbed.
- 🤖 **Agents Hub (`/agents`):** Autonomous agent workflow visualizer, step execution simulator, and one-click JSON blueprint exporter for AI agent playbooks.
- 📅 **Discovery Scheduling (`/book`):** Dedicated client route for 15-minute discovery calls and 45-minute architectural review appointments.
- 📊 **Telemetry Dashboard (`/dashboard`):** Real-time service mesh monitoring with accessible text data tables, radar stats, and KeePassXC secret key state verification.

---

## 🔒 Security & Governance

- **Zero Hardcoded Secrets:** Centralized secrets pipeline managed via `linacre.py` CLI and environment variables (`.env`).
- **Timing-Safe Authentication:** Session authentication uses HMAC-SHA256 signatures with constant-time equality comparisons (`crypto.timingSafeEqual`) to mitigate side-channel timing attacks.
- **Strict CSP Headers:** Hardened Content-Security-Policy rules in `vercel.json` enforcing strict script, style, frame, and font origin restrictions.
- **Bounded Rate Limiting:** Sliding-window IP rate limiters on all public API endpoints to prevent brute-force attacks and resource exhaustion.

---

## 🛠️ Local Development & Build Pipeline

### Prerequisites
- Node.js >= 20.x
- npm >= 10.x
- Python 3.11+ (optional for orchestration via `linacre.py`)

### Development Commands
```bash
# Install dependencies
npm install

# Launch development environment (Vite middleware + Express API on port 3000)
npm run dev

# Run TypeScript typechecks & linter
npm run lint

# Build production bundle & prerender static HTML snapshots (24 routes)
npm run build

# Preview production build locally
npm run start
```

### Deployment Command
```powershell
# Automated build and production deployment via Python CLI
python linacre.py build
vercel deploy --prod --yes --project linacre-site-repo --force
```

---

## 👨‍💻 About the Author

**David Linacre**  
*Principal Infrastructure Engineer, DevOps Architect, and Software Systems Developer*

- 🌐 **Live Portal:** [www.linacre.site](https://www.linacre.site)
- 🐙 **GitHub Org:** [@LIN4CRE](https://github.com/LIN4CRE)
- 👤 **GitHub Personal:** [@DLinacre](https://github.com/DLinacre)
- ☕ **Sponsor Craft:** [paypal.me/DLinacre16](https://paypal.me/DLinacre16)

---

## 📄 License
This repository is licensed under the [MIT License](LICENSE).
