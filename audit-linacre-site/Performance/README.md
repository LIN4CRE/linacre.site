# Performance Optimizations

## Current Baseline

| Asset | Size | Target |
|-------|------|--------|
| HTML (homepage) | 13 KB | ✅ Good |
| JS bundle | 313 KB | ⚠️ Target <150 KB |
| CSS bundle | 109 KB | ⚠️ Target <50 KB |
| Fonts | 3 variable .woff2 | ✅ Good |

---

## 1. Code Splitting with React.lazy()

### Current (monolithic):
```typescript
import Home from './pages/Home';
import Identity from './pages/Identity';
import Agents from './pages/Agents';
import Lab from './pages/Lab';
import Playground from './pages/Playground';
import Blog from './pages/Blog';
// ... all imported eagerly
```

### Recommended (lazy-loaded):
```typescript
import { lazy, Suspense } from 'react';

const Home = lazy(() => import('./pages/Home'));
const Identity = lazy(() => import('./pages/Identity'));
const Agents = lazy(() => import('./pages/Agents'));
const Lab = lazy(() => import('./pages/Lab'));
const Playground = lazy(() => import('./pages/Playground'));
const Blog = lazy(() => import('./pages/Blog'));

// Shared loading component
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]" aria-live="polite" aria-busy="true">
      <div className="animate-pulse text-amber-400 font-mono">Loading...</div>
    </div>
  );
}

// In router:
<Route path="/identity" element={
  <Suspense fallback={<PageLoader />}>
    <Identity />
  </Suspense>
} />
```

### Expected Impact:
- Main bundle: 313 KB → ~120–150 KB
- Lazy chunks: ~50–80 KB each (loaded on demand)
- FCP improvement: ~0.5–1s on Slow 3G

---

## 2. CSS Optimization

### Verify Tailwind Purge

```javascript
// tailwind.config.js or vite.config.ts
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // ... other config
}
```

**Check:** Run `npx tailwindcss -o output.css --minify` and verify output is <50 KB.

If the 109 KB CSS is ALL Tailwind utilities and custom styles, it suggests:
- Dynamic class names that purge can't detect
- Or significant custom CSS beyond Tailwind

**Fix:** Audit for dynamic class concatenation like `className={`text-${color}-500`}` — this bypasses Tailwind's purge. Use full class names or safelist them.

---

## 3. Preconnect for Third-Party Origins

```html
<!-- Add to <head> alongside existing preconnects -->
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="preconnect" href="https://play.pokemonshowdown.com" />
<link rel="preconnect" href="https://raw.githubusercontent.com" />
```

---

## 4. Image Optimization

### Responsive Images

```html
<!-- Instead of: -->
<img src="/profile_avatar.webp" alt="David Linacre" />

<!-- Use: -->
<img 
  src="/profile_avatar-400w.webp"
  srcset="
    /profile_avatar-200w.webp 200w,
    /profile_avatar-400w.webp 400w,
    /profile_avatar-800w.webp 800w
  "
  sizes="(max-width: 768px) 200px, 400px"
  alt="David Linacre — full-stack & AI engineer"
  width="400"
  height="400"
  loading="lazy"
/>
```

### Hero Image Preload

```html
<!-- If og.png is used as LCP element on homepage: -->
<link 
  rel="preload" 
  href="/og.png" 
  as="image" 
  type="image/png"
  fetchpriority="high"
/>
```

---

## 5. Font Loading Optimization

```css
/* In @font-face declarations, add: */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-display: swap; /* ← Prevent FOIT */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}
```

---

## 6. Service Worker Caching Strategy

```javascript
// sw.js — Stale-while-revalidate for static assets
const CACHE_NAME = 'linacre-v4.5';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Cache-first for fonts
  if (url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(event.request).then(cached => 
        cached || fetch(event.request).then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          return response;
        })
      )
    );
  }
  
  // Network-first for HTML (always fresh)
  if (event.request.destination === 'document') {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
  }
  
  // Stale-while-revalidate for JS/CSS assets
  if (url.pathname.startsWith('/assets/')) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        const fetchPromise = fetch(event.request).then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
          return response;
        });
        return cached || fetchPromise;
      })
    );
  }
});
```

---

## 7. Vercel-Specific Optimizations

### vercel.json header configuration

```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/manifest.json",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=86400" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, s-maxage=31536000, must-revalidate" }
      ]
    }
  ]
}
```

---

## Performance Budget

| Metric | Current (est.) | Budget |
|--------|---------------|--------|
| Total JS (main) | 313 KB | <150 KB |
| Total CSS | 109 KB | <50 KB |
| Total page weight | ~435 KB | <300 KB |
| FCP | Unknown | <1.5s |
| LCP | Unknown | <2.5s |
| TBT | Unknown | <200ms |
| CLS | Unknown | <0.1 |
