# Accessibility Fixes & Checklist

## WCAG 2.2 AA Quick-Reference Checklist

### Perceivable
- [ ] 1.1.1 Non-text Content — All images have alt text
- [ ] 1.2.1 Audio-only/Video-only — N/A (no pre-recorded media)
- [ ] 1.3.1 Info and Relationships — Semantic HTML used
- [ ] 1.3.2 Meaningful Sequence — Content order is logical
- [ ] 1.4.1 Use of Color — Color is not the only way to convey info
- [ ] 1.4.3 Contrast (Minimum) — 4.5:1 text, 3:1 large text
- [ ] 1.4.4 Resize Text — Page works at 200% zoom
- [ ] 1.4.10 Reflow — Works at 320px width without horizontal scroll
- [ ] 1.4.11 Non-Text Contrast — UI components have 3:1 contrast

### Operable
- [ ] 2.1.1 Keyboard — All functionality operable via keyboard
- [ ] 2.1.2 No Keyboard Trap — Focus can always leave an element
- [ ] 2.3.1 Three Flashes — No content flashes >3 times/second
- [ ] 2.4.1 Bypass Blocks — Skip-to-content link present
- [ ] 2.4.3 Focus Order — Tab order is logical
- [ ] 2.4.7 Focus Visible — Focus indicator is always visible
- [ ] 2.5.3 Label in Name — Visible labels match accessible names
- [ ] 2.5.8 Target Size (Minimum) — Touch targets ≥24×24px

### Understandable
- [ ] 3.1.1 Language of Page — `lang="en-GB"` set
- [ ] 3.2.1 On Focus — No context change on focus
- [ ] 3.3.1 Error Identification — Form errors are described in text
- [ ] 3.3.2 Labels or Instructions — All inputs have labels

### Robust
- [ ] 4.1.2 Name, Role, Value — ARIA used correctly where needed
- [ ] 4.1.3 Status Messages — Dynamic content changes announced

---

## prefers-reduced-motion Implementation

### CSS Approach

```css
/* Default: animations enabled */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.breathing-logo {
  animation: pulse 3s ease-in-out infinite;
}

/* Respect user preference */
@media (prefers-reduced-motion: reduce) {
  .breathing-logo,
  .pulse-animation,
  .spinning-orbit {
    animation: none !important;
    transition: none !important;
  }
  
  /* Replace animated GIFs with static fallback */
  .agent-sprite[src*=".gif"] {
    /* Use a static version or first frame */
    /* Implementation: swap src to static PNG */
  }
}
```

### React Hook Approach

```typescript
import { useState, useEffect } from 'react';

function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return prefersReducedMotion;
}

// Usage in Identity Hub:
function IdentityMotion({ mode, speed }) {
  const reduceMotion = usePrefersReducedMotion();
  
  if (reduceMotion) {
    return <StaticSolid variant="clean" />;
  }
  
  return <AnimatedMotion mode={mode} speed={speed} />;
}
```

---

## Contrast Checker Snippet (Identity Hub)

```typescript
function getWCAGContrastRatio(hex1: string, hex2: string): number {
  const getLuminance = (hex: string): number => {
    const rgb = hex.match(/\w\w/g)!.map(c => parseInt(c, 16) / 255);
    const [r, g, b] = rgb.map(c => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
    );
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(hex1);
  const l2 = getLuminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

function ContrastBadge({ foreground, background }: { foreground: string; background: string }) {
  const ratio = getWCAGContrastRatio(foreground, background);
  
  if (ratio >= 4.5) return <span style={{color:'#22c55e'}}>✅ AA Pass ({ratio.toFixed(1)}:1)</span>;
  if (ratio >= 3.0) return <span style={{color:'#f59e0b'}}>⚠️ AA Large Only ({ratio.toFixed(1)}:1)</span>;
  return <span style={{color:'#ef4444'}}>❌ Fail ({ratio.toFixed(1)}:1)</span>;
}
```

---

## Skip-to-Content Link Template

```html
<!-- Place as first focusable element in <body> -->
<a href="#main-content" class="skip-link">
  Skip to content
</a>
```

```css
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  background: #ffb454; /* Amber brand color */
  color: #0b0e14;
  padding: 8px 16px;
  border-radius: 4px;
  z-index: 10000;
  font-family: 'Space Grotesk', sans-serif;
  font-weight: 600;
  transition: top 0.2s;
}

.skip-link:focus {
  top: 16px;
}
```

---

## Consent Banner Accessibility

```html
<!-- Ensure banner has role and is not a keyboard trap -->
<div 
  role="region" 
  aria-label="Cookie consent" 
  aria-live="polite"
  id="consent-banner"
>
  <p>We use essential browser storage for your theme and workspace state...</p>
  <button type="button" id="accept-all">Accept all</button>
  <button type="button" id="essential-only">Essential only</button>
  <button type="button" id="reject-non-essential">Reject non-essential</button>
</div>
```

```typescript
// Focus trap prevention — when banner is dismissed, focus should return to the element
// that was focused before the banner appeared
const banner = document.getElementById('consent-banner');
const previousFocus = document.activeElement;

function dismissBanner() {
  banner?.remove();
  if (previousFocus instanceof HTMLElement) {
    previousFocus.focus();
  }
}
```

---

## Icon/Decorative SVG Accessibility

```html
<!-- Decorative SVGs: -->
<svg aria-hidden="true" focusable="false">...</svg>

<!-- Meaningful SVGs (like the DL monogram): -->
<svg role="img" aria-label="David Linacre monogram logo">...</svg>

<!-- Animated Pokemon sprites on Agents page: -->
<img 
  src="https://play.pokemonshowdown.com/sprites/ani/mewtwo.gif" 
  alt="Mewtwo sprite representing the Agent Architect unit"
  width="96"
  height="96"
/>
```
