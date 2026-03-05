import json
try:
    with open('public/index.json', 'r', encoding='utf-8') as f:
        data = json.load(f)
    print('JSON VALID')
    print(f'Post count: {len(data["posts"])}')
except Exception as e:
    print(f'JSON INVALID: {e}')
