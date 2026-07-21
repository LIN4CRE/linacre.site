# Cyber Security & Defensive Hardening

## 1. Content Security Policy (CSP)
- Security headers configured in `vercel.json`:
  - `default-src 'self'`
  - `script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net`
  - `frame-ancestors 'none'`
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

## 2. Master Session Security
- Authentication utilizes HMAC-SHA256 signature verification with `crypto.timingSafeEqual` string comparison to prevent timing side-channel exploits.
- HttpOnly, Secure, SameSite=Strict cookies enforced.
