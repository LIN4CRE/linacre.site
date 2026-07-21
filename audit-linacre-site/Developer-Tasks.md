# DEVELOPER TASKS & ISSUES LIST (GITHUB FORMAT)
## Target: https://linacre.site (David Linacre)

---

### Task 001: Standalone Games Hub Implementation & Routing Integration
- **Owner**: Full-Stack Engineer / UI Designer
- **Priority**: Critical
- **Estimated Effort**: S (1 day)
- **Status**: Completed (v6.2)
- **Description**:
  Implement a dedicated, standalone Games Hub at `/games/index.html` and integrate it into the React SPA router (`src/App.tsx`), `Header.tsx`, `Footer.tsx`, `CommandPalette.tsx`, and `vercel.json` rewrites. Ensure only real games (KushCloud and Snake) are featured.
- **Acceptance Criteria**:
  1. Visiting `https://www.linacre.site/games` renders the Games Hub directly.
  2. The Snake game opens in a canvas modal and saves high scores locally in `localStorage`.
  3. Clicking "KushCloud" launches `https://lin4cre.github.io/KushCloud/` in a new tab.
  4. Header navigation, footer links, and command palette (`/`) point directly to `/games`.

---

### Task 002: Streamline Developer Toolkit Loadout
- **Owner**: Product Engineer / Copywriter
- **Priority**: High
- **Estimated Effort**: S (0.5 days)
- **Status**: Completed (v6.2)
- **Description**:
  Replace the lengthy 50+ third-party tool directory on `/toolkit` with a curated loadout of ~12 essential tools David actually relies on (VS Code, Git, GitHub, React, Vite, Tailwind CSS, Python, Kotlin, Dexie, Vercel, Cloudflare, GitHub Pages).
- **Acceptance Criteria**:
  1. Filter chips (`all loadout`, `start`, `build`, `deploy`, `★ my stack`) update filtered cards dynamically.
  2. Bookmarking tools persists across sessions in `localStorage`.
  3. Zero third-party bloat remains.

---

### Task 003: Verify 100% Real CV Data Across All Surfaces
- **Owner**: Content Lead / Developer
- **Priority**: High
- **Estimated Effort**: S (0.5 days)
- **Status**: Completed (v6.2)
- **Description**:
  Audit and update all personal biographical data across `About.tsx`, `gamepage.html`, `data.ts`, and core meta attributes to ensure 100% real information.
- **Acceptance Criteria**:
  1. Name: David Linacre
  2. Role: Self Taught Developer
  3. Location: Barnsley, South Yorkshire, UK (`davidlinacre@hotmail.co.uk` | `07391 428996`)
  4. Employment: Tudor Rose Nurseries (2020–2024), Cubley Hall (2020), Five A Day (2013–2020), Fresh Today (2008–2013)
  5. Education: Darton High School (2002–2007)

---

### Task 004: Server Route & Edge Proxy Fallback Validation
- **Owner**: DevOps / Systems Engineer
- **Priority**: Critical
- **Estimated Effort**: S (0.5 days)
- **Status**: Completed (v6.2)
- **Description**:
  Ensure all 23 prerendered paths (including `/games`, `/work`, `/now`, `/cookie-policy`, `/terms`) are registered in `api/server.ts` VALID_ROUTES set and `vercel.json` rewrites.
- **Acceptance Criteria**:
  1. Direct hard-refresh on `https://www.linacre.site/games` returns 200 OK without falling back to a 404 response.
  2. `npm run build` generates 23 static prerendered HTML routes.
