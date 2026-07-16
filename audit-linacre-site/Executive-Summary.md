# 📊 Executive Summary — Linacre.site

**Overall Website Score: 76/100**  
**Product type:** Personal brand / freelance portfolio for David Linacre (Full-Stack & AI Engineer)  
**Audit depth:** Forensic / Exhaustive  
**Date:** 2026-07-16  

---

## Category Scores

| # | Category | Score | Grade |
|---|----------|-------|-------|
| 1 | Executive Summary | 76 | B+ |
| 2 | Brand Review | 80 | A- |
| 3 | User Experience | 72 | B |
| 4 | User Interface | 78 | B+ |
| 5 | Content / Copy | 68 | C+ |
| 6 | SEO Audit | 79 | B+ |
| 7 | Performance | 74 | B |
| 8 | Accessibility | 70 | B- |
| 9 | Security & Privacy | 90 | A |
| 10 | Technical / Bugs | 78 | B+ |
| 11 | Conversion (CRO) | 72 | B |
| 12 | AI Opportunities | 82 | A- |
| 13 | Competitive Positioning | 75 | B |
| 14 | Missing Features | 65 | C+ |
| 15 | Priority Matrix | 78 | B+ |

---

## Biggest Strengths

1. **World-class security posture** — CSP, HSTS with preload, X-Frame-Options DENY, CORP/COOP, Permissions-Policy, and Referrer-Policy all correctly configured. This is rare even for enterprise sites and exceptional for a personal portfolio. (Score: 90/100)

2. **Privacy-first architecture** — Zero tracking cookies, no analytics scripts, transparent LocalStorage inventory with clear consent mechanism. UK GDPR-compliant with detailed privacy & cookie policies. Sets a benchmark for ethical web development.

3. **Comprehensive JSON-LD schema** — Person, ProfessionalService, WebSite, SoftwareApplication, ItemList, SoftwareSourceCode, BreadcrumbList, and SpeakableSpecification all properly implemented with @id referencing. Search engines receive rich, connected entity data.

4. **PWA-ready** — Complete manifest.json with shortcuts, service worker, multiple icon sizes, standalone display mode. The site is installable as a progressive web app.

5. **Clean modern stack** — React + TypeScript + Tailwind CSS v4 + Express v4 deployed on Vercel with clear version history (v1.0 through v4.5). Well-maintained with visible changelog.

6. **Interactive tooling** — Identity Hub, AI Lab, Agents Hub, Playground, and Terminal-style toolkit provide genuine utility beyond static content.

---

## Biggest Weaknesses

1. **Thin blog content** — Only 3 posts spanning 2 months (June–July 2026). No content strategy evident. Missing categories, tags, author pages, and RSS feed. This severely limits organic search reach.

2. **Undifferentiated OG images** — Every page shares the same `og.png` (1200×630). Blog posts lack individual social cards, reducing shareability and click-through from social platforms.

3. **Unverifiable accessibility compliance** — While an accessibility statement exists and proper HTML landmarks are claimed, the interactive customizers (Identity Hub, Agents, AI Lab) cannot be fully evaluated for screen-reader support from text-only fetches. The "skip-to-content" link and keyboard navigation cannot be verified from public surface alone.

4. **Navigation architecture tension** — The homepage embeds the toolkit (42 tools) directly, yet `/toolkit` exists as a sitemap URL. The `/learn` page offers a learning roadmap and `/work` offers services, creating overlapping CTAs without clear user journey segmentation.

5. **No analytics or measurement** — While privacy-respecting, the absence of any analytics (even privacy-first tools like Plausible or Fathom) means zero visibility into user behavior, conversion funnels, or content performance.

6. **Content depth varies wildly** — Some pages (Work, Contact, Privacy) are comprehensive. Others (About, Learn) feel concise to the point of thinness. The Projects page lists 19 projects but most are marked "Private — details available on request," limiting portfolio impact.

---

## Highest-Priority Improvements

| Priority | Improvement | Impact | Effort |
|----------|------------|--------|--------|
| 🔴 Critical | Add privacy-first analytics (Plausible/Fathom) | Understand user behavior | S |
| 🔴 Critical | Create per-post OG images for 3 blog posts | Social shareability | S |
| 🔴 Critical | Add `article:published_time` and `article:author` OG tags | Rich social cards | S |
| 🟠 High | Expand blog to 8–10 posts with editorial calendar | SEO authority | M |
| 🟠 High | Conduct full WCAG 2.2 AA manual audit of interactive surfaces | Accessibility | M |
| 🟠 High | Add RSS/Atom feed for blog | Content distribution | S |
| 🟡 Medium | Add case study detail pages for GhostMail and DomainDeals | Portfolio depth | M |
| 🟡 Medium | Implement code splitting to reduce JS bundle (313KB → target ~150KB) | Performance | M |
| 🟡 Medium | Add visual breadcrumbs on all interior pages | UX + SEO | S |
| 🟢 Low | Add dark/light OG images or dynamic social cards | Polish | M |
| 🟢 Low | Create a `/now` page | Personal brand | S |

---

## Estimated Effort vs Business Impact

```
High Impact / Low Effort ⚡ (DO FIRST)
  ├── Privacy-first analytics setup
  ├── Per-post OG images
  ├── article:published_time / article:author OG tags
  ├── RSS feed
  └── Visual breadcrumbs

High Impact / Medium Effort 🔨 (SCHEDULE THIS SPRINT)
  ├── Blog expansion (8–10 posts)
  ├── Accessibility manual audit
  └── Case study detail pages

Medium Impact / Medium Effort 📋 (NEXT MONTH)
  ├── JS bundle code splitting
  ├── Image optimization pipeline
  └── Dynamic OG image generation

Low Impact / High Effort ⏳ (LATER)
  ├── Full visual redesign (not needed — current design is strong)
  └── Multi-tenant blog platform
```

---

## Key Assumptions (from auto-resolution)

- **Market:** Auto-assumed as "general web / brand site." This is actually a **personal brand / freelance engineering portfolio** — more specific and accurate.
- **Product type:** Confirmed as **Website / Web App** (React SPA on Vercel).
- **Target audience:** Technical decision-makers (CTOs, engineering leads), potential freelance clients, and fellow developers.
- **Business model:** Freelance services (audits from £1,800, custom builds from £6,500, retainer £2,400/mo).

---

## Verdict

Linacre.site is a **technically outstanding** personal brand site that punches well above its weight class in security, privacy, and structured data. It suffers from the common solo-developer problem: excellent engineering foundations with thinner content and marketing execution. The site's biggest opportunity is not technical — it's **content strategy and distribution**. With 3 blog posts, no RSS feed, and no analytics, the site is essentially invisible to the organic growth engines that could bring it clients.

**The 90/100 security score alongside the 68/100 content score tells the story: this is an engineer's site that needs a marketer's touch.**
