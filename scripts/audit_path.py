# audit_path.py
# Audits Windows User and System PATH environment variables to detect broken paths, duplicates,
# and missing developer tooling directories, outputting a safe remediation script.

import os
import sys

# Try to import winreg (only works on Windows)
try:
    import winreg
except ImportError:
    print("Error: This script must be run on Windows to access the registry.")
    sys.exit(1)

def read_registry_env(key_path, value_name, hive=winreg.HKEY_CURRENT_USER):
    try:
        key = winreg.OpenKey(hive, key_path, 0, winreg.KEY_READ)
        value, val_type = winreg.QueryValueEx(key, value_name)
        winreg.CloseKey(key)
        return value, val_type
    except FileNotFoundError:
        return None, None

def get_path_elements(path_str):
    if not path_str:
        return []
    return [p.strip() for p in path_str.split(';') if p.strip()]

def audit_path_list(path_list, name):
    print(f"\n=== Auditing {name} PATH ===")
    
    seen = set()
    duplicates = []
    broken = []
    valid = []
    
    for path in path_list:
        # Expand environment variables like %USERPROFILE% or %SystemRoot%
        expanded_path = os.path.expandvars(path)
        
        # Check duplicate
        norm_path = os.path.normpath(expanded_path).lower()
        if norm_path in seen:
            duplicates.append(path)
        else:
            seen.add(norm_path)
            # Check if directory exists
            if not os.path.exists(expanded_path):
                broken.append(path)
            else:
                valid.append(path)
                
    print(f"Total entries: {len(path_list)}")
    print(f"Valid entries: {len(valid)}")
    
    if duplicates:
        print(f"[WARN] Duplicates ({len(duplicates)}):")
        for d in duplicates:
            print(f"  - {d}")
    else:
        print("[OK] No duplicate entries found.")
        
    if broken:
        print(f"[ERROR] Broken/Non-existent directories ({len(broken)}):")
        for b in broken:
            print(f"  - {b}")
    else:
        print("[OK] No broken entries found.")
        
    return valid, duplicates, broken

def check_missing_critical_tools(combined_paths):
    print("\n=== Checking Critical Developer Tooling ===")
    
    critical_tools = {
        "Git": ["Git\\cmd"],
        "Node.js": ["nodejs"],
        "Python": ["Python\\Python3", "Python\\Launcher"],
        "Android SDK Tools": ["Android\\Sdk\\platform-tools", "Android\\Sdk\\emulator"],
        "Ollama": ["Ollama"],
        "VS Code": ["Microsoft VS Code\\bin"]
    }
    
    combined_lower = [os.path.normpath(os.path.expandvars(p)).lower() for p in combined_paths]
    
    for tool, patterns in critical_tools.items():
        found = False
        for p in combined_lower:
            for pattern in patterns:
                if pattern.lower() in p:
                    found = True
                    break
            if found:
                break
        
        status = "[OK] FOUND" if found else "[MISSING] from PATH"
        print(f"  {tool:<20} : {status}")

def main():
    # 1. Read User PATH from registry HKEY_CURRENT_USER\Environment
    user_path_raw, _ = read_registry_env("Environment", "Path", winreg.HKEY_CURRENT_USER)
    user_paths = get_path_elements(user_path_raw)
    
    # 2. Read System PATH from registry HKEY_LOCAL_MACHINE\System\CurrentControlSet\Control\Session Manager\Environment
    sys_path_raw, _ = read_registry_env(
        "System\\CurrentControlSet\\Control\\Session Manager\\Environment", 
        "Path", 
        winreg.HKEY_LOCAL_MACHINE
    )
    sys_paths = get_path_elements(sys_path_raw)
    
    # Audit both
    valid_user, dup_user, broken_user = audit_path_list(user_paths, "USER")
    valid_sys, dup_sys, broken_sys = audit_path_list(sys_paths, "SYSTEM")
    
    # Check critical tools across combined path
    check_missing_critical_tools(user_paths + sys_paths)
    
    # Generate clean environment PATH variables for remediation
    print("\n=== PATH Remediation ===")
    
    # Filter duplicates & broken items
    clean_user = []
    seen_user = set()
    for p in user_paths:
        expanded = os.path.expandvars(p)
        norm = os.path.normpath(expanded).lower()
        if norm not in seen_user and os.path.exists(expanded):
            seen_user.add(norm)
            clean_user.append(p)
            
    clean_sys = []
    seen_sys = set()
    for p in sys_paths:
        expanded = os.path.expandvars(p)
        norm = os.path.normpath(expanded).lower()
        if norm not in seen_sys and os.path.exists(expanded):
            seen_sys.add(norm)
            clean_sys.append(p)
            
    new_user_path = ";".join(clean_user)
    new_sys_path = ";".join(clean_sys)
    
    print("\nTo apply a clean PATH to your User registry, run the following PowerShell command:")
    print("--------------------------------------------------------------------------------")
    print(f'[Environment]::SetEnvironmentVariable("Path", "{new_user_path}", "User")')
    print("--------------------------------------------------------------------------------")
    
    print("\nTo apply a clean PATH to your System registry (requires Administrator rights), run:")
    print("--------------------------------------------------------------------------------")
    print(f'[Environment]::SetEnvironmentVariable("Path", "{new_sys_path}", "Machine")')
    print("--------------------------------------------------------------------------------")

if __name__ == "__main__":
    main()
