---
name: env-secret-sync
description: Syncs local environment secrets and keys securely to Vercel hosting configurations using CLI environments.
---

# Environment Secret Sync Skill

This agent skill automates exporting local `.env` variables directly into Vercel cloud variables to keep production backend functions aligned.

## 📋 Steps & Protocol

### 1. Read Local Secrets
* Read the local `.env` file in the workspace.
* Filter out non-essential keys, keeping only environment secrets:
  * `GEMINI_API_KEY`
  * `OPENAI_API_KEY`
  * `ANTHROPIC_API_KEY`

### 2. Verify Vercel CLI Connectivity
* Ensure the Vercel CLI tool is installed by checking `vercel --version`.
* Verify session login using `vercel whoami`.

### 3. Sync to Cloud
* Loop through the keys and set them in the Vercel project environment (for `production`, `preview`, and `development` configurations):
  ```bash
  vercel env add <key> <value> production,preview,development
  ```
* If the key already exists, overwrite it using the Vercel command structure.

### 4. Redeploy Configuration
* After setting key environments, trigger an updated deployment check to apply variables:
  ```bash
  vercel deploy --prod
  ```
