import os
import sys
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
import re
from vendor_utils import VENDOR_DIR, load_vendor_config, download_file, get_all_vendor_files

def main():
    print("Downloading standard vendor files...")
    
    # Ensure directories exist
    for d in ['js', 'css', 'fonts']:
        os.makedirs(os.path.join(VENDOR_DIR, d), exist_ok=True)

    config = load_vendor_config()
    files_to_download = get_all_vendor_files(config)

    for file_info in files_to_download:
        dest_path = os.path.join(VENDOR_DIR, file_info['dest'])
        print(f"Downloading {file_info['url']}...")
        try:
            content = download_file(file_info['url'])
            
            # Patch MDI CSS to point to local fonts
            if file_info['dest'] == 'css/materialdesignicons.min.css':
                text_content = content.decode('utf-8')
                text_content = re.sub(r'url\("\.\./fonts/([^"]+)"\)', r'url("../fonts/\1")', text_content)
                content = text_content.encode('utf-8')
                
            with open(dest_path, 'wb') as f:
                f.write(content)
        except Exception as e:
            print(f"Failed to download {file_info['dest']}: {e}")

    print("Fetching Google Fonts CSS...")
    font_css_url = config.get('google_fonts_url')
    if font_css_url:
        try:
            css_content = download_file(font_css_url).decode('utf-8')
            
            # Find all WOFF2 references
            font_urls = re.findall(r'url\((https://[^)]+\.woff2)\)', css_content)
            
            for idx, font_url in enumerate(font_urls):
                font_filename = f"google-font-{idx + 1}.woff2"
                font_dest = os.path.join(VENDOR_DIR, 'fonts', font_filename)
                print(f"Downloading font file: {font_url}")
                
                font_content = download_file(font_url)
                with open(font_dest, 'wb') as f:
                    f.write(font_content)
                    
                css_content = css_content.replace(font_url, f"../fonts/{font_filename}")
                
            css_dest = os.path.join(VENDOR_DIR, 'css', 'google-fonts.css')
            with open(css_dest, 'w', encoding='utf-8') as f:
                f.write(css_content)
                
            print("Vendor files downloaded successfully.")
        except Exception as e:
             print(f"Failed to process Google Fonts: {e}")

if __name__ == '__main__':
    main()
