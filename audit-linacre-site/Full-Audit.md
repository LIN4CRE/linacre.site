# 🔍 Full Forensic Audit — Linacre.site

> **Audit depth:** Forensic / Exhaustive  
> **Date:** 2026-07-16  
> **Methodology:** Public surface analysis — page content, HTTP headers, HTML source, sitemap, robots.txt, structured data  

---

## 1. Executive Summary

**Score: 76/100**

See [Executive-Summary.md](Executive-Summary.md) for complete details.

---

## 2. Brand Review

**Score: 80/100**

### 2.1 Identity & Logo

- **Observation:** The site uses a dynamic, interactive brand system rather than a static logo. The Identity Hub at `/identity` allows customization of the "DL" monogram across 5 color themes, 4 font vibes, 10 frame structures (5 base tech + 5 personal DL monograms), and 3 motion modes.
- **Evidence:** Brand updated as "Amber Aura colour, Pipeline Nexus frame, Space Tech font" on the Identity page. The emblem is described as fusing "DevOps pipeline elements, conic-gradient orb systems, and clean terminal brackets."
- **Strengths:** The interactive brand builder is genuinely innovative. Few personal sites offer a live brand customizer with downloadable SVG/PNG/JPG assets, HTML email signatures, GitHub shields, and React components.
- **Weakness:** Because the brand is dynamic/customizable, there is no single canonical logo. The "official" brand configuration (Amber Aura + Pipeline Nexus + Space Tech) is implied but not prominently locked in.

### 2.2 Typography

- **Observation:** Three-font system: Inter (body), Space Grotesk (headings/display), JetBrains Mono (code/terminal).
- **Evidence:** Font preloads in HTML: `inter-var-latin.woff2`, `space-grotesk-var-latin.woff2`, `jetbrains-mono-var-latin.woff2`.
- **Assessment:** Excellent, modern type pairing. Variable fonts reduce total font payload. Space Grotesk conveys technical sophistication; Inter ensures readability; JetBrains Mono reinforces the developer/terminal theme.
- **Recommendation:** Consider adding `font-display: swap` to the @font-face declarations to prevent flash of invisible text (FOIT). (Priority: Medium)

### 2.3 Colour System

- **Observation:** Ink Black backgrounds (`#0b0e14` theme-color), Amber Core/Glow accent system with brand gradients and glow shadows. Described in the v4.5 changelog as: "Ink Black backgrounds, Amber Core/Glow accent system, brand gradients and glow shadows."
- **Evidence:** `theme-color` meta tag set to `#0b0e14`. Changelog v4.5 describes the system.
- **Assessment:** The dark-first aesthetic is distinctive and appropriate for a developer portfolio. The amber-on-black terminal palette creates strong brand recognition. CSS custom properties (HSL-based) enable dynamic theming.
- **Issue:** Light mode exists (via `color-scheme: dark light` meta tag) but the amber-on-ink visual identity may not translate well to light backgrounds. Unable to verify light mode appearance from text-only fetch.

### 2.4 Visual Consistency

- **Observation:** The v4.5 changelog describes a unified system: "glassmorphism header with breathing logo, amber pulse-line dividers, upgraded card surfaces across Toolkit/Learn/Terminal."
- **Assessment:** Consistent design language appears to span all surfaces. The terminal/developer aesthetic is maintained across pages from Home to Blog to Lab.

### 2.5 Trustworthiness

- **Strengths:**
  - Transparent pricing on `/work` (audits from £1,800, builds from £6,500, retainer £2,400/mo)
  - UK GDPR compliance clearly stated
  - "NDA-friendly" prominently displayed
  - "Replies within 12 hours" trust signal
  - "Shipped 17+ production systems" social proof
  - Verifiable GitHub profile with public repos
  - Detailed privacy policy, terms, cookie policy, and accessibility statement
  - No tracking cookies (privacy-respecting)
- **Weakness:** No client testimonials or case studies with named clients. The "Proof of Work" section uses code repositories rather than client endorsements — honest but less persuasive to non-technical buyers.

### 2.6 Brand Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| BR-01 | No canonical locked brand configuration | Identity page shows Amber Aura as "current" but the builder invites changes | Inconsistent brand presentation to returning visitors | Add a "Default Brand" reset button; display the official brand prominently outside the customizer | Medium |
| BR-02 | Missing brand guidelines page | No dedicated brand page in sitemap | Clients/partners can't reference brand assets | Create `/brand` page with official logo downloads, colour codes, typography specs | Low |

---

## 3. User Experience

**Score: 72/100**

### 3.1 Navigation & IA

- **Observation:** The site has 16 sitemap-listed URLs spanning multiple functional areas. Based on page content, the primary navigation appears to cover: Home, Projects, Toolkit, Learn, Blog, Lab, Agents, Playground, Identity, Work, Contact, About.
- **Evidence:** Sitemap lists: `/`, `/projects`, `/about`, `/toolkit`, `/learn`, `/blog` (+ 3 posts), `/playground`, `/contact`, `/privacy`, `/accessibility`, `/agents`, `/lab`, `/identity`, `/work`, `/cookie-policy`, `/terms`.
- **Assessment:** The information architecture is function-oriented (toolkit, lab, playground, agents, identity) rather than audience-oriented. A first-time visitor may struggle to understand the difference between "Lab," "Agents," and "Playground."

### 3.2 User Journey Analysis

#### Journey 1: Potential Freelance Client

```
Home → Work → Contact
```

- **Strengths:** Clean funnel. Homepage has clear pricing and CTA ("Start a project →"). Work page has detailed service descriptions, FAQs, and contact CTAs.
- **Weakness:** No intermediate "nurture" step — no case studies, no portfolio deep-dive, no email course. The jump from pricing to contact is abrupt.

#### Journey 2: Fellow Developer / Learner

```
Home → Toolkit / Learn / Blog
```

- **Strengths:** The Learn page's 6-step roadmap is genuinely useful. Toolkit is comprehensive (42 tools). Blog has 3 deep technical posts.
- **Weakness:** Only 3 blog posts. No way to subscribe for more content. The Learn roadmap has no progress persistence for unauthenticated users.

#### Journey 3: Brand Explorer

```
Home → Identity → Customize → Download Assets
```

- **Strengths:** The Identity Hub is feature-rich with colour, font, frame, motion, and metadata customization plus downloadable SVGs and email signatures.
- **Weakness:** Complex interface may overwhelm casual visitors. No "simple mode" vs "advanced mode."

### 3.3 Mobile vs Desktop

