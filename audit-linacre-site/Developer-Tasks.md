# 🛠️ Developer Tasks — GitHub-Issue-Style Implementation Tickets

> These tasks are written so a developer or AI coding agent can implement them without further clarification.

---

## Critical Priority

### TASK-001: Add article:published_time and article:author OG tags to blog posts

**Title:** Add OpenGraph article metadata to all blog posts

**Description:**
Each blog post currently has standard OG tags (title, description, image) but is missing `article:published_time`, `article:modified_time`, and `article:author` tags. These are required for rich article cards on social platforms (Twitter, LinkedIn, Facebook).

**Acceptance Criteria:**
- [ ] Each blog post `<head>` includes `<meta property="article:published_time" content="2026-06-15T00:00:00.000Z" />`
- [ ] Each blog post includes `<meta property="article:author" content="https://www.linacre.site/about" />`
- [ ] Each blog post includes `<meta property="article:modified_time" content="..." />`
- [ ] Verified with Twitter Card Validator and LinkedIn Post Inspector

**Priority:** Critical  
**Estimated Effort:** 15 minutes  
**Owner:** Engineering  
**Labels:** `seo`, `meta`, `quick-win`

---

### TASK-002: Implement prefers-reduced-motion for all animations

**Title:** Add prefers-reduced-motion media query support across all animated components

**Description:**
The Identity Hub has multiple animation modes (Pulsing, Spinning Orbit, breathing animations). The Agents page has animated sprite GIFs and tactical radar. Users with vestibular disorders may experience nausea or seizures. WCAG 2.2 requires respecting the user's OS-level motion preference.

**Acceptance Criteria:**
- [ ] All CSS animations wrapped in `@media (prefers-reduced-motion: no-preference) { ... }`
- [ ] Identity Hub motion modes disabled when OS "Reduce motion" is enabled
- [ ] Breathing logo animation respects the preference
- [ ] All GIF animations in Agents page replaced with static fallback when preference is set
- [ ] Tested on macOS (System Preferences > Accessibility > Display > Reduce motion) and Windows

**Priority:** Critical  
**Estimated Effort:** 30 minutes (CSS) + 1 hour (React state management for GIF toggle)  
**Owner:** Engineering  
**Labels:** `accessibility`, `wcag`, `motion`

---

### TASK-003: Fix "See case studies" CTA text

**Title:** Change "See case studies" button text to "View projects" on homepage

**Description:**
The homepage hero section button reads "See case studies" but links to `/projects`, which is a project grid page, not narrative case studies. This mismatch reduces trust and may frustrate users expecting detailed case studies.

**Acceptance Criteria:**
- [ ] Button text changed from "See case studies" to "View projects"
- [ ] If case study pages are created in future, revert this change
- [ ] Alternative: Keep text but redirect to a new `/case-studies` page with GhostMail and DomainDeals deep-dives

**Priority:** Critical  
**Estimated Effort:** 5 minutes  
**Owner:** Engineering  
**Labels:** `ux`, `copy`, `quick-win`

---

## High Priority

### TASK-004: Implement route-based code splitting with React.lazy

**Title:** Code-split JS bundle using React.lazy() and Suspense

**Description:**
The current JS bundle is 313 KB (`index-aUXD3oFG.js`). This includes code for all pages including the Identity Hub, AI Lab, Agents, and Playground — even when the user only visits the homepage. Use React.lazy() and Suspense to split these heavy pages into separate chunks.

**Acceptance Criteria:**
- [ ] Identify largest page components (Identity Hub, Agents, Playground, AI Lab)
- [ ] Wrap in `React.lazy(() => import('./pages/Identity'))` with `<Suspense fallback={<LoadingSpinner />}>`
- [ ] Main bundle reduced to <150 KB
- [ ] Each lazy-loaded page chunk is <100 KB
- [ ] Loading states displayed during chunk fetch
- [ ] No layout shift (CLS) during loading
- [ ] Tested on simulated Slow 3G in Chrome DevTools

