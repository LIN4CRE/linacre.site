# UI/UX Design Improvement Specifications

## Visual Breadcrumb Component

**Location:** Below header, above H1 on all interior pages  
**Design spec:**

```
┌─────────────────────────────────────────┐
│  Home  ›  Blog  ›  Article Title        │  ← Terminal-style, amber links
│                              Ink Black bg │
└─────────────────────────────────────────┘
```

```html
<nav aria-label="Breadcrumb" class="breadcrumb">
  <ol class="flex items-center gap-2 text-sm font-mono text-amber-400/70">
    <li><a href="/" class="hover:text-amber-400 transition-colors">Home</a></li>
    <li aria-hidden="true" class="text-amber-400/40">›</li>
    <li><a href="/blog" class="hover:text-amber-400 transition-colors">Blog</a></li>
    <li aria-hidden="true" class="text-amber-400/40">›</li>
    <li aria-current="page" class="text-amber-400">Go Concurrency Patterns</li>
  </ol>
</nav>
```

---

## Navigation Differentiation

**Problem:** Lab, Agents, Playground, and Toolkit are conceptually similar — users don't know which to use.

**Solution:** Add subtitles under each nav item:

| Nav Item | Subtitle |
|----------|----------|
| 🧪 Lab | AI chat & code assistant |
| 🤖 Agents | Simulated agent fleet |
| 🛠️ Playground | Dev utility tools |
| 📦 Toolkit | Curated dev resources |

Or group them:
```
Tools  ▾
  ├── 🧪 AI Lab        Chat with AI models
  ├── 🤖 Agents        Simulated agent monitor  
  ├── 🛠️ Playground    JWT, RegEx, SVG tools
  └── 🎨 Identity      Brand customizer
```

---

## OG Image Design Template

**For blog posts — 1200×630px:**

```
┌──────────────────────────────────────────────┐
│  ┌──────────────────────────────────────┐    │
│  │                                      │    │
│  │    > Go Concurrency Patterns         │    │
│  │                                      │    │
│  │    Deep dive into worker pools,      │    │
│  │    rate limiters, and channel sync   │    │
│  │                                      │    │
│  │    Jun 15, 2026 · David Linacre     │    │
│  │                                      │    │
│  └──────────────────────────────────────┘    │
│                                              │
│  linacre.site           [DL monogram]        │
└──────────────────────────────────────────────┘

Background: #0b0e14 (Ink Black)
Primary text: #ffb454 (Amber Core) — Space Grotesk Bold for title
Secondary text: #ffb454/80 — Inter Regular
Date/author: #94a3b8 (slate-400) — JetBrains Mono
Border/frame: Amber Glow gradient
```

---

## "Related Posts" Component Design

```html
<!-- At bottom of each blog post -->
<section aria-labelledby="related-heading" class="related-posts">
  <h2 id="related-heading" class="text-amber-400 font-mono text-sm">
    $ ls ./related-posts/
  </h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
    <article class="card">
      <span class="text-amber-400/60 font-mono text-xs">04 Jul 2026</span>
      <h3 class="text-lg font-display">
        <a href="/blog/..." class="hover:text-amber-400 transition-colors">
          Title of related post
        </a>
      </h3>
      <p class="text-sm text-slate-400">Brief excerpt...</p>
    </article>
    <!-- ... -->
  </div>
</section>
```

---

## Case Study Card Design (for Projects or Work page)

```
┌─────────────────────────────────────────┐
│ ┌──────┐                                │
│ │ ICON │  GhostMail                     │
│ │  🐳  │  Disposable email engine       │
│ └──────┘                                │
│                                         │
│  Go · Docker · SMTP · 5K req/s         │
│                                         │
│  ████████████░░░░░░  Read case study → │
└─────────────────────────────────────────┘

Background: Ink Black (#0b0e14) with subtle amber border
Card surface: glassmorphism (as current design)
Icon: emoji or SVG representing the project type
Tech badges: JetBrains Mono, small, amber/30
Progress bar: decorative visual element
CTA: amber-400 link with arrow
```

---

## Light Mode Considerations

The brand system is dark-first. When light mode is active:

- Background: `#f8fafc` (slate-50) or `#ffffff`
- Primary text: `#0f172a` (slate-900)
- Accent: Keep `#d97706` (amber-600) or use `#b45309` (amber-700) for contrast
- Code blocks: `#1e293b` (slate-800) background with light text
- Terminal aesthetic: Maintain the theme but with light paper/ink metaphor
- Glassmorphism: White with opacity instead of dark

**Recommendation:** Test light mode with amber accent on white background. If contrast is insufficient, develop a secondary accent colour for light mode (e.g., `#0369a1` sky-700 for a complementary blue).

---

## Toolkit Card Redesign (Minor)

Current toolkit cards link to external sites with description. Add:

- Key icon for each category (Start, Build, Deploy, Design, Email)
- Visual indicator for "Free" / "Trial" (already partially present)
- Subtle amber glow on hover (already described in v4.5)
- "opens in new tab" icon for external links
