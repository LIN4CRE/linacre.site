# Accessibility & WCAG 2.2 Compliance Recommendations

## 1. Keyboard & Screen Reader Navigation
- `a.skip-link` present at top of body for immediate main content jump.
- Interactive modals (`CommandPalette`, `Header` mobile menu, `Projects` case study dialog) contain `Escape` key handlers and return focus to triggering element.

## 2. Dynamic Text Tables
- Interactive Chart.js charts on `/dashboard` feature an accessible plain-text data table view toggle (`showMeshTable`) for screen readers.

## 3. Form Validation & Labels
- All `<input>` and `<textarea>` elements feature explicit `<label>` tags or `aria-label` attributes.