**Priority:** High  
**Estimated Effort:** 1 day  
**Owner:** Engineering  
**Labels:** `performance`, `javascript`, `bundle-size`

---

### TASK-005: Create per-post OG images

**Title:** Design and generate unique OpenGraph images for each blog post

**Description:**
All pages currently share the same `og.png` (1200×630). This means every blog post, when shared on social media, displays the generic site image rather than a post-specific card. Each blog post needs a unique social card with the post title, author, and date.

**Acceptance Criteria:**
- [ ] 3 images created (one per existing post), 1200×630px, <300KB each
- [ ] Consistent template: Linacre brand (Ink Black background, Amber accent, Space Grotesk title)
- [ ] Post title clearly readable at 1x and 2x
- [ ] Include "linacre.site" URL and "David Linacre" name
- [ ] Option: Implement dynamic OG image generation via Vercel OG Image library for future posts
- [ ] Update og:image meta tag per post
- [ ] Tested with Twitter Card Validator

**Priority:** High  
**Estimated Effort:** 2 hours (static) or 1 day (dynamic generation)  
**Owner:** Design + Engineering  
**Labels:** `design`, `seo`, `social-media`

---

### TASK-006: Set up Plausible Analytics

**Title:** Implement privacy-first analytics with Plausible

**Description:**
The site currently has zero analytics — not even privacy-first options. This means no visibility into traffic sources, page performance, conversion rates, or content effectiveness. Plausible is GDPR-compliant, cookie-free, and lightweight (<1KB script).

