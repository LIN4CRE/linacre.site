---
name: seo-sitemap-generator
description: Automatically scans page files, generates semantic sitemaps, robots.txt bot configurations, and updates sitemap dates.
---

# SEO Sitemap & Meta Auditor Skill

This agent skill automates crawling workspace navigation files and generating static sitemaps, robots configurations, and HTML meta tags.

## 📋 Steps & Protocol

### 1. Route Discovery
* Read [src/App.tsx](file:///v:/LIN4CRE/linacre-site-repo/src/App.tsx) and [src/components/Header.tsx](file:///v:/LIN4CRE/linacre-site-repo/src/components/Header.tsx) to find the active navigation tabs (e.g. `toolkit`, `learn`, `lab`, `dashboard`, `identity`, `playground`).

### 2. Sitemap XML Synthesis
* Generate a structured XML sitemap in `public/sitemap.xml` with all discovered URLs.
* Set the `<lastmod>` property to the current date in `YYYY-MM-DD` format.
* Set the `<changefreq>` frequency to `weekly` and `<priority>` weight of the main URL to `1.0`.

### 3. Robots.txt Generation
* Ensure the sitemap link is declared at the bottom of `public/robots.txt`:
  ```txt
  User-agent: *
  Allow: /
  
  Sitemap: https://linacre.site/sitemap.xml
  ```

### 4. Build Output Checks
* Ensure sitemap and robots assets are placed inside the `public/` folder so they get copied directly to the `dist/` directory during Vite builds.
