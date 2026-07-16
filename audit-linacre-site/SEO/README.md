# SEO Configurations & Templates

## Recommended robots.txt

The current robots.txt is well-configured. Only minor additions recommended:

```txt
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

✅ No changes needed. The current configuration is optimal.

---

## Sitemap Enhancement

Current sitemap is functional but could be enhanced with optional metadata:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
  
  <!-- Example enhanced entry -->
  <url>
    <loc>https://www.linacre.site/</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  
  <url>
    <loc>https://www.linacre.site/work</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  
  <url>
    <loc>https://www.linacre.site/blog</loc>
    <lastmod>2026-07-16</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  
  <url>
    <loc>https://www.linacre.site/blog/go-concurrency-patterns</loc>
    <lastmod>2026-06-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  
  <!-- Continue for all pages... -->
  
</urlset>
```

---

## Blog Post Title Tag Template

**Current (too short):**
```
<title>Go Concurrency Patterns | David Linacre</title>
```

**Recommended (target 50–60 chars):**
```
<title>High-Throughput Go Concurrency Patterns: Worker Pools & Rate Limiters | Linacre</title>
```

**Blog listing page:**
```
<title>Engineering Notes — Go, React, DevOps & Caching | David Linacre</title>
```

---

## Blog Post Meta Template

```html
<!-- Standard -->
<title>{{title}} | David Linacre</title>
<meta name="description" content="{{description_155_chars}}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="https://www.linacre.site/blog/{{slug}}" />

<!-- Open Graph -->
<meta property="og:title" content="{{title}} | David Linacre" />
<meta property="og:description" content="{{description}}" />
<meta property="og:type" content="article" />
<meta property="og:site_name" content="linacre.site" />
<meta property="og:locale" content="en_GB" />
<meta property="og:url" content="https://www.linacre.site/blog/{{slug}}" />
<meta property="og:image" content="https://www.linacre.site/og/blog/{{slug}}.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:alt" content="{{title}}" />

<!-- Article-specific -->
<meta property="article:published_time" content="{{published_iso8601}}" />
<meta property="article:modified_time" content="{{modified_iso8601}}" />
<meta property="article:author" content="https://www.linacre.site/about" />
<meta property="article:tag" content="{{tag1}}" />
<meta property="article:tag" content="{{tag2}}" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{title}} | David Linacre" />
<meta name="twitter:description" content="{{description}}" />
<meta name="twitter:image" content="https://www.linacre.site/og/blog/{{slug}}.png" />
```

---

## RSS Feed Template

```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Engineering Notes — David Linacre</title>
    <link>https://www.linacre.site/blog</link>
    <description>Deep-dives into systems architecture, Go concurrency, React theming, and cloud caching protocols.</description>
    <language>en-GB</language>
    <lastBuildDate>Wed, 16 Jul 2026 17:00:00 GMT</lastBuildDate>
    <atom:link href="https://www.linacre.site/feed.xml" rel="self" type="application/rss+xml"/>
    
    <item>
      <title>Optimizing Vercel Edge CDN Caching Headers</title>
      <link>https://www.linacre.site/blog/optimizing-edge-cdn-caching</link>
      <guid>https://www.linacre.site/blog/optimizing-edge-cdn-caching</guid>
      <pubDate>Wed, 08 Jul 2026 00:00:00 GMT</pubDate>
      <author>david@linacre.site (David Linacre)</author>
      <category>Caching</category>
      <category>CDN</category>
      <category>Vercel</category>
      <description>Enforcing cache invalidation rules, immutable assets, and s-maxage controls to build a blazing fast, globally cached SPA.</description>
    </item>
    
    <item>
      <title>Dynamic HSL Theme Customization in React</title>
      <link>https://www.linacre.site/blog/dynamic-hsl-theme-variables</link>
      <guid>https://www.linacre.site/blog/dynamic-hsl-theme-variables</guid>
      <pubDate>Thu, 02 Jul 2026 00:00:00 GMT</pubDate>
      <author>david@linacre.site (David Linacre)</author>
      <category>React</category>
      <category>CSS</category>
      <category>Tailwind</category>
      <description>How to build a theme customization panel using CSS custom properties, HSL color calculations, and local storage preservation.</description>
    </item>
    
    <item>
      <title>High-Throughput Go Concurrency Patterns</title>
      <link>https://www.linacre.site/blog/go-concurrency-patterns</link>
      <guid>https://www.linacre.site/blog/go-concurrency-patterns</guid>
      <pubDate>Mon, 15 Jun 2026 00:00:00 GMT</pubDate>
      <author>david@linacre.site (David Linacre)</author>
      <category>Go</category>
      <category>Concurrency</category>
      <category>SMTP</category>
      <description>Deep dive into worker pools, rate limiters, and channel synchronization built for high-throughput SMTP processing in GhostMail.</description>
    </item>
  </channel>
</rss>
```

Add to `<head>` on blog pages:
```html
<link rel="alternate" type="application/rss+xml" title="Linacre Engineering Notes" href="/feed.xml" />
```
