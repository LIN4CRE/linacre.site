# JavaScript Optimization Notes

## 1. React Code Splitting (React.lazy + Suspense)

```tsx
// src/App.tsx or router configuration
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Eager load critical pages
import Home from './pages/Home';
import Work from './pages/Work';
import Contact from './pages/Contact';

// Lazy load heavier pages
const Identity = lazy(() => import('./pages/Identity'));
const Agents = lazy(() => import('./pages/Agents'));
const Lab = lazy(() => import('./pages/Lab'));
const Playground = lazy(() => import('./pages/Playground'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const Projects = lazy(() => import('./pages/Projects'));
const About = lazy(() => import('./pages/About'));
const Toolkit = lazy(() => import('./pages/Toolkit'));
const Learn = lazy(() => import('./pages/Learn'));

function PageSkeleton() {
  return (
    <div 
      className="min-h-[60vh] flex items-center justify-center"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-2 border-amber-400/30 border-t-amber-400 rounded-full animate-spin" />
        <span className="text-amber-400/60 font-mono text-sm">Loading...</span>
      </div>
    </div>
  );
}

function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/work" element={<Work />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/identity" element={<Identity />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/lab" element={<Lab />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/about" element={<About />} />
        <Route path="/toolkit" element={<Toolkit />} />
        <Route path="/learn" element={<Learn />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 2. Plausible Analytics Integration

```html
<!-- Privacy-first analytics — no cookies, <1KB, GDPR compliant -->
<script 
  defer 
  data-domain="linacre.site" 
  src="https://plausible.io/js/script.outbound-links.file-downloads.js"
></script>
```

Or if proxying through Vercel for full privacy:

```javascript
// In vercel.json rewrites:
{
  "rewrites": [
    {
      "source": "/js/analytics.js",
      "destination": "https://plausible.io/js/script.outbound-links.file-downloads.js"
    },
    {
      "source": "/api/event",
      "destination": "https://plausible.io/api/event"
    }
  ]
}
```

Then in HTML:
```html
<script defer data-domain="linacre.site" src="/js/analytics.js"></script>
```

---

## 3. prefers-reduced-motion Hook

```typescript
// src/hooks/usePrefersReducedMotion.ts
import { useState, useEffect } from 'react';

export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(
    () => typeof window !== 'undefined' 
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches 
      : false
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}

// Usage:
function IdentityMotions() {
  const reduceMotion = usePrefersReducedMotion();
  
  if (reduceMotion) {
    return <StaticSolid />;
  }
  
  return (
    <div className="motion-controls">
      <button onClick={() => setMode('pulse')}>Pulsing D-Mode</button>
      <button onClick={() => setMode('orbit')}>Spinning Orbit</button>
      <button onClick={() => setMode('static')}>Static Solid</button>
    </div>
  );
}
```

---

## 4. Dynamic OG Image Generation (Vercel OG)

```typescript
// api/og.tsx (Vercel Edge Function)
import { ImageResponse } from '@vercel/og';

export const config = {
  runtime: 'edge',
};

export default async function handler(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') || 'David Linacre';
  const type = searchParams.get('type') || 'website';

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0b0e14',
          padding: 64,
          fontFamily: '"Space Grotesk"',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ color: '#ffb454', fontSize: 24, fontFamily: '"JetBrains Mono"' }}>
            {type === 'article' ? 'Engineering Notes' : 'linacre.site'}
          </div>
          <div style={{ color: '#ffb454', fontSize: 48, fontWeight: 700, maxWidth: 900 }}>
            {title}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ color: '#ffb454', fontSize: 28, fontFamily: '"JetBrains Mono"' }}>
            {'>'} linacre.site
          </div>
          <div style={{ color: '#94a3b8', fontSize: 20 }}>
            David Linacre — Full-stack & AI Engineer
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

Usage for blog posts:
```html
<meta property="og:image" content="https://www.linacre.site/api/og?title=Go+Concurrency+Patterns&type=article" />
```

---

## 5. Learn Page Progress Persistence

```typescript
// hooks/useLearnProgress.ts
import { useState, useEffect } from 'react';

const STORAGE_KEY = 'linacre_learn_progress';

interface LearnProgress {
  completedSteps: number[];
  lastUpdated: string;
}

export function useLearnProgress() {
  const [progress, setProgress] = useState<LearnProgress>({ completedSteps: [], lastUpdated: '' });

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProgress(JSON.parse(stored));
    }
  }, []);

  const toggleStep = (step: number) => {
    setProgress(prev => {
      const completed = prev.completedSteps.includes(step)
        ? prev.completedSteps.filter(s => s !== step)
        : [...prev.completedSteps, step];
      
      const newProgress = { completedSteps: completed, lastUpdated: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
      return newProgress;
    });
  };

  return { progress, toggleStep };
}
```

---

## 6. Newsletter Form Handler

```typescript
// components/NewsletterSignup.tsx
import { useState } from 'react';

export function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) throw new Error('Subscription failed');
      
      setStatus('success');
      setMessage('Check your inbox to confirm your subscription.');
      setEmail('');
    } catch {
      setStatus('error');
      setMessage('Something went wrong. Please try again or email directly.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="newsletter-form">
      <label htmlFor="newsletter-email" className="sr-only">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        required
        disabled={status === 'loading'}
        aria-describedby="newsletter-status"
      />
      <button type="submit" disabled={status === 'loading'}>
        {status === 'loading' ? 'Subscribing...' : 'Subscribe →'}
      </button>
      {message && (
        <p 
          id="newsletter-status"
          role="status"
          aria-live="polite"
          className={status === 'error' ? 'text-red-400' : 'text-green-400'}
        >
          {message}
        </p>
      )}
    </form>
  );
}
```
