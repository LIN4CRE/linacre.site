# robots.txt — Current & Recommended

## Current Configuration (✅ Excellent — No Changes Needed)

```
User-agent: *
Allow: /
Disallow: /api/
Disallow: /dashboard
Disallow: /contact/thanks

User-agent: GPTBot
Allow: /

User-agent: CCBot
Disallow: /

Sitemap: https://www.linacre.site/sitemap.xml
```

### Analysis

| Rule | Purpose | Assessment |
|------|---------|------------|
| `Allow: /` | Allow crawling of all public pages | ✅ Correct |
| `Disallow: /api/` | Block API routes from indexing | ✅ Correct |
| `Disallow: /dashboard` | Block admin dashboard (if exists) | ✅ Good practice |
| `Disallow: /contact/thanks` | Block post-submission thank-you page | ✅ Prevents thin content indexing |
| `GPTBot: Allow: /` | Explicitly allow OpenAI's training crawler | ✅ Forward-thinking for AI visibility |
| `CCBot: Disallow: /` | Block Common Crawl | ⚠️ Reduces dataset presence — intentional choice |

### Notes

- **GPTBot:** Allowing GPTBot is a strategic choice — it means Linacre content may appear in ChatGPT's training data, increasing brand visibility in AI-assisted search. Consider this carefully; the current choice is forward-thinking.
- **CCBot:** Blocking Common Crawl reduces presence in open datasets. If you want maximum visibility, allow it. If you want to limit large-scale crawling, keep it blocked. Current stance is conservative — reasonable for a small site.

---

## No Changes Recommended

The current robots.txt is well-configured for a site of this scale. No modifications needed.