**Acceptance Criteria:**
- [ ] Plausible account created (plausible.io — €9/mo or self-hosted)
- [ ] Script added to site (either via `<script>` or Plausible proxy through Vercel)
- [ ] Dashboard accessible
- [ ] Key events tracked: pageviews, outbound link clicks (/contact, /work, email), blog post views, toolkit link clicks
- [ ] No cookies set — verified in browser DevTools
- [ ] Privacy policy updated to mention Plausible (optional — Plausible doesn't use cookies but transparency is good)

**Priority:** High  
**Estimated Effort:** 2 hours  
**Owner:** Engineering + Growth  
**Labels:** `analytics`, `growth`, `privacy`

---

### TASK-007: Create RSS/Atom feed for blog

**Title:** Add RSS feed at /blog/rss.xml or /feed.xml

**Description:**
There is no RSS/Atom feed for the blog. This is a missed distribution channel — RSS is still widely used by developers (the target audience) and enables content syndication. It also helps with SEO discoverability.

**Acceptance Criteria:**
- [ ] XML feed generated at build time or via server route
- [ ] Contains all 3 blog posts with: title, link, description, pubDate, author, categories
- [ ] Feed auto-discoverable via `<link rel="alternate" type="application/rss+xml" title="Linacre Blog" href="/feed.xml" />`
- [ ] Validates against W3C Feed Validator
- [ ] Updated automatically when new posts are published

**Priority:** High  
**Estimated Effort:** 2 hours  
**Owner:** Engineering  
**Labels:** `seo`, `content-distribution`, `blog`

---

### TASK-008: Add email signup component to Blog and Learn pages

**Title:** Add newsletter subscription to Blog listing and Learn page

**Description:**
The only email capture on the site is the Go Concurrency Starter Kit form on `/work`. The Blog and Learn pages have no way for visitors to subscribe for updates, missing a key nurturing opportunity.

**Acceptance Criteria:**
- [ ] Inline signup form added below blog post list: "Get new engineering notes by email"
- [ ] Inline signup added to Learn page: "Get learning resources and updates"
- [ ] Form uses same email service as Go Kit form (Resend or similar)
- [ ] Double opt-in (GDPR compliant)
- [ ] Clear: "No spam, unsubscribe any time. See privacy policy."
- [ ] Privacy policy updated if needed

**Priority:** High  
**Estimated Effort:** 3 hours  
**Owner:** Engineering + Content  
**Labels:** `cro`, `email`, `growth`

---

## Medium Priority

### TASK-009: Add visual breadcrumb component

**Title:** Implement breadcrumb navigation on all interior pages

**Description:**
The site has BreadcrumbList JSON-LD schema but no visible breadcrumb navigation. Users on deep pages (like blog posts) have no visual way to navigate back up the hierarchy.

**Acceptance Criteria:**
- [ ] Breadcrumb component created (React)
- [ ] Rendered on all interior pages: Blog > Post Title, Projects > Project Name, Identity, Agents, Lab, etc.
- [ ] Matches existing BreadcrumbList schema
- [ ] Styled consistently with brand (likely amber-on-dark terminal style)
- [ ] Home > Current Page pattern
- [ ] Clickable (except current page)

**Priority:** Medium  
**Estimated Effort:** 1 hour  
**Owner:** Engineering  
**Labels:** `ux`, `navigation`, `seo`

---

### TASK-010: Add real-time contrast checker to Identity Hub

**Title:** Implement WCAG contrast ratio checker in brand customizer

**Description:**
The Identity Hub lets users choose from 5 colour themes. Some combinations of colour + background may fail WCAG 2.2 AA contrast minimums (4.5:1 for normal text, 3:1 for large text). Users should be warned when their brand configuration is inaccessible.

**Acceptance Criteria:**
- [ ] Contrast ratio calculated in real-time using WCAG relative luminance formula
- [ ] Visual indicator: green checkmark (passes AA) / amber warning (passes AA large only) / red X (fails)
- [ ] Checked against both dark background (#0b0e14) and light background (white)
- [ ] Tooltip explaining the issue and suggesting fixes
- [ ] Does not block the user — advisory only

**Priority:** Medium  
**Estimated Effort:** 4 hours  
**Owner:** Engineering  
**Labels:** `accessibility`, `wcag`, `identity`

---

### TASK-011: Create case study detail pages

**Title:** Build dedicated case study pages for GhostMail and DomainDeals

**Description:**
The Projects page lists 19 projects but none have narrative case study pages. "Case studies" are mentioned in the homepage CTA. Two existing open-source projects (GhostMail and DomainDeals) are prime candidates for detailed case studies.

**Acceptance Criteria:**
- [ ] `/case-studies/ghostmail` page created
- [ ] `/case-studies/domaindeals` page created
- [ ] Each includes: problem statement, technical approach, architecture diagram (Mermaid or SVG), key decisions, results, lessons learned
- [ ] Links to source code and live demos
- [ ] "Start a similar project" CTA at bottom
- [ ] Proper meta/OG tags with unique social images
- [ ] BreadcrumbList schema
- [ ] Listed on Projects page and linked from homepage

**Priority:** Medium  
**Estimated Effort:** 2 days  
**Owner:** Content + Engineering  
**Labels:** `content`, `cro`, `seo`

---

### TASK-012: Expand About page content

**Title:** Rewrite and expand /about page to 300–500 words

**Description:**
The current About page is thin — ~100 words of personal narrative plus a skills matrix and 4 milestones. For a freelance engineer, the About page is often the second-most-visited page after the homepage. It needs to build trust and connection.

**Acceptance Criteria:**
- [ ] Career story: how you got into engineering (2 paragraphs)
- [ ] Philosophy: approach to building software (1 paragraph)
- [ ] What it's like to work together: process, communication style, tools (1 paragraph)
- [ ] Personal touch: what you do when not coding (1 sentence)
- [ ] Skills matrix updated and kept
- [ ] Milestones expanded with more detail
- [ ] Updated og:title and meta description

**Priority:** Medium  
**Estimated Effort:** 2 hours  
**Owner:** Content  
**Labels:** `content`, `about`, `trust`

---

### TASK-013: Evaluate removing unsafe-inline from style-src CSP

**Title:** Remove or narrow `'unsafe-inline'` from Content-Security-Policy

**Description:**
The current CSP includes `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`. The `'unsafe-inline'` directive weakens the CSP by allowing inline `<style>` blocks and `style=` attributes. If Tailwind CSS generates all styles via static CSS files (which it does by default), `'unsafe-inline'` may not be needed.

**Acceptance Criteria:**
- [ ] Test removing `'unsafe-inline'` from style-src in staging
- [ ] Verify no inline styles break (check React components, emotion/styled-components if used)
- [ ] If inline styles are needed, use nonces or hashes instead of blanket `'unsafe-inline'`
- [ ] Deploy to production
- [ ] Monitor for CSP violation reports

**Priority:** Medium  
**Estimated Effort:** 2 hours (testing)  
**Owner:** Engineering  
**Labels:** `security`, `csp`, `hardening`

---

## Low Priority

### TASK-014: Add security.txt file

**Title:** Create /.well-known/security.txt for vulnerability disclosure

**Description:**
There is no public channel for security researchers to report vulnerabilities. A security.txt file provides a standardized way to accept reports.

**Acceptance Criteria:**
- [ ] File served at `/.well-known/security.txt`
- [ ] Content:
  ```
  Contact: mailto:david@linacre.site
  Expires: 2027-07-16T00:00:00.000Z
  Preferred-Languages: en
  Canonical: https://www.linacre.site/.well-known/security.txt
  Policy: https://www.linacre.site/privacy
  ```

**Priority:** Low  
**Estimated Effort:** 15 minutes  
**Owner:** Engineering  
**Labels:** `security`, `compliance`

---

### TASK-015: Create /now page

**Title:** Add a /now page following Derek Sivers' convention

**Description:**
A `/now` page is a popular personal-brand convention showing what the person is currently focused on — work projects, learning, life. It humanizes the brand and builds connection.

**Acceptance Criteria:**
- [ ] Page at `/now` created
- [ ] Sections: "What I'm working on," "What I'm learning," "What I'm reading/watching"
- [ ] Updated monthly
- [ ] Linked from About page and/or footer
- [ ] Proper meta/OG tags

**Priority:** Low  
**Estimated Effort:** 1 hour  
**Owner:** Content  
**Labels:** `content`, `personal-brand`

---

## Task Summary

| ID | Title | Priority | Effort | Owner |
|----|-------|----------|--------|-------|
| TASK-001 | Add article OG tags | 🔴 Critical | 15 min | Engineering |
| TASK-002 | prefers-reduced-motion | 🔴 Critical | 1.5 hrs | Engineering |
| TASK-003 | Fix CTA text | 🔴 Critical | 5 min | Engineering |
| TASK-004 | Code splitting | 🟠 High | 1 day | Engineering |
| TASK-005 | Per-post OG images | 🟠 High | 2 hrs | Design + Eng |
| TASK-006 | Plausible Analytics | 🟠 High | 2 hrs | Engineering |
| TASK-007 | RSS feed | 🟠 High | 2 hrs | Engineering |
| TASK-008 | Email signup | 🟠 High | 3 hrs | Engineering + Content |
| TASK-009 | Breadcrumbs | 🟡 Medium | 1 hr | Engineering |
| TASK-010 | Contrast checker | 🟡 Medium | 4 hrs | Engineering |
| TASK-011 | Case study pages | 🟡 Medium | 2 days | Content + Eng |
| TASK-012 | Expand About page | 🟡 Medium | 2 hrs | Content |
| TASK-013 | CSP hardening | 🟡 Medium | 2 hrs | Engineering |
| TASK-014 | security.txt | 🟢 Low | 15 min | Engineering |
| TASK-015 | /now page | 🟢 Low | 1 hr | Content |
