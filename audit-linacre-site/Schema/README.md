# JSON-LD Schema Templates

The existing schema implementation is already excellent. These templates cover additions and page-specific schemas.

---

## Blog Post Schema (Article type)

Currently, blog posts use the same `Person` + `ProfessionalService` + `WebSite` graph as the homepage. Each blog post should include `Article` schema:

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "@id": "https://www.linacre.site/blog/go-concurrency-patterns#article",
  "headline": "High-Throughput Go Concurrency Patterns",
  "description": "Deep dive into worker pools, rate limiters, and channel synchronization built for high-throughput SMTP processing in GhostMail.",
  "author": {
    "@id": "https://www.linacre.site/#person"
  },
  "publisher": {
    "@id": "https://www.linacre.site/#org"
  },
  "datePublished": "2026-06-15T00:00:00.000Z",
  "dateModified": "2026-06-15T00:00:00.000Z",
  "url": "https://www.linacre.site/blog/go-concurrency-patterns",
  "image": "https://www.linacre.site/og/blog/go-concurrency-patterns.png",
  "inLanguage": "en-GB",
  "wordCount": 1200,
  "articleSection": ["Go", "Concurrency", "SMTP", "Docker"],
  "isPartOf": {
    "@id": "https://www.linacre.site/#website"
  },
  "mainEntityOfPage": {
    "@type": "WebPage",
    "@id": "https://www.linacre.site/blog/go-concurrency-patterns#webpage"
  }
}
```

---

## FAQ Schema for Work Page

The `/work` page has FAQ content that should be marked up:

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.linacre.site/work#faq",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "How quickly can we start?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Systems audits can usually start within 1–2 weeks. Custom development projects are booked in order of enquiry against the next available slot shown on this page."
      }
    },
    {
      "@type": "Question",
      "name": "What does the Systems & Infrastructure Audit include?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "A deep technical review of your architecture, security, performance, and developer experience: a full architecture review with a written report, security and performance recommendations, a 30/60/90-day implementation roadmap, and two 45-minute follow-up consulting calls. Pricing starts at £1,800."
      }
    },
    {
      "@type": "Question",
      "name": "How do custom development projects work?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We agree scope, milestones and a starting price (from £6,500) before any code is written. You get a production-grade build — typically React and TypeScript with Go or Python services — deployed to Vercel or your cloud, full documentation with a system handoff, and 30 days of direct post-launch support."
      }
    },
    {
      "@type": "Question",
      "name": "Do you sign NDAs and comply with UK GDPR?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes. I am NDA-friendly and work under UK GDPR: client repositories are fully isolated, credentials are never hardcoded, and your contact details are used only to reply."
      }
    }
  ]
}
```

---

## How-To Schema for Learn Page

The `/learn` page has a 6-step roadmap:

```json
{
  "@context": "https://schema.org",
  "@type": "HowTo",
  "@id": "https://www.linacre.site/learn#howto",
  "name": "Learn Web Development from Scratch",
  "description": "The exact route from absolute zero to shipping full-stack applications.",
  "step": [
    {
      "@type": "HowToStep",
      "position": 1,
      "name": "Set up your dev environment",
      "text": "Install VS Code + Git, make a dev folder, and run git init for the first time."
    },
    {
      "@type": "HowToStep",
      "position": 2,
      "name": "Finish freeCodeCamp Responsive Web Design",
      "text": "~300 hours covering HTML, CSS, Flexbox & Grid — with a certificate."
    },
    {
      "@type": "HowToStep",
      "position": 3,
      "name": "Rebuild this landing page",
      "text": "Copy the source, modify it, break it, fix it. Then deploy to Vercel."
    },
    {
      "@type": "HowToStep",
      "position": 4,
      "name": "Learn JavaScript (ES6+)",
      "text": "JavaScript.info + the freeCodeCamp JS cert. Build small projects."
    },
    {
      "@type": "HowToStep",
      "position": 5,
      "name": "Pick a framework & build something real",
      "text": "Next.js + Supabase + Vercel = a full-stack app."
    },
    {
      "@type": "HowToStep",
      "position": 6,
      "name": "Share everything on GitHub",
      "text": "Push code, write READMEs, build in public."
    }
  ]
}
```

---

## Service Schema for Work Page

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://www.linacre.site/work#systems-audit",
  "name": "Systems & Infrastructure Audit",
  "provider": {
    "@id": "https://www.linacre.site/#person"
  },
  "description": "Deep technical review of architecture, security, performance, and developer experience.",
  "offers": {
    "@type": "Offer",
    "price": "1800",
    "priceCurrency": "GBP",
    "priceSpecification": "Starting from",
    "url": "https://www.linacre.site/contact"
  },
  "areaServed": ["GB", "EU", "US", "Worldwide"],
  "termsOfService": "https://www.linacre.site/terms"
}
```

---

## BreadcrumbList Template (All Interior Pages)

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://www.linacre.site/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Blog",
      "item": "https://www.linacre.site/blog"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Go Concurrency Patterns",
      "item": "https://www.linacre.site/blog/go-concurrency-patterns"
    }
  ]
}
```
