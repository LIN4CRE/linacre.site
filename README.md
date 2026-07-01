# linacre.site

David Linacre's personal site — a terminal-styled intro plus a searchable
directory of free developer tools. Zero frameworks, single `index.html`, on Vercel.

![CI](https://github.com/LIN4CRE/linacre.site/actions/workflows/ci.yml/badge.svg)
![Lighthouse](https://github.com/LIN4CRE/linacre.site/actions/workflows/lighthouse.yml/badge.svg)
![AI review](https://github.com/LIN4CRE/linacre.site/actions/workflows/claude-review.yml/badge.svg)

## What's automated
- **@claude** on any issue/PR → writes code and opens a PR (Anthropic)
- **/oc** (or /opencode) on any issue/PR → same, powered by your **OpenAI** key
- Every PR → **two** AI reviews: Claude (Sonnet) + Gemini (whole-repo context)
- **Nightly agent** (Mondays) → audits the site and opens one improvement PR (OpenAI)
- CI (broken-link check) + Lighthouse budget on every PR
- Weekly Dependabot updates (also auto-reviewed)
- Vercel auto-deploys `main` and posts a preview URL per PR

The opencode workflows run on the built-in `GITHUB_TOKEN` (`use_github_token: true`),
so there's **no extra app to install** — just add the secrets below. Model IDs drift;
if one errors, run `opencode models` and update the `model:` line.

## Add your API keys (values never go in git, and never run up bills)

See **COST-SAFETY.md** — everything is set to draw from subscription quota / free
tiers, and each account is capped so it can't bill you.

**GitHub Actions secrets** — each prompts for the value so it stays out of shell history:
```bash
claude setup-token                         # Claude Pro/Max quota (no API bill)
gh secret set CLAUDE_CODE_OAUTH_TOKEN
gh secret set OPENAI_API_KEY               # prepaid credits, auto-recharge OFF
gh secret set GEMINI_API_KEY               # free-tier key, no billing linked
```
Or paste them under **Settings → Secrets and variables → Actions**.
Do **not** add `ANTHROPIC_API_KEY` — the OAuth token keeps Claude on your plan.

**Vercel** (only if your app code calls these at runtime):
```bash
vercel env add OPENAI_API_KEY
vercel env add GEMINI_API_KEY
```

**Local dev:** `cp .env.example .env` and fill it in. `.env` is gitignored.

## First-time Claude wiring
Install the GitHub app once, then use the subscription token (no API bill):
```bash
claude
/install-github-app          # installs the app
claude setup-token           # then store as CLAUDE_CODE_OAUTH_TOKEN (see above)
```

See `SETUP.md` for the full walkthrough and tool recommendations.