- **Unable to verify from text-only fetches.** The site uses responsive design (viewport meta tag, Tailwind CSS). PWA manifest with standalone display mode suggests mobile-first consideration. The changelog mentions "responsive grid and mobile navigation layouts" since v1.0.

### 3.4 CTAs

- **Observation:** Multiple CTAs across pages:
  - Home: "Start a project →", "See case studies", "Browse free toolkit →"
  - Work: "Book an Audit", "Start Project", "Discuss Retainer", "Send me the kit →"
  - Contact: "Send message →", "Email to book a 15-min call"
  - Projects: "Start a conversation →"
- **Assessment:** CTAs are clear and action-oriented. However, "See case studies" on the homepage may mislead — there are no dedicated case study pages, only project cards and blog posts.

### 3.5 UX Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| UX-01 | "See case studies" CTA links to `/projects` not dedicated case studies | Homepage button text | Mismatched expectation — users expect narrative case studies, get a project grid | Either rename CTA to "View projects" or create actual case study pages | High |
| UX-02 | No visual differentiation between Lab, Agents, Playground, and Toolkit | Page titles and descriptions overlap | Cognitive overload — users unsure which tool to use for what | Add one-line descriptors under each nav item; consider merging Playground into Toolkit | Medium |
| UX-03 | Learn page progress tracker (0/6) doesn't persist | "Progress Log 0 / 6 Completed (0%)" on /learn | Returning learners lose progress | Persist in localStorage with consent; or simply remove the broken progress indicator | Medium |
| UX-04 | No search across site content | No search interface observed | Users must browse to find specific tools or content | Add command palette (already exists per v3.5 changelog — verify it searchs content, not just navigation) | Medium |
| UX-05 | Contact form honeypot field visible in DOM | "Leave this field blank" text visible in fetched content | Could be hidden with CSS but visible without; minor UX friction | Ensure honeypot is `aria-hidden="true"` and visually hidden via CSS (not just placeholder text) | Low |
| UX-06 | Homepage toolkit search embedded on homepage — `/toolkit` in sitemap but appears to redirect | Fetching /toolkit returned homepage content | Confusing URL structure; SEO dilution | Decide: either make /toolkit a standalone page or remove from sitemap and canonicalize to homepage section | Medium |

---

## 4. User Interface

**Score: 78/100**

### 4.1 Visual Hierarchy

- **Observation (from content structure):** Pages follow a consistent pattern: page title → description → main content → CTA → footer with consent banner. Headings appear to use proper hierarchy (H1 → H2 → H3).
- **Evidence:** Content extraction shows clear heading structure on all pages. Blog posts use H2 for sections, H3 for subsections.
- **Assessment:** Good structural hierarchy. Unable to verify visual weight/spacing from text-only content.

### 4.2 Component Consistency

- **Observation:** From the changelog, v4.5 introduced unified card surfaces, glassmorphism header, amber pulse-line dividers, and breathing logo animation. These suggest a design system with reusable components.
- **Evidence:** Changelog v4.5: "upgraded card surfaces across Toolkit/Learn/Terminal, glassmorphism header with breathing logo, amber pulse-line dividers."
- **Assessment:** Consistent component language across surfaces.

### 4.3 Modern Design Practices

- **Strengths:**
  - Glassmorphism header (described in changelog)
  - Conic-gradient orb systems (described on Identity page)
  - CSS custom properties for dynamic theming
  - Dark/light mode support
  - Terminal/CLI aesthetic as differentiating design choice
- **Weakness:** The terminal aesthetic, while distinctive, may alienate non-technical visitors. The "hackable" developer vibe could reduce perceived professionalism for enterprise buyers.

### 4.4 UI Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| UI-01 | Shared `og.png` for all pages | All pages reference same og:image URL | Social shares look identical regardless of content | Create per-page or per-category OG images; or implement dynamic OG image generation | High |
| UI-02 | No visual breadcrumbs on interior pages | Content analysis shows no breadcrumb markup visible | Users lose orientation on deep pages | Add visual breadcrumb component (matching existing BreadcrumbList schema) | Medium |
| UI-03 | Identity Hub complexity | 5 colour themes × 4 fonts × 10 frames × 3 motion modes × metadata fields | 600+ possible combinations — overwhelming UI | Add preset thumbnails row; group advanced options behind a toggle | Low |
| UI-04 | Light mode brand translation | theme-color is `#0b0e14` (dark); amber-on-ink may not work in light mode | Poor light mode experience if not tested | Test and refine light mode palette; ensure sufficient contrast in both modes | Medium |
| UI-05 | Homepage has both terminal simulator AND toolkit grid | Content shows `$whoami` terminal + full toolkit grid | Two competing interaction models on one page | Consider separating: terminal as hero accent, toolkit as primary interactive element | Low |

---

## 5. Content / Copy

**Score: 68/100**

### 5.1 Clarity & Tone

- **Assessment:** The copy blends technical precision with approachable language. The terminal/CLI motif carries through to copy style (`bio_query.sh`, `article_viewer.sh`, `cat about_me.md`). This is charming for developers but may confuse non-technical visitors.
- **Strengths:** Pricing is transparent, CTAs are clear, policies are thorough and readable.
- **Weakness:** Inconsistent voice — some pages are deeply technical (blog posts with Go code), others are marketing-focused (Work page with service descriptions). The About page is notably sparse for a personal brand.

### 5.2 Trust Signals

- **Present:** UK GDPR compliance, NDA-friendly, reply within 12h, 17+ production systems, public GitHub, transparent pricing, detailed legal pages.
- **Missing:** Client testimonials, named client logos, case study narratives, industry recognition/awards, conference talks, certifications.

### 5.3 Content Gaps

| Gap | Current State | Recommendation | Priority |
|-----|--------------|----------------|-----------|
| Blog content | 3 posts (Jun–Jul 2026) | Expand to 8–10 posts; establish biweekly cadence | High |
| Case studies | None — "See case studies" links to project grid | Create 2–3 narrative case studies (GhostMail, DomainDeals, linacre.site itself) | High |
| Testimonials | None publicly visible | Request 2–3 quotes from past clients; display on Work page | High |
| About page depth | 1 photo, 1 paragraph, skills matrix, 4 milestones | Expand with career story, philosophy, approach to work | Medium |
| Blog post images | No per-post social images | Create individual OG images for each post | High |
| RSS / Atom feed | Not present | Add RSS feed for blog | Medium |
| Newsletter | Only Go kit email capture on Work page | Add general newsletter signup on Blog page | Medium |
| `/now` page | Not present | Add a `/now` page (per Derek Sivers movement) for personal connection | Low |

