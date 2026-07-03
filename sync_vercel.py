# sync_vercel.py
# Script to automate syncing local environment secrets to Vercel configurations.

import os
import subprocess
import sys
import json

def is_vercel_logged_in():
    # Check typical Vercel CLI config paths
    paths = [
        os.path.join(os.environ.get("LOCALAPPDATA", ""), "com.vercel.cli", "auth.json"),
        os.path.join(os.environ.get("APPDATA", ""), "com.vercel.cli", "auth.json"),
        os.path.join(os.path.expanduser("~"), ".config", "vercel", "auth.json")
    ]
    for p in paths:
        if p and os.path.exists(p):
            try:
                with open(p, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    if data.get("token"):
                        return True
            except Exception:
                pass
    return False

def run_command(cmd_args, input_data=None, timeout=None):
    try:
        # Avoid shell=True to allow correct timeout termination on Windows
        stdin_val = None if input_data is not None else subprocess.DEVNULL
        res = subprocess.run(
            cmd_args,
            text=True,
            input=input_data,
            stdin=stdin_val,
            capture_output=True,
            timeout=timeout
        )
        return res.returncode == 0, res.stdout.strip(), res.stderr.strip()
    except subprocess.TimeoutExpired:
        return False, "", "Command timed out"
    except Exception as e:
        return False, "", str(e)

def main():
    # Set encoding to utf-8 if possible
    if hasattr(sys.stdout, 'reconfigure'):
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("===================================================")
    print("[INFO] David Linacre Site Vercel Secrets Sync")
    print("===================================================\n")

    # Resolve executable name for Windows vs Unix
    vercel_bin = "vercel.cmd" if sys.platform == "win32" else "vercel"

    # 1. Verify Vercel CLI connectivity using local configuration files (prevents hanging)
    print("[INFO] Checking Vercel CLI authentication status...")
    if not is_vercel_logged_in():
        print("[WARN] Vercel CLI is not logged in.")
        print("\nPlease run the following command in your terminal to authenticate first:")
        print("  vercel login")
        print("\nOnce logged in, run this script again to sync secrets automatically.")
        sys.exit(0)
    
    # Run vercel whoami as a secondary check, now safe because we know a token exists
    ok, stdout, stderr = run_command([vercel_bin, "whoami"], timeout=5)
    if not ok:
        print("[WARN] Vercel CLI token detected, but session validation failed.")
        if stderr:
            print(f"Details: {stderr}")
        print("\nPlease run the following command to re-authenticate:")
        print("  vercel login")
        sys.exit(0)
        
    print(f"[OK] Logged in as Vercel user: {stdout}")

    # 2. Read local .env file
    env_path = os.path.join(os.path.dirname(__file__), ".env")
    if not os.path.exists(env_path):
        print("[ERROR] Local .env file not found. Run 'npm run dev' first to create it.")
        sys.exit(1)

    secrets = {}
    keys_to_sync = ["GEMINI_API_KEY", "OPENAI_API_KEY", "ANTHROPIC_API_KEY", "CLAUDE_API_KEY", "LITELLM_API_KEY"]
    
    with open(env_path, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                k = k.strip()
                v = v.strip()
                if k in keys_to_sync and v:
                    secrets[k] = v

    if not secrets:
        print("[INFO] No developer API keys found in .env to synchronize.")
        sys.exit(0)

    print(f"[INFO] Found {len(secrets)} secrets in local .env to sync.")

    for k, v in secrets.items():
        print(f"\n[INFO] Syncing {k}...")
        
        # Remove existing key from Vercel to prevent duplication conflicts
        subprocess.run([vercel_bin, "env", "rm", k, "-y"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
        
        # Add the env variable (piping the value to avoid exposing it in shell command histories)
        add_cmd_args = [vercel_bin, "env", "add", k, "production,preview,development"]
        res = subprocess.run(
            add_cmd_args,
            text=True,
            input=v,
            capture_output=True
        )
        
        if res.returncode == 0:
            print(f"[SUCCESS] {k} added successfully to Vercel!")
        else:
            print(f"[FAIL] Failed to sync {k}: {res.stderr.strip() or res.stdout.strip()}")

    print("\n===================================================")
    print("[SUCCESS] Vercel environment secrets sync completed!")
    print("===================================================")

if __name__ == "__main__":
    main()
