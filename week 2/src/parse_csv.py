"""Simple CSV parser (stub) for Week 2.

Scans the `week 1/data` directory for .csv files and writes
parsed JSON to `week 2/output/parsed_csv.json`.

Note: `parsed_csv.json` may already exist; this script provides
an easy way to regenerate it from raw CSVs.
"""

import csv
import json
from pathlib import Path
from typing import List, Dict


def find_csv_files(root: Path) -> List[Path]:
    return list(root.rglob("*.csv"))


def parse_csv_file(path: Path) -> Dict:
    rows = []
    try:
        with path.open("r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append(r)
    except Exception:
        with path.open("r", encoding="latin-1", errors="ignore") as f:
            reader = csv.DictReader(f)
            for r in reader:
                rows.append(r)
    return {
        "filename": path.name,
        "filepath": str(path),
        "row_count": len(rows),
        "rows": rows
    }


def main():
    project_root = Path(__file__).parents[1].parent
    data_dir = project_root / "week 1" / "data"
    out_dir = Path(__file__).parents[1] / "output"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / "parsed_csv.json"

    csv_files = find_csv_files(data_dir)
    parsed = [parse_csv_file(p) for p in csv_files]

    with out_file.open("w", encoding="utf-8") as f:
        json.dump(parsed, f, ensure_ascii=False, indent=2)

    print(f"Wrote {len(parsed)} parsed CSV files to {out_file}")


if __name__ == "__name__":
    main()