### 5.4 Content Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| CN-01 | About page too thin | `/about` has ~100 words of personal narrative | Doesn't build enough trust/connection for freelance hiring | Expand to 300–500 words: career story, philosophy, what it's like to work together | Medium |
| CN-02 | Blog lacks author bios | No author box observed on blog posts | Misses E-E-A-T signal for SEO | Add author bio snippet with photo to each post footer | Medium |
| CN-03 | "Shipped 17+ production systems" unverifiable | Homepage claim | Strong claim without backing — list or link to them | Add a systems counter or timeline that maps to visible projects | Low |
| CN-04 | Projects page has 14/19 projects marked "Private" | `/projects` content analysis | Portfolio looks thin when most projects are hidden | Either make more projects public or create summary cards that explain value without revealing IP | Medium |
| CN-05 | No content above the fold about who this is FOR | Homepage H1 is "Full-stack & AI systems engineer — available for freelance" | Self-descriptive but not audience-targeted | Add a subheading: "I help startups ship reliable React/Go/AI systems — fast." | Low |

---

## 6. SEO Audit

**Score: 79/100**

### 6.1 Title Tags

| Page | Title | Length | Assessment |
|------|-------|--------|------------|
| Home | David Linacre — Full-stack & AI engineer \| Available for freelance | 68 chars | ✅ Good — branded, descriptive, includes availability signal |
| Identity | Identity Hub \| Live brand and monogram builder \| David Linacre | 67 chars | ✅ Good — descriptive, branded |
| Blog | Engineering notes \| David Linacre | 32 chars | ⚠️ Short — could include "Technical articles on Go, React, DevOps" |
| Blog post | Go Concurrency Patterns \| David Linacre | 39 chars | ⚠️ Short — could include "High-Throughput Go Worker Pools & Rate Limiters" |
| About | About David Linacre \| Full-stack and AI engineer | 50 chars | ✅ Acceptable |
| Work | Work with David Linacre \| Services & Availability | 51 chars | ✅ Acceptable |
| Contact | Contact David Linacre \| Software and automation projects | 58 chars | ✅ Acceptable |
| Privacy | Privacy policy \| linacre.site | 28 chars | ✅ Appropriate for legal page |
| Terms | Terms of service \| linacre.site | 29 chars | ✅ Appropriate for legal page |
| Accessibility | Accessibility statement \| linacre.site | 37 chars | ✅ Appropriate |

### 6.2 Meta Descriptions

| Page | Description | Assessment |
|------|------------|------------|
| Home | "UK-based full-stack & AI systems engineer. React, TypeScript, Go, Python. Systems audits from £1,800, custom builds from £6,500. Available now." | ✅ Excellent — keyword-rich, includes pricing, CTA |
| Identity | "Customise the linacre.site brand system live: colours, frames, motion and typography with exportable SVG monograms." | ✅ Good |
| Blog | "Technical notes on Go concurrency, React theming, caching and developer tooling." | ✅ Good — descriptive |
| Blog post | "Deep dive into worker pools, rate limiters, and channel synchronization in Go." | ✅ Good |
| About | Unable to verify separately — may share homepage description | ⚠️ Check if /about has unique meta description |
| Projects | Unable to verify separately | ⚠️ Should be checked |

### 6.3 Heading Hierarchy

- **Observation:** All pages use a single H1. Blog posts use H2 for sections and H3 for subsections. The structure is semantically correct.
- **Evidence:** Content analysis shows consistent `# Title` (H1) → `## Section` (H2) → `### Subsection` (H3) patterns across all pages.
- **Assessment:** Proper heading hierarchy. No skipping of levels detected.

### 6.4 Canonical Tags

- **Observation:** Every checked page has a proper self-referencing canonical tag.
- **Evidence:** 
  - Home: `<link rel="canonical" href="https://www.linacre.site/">`
  - Identity: `<link rel="canonical" href="https://www.linacre.site/identity">`
  - Blog: `<link rel="canonical" href="https://www.linacre.site/blog">`
  - Blog post: `<link rel="canonical" href="https://www.linacre.site/blog/go-concurrency-patterns">`
- **Assessment:** ✅ Excellent — no canonicalization issues detected.

### 6.5 Robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /contact/thanks

User-agent: GPTBot
Allow: /

User-agent: CCBot
Disallow: /

Sitemap: https://www.linacre.site/sitemap.xml
```

- **Assessment:** ✅ Well-configured. Allows AI training crawlers (GPTBot) while blocking Common Crawl (CCBot). Disallows API routes and post-submission pages. Sitemap location declared.

### 6.6 Sitemap

- **Observation:** 19 URLs listed, all with proper `<lastmod>` dates (2026-07-16 for main pages, specific dates for blog posts).
- **Assessment:** ✅ Generally good. However:
  - Missing `<changefreq>` and `<priority>` tags (not critical but helpful)
  - Blog post `<lastmod>` dates are static (publication dates) — should update when content is revised
  - No image sitemap or news sitemap (not needed at this scale)

### 6.7 Schema / JSON-LD

- **Observation:** Comprehensive structured data implementation.
  - Homepage: Person, ProfessionalService, WebSite (with SearchAction), ItemList (projects), SoftwareSourceCode (×2), SoftwareApplication, WebPage (with SpeakableSpecification)
  - Identity: Above + BreadcrumbList
  - Blog: Above + BreadcrumbList
  - Blog posts: Same graph structure
- **Assessment:** ✅ Exceptional. The @graph approach with @id referencing creates connected entities. Few personal sites implement schema at this level.

### 6.8 URL Structure

- **Assessment:** ✅ Clean, descriptive, hierarchical URLs.
  - `/blog/` (listing)
  - `/blog/go-concurrency-patterns` (descriptive slug)
  - No query parameters, no `.html` extensions, no trailing slashes
  - Consistent lowercase with hyphens

### 6.9 Image SEO

- **Issue:** Blog posts lack unique images. The `og.png` is shared across all pages. No `alt` text could be verified for decorative/brand images.
- **Evidence:** All pages use `og:image` = `https://www.linacre.site/og.png`.
- **Impact:** Reduced social share engagement, missed image search traffic.
- **Recommendation:** Create per-post featured images (1200×630) for each blog post with the post title overlayed.

### 6.10 Internal Linking

- **Assessment:** Good internal linking structure. The homepage links to major sections. Blog posts likely interlink (unable to verify from text fetch). The sitemap provides comprehensive crawl paths.
- **Gap:** No related posts section observed on blog posts. No "next/previous" post navigation.

### 6.11 Crawlability & Indexability

