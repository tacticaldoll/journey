import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import re
from vendor_utils import VENDOR_DIR, load_vendor_config, download_file, get_all_vendor_files

def main():
    print("Verifying vendor files against remote sources...")
    success = True
    config = load_vendor_config()
    files_to_verify = get_all_vendor_files(config)

    for file_info in files_to_verify:
        local_path = os.path.join(VENDOR_DIR, file_info['dest'])
        
        if not os.path.exists(local_path):
            print(f"[FAIL] Missing: {file_info['dest']}")
            success = False
            continue

        try:
            remote_content = download_file(file_info['url'])
            
            is_text = not file_info['dest'].endswith('.woff2')
            
            if is_text:
                remote_content = remote_content.decode('utf-8')
                # Apply the same regex patch we do on download for MDI
                if file_info['dest'] == 'css/materialdesignicons.min.css':
                    remote_content = re.sub(r'url\("\.\./fonts/([^"]+)"\)', r'url("../fonts/\1")', remote_content)
                
                with open(local_path, 'r', encoding='utf-8') as f:
                    local_content = f.read()
                    
                # Normalize line endings (CRLF vs LF) to prevent false positives due to Git
                remote_content = remote_content.replace('\r', '')
                local_content = local_content.replace('\r', '')
            else:
                # Binary files (fonts) direct comparison
                with open(local_path, 'rb') as f:
                    local_content = f.read()

            if remote_content != local_content:
                print(f"[FAIL] Modified: {file_info['dest']}")
                success = False
            else:
                print(f"[ OK ] Verified: {file_info['dest']}")
                
        except Exception as e:
            print(f"[FAIL] Error fetching {file_info['dest']}: {e}")
            success = False

    if success:
        print("\nSuccess! All core vendor files match their upstream sources exactly.")
        sys.exit(0)
    else:
        print("\nError: One or more vendor files have been manually modified or corrupted.")
        sys.exit(1)

if __name__ == '__main__':
    main()
