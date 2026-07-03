---
name: code-quality-auditor
description: Automates code quality verification, running TypeScript compiler checks, linter audits, and security key scans.
---

# Code Quality Auditor Skill

This agent skill automates codebase analysis to check type safety, code styles, and potential security leaks before pushing changes.

## 📋 Steps & Protocol

### 1. Typescript Compilation Audit
* Run the typescript linter command:
  ```bash
  npm run lint
  ```
* If there are compilation issues, output the line number, description, and proposed code edits to resolve the type discrepancies.

### 2. Vite Build Validation
* Trigger a production-equivalent bundler build to verify asset compilation and chunk sizes:
  ```bash
  npm run build
  ```
* Check for Rollup bundling issues or chunk warning thresholds.

### 3. Key & Secrets Leak Check
* Scan files in the workspace (excluding `.gitignore` patterns) for any high-entropy text strings that might represent exposed secrets:
  * Pattern checks for:
    * `GEMINI_API_KEY` assignment.
    * `OPENAI_API_KEY` assignment.
    * `sk-` API keys.
* Ensure `.env` is listed inside `.gitignore` and not tracked in git.