- **Assessment:** ✅ All major pages are indexable (`meta robots: index, follow`). Robots.txt is permissive where appropriate. Sitemap is present and referenced. No accidental noindex tags detected.

### 6.12 Keyword Opportunities

Based on the site's content and positioning, these keyword clusters are relevant:

| Cluster | Current Coverage | Opportunity |
|---------|-----------------|-------------|
| "freelance React developer UK" | Homepage partially | Create dedicated landing page |
| "Go concurrency patterns" | 1 blog post ✅ | Expand to series |
| "full-stack engineer portfolio" | Homepage | Optimize About page |
| "systems audit service" | Work page | Create dedicated audit landing page |
| "AI engineer freelance" | Homepage partially | Create AI-specific service page |
| "developer toolkit" | Toolkit section | Optimize toolkit page for SEO |
| "Vercel edge caching" | 1 blog post ✅ | Expand CDN/DevOps content cluster |

### 6.13 SEO Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| SEO-01 | Undifferentiated OG images across all pages | All pages use same og.png | Reduces social share CTR; missed branding opportunity | Create per-post images (or dynamic generation via Vercel OG Image) | Critical |
| SEO-02 | Blog posts missing `article:published_time` and `article:author` OG tags | HTML analysis of blog posts | Social platforms can't display rich article cards | Add `og:article:published_time`, `og:article:author`, `article:published_time` | Critical |
| SEO-03 | Blog title tags too short (32–39 chars) | "Engineering notes \| David Linacre" (32 chars) | Underutilized SERP real estate (55–60 chars optimal) | Expand blog listing title; add keywords to post titles | High |
| SEO-04 | Thin blog content (3 posts) | /blog and sitemap | Insufficient topical authority for SEO | Publish 8–10 posts minimum; establish regular cadence | High |
| SEO-05 | No RSS/Atom feed | No feed link in HTML or sitemap | Missed distribution channel; some readers prefer RSS | Add RSS feed at /blog/rss.xml or /feed.xml | High |
| SEO-06 | Missing `article:tag` OG meta on blog posts | Blog post HTML | Reduced content discoverability on social platforms | Add og:article:tag for each post's tags | Medium |
| SEO-07 | Sitemap missing `<changefreq>` and `<priority>` | sitemap.xml content | Suboptimal crawl budget signaling (minor at this scale) | Add changefreq and priority elements | Low |
| SEO-08 | No image alt text verifiable for Identity page customizer graphics | Text-only content fetch can't verify alt text | Potential accessibility + image SEO gap | Ensure all SVGs and brand assets have descriptive alt text | Medium |
| SEO-09 | Blog posts lack related/recommended posts section | Blog post pages | Higher bounce rate; less page-per-session | Add "Related Posts" section at bottom of each article | Medium |
| SEO-10 | No hreflang tags | HTML analysis | Not critical for single-language site, but helpful | Add self-referencing hreflang if targeting UK specifically | Low |

---

## 7. Performance

**Score: 74/100**

### 7.1 Observed Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| Homepage HTML size | 13,392 bytes | ✅ Lean |
| Homepage TTFB (curl) | ~0.11s | ✅ Fast (Vercel edge) |
| JS bundle size | 312,885 bytes (~306 KB) | ⚠️ Large for a portfolio site |
| CSS bundle size | 109,079 bytes (~107 KB) | ⚠️ Large for Tailwind with purging |
| Total page weight (HTML+JS+CSS) | ~435 KB | ⚠️ Could be ~200 KB with optimization |
| Font strategy | 3 variable fonts, preloaded | ✅ Good |
| Caching for static assets | favicon.ico: `max-age=31536000, immutable` | ✅ Excellent |
| Caching for HTML | `max-age=0, must-revalidate` | ✅ Correct (HTML should not be cached long) |
| manifest.json caching | `max-age=86400` | ✅ Good |
| Compression | Vercel handles gzip/brotli automatically | ✅ Assumed; unable to verify exact algorithm |

### 7.2 Core Web Vitals Assessment

**Unable to verify actual CWV scores from public sources.** No CrUX data available for this domain (likely below reporting threshold). However, based on observed signals:

- **LCP (Largest Contentful Paint):** Likely good — small HTML payload, preloaded fonts, Vercel edge. JS bundle is render-blocking though.
- **FID/INP (Interaction to Next Paint):** Likely good — React with client-side interactivity. The Identity Hub with animation may impact INP.
- **CLS (Cumulative Layout Shift):** Likely good — font preloading with `crossorigin`, explicit image dimensions on OG images.

### 7.3 Optimization Opportunities

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| PF-01 | JS bundle too large (313 KB) | `index-aUXD3oFG.js` = 312,885 bytes | Slow initial load on mobile/3G; blocks rendering | Implement code splitting: lazy-load Identity Hub, Agents, Playground as separate chunks; main bundle target <150 KB | High |
| PF-02 | CSS bundle (109 KB) could be smaller | `index-Bt4hS2XN.css` = 109,079 bytes | Unnecessary CSS shipped to all pages | Verify Tailwind purge is working; remove unused utility classes; consider splitting per-page CSS | Medium |
| PF-03 | No resource hints for critical third parties | HTML source | Delayed connections to Google Fonts, GitHub avatars, Pokemon Showdown sprites | Add `<link rel="preconnect">` for fonts.gstatic.com, raw.githubusercontent.com, play.pokemonshowdown.com | Medium |
| PF-04 | No image optimization evidence | Unable to verify | profile_avatar.webp uses WebP ✅ but no srcset/responsive images detected | Use `<img srcset>` for responsive images; serve AVIF format for compatible browsers | Medium |
| PF-05 | No service worker caching strategy visible | sw.js exists but strategy unknown | Service worker could improve repeat-visit performance | Implement stale-while-revalidate for static assets, cache-first for fonts | Medium |
| PF-06 | Font preloads lack `as` attribute verification | Preload tags observed | Incorrect preload can cause double-fetch | Verify: `as="font" type="font/woff2" crossorigin` is present on all font preloads (confirmed present in HTML) | Low |
| PF-07 | No `<link rel="preload">` for critical above-fold image (og.png) | HTML analysis | LCP image may load late | Preload og.png or hero image with `fetchpriority="high"` | Low |

### 7.4 Quick Wins

1. ✅ Add `fetchpriority="high"` to hero/LCP image
2. ✅ Add preconnect for third-party origins
3. ✅ Verify Tailwind CSS purge configuration
4. ✅ Implement React.lazy() + Suspense for route-based code splitting

---

## 8. Accessibility

