# HTML Patches & Improvements

## 1. Skip-to-Content Link

Add as first child of `<body>`:

```html
<a href="#main-content" class="skip-link">
  Skip to content
</a>
```

---

## 2. Main Content Landmark

Ensure the main content area has:

```html
<main id="main-content">
  <!-- page content -->
</main>
```

---

## 3. Blog Post Article Structure

```html
<article itemscope itemtype="https://schema.org/Article">
  <header>
    <h1 itemprop="headline">High-Throughput Go Concurrency Patterns</h1>
    <div class="post-meta">
      <time datetime="2026-06-15" itemprop="datePublished">Jun 15, 2026</time>
      <span>·</span>
      <span itemprop="author" itemscope itemtype="https://schema.org/Person">
        <a href="/about" itemprop="url">
          <span itemprop="name">David Linacre</span>
        </a>
      </span>
      <span>·</span>
      <span>6 min read</span>
    </div>
    <div class="post-tags" itemprop="keywords">
      <a href="/blog?tag=go" class="tag">Go</a>
      <a href="/blog?tag=concurrency" class="tag">Concurrency</a>
      <a href="/blog?tag=smtp" class="tag">SMTP</a>
      <a href="/blog?tag=docker" class="tag">Docker</a>
    </div>
  </header>

  <div itemprop="articleBody">
    <!-- Post content -->
  </div>

  <footer>
    <!-- Author bio -->
    <!-- Related posts -->
  </footer>
</article>
```

---

## 4. Contact Form Accessibility Enhancement

```html
<form action="/api/contact" method="POST">
  <!-- Honeypot — visually hidden but present for bots -->
  <div style="position: absolute; left: -9999px;" aria-hidden="true">
    <label for="website">Leave this field blank</label>
    <input type="text" id="website" name="website" tabindex="-1" autocomplete="off" />
  </div>

  <div class="form-group">
    <label for="name">Name <span aria-hidden="true">*</span></label>
    <input 
      type="text" 
      id="name" 
      name="name" 
      required 
      aria-required="true"
      autocomplete="name"
    />
  </div>

  <div class="form-group">
    <label for="email">Work email <span aria-hidden="true">*</span></label>
    <input 
      type="email" 
      id="email" 
      name="email" 
      required 
      aria-required="true"
      autocomplete="email"
      aria-describedby="email-hint"
    />
    <span id="email-hint" class="hint">We'll only use this to reply</span>
  </div>

  <div class="form-group">
    <label for="company">Company (optional)</label>
    <input 
      type="text" 
      id="company" 
      name="company"
      autocomplete="organization"
    />
  </div>

  <div class="form-group">
    <label for="budget">Budget</label>
    <select id="budget" name="budget">
      <option value="">Select…</option>
      <option value="under-2k">Under £2k</option>
      <option value="2-6k">£2–6k</option>
      <option value="6-15k">£6–15k</option>
      <option value="15k-plus">£15k+</option>
      <option value="retainer">Retainer / Not sure</option>
      <option value="researching">Just browsing / researching</option>
    </select>
  </div>

  <div class="form-group">
    <label for="timeline">Timeline</label>
    <select id="timeline" name="timeline">
      <option value="">Select…</option>
      <option value="asap">ASAP</option>
      <option value="2-4-weeks">2–4 weeks</option>
      <option value="1-3-months">1–3 months</option>
      <option value="exploring">Exploring</option>
    </select>
  </div>

  <div class="form-group">
    <label for="message">Project details <span aria-hidden="true">*</span></label>
    <textarea 
      id="message" 
      name="message" 
      required 
      aria-required="true"
      rows="5"
    ></textarea>
  </div>

  <div class="form-group checkbox-group">
    <input 
      type="checkbox" 
      id="privacy-consent" 
      name="privacy_consent" 
      required 
      aria-required="true"
    />
    <label for="privacy-consent">
      I agree to the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. *
    </label>
  </div>

  <button type="submit" class="btn-primary">
    Send message →
  </button>

  <div class="form-footer">
    <p>🔒 HTTPS encrypted · UK GDPR compliant · NDA-friendly · Reply within 12h</p>
  </div>
</form>
```

---

## 5. Footer Link Audit

Ensure footer includes:
```html
<footer>
  <nav aria-label="Footer navigation">
    <ul>
      <li><a href="/">Home</a></li>
      <li><a href="/work">Work with me</a></li>
      <li><a href="/projects">Projects</a></li>
      <li><a href="/blog">Blog</a></li>
      <li><a href="/contact">Contact</a></li>
      <li><a href="/about">About</a></li>
      <li><a href="/privacy">Privacy</a></li>
      <li><a href="/terms">Terms</a></li>
      <li><a href="/cookie-policy">Cookies</a></li>
      <li><a href="/accessibility">Accessibility</a></li>
    </ul>
  </nav>
  
  <div class="footer-social">
    <a href="https://github.com/LIN4CRE" rel="noopener noreferrer" aria-label="GitHub">
      GitHub
    </a>
    <a href="https://linkedin.com/in/david-linacre" rel="noopener noreferrer" aria-label="LinkedIn">
      LinkedIn
    </a>
  </div>
  
  <p class="footer-copy">© 2026 David Linacre. Built in West Yorkshire, UK.</p>
</footer>
```

---

## 6. Newsletter Signup Component

```html
<section class="newsletter-signup" aria-labelledby="newsletter-heading">
  <h2 id="newsletter-heading">Get new engineering notes</h2>
  <p>One email when I publish something new. No spam, unsubscribe any time.</p>
  <form action="/api/subscribe" method="POST">
    <label for="sub-email" class="sr-only">Email address</label>
    <input 
      type="email" 
      id="sub-email" 
      name="email" 
      placeholder="you@example.com" 
      required
      aria-required="true"
    />
    <button type="submit">Subscribe →</button>
  </form>
  <p class="text-xs text-slate-500">
    See <a href="/privacy">privacy policy</a> for how we handle your data.
  </p>
</section>
```
