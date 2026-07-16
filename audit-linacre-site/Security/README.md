# Security Hardening Notes

## Current Security Posture: 90/100 ⭐

Linacre.site has an exceptionally strong security configuration. This section documents the baseline and minor hardening opportunities.

---

## Security Header Reference (Current)

```nginx
# Currently deployed — exemplary configuration
Content-Security-Policy: default-src 'self'; 
  script-src 'self'; 
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
  img-src 'self' data: https://play.pokemonshowdown.com https://*.githubusercontent.com https://www.linacre.site; 
  font-src 'self' https://fonts.gstatic.com data:; 
  connect-src 'self' https://generativelanguage.googleapis.com https://*.googleapis.com https://api.openai.com https://api.anthropic.com https://vercel.live wss:; 
  worker-src 'self' blob:; 
  frame-src 'self'; 
  object-src 'none'; 
  base-uri 'self'; 
  form-action 'self'; 
  frame-ancestors 'none'; 
  upgrade-insecure-requests

Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=(), magnetometer=(), gyroscope=(), interest-cohort=()
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Resource-Policy: same-origin
```

---

## CSP Hardening: Removing `unsafe-inline`

### Current issue
```
style-src 'self' 'unsafe-inline' https://fonts.googleapis.com
```

`'unsafe-inline'` allows inline `<style>` blocks and `style=` attributes, weakening CSP against style injection attacks.

### If Tailwind generates all styles via static `.css` files:

**Option A: Remove entirely**
```
style-src 'self' https://fonts.googleapis.com
```

**Option B: Use nonces (if inline styles are needed for dynamic components)**
```
style-src 'self' 'nonce-{RANDOM}' https://fonts.googleapis.com
```

Server must inject a unique nonce per request:
```html
<style nonce="{RANDOM}">/* dynamic styles */</style>
```

**Option C: Use hashes (if inline styles are static)**
```
style-src 'self' 'sha256-{HASH}' https://fonts.googleapis.com
```

Generate hash:
```bash
echo -n "/* exact inline style content */" | openssl dgst -sha256 -binary | base64
```

---

## CORS: Restricting Access-Control-Allow-Origin

### Current:
```
Access-Control-Allow-Origin: *
```

This allows any website to read linacre.site responses via `fetch()`. If CORS is needed for specific API routes:

```json
// vercel.json — scope CORS to /api/* only
{
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Access-Control-Allow-Origin", "value": "https://www.linacre.site" }
      ]
    }
  ]
}
```

Or remove entirely from non-API routes.

---

## security.txt

Create at `public/.well-known/security.txt`:

```
Contact: mailto:david@linacre.site
Expires: 2027-07-16T00:00:00.000Z
Preferred-Languages: en
Canonical: https://www.linacre.site/.well-known/security.txt
Policy: https://www.linacre.site/privacy
Encryption: https://www.linacre.site/pgp-key.txt (if applicable)
Acknowledgments: https://www.linacre.site/security-acknowledgments (if applicable)
```

---

## XSS Prevention Checklist

- [x] CSP with `script-src 'self'` (no unsafe-inline for scripts)
- [x] `X-Content-Type-Options: nosniff`
- [ ] Input sanitization on contact form — **verify server-side**
- [ ] Output encoding in React (React handles this by default via JSX)
- [ ] API keys handled in memory only, never in localStorage — ✅ confirmed in privacy policy
- [ ] `httpOnly` cookies if any auth cookies exist — **verify if applicable**

---

## CSRF Protection

- Contact form uses POST — **verify CSRF token implementation on server**
- Honeypot field ("Leave this field blank") is a good anti-bot measure but not CSRF protection
- Recommended: Add CSRF token to the contact form via meta tag or cookie, verified server-side

```html
<!-- In <head> -->
<meta name="csrf-token" content="{{csrf_token}}" />

<!-- In form -->
<input type="hidden" name="_csrf" value="{{csrf_token}}" />
```

---

## Subresource Integrity (SRI)

No third-party scripts are loaded (all scripts are `'self'`), so SRI is not needed. This is a strength.

If third-party scripts are ever added:
```html
<script src="https://example.com/lib.js" 
  integrity="sha384-{HASH}" 
  crossorigin="anonymous">
</script>
```

---

## Recommended Security Audit Checklist

- [ ] Run `npm audit` on dependencies monthly
- [ ] Check Vercel deployment logs for unusual access patterns
- [ ] Verify Express routes have rate limiting (especially `/api/contact`, `/api/chat`)
- [ ] Test contact form for injection (server-side validation)
- [ ] Rotate any hardcoded API keys (ensure none in git history)
- [ ] Enable Vercel's WAF (Web Application Firewall) if available
- [ ] Set up CSP violation reporting: add `report-uri /api/csp-report` or `report-to` directive
