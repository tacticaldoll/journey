import os
import shutil
import sys

def main():
    print("Installing strict pre-commit hooks...")
    
    root_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    hooks_dir = os.path.join(root_dir, '.git', 'hooks')
    pre_commit_src = os.path.join(root_dir, 'scripts', 'pre-commit')
    pre_commit_dest = os.path.join(hooks_dir, 'pre-commit')
    
    if not os.path.exists(hooks_dir):
        print("Error: '.git/hooks' directory not found. Please ensure you are running this in the root of the git repository.")
        sys.exit(1)

    try:
        shutil.copy2(pre_commit_src, pre_commit_dest)
        
        # Make executable on Unix-based systems
        if os.name != 'nt':
            os.chmod(pre_commit_dest, 0o755)
            
        print("[OK] Successfully installed pre-commit hook.")
        print("Every specific `git commit` will now run `verify-vendor.py` locally before allowing the commit.")
    except Exception as e:
        print(f"[FAIL] Failed to install pre-commit hook: {e}")
        sys.exit(1)

if __name__ == '__main__':
    main()
