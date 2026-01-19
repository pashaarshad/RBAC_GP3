"""SemanticSearch class using SentenceTransformer + ChromaDB (with fallback).

This module provides `SemanticSearch` which attempts to use real
`sentence_transformers` and `chromadb` when available. If those packages
are not installed, it falls back to the local in-memory `VectorDB` and
`get_embedding` helpers in this folder so the test harness can run.
"""
from typing import List, Dict, Any, Optional
import os
import sys

# Ensure local module imports work regardless of current working directory
sys.path.insert(0, os.path.dirname(__file__) or '')

try:
    from sentence_transformers import SentenceTransformer
    HAS_SBT = True
except Exception:
    HAS_SBT = False

try:
    import chromadb
    from chromadb.config import Settings
    HAS_CHROMADB = True
except Exception:
    chromadb = None
    Settings = None
    HAS_CHROMADB = False

from vector_db_setup import VectorDB
from embeddings import get_embedding


class SemanticSearch:
    def __init__(self, model_name: str = 'all-MiniLM-L6-v2', collection_name: str = 'rbac_collection', persist_directory: Optional[str] = None):
        # Initialize embedder
        if HAS_SBT:
            self.model = SentenceTransformer(model_name)
        else:
            self.model = None

        # Initialize Chroma collection if available, otherwise use fallback VectorDB
        if HAS_CHROMADB:
            settings = Settings(chroma_db_impl="duckdb+parquet", persist_directory=persist_directory) if persist_directory else Settings()
            client = chromadb.Client(settings)
            self.collection = client.get_or_create_collection(name=collection_name)
            self._is_chroma = True
        else:
            self.collection = None
            self._is_chroma = False
            self._fallback_db = VectorDB()

    def _embed(self, text: str) -> List[float]:
        if self.model is not None:
            emb = self.model.encode(text, convert_to_numpy=True)
            # ensure list for Chroma fallback compatibility
            return emb.tolist()
        # fallback deterministic embedding
        return get_embedding(text)

    def search(self, query: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Search the index and return list of dicts: {chunk_id, content, score, metadata}."""
        q_emb = self._embed(query)
        if self._is_chroma:
            resp = self.collection.query(query_embeddings=[q_emb], n_results=n_results, include=['metadatas', 'documents', 'ids', 'distances'])
            ids = resp.get('ids', [[]])[0]
            docs = resp.get('documents', [[]])[0]
            metas = resp.get('metadatas', [[]])[0]
            dists = resp.get('distances', [[]])[0]
            results: List[Dict[str, Any]] = []
            for i, cid in enumerate(ids):
                dist = dists[i] if i < len(dists) else None
                score = (1 - dist) if dist is not None else None
                results.append({'chunk_id': cid, 'content': docs[i] if i < len(docs) else None, 'score': score, 'metadata': metas[i] if i < len(metas) else None})
            return results
        else:
            raw = self._fallback_db.search(q_emb, top_k=n_results)
            # raw items are (score, id, meta, text)
            return [{'chunk_id': doc_id, 'content': text, 'score': score, 'metadata': meta} for score, doc_id, meta, text in raw]

    def search_with_filter(self, query: str, department: str, n_results: int = 5) -> List[Dict[str, Any]]:
        """Search with a department filter applied to metadata."""
        q_emb = self._embed(query)
        if self._is_chroma:
            # Chroma supports a `where` filter for metadata
            resp = self.collection.query(query_embeddings=[q_emb], n_results=n_results, include=['metadatas', 'documents', 'ids', 'distances'], where={"department": department})
            ids = resp.get('ids', [[]])[0]
            docs = resp.get('documents', [[]])[0]
            metas = resp.get('metadatas', [[]])[0]
            dists = resp.get('distances', [[]])[0]
            results: List[Dict[str, Any]] = []
            for i, cid in enumerate(ids):
                dist = dists[i] if i < len(dists) else None
                score = (1 - dist) if dist is not None else None
                results.append({'chunk_id': cid, 'content': docs[i] if i < len(docs) else None, 'score': score, 'metadata': metas[i] if i < len(metas) else None})
            return results
        else:
            # fallback: filter metadata in the in-memory DB
            filtered = [item for item in self._fallback_db._index if item[2] and item[2].get('department') == department]
            # compute cosine similarity between q_emb and each vector
            def dot(a, b):
                return sum(x * y for x, y in zip(a, b))
            def norm(a):
                return sum(x * x for x in a) ** 0.5
            qn = norm(q_emb) + 1e-12
            scored = []
            for doc_id, vec, meta, text in filtered:
                if len(vec) != len(q_emb):
                    continue
                score = dot(vec, q_emb) / (norm(vec) * qn + 1e-12)
                scored.append((score, doc_id, meta, text))
            scored.sort(key=lambda x: x[0], reverse=True)
            return [{'chunk_id': doc_id, 'content': text, 'score': score, 'metadata': meta} for score, doc_id, meta, text in scored[:n_results]]


def _print_table(query: str, results: List[Dict[str, Any]]):
    if not results:
        print(f"\nQuery: {query}\n  (no results)\n")
        return
    # simple aligned table
    print(f"\nQuery: {query}")
    print("-" * 80)
    print(f"{'#':<3} {'chunk_id':<20} {'score':>8} {'department':<12}  content")
    print("-" * 80)
    for i, r in enumerate(results, start=1):
        mid = (r.get('metadata') or {}).get('department') if r.get('metadata') else None
        content = (r.get('content') or '')
        if len(content) > 40:
            content = content[:37] + '...'
        score = f"{r.get('score'):.4f}" if r.get('score') is not None else 'N/A'
        print(f"{i:<3} {r.get('chunk_id'):<20} {score:>8} {str(mid):<12}  {content}")


def _test_sample():
    ss = SemanticSearch()

    # sample docs
    sample_docs = [
        {'id': 'doc_fin_q4', 'text': 'Q4 revenue grew 12% year over year; revenue details and breakdown', 'metadata': {'department': 'finance'}},
        {'id': 'doc_hr_leave', 'text': 'Employee leave policy: employees receive 18 days of paid leave per year; procedure for requesting leave', 'metadata': {'department': 'hr'}},
        {'id': 'doc_mkt_campaign', 'text': 'Marketing campaign results show a 25% lift in conversions during Q1', 'metadata': {'department': 'marketing'}},
        {'id': 'doc_general_policy', 'text': 'Company policies overview and governance', 'metadata': {'department': 'general'}},
    ]

    # add to underlying store
    if ss._is_chroma:
        ids = [d['id'] for d in sample_docs]
        docs = [d['text'] for d in sample_docs]
        metas = [d['metadata'] for d in sample_docs]
        embs = [ss._embed(d['text']) for d in sample_docs]
        ss.collection.add(ids=ids, documents=docs, metadatas=metas, embeddings=embs)
    else:
        for d in sample_docs:
            ss._fallback_db.add(d['id'], ss._embed(d['text']), d['metadata'], d['text'])

    queries = [
        'What is the Q4 revenue?',
        'Employee leave policy',
        'Marketing campaign results',
    ]

    for q in queries:
        res = ss.search(q, n_results=3)
        _print_table(q, res)


if __name__ == '__main__':
    _test_sample()
