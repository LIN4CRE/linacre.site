# COST-SAFETY — how this stays $0

Two layers: the workflows are throttled (turn caps, one-run-at-a-time, nightly is
manual), and each account is capped so it *physically can't* bill you. Do the
account switches below — they're the real guarantee. I can't flip them for you;
they live in your provider dashboards.

## Claude — use subscription quota (no API bill)
The Claude workflows authenticate with `CLAUDE_CODE_OAUTH_TOKEN`, which draws
from your **Claude Pro/Max plan**, not paid API credits.
```bash
claude setup-token          # generates the token
gh secret set CLAUDE_CODE_OAUTH_TOKEN
```
Do **not** add `ANTHROPIC_API_KEY` — if both exist, the API key wins and can bill.
No Pro/Max plan? Then the only $0 path is an API account with prepaid credits and
auto-reload OFF (same rule as OpenAI below).

## OpenAI — prepaid only, auto-recharge OFF
OpenAI has no free tier for these models, so the guarantee is: it can only spend
credits you've already bought.
- platform.openai.com → **Settings → Billing**: turn **Auto-recharge OFF**.
- Set a **monthly budget limit** (Limits) to a small number, e.g. $5, with the
  email alert at $1. When credits run out, the workflow just errors — no bill.
- Prefer a **project-scoped** key so this repo can't touch other budgets.

## Gemini — free-tier key, no billing linked
- aistudio.google.com → create an API key in a Google Cloud project that has
  **no billing account attached**. Free tier then rate-limits instead of charging.
- Keep it as the `GEMINI_API_KEY` secret.

## GitHub Actions — free minutes only
- Public repo → Actions minutes are **unlimited and free**. (linacre.site is public.)
- Belt-and-suspenders: github.com/settings/billing → **Spending limit → $0**.
  That blocks any paid Actions/storage overage on private repos too.

## Built-in throttles (already in the workflows)
- Claude runs capped at `--max-turns 12–15`.
- `concurrency` cancels stacked runs so nothing piles up.
- The autonomous nightly agent is **manual-trigger only** by default.
- `@claude` / `/oc` only fire when explicitly mentioned.

Net effect: worst case, a run stops or errors. It never silently rings up a bill.
