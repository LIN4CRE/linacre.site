---
name: git-auto-commit
description: Automates staged code analysis, conventional semantic commits, conflict resolution, and pushing to git remote repositories.
---

# Git Auto Commit & Workspace Sync Skill

This agent skill automates staged changes review, commits them using conventional commit specifications, and pushes changes to the remote branch.

## 📋 Steps & Protocol

### 1. Pre-commit Analysis
* Execute `git status` to determine which files are modified and staged.
* Analyze the diff of staged files using `git diff --cached` to identify key structural additions, bugfixes, or refactors.

### 2. Semantic Commit Generation
* Compose a conventional commit message following this format:
  * `feat: ...` for new features or additions.
  * `fix: ...` for resolving bugs, exceptions, or errors.
  * `refactor: ...` for code structure changes that don't add features.
  * `docs: ...` for updating markdown files, sitemaps, or inline comments.
  * `chore: ...` for updating dependencies or build scripts.
* Write a concise body if the change contains non-obvious details.

### 3. Verification & Safety Run
* Ensure that no credentials or secret keys are staged. Check staged diffs for:
  * `sk-` (OpenAI/Anthropic keys)
  * `AQ.Ab` (Gemini keys)
  * Raw client passwords or database secrets.
* If any secret is found, stop immediately and ask the user to run `git reset` on the file containing the secret.

### 4. Push Execution
* Commit the changes:
  ```bash
  git commit -m "<semantic-message>"
  ```
* Push the staged commits to the active tracking branch (e.g. `main`):
  ```bash
  git push origin <branch-name>
  ```
