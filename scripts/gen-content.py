#!/usr/bin/env python3
"""Generate explorer.md and exam-prep.md for all remaining topics."""
import os, sys

BASE = "/Users/adityachandrabhatla/nucleux-academy/content/medicine"

def w(subpath, filename, content):
    p = os.path.join(BASE, subpath, filename)
    with open(p, 'w') as f:
        f.write(content.lstrip('\n'))
    lines = len(content.strip().splitlines())
    print(f"  {subpath}/{filename} ({lines} lines)")

# Read content from individual files
def load_and_write(topic_dir):
    """Load content module and write files."""
    import importlib.util
    spec = importlib.util.spec_from_file_location("mod", topic_dir)
    mod = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(mod)
    return mod

if __name__ == "__main__":
    # Import all topic content from the topics directory
    topics_dir = os.path.join(os.path.dirname(__file__), "topics")
    for fname in sorted(os.listdir(topics_dir)):
        if fname.endswith('.py'):
            fpath = os.path.join(topics_dir, fname)
            exec(open(fpath).read())
    print("Done!")