**Score: 70/100**

### 8.1 Accessibility Statement

- **Evidence:** Dedicated page at `/accessibility` — reviewed July 10, 2026.
- **Content:** States WCAG 2.2 AA as conformance objective. Mentions HTML landmarks, skip-to-content link, semantic headings, native controls, focus outlines, contrast verification. Tested with Axe DevTools and manual keyboard reviews.
- **Assessment:** The statement is honest and transparent — it explicitly says "it is not a claim of full conformance" and lists known limitations (experimental features in AI Agents/Labs may have limited screen-reader support).

### 8.2 Verified Accessibility Features

| Feature | Status | Evidence |
|---------|--------|----------|
| Semantic HTML | Likely present | Accessibility statement claims "proper HTML landmarks" and "semantic headings" |
| Skip-to-content link | Claimed | Accessibility statement mentions "keyboard skip-to-content link" |
| Focus outlines | Claimed | "explicit focus outline states" |
| Dark/light mode | Present | `color-scheme: dark light` meta tag |
| Form labels | Partially verified | Contact form has label elements ("Name *", "Work email *", etc.) |
| ARIA | Unknown | Unable to verify from text-only fetch |
| Keyboard navigation | Claimed | "keyboard skip-to-content link" implies keyboard support |
| Screen reader support | Partially claimed | Statement admits limitations in AI Agents/Labs |

### 8.3 Accessibility Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| AC-01 | Interactive customizers (Identity Hub, Agents, AI Lab) cannot be verified for accessibility | Text-only fetch cannot evaluate canvas/SVG interactivity | Core interactive features may be inaccessible to keyboard/screen-reader users | Conduct manual WCAG 2.2 AA audit focusing on: keyboard operability, ARIA labels on custom controls, focus management in modals/panels | Critical |
| AC-02 | Identity Hub colour customizer may have contrast issues across themes | 5 colour themes offered — some may fail contrast minimums | Users may create inaccessible brand configurations | Add real-time contrast checker in the customizer; flag combinations that fail WCAG AA (4.5:1 for text, 3:1 for large text) | High |
| AC-03 | Consent banner accessibility unknown | Banner has 3 buttons (Accept all, Essential only, Reject non-essential) | GDPR consent must be accessible | Verify: buttons are focusable, banner is not a keyboard trap, focus is managed when banner appears/dismisses | High |
| AC-04 | No visible accessibility widget or controls | Page content shows no font-size or contrast controls | Users who need adjustments can't easily make them | Not strictly required if site meets WCAG, but consider adding a small accessibility menu (especially for light/dark toggle visibility) | Low |
| AC-05 | Motion modes on Identity page include animations | "Pulsing D-Mode", "Spinning Orbit", speeds 1s–5s | Could trigger vestibular disorders (seizures, nausea) | Add `prefers-reduced-motion` media query support; disable animations when user prefers reduced motion | High |
| AC-06 | Playground tools (JWT Decoder, RegEx Matcher, etc.) accessibility unknown | Text content shows interactive tool interfaces | Developer tools must be accessible to developers with disabilities | Audit all playground tools for keyboard access, screen reader labels, and focus order | Medium |
| AC-07 | Pokemon Showdown sprite GIFs in Agents page lack descriptive alt text | `<img>` tags with alt like "Agent Architect" — needs verification | Screen readers may not convey the playful interface | Ensure all sprites have meaningful alt text (e.g., "Mewtwo sprite — Agent Architect unit") | Medium |

### 8.4 Accessibility Quick Wins

1. Add `prefers-reduced-motion` support for all animations (Identity Hub + Agents)
2. Audit consent banner for keyboard trap
3. Add real-time contrast warnings to Identity Hub colour picker
4. Verify all form inputs have associated `<label>` elements
5. Test AI Lab chat interface with screen reader

---

## 9. Security & Privacy

**Score: 90/100**

### 9.1 HTTPS

- **Status:** ✅ HTTPS enforced with HTTP/2. All pages served securely.
- **Evidence:** `strict-transport-security: max-age=63072000; includeSubDomains; preload`

### 9.2 Security Headers — FULL ANALYSIS

| Header | Value | Assessment |
|--------|-------|------------|
| Content-Security-Policy | `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https://play.pokemonshowdown.com https://*.githubusercontent.com https://www.linacre.site; font-src 'self' https://fonts.gstatic.com data:; connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://api.openai.com https://api.anthropic.com https://vercel.live wss:; worker-src 'self' blob:; frame-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests` | ✅ EXCELLENT — Comprehensive, well-scoped CSP |
| Strict-Transport-Security | `max-age=63072000; includeSubDomains; preload` | ✅ MAXIMUM — 2 years, includes subdomains, preload-ready |
| X-Frame-Options | `DENY` | ✅ Prevents clickjacking |
| X-Content-Type-Options | `nosniff` | ✅ Prevents MIME-type sniffing |
| Referrer-Policy | `strict-origin-when-cross-origin` | ✅ Good — balances privacy with functionality |
| Permissions-Policy | `camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()` | ✅ EXCELLENT — All sensitive features disabled |
| Cross-Origin-Opener-Policy | `same-origin` | ✅ Process isolation |
| Cross-Origin-Resource-Policy | `same-origin` | ✅ Resource isolation |
| Access-Control-Allow-Origin | `*` | ⚠️ LENIENT — Allows any origin to read responses (likely for CORS on API routes) |
| X-DNS-Prefetch-Control | `on` | ✅ Minor performance boost |

### 9.3 Cookie & Storage Analysis

- **Cookies:** Zero tracking cookies, zero advertising cookies. Vercel sets a "short-lived security/rate-limit cookie" per cookie policy — non-tracking.
- **LocalStorage:** 5 documented keys, all functional (consent, theme, tab, brand, lab sessions). API keys never stored.
- **Assessment:** ✅ Exceptional privacy posture. The cookie/storage policy is one of the most transparent I've reviewed.

### 9.4 Privacy Documentation

- **Privacy Policy (`/privacy`):** Comprehensive — covers data collection, contact forms, chatbot processing, data controller identity, sub-processors (Vercel, Google Cloud), legal basis, cookie inventory. Date-stamped (July 10, 2026).
- **Cookie Policy (`/cookie-policy`):** Detailed table of all storage keys with purpose, category, and retention. Clear opt-out mechanism.
- **Terms (`/terms`):** Covers site use, engagements/deliverables, confidentiality/NDA, warranty/liability, third-party services, data/privacy, governing law (England & Wales).
- **Contact Form:** Honeypot field present ("Leave this field blank") — anti-spam measure.

