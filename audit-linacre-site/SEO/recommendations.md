# SEO Audit & Technical Recommendations

## 1. Title & Meta Descriptions
- All 24 SPA routes generate distinct static HTML snapshots via `scripts/prerender.mjs` and `route-meta.json`.
- Page titles follow the high-converting format: `[Page Name] — [Value Proposition] | Linacre`.

## 2. Structured Data (JSON-LD)
- Active `WebSite`, `Person`, and `SoftwareApplication` schema blocks embedded in pre-rendered static pages.

## 3. Canonical Tags & Hreflang
- Canonical URLs point to `https://linacre.site/`.
- Hreflang tags configured for `en-GB` and `x-default`.
