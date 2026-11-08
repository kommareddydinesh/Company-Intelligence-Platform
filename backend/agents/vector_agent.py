import logging
from typing import Dict, Any, List
from backend.services.vector_search_service import vector_search_service
from backend.models.schemas import SemanticSearchRequest, VectorSearchResult

logger = logging.getLogger(__name__)

class VectorSearchAgent:
    """Agent 3: Executes dense vector search over ChromaDB index."""

    def execute(self, vector_plan: Dict[str, Any]) -> List[VectorSearchResult]:
        query = vector_plan.get("query", "")
        top_k = vector_plan.get("top_k", 5)
        
        req = SemanticSearchRequest(query=query, top_k=top_k)
        results = vector_search_service.search_similar_companies(req)
        logger.info(f"Vector Search Agent -> Retrieved {len(results)} vector documents.")
        return results

vector_agent = VectorSearchAgent()
