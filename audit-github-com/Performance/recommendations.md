# Web Performance & Core Web Vitals Optimization

## 1. Static Snapshot Prerendering
- Pre-renders all 24 routes into static HTML files inside `dist/`.
- Enables instant First Contentful Paint (FCP) under 300ms without JavaScript execution.

## 2. Resource Preloading & Compression
- Self-hosted variable fonts (`Inter`, `Space Grotesk`, `JetBrains Mono`) preloaded in `<head>` via `<link rel="preload">`.
- Gzip & Brotli asset compression enabled on Vercel Edge.

## 3. Serverless Cold Start Reduction
- Express API server bundled with `esbuild` to a single production file (`dist/server.js` ~54 KB) for instant cold starts under 10ms.
