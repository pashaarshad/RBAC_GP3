"""
RAG Pipeline Implementation
Week 6 - RBAC Chatbot Project

This module implements the complete RAG (Retrieval-Augmented Generation) pipeline
with role-based access control filtering.

Author: Arshad
Date: Week 6
"""

import json
import os
import time
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


@dataclass
class RAGResponse:
    """Data class for RAG pipeline response."""
    response: str
    sources: List[str]
    confidence_score: float
    processing_time: float
    user_role: str
    chunks_retrieved: int


class RAGPipeline:
    """
    RAG Pipeline with RBAC filtering.
    
    This class implements the complete RAG workflow:
    1. User authentication and role verification
    2. Query embedding generation
    3. Vector similarity search
    4. RBAC-based result filtering
    5. Context building
    6. LLM response generation
    7. Citation addition
    """
    
    def __init__(self, config_path: str = None):
        """
        Initialize the RAG Pipeline.
        
        Args:
            config_path: Path to pipeline configuration file
        """
        self.config = self._load_config(config_path)
        self.embeddings_path = self._get_embeddings_path()
        self.role_hierarchy = self._load_role_hierarchy()
        self.embeddings_cache = None
        
        logger.info("RAG Pipeline initialized successfully")
    
    def _load_config(self, config_path: str) -> Dict:
        """Load pipeline configuration."""
        if config_path is None:
            script_dir = os.path.dirname(os.path.abspath(__file__))
            config_path = os.path.join(script_dir, "..", "config", "pipeline_config.json")
        
        try:
            with open(config_path, 'r') as f:
                config = json.load(f)
                logger.info(f"Loaded configuration from {config_path}")
                return config
        except FileNotFoundError:
            logger.warning(f"Config file not found, using defaults")
            return {
                "max_chunks": 5,
                "similarity_threshold": 0.3,
                "max_response_tokens": 500,
                "temperature": 0.7,
                "include_sources": True
            }
    
    def _get_embeddings_path(self) -> str:
        """Get path to embeddings file."""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        return os.path.join(script_dir, "..", "..", "week 3", "output", "chunk_embeddings.json")
    
    def _load_role_hierarchy(self) -> Dict:
        """Load RBAC role hierarchy."""
        script_dir = os.path.dirname(os.path.abspath(__file__))
        role_path = os.path.join(script_dir, "..", "..", "week 4", "config", "role_hierarchy.json")
        
        try:
            with open(role_path, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            logger.warning("Role hierarchy not found, using defaults")
            return {
                "department_access": {
                    "c-level": ["Finance", "HR", "marketing", "engineering", "general"],
                    "finance": ["Finance", "general"],
                    "hr": ["HR", "general"],
                    "marketing": ["marketing", "general"],
                    "engineering": ["engineering", "general"],
                    "employees": ["general"]
                }
            }
    
    def _load_embeddings(self) -> List[Dict]:
        """Load embeddings from file (with caching)."""
        if self.embeddings_cache is not None:
            return self.embeddings_cache
        
        try:
            with open(self.embeddings_path, 'r', encoding='utf-8') as f:
                self.embeddings_cache = json.load(f)
                logger.info(f"Loaded {len(self.embeddings_cache)} embeddings")
                return self.embeddings_cache
        except FileNotFoundError:
            logger.error(f"Embeddings file not found: {self.embeddings_path}")
            return []
    
    def authenticate_user(self, user_id: str) -> Dict[str, Any]:
        """
        Authenticate user and get their role.
        
        Args:
            user_id: User identifier
            
        Returns:
            Dict with user info including role
        """
        # Mock user database - in production, this would query a real database
        mock_users = {
            "admin": {"role": "c-level", "name": "Admin User", "departments": ["all"]},
            "finance_user": {"role": "finance", "name": "Finance Manager", "departments": ["Finance"]},
            "hr_user": {"role": "hr", "name": "HR Manager", "departments": ["HR"]},
            "marketing_user": {"role": "marketing", "name": "Marketing Lead", "departments": ["marketing"]},
            "engineer": {"role": "engineering", "name": "Software Engineer", "departments": ["engineering"]},
            "employee": {"role": "employees", "name": "General Employee", "departments": ["general"]}
        }
        
        if user_id in mock_users:
            logger.info(f"User authenticated: {user_id} with role: {mock_users[user_id]['role']}")
            return {"authenticated": True, **mock_users[user_id]}
        
        logger.warning(f"Authentication failed for user: {user_id}")
        return {"authenticated": False, "role": "employees", "name": "Unknown", "departments": ["general"]}
    
    def filter_by_rbac(self, user_role: str, chunks: List[Dict]) -> List[Dict]:
        """
        Filter chunks based on user's role and permissions.
        
        Args:
            user_role: The user's role
            chunks: List of document chunks with metadata
            
        Returns:
            Filtered list of accessible chunks
        """
        accessible_departments = self.role_hierarchy.get("department_access", {}).get(
            user_role.lower(), ["general"]
        )
        
        filtered_chunks = []
        for chunk in chunks:
            # Determine department from source file
            source_file = chunk.get("source_file", "").lower()
            
            # Map source file to department
            chunk_department = "general"
            if "finance" in source_file:
                chunk_department = "Finance"
            elif "hr" in source_file or "employee" in source_file:
                chunk_department = "HR"
            elif "marketing" in source_file:
                chunk_department = "marketing"
            elif "engineering" in source_file:
                chunk_department = "engineering"
            
            # Check if user has access
            if any(dept.lower() == chunk_department.lower() for dept in accessible_departments):
                filtered_chunks.append(chunk)
                logger.debug(f"ACCESS ALLOWED: {user_role} -> {chunk_department}")
            else:
                logger.debug(f"ACCESS DENIED: {user_role} -> {chunk_department}")
        
        logger.info(f"RBAC Filtering: {len(filtered_chunks)}/{len(chunks)} chunks accessible for role '{user_role}'")
        return filtered_chunks
    
    def _compute_similarity(self, query_embedding: List[float], doc_embedding: List[float]) -> float:
        """Compute cosine similarity between two embeddings."""
        import math
        
        dot_product = sum(a * b for a, b in zip(query_embedding, doc_embedding))
        magnitude_a = math.sqrt(sum(a * a for a in query_embedding))
        magnitude_b = math.sqrt(sum(b * b for b in doc_embedding))
        
        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0
        
        return dot_product / (magnitude_a * magnitude_b)
    
    def retrieve_chunks(self, query: str, user_role: str, top_k: int = None) -> List[Dict]:
        """
        Retrieve top-K relevant chunks with RBAC filtering.
        
        Args:
            query: User query
            user_role: User's role for filtering
            top_k: Number of chunks to retrieve
            
        Returns:
            List of relevant chunks
        """
        top_k = top_k or self.config.get("max_chunks", 5)
        
        # Load all embeddings
        all_chunks = self._load_embeddings()
        
        # Apply RBAC filtering first
        accessible_chunks = self.filter_by_rbac(user_role, all_chunks)
        
        if not accessible_chunks:
            logger.warning("No accessible chunks after RBAC filtering")
            return []
        
        # For demo purposes, we'll use keyword matching
        # In production, you would embed the query and compute similarity
        query_lower = query.lower()
        scored_chunks = []
        
        for chunk in accessible_chunks:
            content = chunk.get("content", "").lower()
            # Simple keyword scoring
            score = sum(1 for word in query_lower.split() if word in content) / max(len(query_lower.split()), 1)
            
            # Boost score if query words appear multiple times
            for word in query_lower.split():
                if len(word) > 3:  # Only meaningful words
                    score += content.count(word) * 0.1
            
            if score > self.config.get("similarity_threshold", 0.1):
                scored_chunks.append({**chunk, "relevance_score": score})
        
        # Sort by relevance and return top-K
        scored_chunks.sort(key=lambda x: x["relevance_score"], reverse=True)
        result = scored_chunks[:top_k]
        
        logger.info(f"Retrieved {len(result)} relevant chunks for query")
        return result
    
    def build_context(self, query: str, chunks: List[Dict]) -> str:
        """
        Build augmented prompt with context from retrieved chunks.
        
        Args:
            query: User query
            chunks: Retrieved document chunks
            
        Returns:
            Augmented prompt string
        """
        if not chunks:
            return f"""You are a helpful AI assistant for FinSolve Technologies.
            
User Question: {query}

I don't have access to relevant documents for this query. Please provide a general response 
and suggest the user contact the appropriate department for detailed information."""
        
        # Build context from chunks
        context_parts = []
        for i, chunk in enumerate(chunks, 1):
            source = chunk.get("source_file", "Unknown")
            content = chunk.get("content", "")[:1000]  # Limit content length
            context_parts.append(f"[Document {i}] Source: {source}\n{content}\n")
        
        context = "\n---\n".join(context_parts)
        
        prompt = f"""You are a helpful AI assistant for FinSolve Technologies. 
Use the following documents to answer the user's question.
Always cite your sources using [Document X] format.

CONTEXT:
{context}

USER QUESTION: {query}

INSTRUCTIONS:
1. Answer based ONLY on the provided documents
2. Cite sources using [Document X] format
3. If the documents don't contain enough information, say so
4. Be concise but comprehensive

ANSWER:"""
        
        return prompt
    
    def generate_response(self, prompt: str) -> str:
        """
        Generate response using LLM.
        
        Args:
            prompt: Augmented prompt with context
            
        Returns:
            LLM-generated response
        """
        # For demo purposes, generate a simple response
        # In production, this would call OpenAI, Anthropic, or local LLM
        
        logger.info("Generating LLM response (demo mode)")
        
        # Extract the question from the prompt
        if "USER QUESTION:" in prompt:
            question = prompt.split("USER QUESTION:")[1].split("INSTRUCTIONS:")[0].strip()
        else:
            question = "your query"
        
        # Generate a placeholder response
        response = f"""Based on the provided documents, here is the information regarding {question}:

The documents contain relevant information from FinSolve Technologies' internal documentation. 
Key points have been extracted from the engineering, finance, and HR documentation.

[Document 1] provides foundational context about company policies and procedures.
[Document 2] offers additional details about specific implementations.

For more detailed information, please consult the specific department documentation 
or contact the relevant team leads.

Note: This is a demo response. In production, this would be generated by an LLM 
(GPT-4, Claude, or similar) using the actual document context."""
        
        return response
    
    def add_citations(self, response: str, chunks: List[Dict]) -> Dict[str, Any]:
        """
        Add source citations to the response.
        
        Args:
            response: LLM-generated response
            chunks: Source chunks used for context
            
        Returns:
            Dict with response and formatted citations
        """
        sources = []
        for i, chunk in enumerate(chunks, 1):
            source_file = chunk.get("source_file", "Unknown")
            chunk_id = chunk.get("chunk_id", f"chunk_{i}")
            relevance = chunk.get("relevance_score", 0)
            
            sources.append({
                "citation": f"[Document {i}]",
                "source_file": source_file,
                "chunk_id": chunk_id,
                "relevance_score": round(relevance, 3)
            })
        
        return {
            "response": response,
            "sources": sources,
            "source_count": len(sources)
        }
    
    def process_query(self, user_id: str, query: str) -> RAGResponse:
        """
        Process a user query through the complete RAG pipeline.
        
        Args:
            user_id: User identifier
            query: User's question
            
        Returns:
            RAGResponse with answer, sources, and metadata
        """
        start_time = time.time()
        logger.info(f"Processing query from user '{user_id}': {query[:50]}...")
        
        # Step 1: Authenticate user
        user_info = self.authenticate_user(user_id)
        user_role = user_info.get("role", "employees")
        
        if not user_info.get("authenticated", False):
            logger.warning(f"User {user_id} not authenticated, using default role")
        
        # Step 2: Retrieve relevant chunks with RBAC filtering
        chunks = self.retrieve_chunks(query, user_role)
        
        # Step 3: Build context prompt
        prompt = self.build_context(query, chunks)
        
        # Step 4: Generate response
        response = self.generate_response(prompt)
        
        # Step 5: Add citations
        cited_response = self.add_citations(response, chunks)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        # Calculate confidence score based on chunk relevance
        if chunks:
            avg_relevance = sum(c.get("relevance_score", 0) for c in chunks) / len(chunks)
            confidence = min(avg_relevance * 2, 1.0)  # Normalize to 0-1
        else:
            confidence = 0.1
        
        logger.info(f"Query processed in {processing_time:.2f}s with confidence {confidence:.2f}")
        
        return RAGResponse(
            response=cited_response["response"],
            sources=[s["source_file"] for s in cited_response["sources"]],
            confidence_score=round(confidence, 3),
            processing_time=round(processing_time, 3),
            user_role=user_role,
            chunks_retrieved=len(chunks)
        )


# ==================== TEST SCRIPT ====================
if __name__ == "__main__":
    print("=" * 60)
    print("RAG PIPELINE TEST - Week 6")
    print("=" * 60)
    
    # Initialize pipeline
    pipeline = RAGPipeline()
    
    # Test queries with different users
    test_cases = [
        ("admin", "What is the system architecture?"),
        ("finance_user", "What are the financial metrics and KPIs?"),
        ("engineer", "What is the technology stack?"),
        ("employee", "What are the employee benefits?"),
        ("hr_user", "What is the leave policy?"),
    ]
    
    for user_id, query in test_cases:
        print(f"\n{'='*60}")
        print(f"User: {user_id}")
        print(f"Query: {query}")
        print("-" * 60)
        
        result = pipeline.process_query(user_id, query)
        
        print(f"Role: {result.user_role}")
        print(f"Chunks Retrieved: {result.chunks_retrieved}")
        print(f"Confidence: {result.confidence_score}")
        print(f"Processing Time: {result.processing_time}s")
        print(f"Sources: {result.sources[:3]}...")  # Show first 3 sources
        print(f"\nResponse Preview:\n{result.response[:300]}...")
    
    print("\n" + "=" * 60)
    print("✅ RAG Pipeline Test Complete!")
    print("=" * 60)
