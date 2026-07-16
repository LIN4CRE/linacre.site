# CSS Optimization Recommendations

## 1. Font Display Swap

Ensure all @font-face declarations include `font-display: swap`:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var-latin.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap; /* ← Critical: prevents FOIT */
  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6,
                 U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122,
                 U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
}

@font-face {
  font-family: 'Space Grotesk';
  src: url('/fonts/space-grotesk-var-latin.woff2') format('woff2');
  font-weight: 300 700;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'JetBrains Mono';
  src: url('/fonts/jetbrains-mono-var-latin.woff2') format('woff2');
  font-weight: 100 800;
  font-style: normal;
  font-display: swap;
}
```

---

## 2. prefers-reduced-motion

```css
/* Default: allow animations */
@media (prefers-reduced-motion: no-preference) {
  .breathing-logo {
    animation: logo-breathe 3s ease-in-out infinite;
  }
  
  .pulse-divider {
    animation: pulse-glow 2.5s ease-in-out infinite;
  }
  
  .spinning-orbit {
    animation: orbit-spin 5s linear infinite;
  }
  
  .hex-grid-bg {
    animation: hex-drift 20s linear infinite;
  }
}

/* Reduced motion: disable all */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Static alternatives for Identity Hub */
  .pulse-mode { display: none; }
  .static-mode { display: block; }
}
```

---

## 3. Focus Visible Enhancement

```css
/* Ensure focus ring is always visible — especially on dark backgrounds */
:focus-visible {
  outline: 2px solid #ffb454 !important;
  outline-offset: 2px !important;
  border-radius: 2px;
}

/* Custom focus for interactive cards */
.card:focus-visible {
  outline: 2px solid #ffb454;
  outline-offset: 4px;
  box-shadow: 0 0 0 4px rgba(255, 180, 84, 0.2);
}

/* Skip link focus */
.skip-link:focus {
  outline: 3px solid #ffb454;
  outline-offset: 0;
}
```

---

## 4. Tailwind Purge Verification

Verify these are in your Tailwind config:

```javascript
// tailwind.config.js or postcss config
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  // If you have dynamic classes that purge can't detect:
  safelist: [
    // Any class names constructed dynamically
    'text-amber-400',
    'text-cyan-400',
    'text-emerald-400',
    'text-crimson-400',
    'text-slate-400',
  ],
  theme: {
    extend: {
      // Your custom brand colors
      colors: {
        amber: {
          core: '#ffb454',
          glow: '#ff9d2e',
        },
        ink: {
          black: '#0b0e14',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
    },
  },
};
```

---

## 5. Print Stylesheet

```css
@media print {
  /* Hide interactive elements */
  .skip-link,
  .consent-banner,
  nav,
  footer,
  .breadcrumb,
  button,
  .ai-lab,
  .agents-hub,
  .playground-tools {
    display: none !important;
  }
  
  /* Ensure readable text */
  body {
    color: #000;
    background: #fff;
    font-size: 12pt;
    line-height: 1.5;
  }
  
  /* Show URLs for links */
  a[href]::after {
    content: " (" attr(href) ")";
    font-size: 0.8em;
    color: #666;
  }
  
  /* Don't show URL for internal links or anchors */
  a[href^="#"]::after,
  a[href^="/"]::after {
    content: "";
  }
  
  /* Page breaks */
  h2, h3 {
    page-break-after: avoid;
  }
  
  pre, code, blockquote {
    page-break-inside: avoid;
  }
}
```

---

## 6. Responsive Typography Scale

```css
/* Using clamp() for fluid typography */
:root {
  --text-sm: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
  --text-base: clamp(0.875rem, 0.8rem + 0.5vw, 1rem);
  --text-lg: clamp(1rem, 0.9rem + 0.75vw, 1.25rem);
  --text-xl: clamp(1.25rem, 1rem + 1vw, 1.5rem);
  --text-2xl: clamp(1.5rem, 1.2rem + 1.5vw, 2rem);
  --text-3xl: clamp(2rem, 1.5rem + 2.5vw, 3rem);
}

/* Usage */
h1 { font-size: var(--text-3xl); }
h2 { font-size: var(--text-2xl); }
h3 { font-size: var(--text-xl); }
p, li { font-size: var(--text-base); }
small, .text-sm { font-size: var(--text-sm); }
```
