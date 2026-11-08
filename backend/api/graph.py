from fastapi import APIRouter, Query
from backend.models.schemas import KnowledgeGraphResponse
from backend.knowledge_graph.graph_builder import graph_builder

router = APIRouter(prefix="/graph", tags=["Knowledge Graph"])

@router.get("/visualization", response_model=KnowledgeGraphResponse)
async def get_graph_data(limit: int = Query(default=100, ge=10, le=500)):
    return await graph_builder.get_entire_graph(limit=limit)
