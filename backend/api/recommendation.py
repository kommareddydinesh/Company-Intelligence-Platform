from typing import List
from fastapi import APIRouter
from backend.models.schemas import RecommendationRequest, CompanyRecommendation
from backend.recommendation.recommendation_engine import recommendation_engine

router = APIRouter(prefix="/recommendations", tags=["Recommendations"])

@router.post("", response_model=List[CompanyRecommendation])
async def get_company_recommendations(req: RecommendationRequest):
    return await recommendation_engine.recommend_similar_companies(req.company_name, req.top_k)
