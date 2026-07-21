# Audit Assumptions & Scope Boundaries

## Assumptions
1. **Target Market:** General developer portal, web app, and AI product brand site (`www.linacre.site`).
2. **Product Stack:** React 19 SPA, Vite 6, Express 4 server, Vercel Edge Serverless functions.
3. **Environment:** Local development on Windows OS with PowerShell, Node.js v20+, and Git.

## Unverified / Public Boundaries
- Private production traffic analytics (Google Analytics / Vercel Web Analytics) are **unable to verify from public sources**.
- Server internal CPU load logs on live edge functions are **unable to verify from public sources**.
- Third-party API rate limits on Gemini/OpenAI external endpoints are **unable to verify from public sources**.
