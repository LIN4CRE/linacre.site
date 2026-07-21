# GitHub-Ready Developer Task Backlog

### Task 1: PWA Service Worker Cache Audit
- **Title:** Precache newly added routes in `public/sw.js`
- **Description:** Ensure `/book`, `/identity`, `/playground`, `/agents`, and `/tools/apk-hub.html` are cached in service worker `linacre-v13`.
- **Acceptance Criteria:** Service worker caches all 24 routes without throwing 404s when offline.
- **Priority:** High
- **Effort:** S
- **Owner:** Engineering

### Task 2: High-Contrast ARIA Focus Outlines
- **Title:** Verify focus visible ring across theme toggles
- **Description:** Ensure focus rings use high contrast `focus:ring-2 focus:ring-cyan` on interactive buttons.
- **Acceptance Criteria:** Keyboard tabbing highlights focused items clearly in both dark and light mode.
- **Priority:** Medium
- **Effort:** S
- **Owner:** Design / Engineering

### Task 3: Automated Repo Health Monitoring
- **Title:** Add repository health audit function to `linacre.py`
- **Description:** Implement `python linacre.py audit` to scan local repositories for missing `.gitignore` or uncommitted edits.
- **Acceptance Criteria:** Running audit lists status of all 29 projects in `D:\LIN4CRE`.
- **Priority:** Medium
- **Effort:** M
- **Owner:** DevOps
