def load_json(path):
    import json
    with open(path, 'r') as f:
        return json.load(f)
