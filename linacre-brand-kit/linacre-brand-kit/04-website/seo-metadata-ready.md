# Ready SEO Metadata — Linacre.site

## Primary Metadata

### Title
Linacre.site — Full-Stack & AI Engineering Toolkit

### Meta Description
Tools, roadmaps, AI experiments, and clean web systems from full-stack and AI engineer David Linacre.

### Keywords
full-stack engineer, AI engineer, developer toolkit, self-taught developer roadmap, React TypeScript portfolio, AI lab, web development tools, Linacre.site, David Linacre

## Open Graph

```html
<meta property="og:type" content="website" />
<meta property="og:title" content="Linacre.site — Full-Stack & AI Engineering Toolkit" />
<meta property="og:description" content="Tools, roadmaps, AI experiments, and clean web systems from full-stack and AI engineer David Linacre." />
<meta property="og:url" content="https://linacre.site" />
<meta property="og:image" content="https://linacre.site/og/linacre-og-card-1200x630-v01.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
```

## Twitter / X Card

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Linacre.site — Full-Stack & AI Engineering Toolkit" />
<meta name="twitter:description" content="Tools, roadmaps, AI experiments, and clean web systems from David Linacre." />
<meta name="twitter:image" content="https://linacre.site/og/linacre-og-card-1200x630-v01.png" />
```

## Next.js Metadata Example

```ts
export const metadata = {
  title: "Linacre.site — Full-Stack & AI Engineering Toolkit",
  description:
    "Tools, roadmaps, AI experiments, and clean web systems from full-stack and AI engineer David Linacre.",
  keywords: [
    "full-stack engineer",
    "AI engineer",
    "developer toolkit",
    "self-taught developer roadmap",
    "React TypeScript portfolio",
    "AI lab",
    "web development tools",
    "Linacre.site",
    "David Linacre",
  ],
  openGraph: {
    type: "website",
    url: "https://linacre.site",
    title: "Linacre.site — Full-Stack & AI Engineering Toolkit",
    description:
      "Tools, roadmaps, AI experiments, and clean web systems from full-stack and AI engineer David Linacre.",
    images: [
      {
        url: "https://linacre.site/og/linacre-og-card-1200x630-v01.png",
        width: 1200,
        height: 630,
        alt: "Linacre.site full-stack and AI engineering toolkit brand card",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Linacre.site — Full-Stack & AI Engineering Toolkit",
    description: "Tools, roadmaps, AI experiments, and clean web systems from David Linacre.",
    images: ["https://linacre.site/og/linacre-og-card-1200x630-v01.png"],
  },
};
```
