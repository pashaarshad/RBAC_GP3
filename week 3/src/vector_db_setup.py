"""
vector_db_setup.py

Sets up a persistent ChromaDB collection and exposes helpers:
- get_collection()
- add_documents(chunks, embeddings, metadatas)
- query(embedding, n_results=5)

The script will attempt to install chromadb if it's not available, then initialize
a persistent Chroma client using the config file at ../config/db_config.json.
"""

from __future__ import annotations

import json
import logging
import subprocess
import sys
import uuid
from pathlib import Path
from typing import Any, Dict, List

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Try to import chromadb and install if missing
try:
    import chromadb
    from chromadb.config import Settings
except Exception:
    logger.info("chromadb not found - installing via pip...")
    subprocess.check_call([sys.executable, "-m", "pip", "install", "chromadb"])  # raises on failure
    # re-import after install
    import importlib

    importlib.invalidate_caches()
    import chromadb
    from chromadb.config import Settings

# Load config
CONFIG_PATH = Path(__file__).parent.parent / "config" / "db_config.json"
if not CONFIG_PATH.exists():
    raise FileNotFoundError(f"db_config.json not found at expected location: {CONFIG_PATH}")

with open(CONFIG_PATH, "r", encoding="utf-8") as f:
    _config = json.load(f)

COLLECTION_NAME: str = _config.get("collection_name", "rbac_documents")
PERSIST_DIR_REL: str = _config.get("persist_directory", "../output/vector_db")
EMBEDDING_DIMENSION: int = int(_config.get("embedding_dimension", 384))
DISTANCE_METRIC: str = _config.get("distance_metric", "cosine")

# Persist directory resolved relative to this script (week_3/src)
PERSIST_DIR = (Path(__file__).parent / PERSIST_DIR_REL).resolve()
PERSIST_DIR.mkdir(parents=True, exist_ok=True)

_client = None
_collection = None


def _init_client_and_collection():
    """Internal: initialize and cache the client & collection."""
    global _client, _collection
    if _client is not None and _collection is not None:
        return _client, _collection

    # Prefer persistent duckdb+parquet store
    try:
        settings = Settings(chroma_db_impl="duckdb+parquet", persist_directory=str(PERSIST_DIR))
        _client = chromadb.Client(settings)
        logger.info("Created persistent Chroma client")
    except Exception as e:
        logger.warning(f"Persistent client failed ({e}); falling back to default client")
        _client = chromadb.Client()

    # Get or create collection
    try:
        _collection = _client.get_collection(name=COLLECTION_NAME)
        logger.info(f"Found existing collection '{COLLECTION_NAME}'")
    except Exception:
        logger.info(f"Creating collection '{COLLECTION_NAME}' with distance metric '{DISTANCE_METRIC}'")
        try:
            _collection = _client.create_collection(
                name=COLLECTION_NAME,
                metadata={
                    "distance_metric": DISTANCE_METRIC,
                    "embedding_dimension": EMBEDDING_DIMENSION,
                    "schema": {
                        "chunk_id": "string",
                        "source_file": "string",
                        "department": "string",
                        "accessible_roles": "list",
                    },
                },
            )
        except Exception as e:
            logger.error(f"Failed to create collection: {e}")
            # Try to get it again
            _collection = _client.get_collection(name=COLLECTION_NAME)

    return _client, _collection


def get_collection():
    """Return the Chroma collection (initializes client if necessary)."""
    _, col = _init_client_and_collection()
    return col


def add_documents(chunks: List[str], embeddings: List[List[float]], metadatas: List[Dict[str, Any]]):
    """
    Add documents (chunks) with embeddings and metadata to the collection.

    - chunks: list of document texts
    - embeddings: list of vectors (same length as chunks)
    - metadatas: list of dicts; recommended keys: chunk_id, source_file, department, accessible_roles
    """
    if not (len(chunks) == len(embeddings) == len(metadatas)):
        raise ValueError("chunks, embeddings, and metadatas must be the same length")

    client, col = _init_client_and_collection()

    ids: List[str] = []
    for md in metadatas:
        cid = md.get("chunk_id") or str(uuid.uuid4())
        ids.append(cid)

    try:
        col.add(ids=ids, documents=chunks, embeddings=embeddings, metadatas=metadatas)
        try:
            client.persist()
        except Exception:
            pass
        logger.info(f"Added {len(chunks)} documents to collection '{COLLECTION_NAME}'")
    except Exception as e:
        logger.exception("Failed to add documents to ChromaDB")
        raise


def query(embedding: List[float], n_results: int = 5) -> Dict[str, Any]:
    """Query the collection using a single embedding vector. Returns raw Chroma results."""
    _, col = _init_client_and_collection()
    try:
        results = col.query(query_embeddings=[embedding], n_results=n_results, include=["ids", "metadatas", "documents", "distances"])
        return results
    except Exception:
        logger.exception("Query failed")
        raise


if __name__ == "__main__":
    _init_client_and_collection()
    print(f"Vector database initialized at: {PERSIST_DIR}")
