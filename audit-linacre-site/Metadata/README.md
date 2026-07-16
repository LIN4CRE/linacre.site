# Meta & OG Tag Reference

## Current State: ✅ Strong Foundation

The site already implements proper meta tags and OG tags. This reference covers the recommended additions.

---

## Complete Meta Template (Blog Post)

```html
<head>
  <!-- Primary -->
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Go Concurrency Patterns — Worker Pools & Rate Limiters | David Linacre</title>
  <meta name="description" content="Deep dive into bounded worker pools, token-bucket rate limiters, and channel synchronization — the patterns that made GhostMail sustain 5,000+ SMTP connections per second." />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="https://www.linacre.site/blog/go-concurrency-patterns" />
  <meta name="author" content="David Christopher Linacre" />

  <!-- RSS -->
  <link rel="alternate" type="application/rss+xml" title="Linacre Engineering Notes" href="/feed.xml" />

  <!-- Open Graph -->
  <meta property="og:title" content="Go Concurrency Patterns — Worker Pools & Rate Limiters | David Linacre" />
  <meta property="og:description" content="Deep dive into worker pools, rate limiters, and channel synchronization built for high-throughput SMTP processing." />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="linacre.site" />
  <meta property="og:locale" content="en_GB" />
  <meta property="og:url" content="https://www.linacre.site/blog/go-concurrency-patterns" />
  <meta property="og:image" content="https://www.linacre.site/og/blog/go-concurrency-patterns.png" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Go Concurrency Patterns — Worker Pools & Rate Limiters" />

  <!-- Article-specific OG -->
  <meta property="article:published_time" content="2026-06-15T00:00:00.000Z" />
  <meta property="article:modified_time" content="2026-06-15T00:00:00.000Z" />
  <meta property="article:author" content="https://www.linacre.site/about" />
  <meta property="article:section" content="Technology" />
  <meta property="article:tag" content="Go" />
  <meta property="article:tag" content="Concurrency" />
  <meta property="article:tag" content="SMTP" />
  <meta property="article:tag" content="Docker" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="Go Concurrency Patterns — Worker Pools & Rate Limiters | David Linacre" />
  <meta name="twitter:description" content="Deep dive into worker pools, rate limiters, and channel synchronization built for high-throughput SMTP processing." />
  <meta name="twitter:image" content="https://www.linacre.site/og/blog/go-concurrency-patterns.png" />
  <meta name="twitter:label1" content="Reading time" />
  <meta name="twitter:data1" content="6 min read" />
  <meta name="twitter:label2" content="Published" />
  <meta name="twitter:data2" content="June 15, 2026" />

  <!-- Theme -->
  <meta name="theme-color" content="#0b0e14" />
  <meta name="color-scheme" content="dark light" />

  <!-- PWA -->
  <link rel="manifest" href="/manifest.json" />
  <link rel="icon" href="/favicon.ico" sizes="any" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
</head>
```

---

## Quick Reference: What Each Page Needs

| Page Type | Title Pattern | OG Type | Extra Tags |
|-----------|--------------|---------|------------|
| Home | `David Linacre — Full-stack & AI engineer \| Available for freelance` | website | — |
| Blog listing | `Engineering Notes — Go, React, DevOps & Caching \| David Linacre` | website | RSS link |
| Blog post | `{Title} \| David Linacre` (50–60 chars) | article | published_time, author, tag, section |
| Work | `Work with David Linacre — Services & Freelance Availability` | website | — |
| About | `About David Linacre — Full-Stack & AI Engineer` | profile | — |
| Contact | `Contact David Linacre — Start a Project` | website | — |
| Projects | `Projects & Portfolio \| David Linacre` | website | — |
| Identity | `Identity Hub \| Live Brand Builder \| David Linacre` | website | — |
| Toolkit | `Developer Toolkit — 42 Free Tools \| David Linacre` | website | — |
| Learn | `Learn Web Development from Scratch \| David Linacre` | website | — |
| Privacy | `Privacy Policy \| linacre.site` | website | — |
| Terms | `Terms of Service \| linacre.site` | website | — |
| Cookie | `Cookie & Storage Policy \| linacre.site` | website | — |
| Accessibility | `Accessibility Statement \| linacre.site` | website | — |

---

## Title Tag Length Checker

Keep titles between **50–60 characters** for optimal SERP display:

| Page | Current Length | Recommended Length |
|------|---------------|-------------------|
| Home | 68 chars | ⚠️ Slightly long — trim "available for freelance" |
| Blog listing | 32 chars | ⚠️ Too short — add keywords |
| Blog post — Go | 39 chars | ⚠️ Too short — add descriptive subtitle |
| About | 50 chars | ✅ Good |
| Work | 51 chars | ✅ Good |

---

## Meta Description Length Checker

Keep between **120–155 characters** for optimal SERP display:

| Page | Current (est.) | Assessment |
|------|---------------|------------|
| Home | 135 chars | ✅ Excellent |
| Blog listing | 78 chars | ⚠️ Short — expand |
| Blog post | 77 chars | ⚠️ Short — use 150 chars for click appeal |
| Identity | 105 chars | ✅ Good |