### 9.5 Security Issues

| ID | Description | Evidence | Why It Matters | Recommended Solution | Priority |
|----|------------|----------|----------------|---------------------|----------|
| SE-01 | `style-src 'unsafe-inline'` in CSP | CSP header analysis | Required by many React CSS-in-JS approaches; reduces CSP effectiveness against style injection | If not needed (Tailwind generates static CSS), remove `'unsafe-inline'` or use nonces/hashes | Medium |
| SE-02 | `Access-Control-Allow-Origin: *` on all responses | Response headers | Overly permissive; any website can read linacre.site responses via fetch | Restrict to specific origins if CORS is needed for API routes only; or scope to `/api/*` paths | Medium |
| SE-03 | API keys handled client-side (in-memory, not in storage) — good but still a risk vector | Privacy policy: "Provider API keys stay in memory for that tab only" | If XSS vulnerability exists, in-memory keys could be exfiltrated | Document this risk; consider if server-side proxy can be extended to cover all providers (currently only Gemini is server-side) | Low |
| SE-04 | No Subresource Integrity (SRI) on third-party resources | CSP allows specific origins but no SRI hashes | Third-party resource compromise could inject malicious code | N/A — no third-party scripts loaded (all scripts are 'self') — actually, this is a STRENGTH | — |
| SE-05 | No visible security.txt or vulnerability disclosure policy | No /.well-known/security.txt detected | Researchers can't easily report vulnerabilities | Add `/.well-known/security.txt` with contact email | Low |

### 9.6 Security Verdict

This is one of the most securely configured personal/small-business sites I've audited. The CSP is comprehensive, HSTS is preload-ready, frame protections are in place, and the permissions policy locks down all sensitive browser features. The privacy and cookie documentation is exceptionally transparent.

**The 90/100 reflects not a deficit but the near-impossibility of scoring 100 on a public audit without penetration testing (which is out of scope).**

---

## 10. Technical / Bugs

**Score: 78/100**

### 10.1 Platform & Stack Signals

| Signal | Value | How Detected |
|--------|-------|-------------|
| Frontend framework | React (Vite-bundled) | JS filename pattern (`index-aUXD3oFG.js`), changelog mentions React + TypeScript |
| CSS framework | Tailwind CSS v4 | CSS filename, changelog confirmation |
| Backend | Express v4 | Changelog v3.5 |
| Hosting | Vercel | `server: Vercel` header |
| Font rendering | Variable fonts (.woff2) | Preload tags |
| PWA | Service worker + manifest | sw.js (2,727 bytes), manifest.json (1,729 bytes) |
| State management | localStorage + React state | Cookie policy, changelog |
| AI integration | Server-side Gemini proxy + optional client-side OpenAI/Anthropic/Ollama | Privacy policy, Lab page content |

### 10.2 Observed Issues

| ID | Description | Evidence | Severity | Fix |
|----|------------|----------|----------|-----|
| TG-01 | `/toolkit` URL in sitemap but fetching returns homepage content | curl https://www.linacre.site/toolkit returned homepage HTML | Medium | Either make /toolkit a standalone page or remove from sitemap and add canonical to homepage |
| TG-02 | Homepage v1.0 changelog entry truncated | "Connected local LLMs directly to the bro" — text cuts mid-word | Low | Fix changelog truncation; check for overflow/clipping in the UI |
| TG-03 | JS bundle filename is content-hashed (`aUXD3oFG`) which is correct for cache busting | File naming pattern | ✅ Correct implementation | No action needed |
| TG-04 | Service worker present (2,727 bytes) | sw.js returns 200 | ✅ Present | Verify update strategy works across deploys (v3.0 changelog notes this was fixed) |
| TG-05 | Asset caching headers correct for immutable assets | favicon.ico has `max-age=31536000, immutable` | ✅ Correct | Maintain this pattern |
| TG-06 | HTML caching correctly set to `max-age=0, must-revalidate` | All HTML responses | ✅ Correct | Ensures fresh content on every visit |
| TG-07 | noopener/noreferrer on external links — unable to verify | Text-only fetch can't inspect `<a>` attributes | Unknown | Ensure all external links use `rel="noopener noreferrer"` — especially toolkit links (42 external links) |
| TG-08 | Contact form has honeypot field | "Leave this field blank" text input | ✅ Good anti-spam | Ensure server-side validation also checks honeypot |

### 10.3 Third-Party Dependencies

| Dependency | Purpose | Risk |
|-----------|---------|------|
| Google Fonts | Typography (3 variable fonts) | Low — preloaded, self-hosted variant? Verify if fonts are self-hosted or CDN |
| Google Gemini API | AI Lab chatbot (server-side proxy) | Medium — API dependency for core feature |
| Pokemon Showdown sprites | Agents page avatars | Low — decorative only, hotlinked |
| Vercel | Hosting + Edge Functions | Inherent — platform dependency |
| OpenAI / Anthropic APIs | Optional AI Lab providers (user-supplied keys) | Low — opt-in, keys never stored |

### 10.4 Bug List

| Bug | Severity | Evidence | Fix Guidance |
|-----|----------|----------|--------------|
| Homepage changelog text truncation | Low | Text ends mid-word at chunk boundary | Check container overflow and max-height. Ensure text isn't clipped by CSS. May be fetch artifact — verify in browser. |
| `/toolkit` URL behavior unclear | Medium | Curl returns homepage; sitemap lists /toolkit | Decide on single canonical location |
| Learn progress tracker non-functional | Medium | Shows 0/6 always | Implement localStorage persistence or remove the tracking UI element |

---

## 11. Conversion (CRO)

**Score: 72/100**

### 11.1 Conversion Funnel Analysis

The site has two primary conversion goals:

**Funnel A: Freelance Client Acquisition**
```
Homepage → Work page → Contact form → Client engagement
```

**Funnel B: Email Capture**
```
Homepage/Blog → Work page (Go concurrency kit) → Email submitted
```

### 11.2 CTA Assessment

| CTA | Location | Clarity | Actionability |
|-----|----------|---------|---------------|
| "Start a project →" | Homepage hero | ✅ Clear | ✅ Links to /contact |
| "See case studies" | Homepage hero | ⚠️ Misleading | Links to /projects (not case studies) |
| "Browse free toolkit →" | Homepage hero | ✅ Clear | Links to toolkit section |
| "Book an Audit" | /work | ✅ Clear | Links to /contact |
| "Start Project" | /work | ✅ Clear | Links to /contact |
| "Discuss Retainer" | /work | ✅ Clear | Links to /contact |
| "Send me the kit →" | /work (email form) | ✅ Clear | Email capture |
| "Send message →" | /contact | ✅ Clear | Form submission |
| "Email to book a 15-min call" | /contact | ✅ Clear | mailto: link |
| "Start a conversation →" | /projects (footer) | ✅ Clear | Links to /contact |

