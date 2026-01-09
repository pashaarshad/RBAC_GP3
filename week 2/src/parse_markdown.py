"""Simple markdown parser (stub) for Week 2.

Scans the `week 1/data` directory for .md files and writes
a parsed JSON list to `week 2/output/parsed_markdown.json`.

This is a lightweight stub to match expected input formats.
"""

import json
from pathlib import Path
import re
from typing import List, Dict


def find_markdown_files(root: Path) -> List[Path]:
    return list(root.rglob("*.md"))


def read_file(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8")
    except Exception:
        return p.read_text(encoding="latin-1", errors="ignore")


def extract_title(text: str) -> str:
    # Find first Markdown H1/H2 heading
    m = re.search(r"^#\s+(.*)$", text, flags=re.MULTILINE)
    if m:
        return m.group(1).strip()
    m = re.search(r"^##\s+(.*)$", text, flags=re.MULTILINE)
    if m:
        return m.group(1).strip()
    # Fallback: first non-empty line
    for line in text.splitlines():
        if line.strip():
            return line.strip()
    return ""


def parse_markdown_file(path: Path) -> Dict:
    text = read_file(path)
    return {
        "filename": path.name,
        "filepath": str(path),
        "title": extract_title(text),
        "content": text
    }


def main():
    project_root = Path(__file__).parents[1].parent
    data_dir = project_root / "week 1" / "data"
    out_dir = Path(__file__).parents[1] / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "parsed_markdown.json"

    md_files = find_markdown_files(data_dir)
    parsed = [parse_markdown_file(p) for p in md_files]

    with out_file.open("w", encoding="utf-8") as f:
        json.dump(parsed, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(parsed)} parsed markdown documents to {out_file}")


if __name__ == "__main__":
    main()
