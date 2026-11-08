from typing import List
from fastapi import APIRouter
from backend.models.schemas import SemanticSearchRequest, VectorSearchResult
from backend.services.vector_search_service import vector_search_service

router = APIRouter(prefix="/search", tags=["Vector & Semantic Search"])

@router.post("/semantic", response_model=List[VectorSearchResult])
async def semantic_search(req: SemanticSearchRequest):
    return vector_search_service.search_similar_companies(req)
