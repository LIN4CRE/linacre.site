# PHASED ACTION PLAN & ROADMAP
## Target: https://linacre.site (David Linacre)

---

## 🚀 1. IMMEDIATE (COMPLETED IN V6.2)

1. **Standalone Games Hub (`public/games/index.html` & `src/components/Games.tsx`)**:
   - Replaced multi-section scrolling resume wall with a focused Games Hub.
   - Featured real builds: **KushCloud** (live GitHub Pages flyer) and **Snake** (in-page interactive Canvas 2D game).
   - Documented `GAMES` JSON structure for quick updates when returning to Windows PC.
2. **Streamlined Toolkit (`src/components/Toolkit.tsx` & `src/data.ts`)**:
   - Replaced bloated 50+ link directory with **David's Curated Developer Loadout** (~12 daily tools).
3. **Real CV Data Enforcement**:
   - Updated background history across `About.tsx`, `gamepage.html`, and `data.ts` to reflect Barnsley, UK location, Tudor Rose Nurseries (2020–2024), Cubley Hall (2020), Five A Day (2013–2020), Fresh Today (2008–2013), and Darton High School (2002–2007).
4. **Server & Route Rewrites Alignment**:
   - Added `/games` to `vercel.json` rewrites, `api/server.ts` VALID_ROUTES, `sw.js` precache URLs, `route-meta.json`, and `scripts/prerender.mjs`.

---

## 📅 2. SHORT TERM (1–2 WEEKS)

1. **Local Font Hosting for Standalone Pages**:
   - Self-host Google Fonts locally under `/fonts/` inside `gamepage.html` to guarantee 100% network-independent rendering during offline viewing.
2. **Automated Link Checker Integration**:
   - Add a CI check step using `lychee` or `broken-link-checker` in GitHub Actions to verify all external project source links automatically on git push.

---

## 🛠️ 3. MEDIUM TERM (1–3 MONTHS)

1. **Expanded Engineering Case Studies**:
   - Write short technical articles on building local-first browser databases with Dexie, optimizing Canvas 2D requestAnimationFrame loops for mobile touch devices, and Web Audio API synthesis.
2. **Performance Monitoring Workflow**:
   - Connect automated Lighthouse CI score assertions (Performance ≥ 95, Accessibility = 100) to pull requests.

---

## 🌐 4. LONG TERM (STRATEGIC)

1. **Custom Web Audio Game Engines**:
   - Expand the built-in browser arcade with a 2D puzzle/canvas game utilizing WebGL and procedural sound effects.
2. **Offline-First PWA Push Updates**:
   - Add background sync and install prompt custom UI for visitors wanting to use the developer tools offline on desktop and mobile.