### 11.3 Trust Signals

| Signal | Present? | Strength |
|--------|----------|----------|
| Pricing transparency | ✅ | Strong — exact numbers |
| Social proof (numbers) | ✅ | "17+ production systems", "42 tools" |
| Social proof (testimonials) | ❌ | Missing |
| Client logos | ❌ | Missing |
| Case studies | ❌ | Missing |
| GitHub activity | ✅ | Verifiable code |
| Response time promise | ✅ | "Replies within 12 hours" |
| NDA-friendly | ✅ | Prominently displayed |
| UK GDPR | ✅ | Detailed policy |
| Security badges | ❌ | N/A (not applicable) |
| Money-back guarantee | ❌ | Not applicable for services |
| Free resource (lead magnet) | ✅ | Go Concurrency Starter Kit |

### 11.4 Conversion Friction Points

| Friction | Location | Impact | Fix |
|----------|----------|--------|-----|
| No intermediate nurture | Home → Contact is direct | Visitors not ready to contact bounce | Add email course, newsletter, or downloadable portfolio PDF |
| "See case studies" mismatch | Homepage button | Expectation violation reduces trust | Rename to "View projects" or create case studies |
| Single email capture | Only on /work page | Missed capture opportunities on blog, learn, toolkit | Add inline newsletter/blog subscription on high-traffic pages |
| No social proof from clients | Entire site | Enterprise buyers need validation | Request 2–3 client quotes; display prominently |
| Contact form budget dropdown has no "Just browsing" option | /contact form | Forces premature qualification | Add "Just browsing / researching" option |

### 11.5 CRO Recommendations

| ID | Description | Impact | Effort | Priority |
|----|------------|--------|--------|----------|
| CR-01 | Add client testimonials to Work and Home pages | High | Medium | High |
| CR-02 | Create case study detail pages for GhostMail and DomainDeals | High | Medium | High |
| CR-03 | Add email capture on Blog and Learn pages | Medium | Low | High |
| CR-04 | Fix "See case studies" CTA text | Medium | Low | High |
| CR-05 | Add "Just browsing" option to contact budget dropdown | Low | Low | Medium |
| CR-06 | Add downloadable portfolio/CV PDF | Medium | Low | Medium |
| CR-07 | Implement exit-intent popup with lead magnet (privacy-respecting) | Medium | Medium | Low |
| CR-08 | Add "Companies I've worked with" section (even if anonymous/industry only) | Medium | Medium | Medium |

---

## 12. AI Opportunities

**Score: 82/100**

### 12.1 Existing AI Features

The site already has significant AI integration, which is rare for a personal portfolio:

1. **AI Lab (`/lab`):** Multi-provider AI chat interface (Gemini server-side, OpenAI/Anthropic/Ollama client-side). SQL playground. Team orchestration visual.
2. **Agents Hub (`/agents`):** Simulated autonomous agent monitor with 3D tactical radar, agent party roster (3 active agents), RPG dialog log, agent spawning system.
3. **Playground (`/playground`):** C-to-Wasm compiler with memory visualizer. SVG Vector Creator with AI design.

### 12.2 Assessment

These features demonstrate genuine AI engineering capability — exactly the skill set that sells freelance services. They serve as both portfolio pieces AND functional tools.

### 12.3 AI Enhancement Opportunities

| ID | Opportunity | Description | Business Value | Effort | Priority |
|----|------------|-------------|----------------|--------|----------|
| AI-01 | AI-powered content recommendations | Use Gemini API to suggest related blog posts based on current article content | Higher page-per-session, better SEO | Medium | Medium |
| AI-02 | Smart contact form triage | Use AI to pre-analyze contact form submissions, categorize by project type, estimate complexity | Faster response, better qualification | Medium | Medium |
| AI-03 | Interactive portfolio chatbot | Fine-tuned bot that answers questions about David's experience, projects, and availability | 24/7 lead qualification, reduced bounce | High | High |
| AI-04 | Automated blog post social sharing | AI-generated social media snippets per new blog post (preserving privacy) | Content distribution efficiency | Low | High |
| AI-05 | Code review demo bot | Live demo AI code reviewer on the Playground page | Demonstrates AI capability directly | Medium | Low |
| AI-06 | Personalized toolkit recommendations | AI suggests tools based on user's stated goals/stack | Better toolkit engagement | Medium | Low |
| AI-07 | AI-generated case study drafts | Use Gemini to draft case study narratives from project data | Content creation efficiency | Medium | Medium |

### 12.4 AI Ethics & Privacy

- **Strengths:** Server-side proxy for Gemini means API keys are secure. User-supplied keys for other providers are never stored. Chat history is in-memory only. Privacy policy is transparent about AI processing.
- **Recommendation:** Add a brief "How AI is used on this site" transparency section on the Lab page.

---

## 13. Competitive Positioning

**Score: 75/100**

### 13.1 Market Context

Linacre.site competes in the **freelance developer portfolio** space, targeting UK/EU/US clients needing React, Go, Python, and AI engineering services. The competitive set includes:

- Other freelance developer portfolios
- Agency websites
- Platforms like Toptal, Upwork (indirect)
- Developer-influencer personal brands

### 13.2 Positioning Assessment

| Dimension | Linacre.site | Market Average | Assessment |
|-----------|-------------|----------------|------------|
| Technical sophistication | Above average | Most portfolios are static | ✅ AI Lab + Agents + Playground are differentiators |
| Security posture | Well above average | Most portfolios lack CSP/HSTS | ✅ Standout feature |
| Privacy | Well above average | Most have GA/Facebook tracking | ✅ Strong ethical positioning |
| Content depth | Below average | Competitors often have 20+ blog posts | ❌ 3 posts is thin |
| Visual design | Above average | Most use generic templates | ✅ Distinctive terminal aesthetic |
| Social proof | Below average | Most have testimonials | ❌ Missing client endorsements |
| Lead generation | Average | Most have contact forms | ➖ Functional but no nurture funnel |
| SEO | Above average | Most lack schema/sitemap | ✅ Strong technical SEO, weak content |
| Accessibility | Average | Most ignore accessibility | ➖ Statement exists but can't verify |
| Mobile experience | Unknown | — | Unable to verify from text-only fetch |

### 13.3 Competitive Advantages

