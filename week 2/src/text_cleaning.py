import argparse
import json
import re
import unicodedata
from pathlib import Path
from typing import Any, Dict, List


def clean_text(text: str, lower: bool = True) -> str:
    if text is None:
        return ""
    s = str(text)
    s = unicodedata.normalize("NFKC", s)
    s = re.sub(r"<[^>]+>", " ", s)
    s = "".join(ch for ch in s if unicodedata.category(ch)[0] != "C")
    s = re.sub(r"[\r\n\t]+", " ", s)
    s = re.sub(r"\s+", " ", s).strip()
    if lower:
        s = s.lower()
    return s


def normalize_doc(raw: Dict[str, Any], source: str) -> Dict[str, Any]:
    doc: Dict[str, Any] = {}
    doc["source"] = source
    doc_id = raw.get("id") or raw.get("uid") or raw.get("file") or raw.get("filepath")
    if not doc_id:
        title = raw.get("title") or raw.get("name")
        doc_id = title[:60] if title else None
    doc["id"] = doc_id
    doc["title"] = clean_text(raw.get("title") or raw.get("name") or "")
    content = raw.get("content") or raw.get("text") or raw.get("body") or raw.get("markdown")
    doc["content"] = clean_text(content)
    tags = raw.get("tags") or raw.get("labels") or raw.get("categories")
    if isinstance(tags, str):
        tags = [t.strip() for t in tags.split(",") if t.strip()]
    doc["tags"] = tags or []
    meta: Dict[str, Any] = {}
    for k, v in raw.items():
        if k.lower() in ("id", "uid", "file", "filepath", "title", "name", "content", "text", "body", "markdown", "tags", "labels", "categories"):
            continue
        meta[k] = v
    doc["metadata"] = meta
    return doc


def load_json(path: Path) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    with path.open("r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception:
            return []
    if isinstance(data, dict):
        for v in data.values():
            if isinstance(v, list):
                return v
        return [data]
    if isinstance(data, list):
        return data
    return []


def main():
    parser = argparse.ArgumentParser(description="Clean and merge parsed documents into a canonical JSON file")
    parser.add_argument("--input-dir", "-i", default=Path(__file__).parents[1] / "output", help="Directory containing parsed_markdown.json and parsed_csv.json")
    parser.add_argument("--output", "-o", default=Path(__file__).parents[1] / "output" / "cleaned_documents.json", help="Output JSON file")
    parser.add_argument("--no-lower", action="store_true", help="Do not lowercase text during cleaning")
    args = parser.parse_args()

    input_dir = Path(args.input_dir)
    out_path = Path(args.output)
    md_path = input_dir / "parsed_markdown.json"
    csv_path = input_dir / "parsed_csv.json"

    md_docs = load_json(md_path)
    csv_docs = load_json(csv_path)

    cleaned: List[Dict[str, Any]] = []
    for raw in md_docs:
        doc = normalize_doc(raw, source="markdown")
        if args.no_lower:
            doc["content"] = clean_text(raw.get("content") or raw.get("text") or "", lower=False)
        cleaned.append(doc)

    for raw in csv_docs:
        doc = normalize_doc(raw, source="csv")
        if args.no_lower:
            doc["content"] = clean_text(raw.get("content") or raw.get("text") or "", lower=False)
        cleaned.append(doc)

    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(cleaned)} cleaned documents to {out_path}")


if __name__ == "__main__":
    main()
