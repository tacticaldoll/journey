import json
import re

def check_json(filepath):
    print(f"Checking {filepath}...")
    try:
        with open(filepath, 'rb') as f:
            raw = f.read()
            
        # Check for non-standard UTF-8 (BOM, etc.)
        if raw.startswith(b'\xef\xbb\xbf'):
            print("  Warning: File has UTF-8 BOM")
        
        content = raw.decode('utf-8-sig')
        
        # Check for illegal control characters in JSON strings
        # JSON.parse (ECMA-404) forbids control characters U+0000 through U+001F inclusive
        # specifically inside string values.
        
        illegal_chars = []
        for i, char in enumerate(content):
            code = ord(char)
            if code < 32 and char not in [' ', '\r', '\n', '\t']:
                illegal_chars.append((i, char, code))
        
        if illegal_chars:
            print(f"  Found {len(illegal_chars)} illegal control characters!")
            for pos, char, code in illegal_chars[:5]:
                print(f"    Pos {pos}: {repr(char)} (code: {code})")
        
        # Check for literal newlines in strings
        # A simple way: find strings between double quotes and check for \n
        # This is a bit naive because of escaped quotes, but Hugo's jsonify escapes them.
        in_string = False
        escaped = False
        string_start = 0
        for i, char in enumerate(content):
            if char == '"' and not escaped:
                if not in_string:
                    in_string = True
                    string_start = i
                else:
                    in_string = False
            elif char == '\\' and not escaped:
                escaped = True
                continue
            elif in_string and char in ['\r', '\n']:
                print(f"  ERROR: Literal newline found in string starting at {string_start}")
                print(f"  Context: {content[string_start:i+10]!r}")
                # return False
            escaped = False
                
        # Final validation
        json.loads(content)
        print("  JSON is valid according to Python")
        return True
    except Exception as e:
        print(f"  FAILED: {e}")
        return False

check_json('public/index.json')
check_json('public/posts/index.json')
