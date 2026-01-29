import sys
import os
import json

# Paths
base_dir = os.path.dirname(os.path.abspath(__file__))
week4_src = os.path.join(base_dir, '..', '..', 'week 4', 'src')
sys.path.append(week4_src)

from search_pipeline import SearchPipeline

class RAGPipeline:
    def __init__(self):
        self.retriever = SearchPipeline()
        
    def generate_response(self, query, user_role, stream=False):
        # 1. Retrieve Context
        search_result = self.retriever.search(query, user_role)
        results = search_result['results']
        
        # 2. Build Context String
        context_text = ""
        sources = []
        for i, res in enumerate(results):
            context_text += f"\nSource [{i+1}] ({res['metadata'].get('department')}): {res['content']}\n"
            sources.append(res['metadata'].get('source'))
            
        # 3. Construct Prompt
        prompt = f"""
        You are an internal assistant. Answer the question based ONLY on the context below.
        
        CONTEXT:
        {context_text}
        
        QUESTION: {query}
        
        ANSWER:
        """
        
        # 4. Call LLM (Mock/Placeholder for now as no API key)
        # In real impl, would call OpenAI or HuggingFace
        
        response = f"Based on the {len(results)} retrieved documents, here is the answer to '{query}':\n\n[LLM Generation Placeholder based on content]...\n\nSources: {', '.join(set(sources))}"
        
        return {
            "query": query,
            "response": response,
            "context_used": context_text,
            "sources": sources
        }

if __name__ == "__main__":
    rag = RAGPipeline()
    print(rag.generate_response("Q4 revenue", "finance"))
