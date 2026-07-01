# AI Dev Kit — setup (≈15 min)

Drop these files into your repo and you get an AI teammate, automatic reviews,
CI, a quality budget, and self-updating dependencies. Verified current June 2026.

## 1. Add the files
Copy the whole `.github/` folder and `CLAUDE.md` into the root of
`LIN4CRE/linacre.site`. Structure:

```
.github/
  workflows/claude.yml          # @claude teammate (issues & PRs)
  workflows/claude-review.yml   # auto AI review on every PR
  workflows/ci.yml              # build + broken-link check
  workflows/lighthouse.yml      # perf / a11y / SEO budget
  lighthouserc.json             # the budget thresholds
  dependabot.yml                # weekly dependency PRs
CLAUDE.md                       # rules the AI agent follows
```

## 2. Connect Claude (one command)
In your terminal, run Claude Code and let it wire up the GitHub app + secret:

```
claude
/install-github-app
```

That installs the Claude GitHub app and adds your `ANTHROPIC_API_KEY` secret.
Manual path: install https://github.com/apps/claude, then add
`ANTHROPIC_API_KEY` under repo **Settings → Secrets and variables → Actions**.

## 3. Use it
- Comment `@claude implement a dark/light toggle` on an issue → it opens a PR.
- Open any PR → it gets reviewed automatically before you merge.
- CI + Lighthouse run on every PR; Vercel posts a preview URL.
- Dependabot opens weekly update PRs (which then get AI-reviewed too).

## Cost control
- Reviews default to **Sonnet** (cheap). For a hard task, uncomment
  `--model claude-opus-4-8` in `claude.yml`.
- A PR review is ~5–15k tokens; the `@claude` mention gate stops idle runs.

---

## Recommended tools

**Editor / agent**
- **Cursor** (free Hobby tier, Pro $20/mo) — AI-native VS Code fork; best day-to-day flow.
- **Claude Code** (Pro from $17/mo annual) — terminal agent, deepest reasoning for hard problems.
- **GitHub Copilot** — cheapest entry ($10/mo Pro) and **free for verified students & OSS maintainers**.

The common 2026 setup: Cursor for everyday shipping, Claude Code for the hard stuff.
On a budget/student: Copilot Pro (free) + Cursor Hobby, add Claude Code later.

**Everything else is already in your toolkit on the site** (Vercel, Supabase,
Neon, Tailwind, etc.) — this kit just automates the workflow around it.