1. **AI-first positioning** — The site doesn't just claim AI expertise; it demonstrates it with live tools
2. **Privacy as brand value** — Zero tracking is genuinely rare and marketable
3. **Security expertise** — The CSP/HSTS configuration is a silent signal of engineering quality
4. **Interactive portfolio** — Identity Hub, Agents, and Playground are memorable and shareable

### 13.4 Competitive Disadvantages

1. **Social proof deficit** — No testimonials or client logos
2. **Content moat absent** — 3 blog posts vs competitors' 20–50+
3. **No clear specialization signal** — "Full-stack & AI" is broad; specialization commands higher rates
4. **No nurturing funnel** — Visitors who aren't ready to hire have no way to stay engaged

### 13.5 Recommended Positioning Refinements

1. **Narrow the homepage positioning:** Instead of "Full-stack & AI systems engineer," consider "I build AI-powered developer tools and automation systems for startups" — more specific, more memorable.
2. **Create a lead magnet beyond the Go kit:** An "AI Engineering Assessment" or "Systems Architecture Health Check" would attract higher-value leads.
3. **Leverage the privacy stance:** "The privacy-respecting engineer" is a unique selling proposition worth emphasizing.

---

## 14. Missing Features

**Score: 65/100**

### 14.1 High-Value Missing Features

| Feature | Business Value | Effort | Priority |
|---------|---------------|--------|----------|
| **Client testimonials page** | Converts skeptical buyers | Medium | 🔴 Critical |
| **Case study detail pages** | Demonstrates capability; SEO content | Medium | 🔴 Critical |
| **Blog RSS/Atom feed** | Content distribution; subscriber retention | Low | 🟠 High |
| **Email newsletter signup** | Lead nurturing; audience building | Low | 🟠 High |
| **Privacy-first analytics** | Understand user behavior | Low | 🟠 High |
| **Portfolio/CV PDF download** | Offline sharing; recruiter appeal | Low | 🟡 Medium |
| **`/now` page** | Personal connection (Derek Sivers concept) | Low | 🟢 Low |
| **Speaking/consulting page** | Additional revenue stream | Medium | 🟢 Low |
| **Status page** | Transparency for hosted tools | Medium | 🟢 Low |
| **Security.txt** | Vulnerability disclosure channel | Low | 🟢 Low |

### 14.2 Missing Policies / Legal

| Page | Status |
|------|--------|
| Privacy Policy | ✅ Present — detailed |
| Cookie Policy | ✅ Present — excellent |
| Terms of Service | ✅ Present — comprehensive |
| Accessibility Statement | ✅ Present — transparent |
| Data Processing Agreement (DPA) | ⚠️ Available on request only — consider publishing template |
| SLA / Uptime commitment | ❌ Not applicable for portfolio site |

### 14.3 Missing Content Types

| Content Type | Value | Status |
|-------------|-------|--------|
| How-to guides | SEO traffic | ❌ Missing (blog covers this partially) |
| Video content | Engagement | ❌ Missing |
| Podcast appearances | Social proof | ❌ Missing |
| Conference talks | Authority | ❌ Missing |
| Guest posts (external) | Backlinks | ❌ Missing |
| Comparison pages | SEO (e.g., "React vs Svelte for startups") | ❌ Missing |

---

## 15. Priority Matrix

**Score: 78/100**

### 15.1 All Recommendations by Priority

#### 🔴 Critical (Do First — This Week)

| ID | Recommendation | Category | Effort | Owner |
|----|---------------|----------|--------|-------|
| SEO-01 | Create per-post OG images | SEO | S | Design |
| SEO-02 | Add article:published_time and article:author OG tags | SEO | S | Engineering |
| AC-01 | Conduct manual WCAG 2.2 AA audit of interactive surfaces | Accessibility | M | Engineering |
| PF-05 | Add prefers-reduced-motion support | Accessibility | S | Engineering |
| AC-02 | Add contrast checker to Identity Hub customizer | Accessibility | M | Engineering |

#### 🟠 High (This Sprint — 1–2 Weeks)

| ID | Recommendation | Category | Effort | Owner |
|----|---------------|----------|--------|-------|
| SEO-04 | Expand blog to 8–10 posts | SEO/Content | M | Content |
| SEO-05 | Add RSS/Atom feed | SEO | S | Engineering |
| CN-01 | Create case study pages (GhostMail, DomainDeals) | Content | M | Content + Engineering |
| CR-01 | Add client testimonials to Work/Home | CRO | M | Content |
| CR-03 | Add email capture on Blog and Learn pages | CRO | S | Engineering |
| PF-01 | Code-split JS bundle (313KB → <150KB) | Performance | M | Engineering |
| UX-01 | Fix "See case studies" CTA text | UX | S | Engineering |
| UI-01 | Create per-page OG images or dynamic OG generation | UI/SEO | M | Design + Engineering |
| -- | Add privacy-first analytics (Plausible/Fathom) | Growth | S | Engineering |

#### 🟡 Medium (This Month — 1–3 Months)

| ID | Recommendation | Category | Effort | Owner |
|----|---------------|----------|--------|-------|
| UX-02 | Differentiate Lab/Agents/Playground/Toolkit | UX | M | Design |
| PF-02 | Verify and optimize Tailwind CSS purge | Performance | S | Engineering |
| PF-03 | Add preconnect for third-party origins | Performance | S | Engineering |
| SE-01 | Evaluate removing `unsafe-inline` from style-src | Security | M | Engineering |
| BR-01 | Add "Default Brand" reset to Identity Hub | Brand | S | Engineering |
| UI-02 | Add visual breadcrumbs | UI | S | Engineering |
| CN-04 | Expand About page content | Content | M | Content |
| AC-06 | Audit Playground tools for accessibility | Accessibility | M | Engineering |
| AI-03 | Interactive portfolio chatbot | AI | M | Engineering |
| AI-04 | Automated social sharing snippets | AI | S | Engineering |

#### 🟢 Low (Backlog — 3+ Months)

| ID | Recommendation | Category | Effort | Owner |
|----|---------------|----------|--------|-------|
| All remaining recommendations | Various | Various | Various | Various |
| -- | Create `/now` page | Content | S | Content |
| -- | Add security.txt | Security | S | Engineering |
| -- | Dark/light OG image variants | UI | M | Design |
| -- | Speaking/consulting page | Growth | M | Content |
| -- | AI code review demo bot | AI | M | Engineering |

---

*End of Full Audit. Continue to [Priority-Roadmap.md](Priority-Roadmap.md) for the phased action plan.*
