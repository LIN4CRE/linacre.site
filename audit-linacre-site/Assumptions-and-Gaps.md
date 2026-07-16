# ⚠️ Assumptions & Verification Gaps

> **Principle:** Every finding in this audit is derived from publicly available information. Where verification was impossible from public surface alone, it's documented here.

---

## Auto-Resolved Inputs

| Original Input | Resolution Applied | Confidence | Recommendation |
|---------------|-------------------|------------|----------------|
| Market / niche | Auto-assumed "general web / brand site" | **Corrected** — This is a **personal brand / freelance engineering portfolio** | Accept corrected classification |
| Product type | Auto-detected as "Website / Web App" | ✅ Confirmed — React SPA + Express backend on Vercel | Accept |
| Product/brand name | Provided as "Linacre" | ✅ Confirmed — Site is for David Linacre, operating as "Linacre" | Accept |
| Audit depth | "Forensic / exhaustive" | Applied | — |

---

## Verification Gaps (Unable to Verify)

### Accessibility

| Claim | Source | Verification Status |
|-------|--------|---------------------|
| "Proper HTML landmarks" | Accessibility statement | ❌ Unable to verify from text-only fetch |
| "Keyboard skip-to-content link" | Accessibility statement | ❌ Unable to verify without browser interaction |
| "Explicit focus outline states" | Accessibility statement | ❌ Unable to verify from text-only fetch |
| "Visual contrast ratios continuously verified" | Accessibility statement | ❌ Unable to verify actual contrast values |
| Screen reader support for AI Agents/Labs | Accessibility statement (admits limitations) | ⚠️ Partially confirmed by site's own admission |
| Axe DevTools testing | Accessibility statement | ❌ Unable to verify tool usage |

### Performance

| Metric | Status |
|--------|--------|
| Lighthouse scores | ❌ Unable to verify — no CrUX data; would require Lighthouse run |
| Core Web Vitals (LCP, FID/INP, CLS) | ❌ Unable to verify — domain below CrUX reporting threshold |
| Actual Time to Interactive | ❌ Unable to verify from server-side fetch |
| First Contentful Paint | ❌ Unable to verify — requires browser rendering |

### Mobile Experience

| Aspect | Status |
|--------|--------|
| Mobile layout and responsive breakpoints | ❌ Unable to verify from text-only fetch |
| Touch target sizes | ❌ Requires visual inspection |
| Mobile navigation menu behavior | ❌ Requires interaction |
| PWA install experience | ❌ Requires browser with PWA support |

### Visual Design

| Aspect | Status |
|--------|--------|
| Actual color contrast ratios | ❌ Unable to verify — requires screenshots and measurement |
| Typography rendering | ❌ Requires visual inspection |
| Animation smoothness | ❌ Requires browser rendering |
| Light mode appearance | ❌ Unable to verify — all content fetched in dark mode context |
| Glassmorphism header appearance | ❌ Changelog describes it but cannot verify visually |

### Technical

| Aspect | Status |
|--------|--------|
| Express server route security | ❌ Server-side — not publicly inspectable |
| API rate limiting implementation | ❌ Server-side |
| Contact form server-side validation | ❌ Server-side |
| Database schema (if any) | ❌ Private |
| Service worker caching strategy details | ⚠️ sw.js exists (2,727 bytes) but content not analyzed |

### Business

| Aspect | Status |
|--------|--------|
| "17+ production systems" claim | ⚠️ Partially verifiable — 19 projects listed, most are real but 14 are private |
| "Replies within 12 hours" claim | ❌ Unable to verify |
| Actual client count/revenue | ❌ Private business information |
| Google ranking positions | ❌ Would require rank tracking tool |

---

## Assumptions Made

1. **Tailwind CSS purging is configured** — Assumed based on changelog v3.5 mentioning "styled using Tailwind CSS v4." The 109 KB CSS suggests purge might not be fully effective.

2. **Fonts are self-hosted** — Preload tags reference `/fonts/inter-var-latin.woff2` (local paths), suggesting self-hosting rather than Google Fonts CDN. This is a performance best practice.

3. **Service worker handles caching correctly** — The v3.0 changelog mentions "service worker now picks up fresh deploys." Assumed current implementation is functional.

4. **Contact form submissions work** — Assumed the form endpoint is functional. Unable to verify server-side.

5. **AI Lab server-side proxy is secure** — Privacy policy describes server-side Gemini API proxy. Assumed secure implementation.

6. **All external links use `rel="noopener noreferrer"`** — Best practice assumed but not verified from text fetch.

7. **The site's primary audience is technical** — Inferred from content style, toolkit, and AI Lab. Non-technical visitors may have a different experience.

---

## Recommendations to Close Gaps

1. **Run a Lighthouse audit** (Chrome DevTools → Lighthouse → Desktop + Mobile) and record scores
2. **Test with screen reader** (NVDA on Windows or VoiceOver on Mac) through key journeys
3. **Test keyboard-only navigation** — Tab through all interactive elements
4. **Check mobile experience** on real devices (iPhone SE, Pixel 7, iPad)
5. **Verify all claims** — Ensure "17+ systems," "12-hour reply," and similar claims are currently accurate
6. **Check light mode** — Toggle light mode and verify all pages render correctly
7. **Validate structured data** with Google Rich Results Test and Schema.org validator

---

## Technical Audit Resolution Notes

### style-src CSP 'unsafe-inline' Evaluation (TASK-013)
* **Status**: Retained `'unsafe-inline'` intentionally.
* **Rationale**: The Identity Hub and live brand customizers utilize dynamically rendered SVG graphics containing local `<style>` blocks for inline CSS keyframe animations (such as `@keyframes characterMorph` and `@keyframes spinLogo`). Because keyframes cannot be defined in inline `style=""` attributes and require a `<style>` tag, removing `'unsafe-inline'` would break SVG dynamic animations. Nonces cannot be statically generated for client-side custom SVG inputs without complex server reflection.
