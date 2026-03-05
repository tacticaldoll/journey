import os
import json
import urllib.request

# Global Constants
PROJECT_ROOT = os.path.join(os.path.dirname(__file__), '..', '..')
VENDOR_DIR = os.path.join(PROJECT_ROOT, 'static', 'vendor')
VENDOR_JSON_PATH = os.path.join(PROJECT_ROOT, 'data', 'vendor.json')

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

def load_vendor_config():
    """Loads the vendor.json configuration file."""
    if not os.path.exists(VENDOR_JSON_PATH):
        raise FileNotFoundError(f"Vendor configuration not found at {VENDOR_JSON_PATH}")
    with open(VENDOR_JSON_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def download_file(url):
    """Downloads a file from a URL using urllib."""
    req = urllib.request.Request(url, headers=HEADERS)
    response = urllib.request.urlopen(req)
    return response.read()

def get_all_vendor_files(config):
    """Returns a flat list of all vendor files (js, css, fonts) from the config."""
    files = []
    if 'js' in config:
        files.extend(config['js'])
    if 'css' in config:
        files.extend(config['css'])
    if 'fonts' in config:
        files.extend(config['fonts'])
    return files
