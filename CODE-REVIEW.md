# Code review — linacre.site

Reviewed: `index.html` (2,419 lines), `sw.js`, `manifest.json`, `404.html`, repo structure. All findings below were verified programmatically (grep, `node --check`, logic simulation) — not guessed.

---

## 1. Overview

The codebase honours its own rules well: zero frameworks, a single self-contained `index.html`, strict-mode vanilla JS in one IIFE, and genuine accessibility effort (`prefers-reduced-motion` handled in both CSS and JS, focus trap on the modal, `aria-pressed` chips, skip link, no-JS fallback for the terminal). All 60 external links carry `target="_blank" rel="noopener"`. No duplicate IDs. JS parses clean.

The issues found are concentrated in four places: **a broken Roadmap section**, **a service worker that permanently serves stale deploys**, **a provider-detection bug that misleads every first-time Lab visitor**, and **an XSS vector in the Lab's markdown link renderer**.

---

## 2. Key improvement areas

### 🔴 P0 — Bugs

**B1. Roadmap section markup is broken.** There is no `<section id="roadmap">` anywhere in the file — the Roadmap content (line ~1163) is a bare `<div class="wrap">` followed by an orphan `</section>` at line 1179. Consequences: the nav and mobile-nav `#roadmap` links are dead anchors, scroll-spy never highlights Roadmap, the skip-link contract of one-section-per-nav-item breaks, and the HTML is invalid (fails the site's own best-practices bar).

**B2. Service worker serves stale content forever.** `sw.js` uses cache-first for *every* request, precaches `index.html`, and the cache name is still `linacre-v1` — while the changelog says the site is on v2. Any returning visitor gets the cached HTML for life; Vercel deploys never reach them until the cache name is manually bumped. The fetch handler also intercepts cross-origin POSTs (the Lab's streaming API calls), which it should never touch.

**B3. Fresh visitors are told Ollama is ready.** In `getBestProvider()`, the Ollama branch is `cfg.endpoint || DEFAULTS.ollama.endpoint` — always truthy. Simulated with empty storage: result is `ollama`. So on first visit the config panel never auto-opens (that code path is unreachable), the status bar claims `ollama · llama3.2 · http://localhost:11434`, and sending a message throws a connection error at `localhost:11434`. Same bug duplicated in `updateAllStatuses()` (`cfg.endpoint || true`).

### 🟠 P1 — Security

**S1. `javascript:` URL injection in Lab markdown links.** `inlineMarkdown()` escapes HTML but then builds `<a href="$2">` from the raw URL. A model response (or replayed chat history from localStorage) containing `[click](javascript:...)` renders a live XSS link. Whitelist `https?:`.

**S2. API keys in `localStorage`.** Disclosed in the UI ("keys stored in browser only") which is honest, but any future XSS (see S1) exfiltrates them. `sessionStorage` or an opt-in "remember key" checkbox narrows the window. Worth a line in the Lab UI either way.

### 🟡 P2 — Maintainability

**M1. The "My Stack" chip is patched on top of the filter, not part of it.** The stack chip has *two* click handlers (the generic chip handler plus a special one), works only because of handler-order side effects on `aria-pressed`, duplicates card-filtering logic, and silently drops the stack filter when the user types in search. `var _origApply = apply;` is dead code. One `apply()` that understands `stack` as a category removes ~40 lines and the fragility.

**M2. Duplicated `fieldMap` literal** in `populateFields()` and the save handler — hoist to module scope next to `LS`/`DEFAULTS`.

**M3. Repo hygiene.** Two junk directories are committed: `ai-dev-kit/ai-dev-kit/` (a stale copy of CI configs + CLAUDE.md) and an empty `linacre-site-repo/`. Both should be deleted; they confuse tooling and future AI-agent sessions.

### 🟢 P3 — Performance / SEO / a11y polish

- **P1.** Reading-progress bar animates `width` (layout+paint every scroll). Use `transform: scaleX()` (compositor-only) and rAF-throttle the handler.
- **P2.** `manifest.json` ships one 32×32 icon; installable-PWA criteria want 192px & 512px (can stay inline SVG data-URIs). No `og:image`/`twitter:image`, no `robots.txt`/`sitemap.xml` — cheap SEO wins.
- **P3.** Provider tabs use `role="tablist"` but lack arrow-key navigation and roving tabindex (ARIA APG pattern) — keyboard users must Tab through all five tabs.
- **P4.** Mobile nav: Esc doesn't close it and body scroll isn't locked while open.

---

## 3. Refactored code

### Fix B1 — restore the Roadmap section

```html
  <!-- ROADMAP -->
  <section id="roadmap">
    <div class="wrap">
      ...existing sec-head + .road content unchanged...
    </div>
  </section>
```

### Fix B2 — sw.js: network-first for HTML, cache-first for the rest, GET/same-origin only

```js
var CACHE = "linacre-v3"; // bump on every release
var URLS = [".", "index.html", "manifest.json", "404.html"];

self.addEventListener("install", function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(URLS); }));
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(caches.keys().then(function (keys) {
    return Promise.all(keys.filter(function (k) { return k !== CACHE; })
      .map(function (k) { return caches.delete(k); }));
  }).then(function () { return self.clients.claim(); }));
});

self.addEventListener("fetch", function (e) {
  var url = new URL(e.request.url);
  // Never touch API calls, POSTs, or third-party requests (Lab streaming!)
  if (e.request.method !== "GET" || url.origin !== location.origin) return;

  if (e.request.mode === "navigate") {
    // Network-first: fresh deploys win, cache is the offline fallback
    e.respondWith(
      fetch(e.request).then(function (r) {
        var copy = r.clone();
        caches.open(CACHE).then(function (c) { c.put(e.request, copy); });
        return r;
      }).catch(function () { return caches.match(e.request); })
    );
    return;
  }
  e.respondWith(caches.match(e.request).then(function (r) { return r || fetch(e.request); }));
});
```

### Fix B3 — Ollama counts as configured only if the user saved an endpoint

```js
function getBestProvider() {
  var order = ["gemini", "openai", "ollama", "litellm", "claude"];
  for (var i = 0; i < order.length; i++) {
    var p = order[i], cfg = getProvConfig(p);
    if ((p === "gemini" || p === "openai") && cfg.key) return p;
    if ((p === "ollama" || p === "litellm" || p === "claude") && cfg.endpoint) return p;
  }
  return null; // now reachable → config auto-opens for new visitors
}
```
(Apply the same `cfg.endpoint` test in `updateAllStatuses()` — delete `|| true`.)

### Fix S1 — sanitize link URLs in `inlineMarkdown`

```js
s = s.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function (_, text, url) {
  return /^https?:\/\//i.test(url.trim())
    ? '<a href="' + url.trim() + '" target="_blank" rel="noopener">' + text + "</a>"
    : text; // drop javascript:, data:, vbscript:, relative junk
});
```

### Fix M1 — make `stack` a first-class category (replaces both patches)

```js
function getStack() {
  try { return JSON.parse(localStorage.getItem("linacre_stack_v1") || "[]"); }
  catch (e) { return []; }
}

function apply() {
  var term = (q.value || "").trim().toLowerCase();
  var stack = activeCat === "stack" ? getStack() : null;
  var shown = 0;
  cards.forEach(function (card) {
    var catOk = activeCat === "all" ||
      (stack ? stack.indexOf(card.dataset.title) !== -1 : card.dataset.cat === activeCat);
    var textOk = !term ||
      (card.dataset.name + " " + card.textContent).toLowerCase().indexOf(term) !== -1;
    var show = catOk && textOk;
    card.style.display = show ? "" : "none";
    if (show) shown++;
  });
  noResults.style.display = shown ? "none" : "block";
  countEl.textContent = "// showing " + shown + " of " + total + " tools" +
    (activeCat === "all" ? "" : " in " + (activeCat === "stack" ? "my stack" : activeCat));
}
// Then: delete the entire stackChip special-case handler, _origApply, and _stackFilter.
// Search + stack now compose instead of clobbering each other.
```

### Fix P1 — compositor-friendly progress bar

```css
#readingProg { width: 100%; transform: scaleX(0); transform-origin: 0 50%; transition: none; }
```
```js
var ticking = false;
window.addEventListener("scroll", function () {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(function () {
    var d = document.documentElement;
    var max = d.scrollHeight - d.clientHeight;
    prog.style.transform = "scaleX(" + (max > 0 ? d.scrollTop / max : 0) + ")";
    ticking = false;
  });
}, { passive: true });
```

### Fix P3 — arrow keys on the provider tablist

```js
var tablist = document.querySelector(".prov-tabs");
tablist.addEventListener("keydown", function (e) {
  var i = provTabs.indexOf(document.activeElement);
  if (i === -1 || (e.key !== "ArrowRight" && e.key !== "ArrowLeft")) return;
  e.preventDefault();
  var next = provTabs[(i + (e.key === "ArrowRight" ? 1 : -1) + provTabs.length) % provTabs.length];
  next.focus(); switchTab(next.dataset.prov);
});
// Plus roving tabindex: active tab tabindex="0", others "-1", updated in switchTab().
```

---

## 4. Implementation guidance

Ship as four small PRs, in priority order, each passing the CLAUDE.md checklist (links, filter + chips regression check, minimal diff):

1. **PR 1 — bugs (B1, B2, B3).** Wrap Roadmap in `<section id="roadmap">`; replace `sw.js` wholesale and bump `CACHE`; fix the two Ollama conditionals. Verify: `#roadmap` anchor scrolls, scroll-spy highlights it, fresh-profile visit auto-opens the Lab config, DevTools → Application → SW shows the new worker taking over, and a hard-deploy is picked up on next visit.
2. **PR 2 — security (S1).** Patch `inlineMarkdown`. Test in the Lab with a saved history entry containing `[x](javascript:alert(1))` — it must render as plain text.
3. **PR 3 — refactor (M1, M2, M3).** New `apply()`, delete the stack-chip patch block and dead code, hoist `fieldMap`, `git rm -r ai-dev-kit linacre-site-repo`. Regression-test: bookmark two tools → stack chip shows 2 → type in search while stack active → results filter *within* the stack.
4. **PR 4 — polish (P1–P4).** Progress bar transform, 192/512 manifest icons, `og:image` + `robots.txt` + `sitemap.xml`, tablist keys, Esc-closes-mobile-nav. Re-run Lighthouse; expect best-practices/SEO to move up, not down.

Estimated total diff: ~150 lines changed, net negative after the M1/M3 deletions.
