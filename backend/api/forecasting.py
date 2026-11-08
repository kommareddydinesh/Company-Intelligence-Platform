import logging
from typing import Dict, Any
from fastapi import APIRouter
from backend.services.predictive_ai import predictive_ai_engine

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/forecasting", tags=["Predictive AI Forecasting"])

@router.get("/{company_name}")
async def get_valuation_forecast(company_name: str, years: int = 5) -> Dict[str, Any]:
    """Returns 1-5 year predictive valuation and revenue growth projections for an enterprise."""
    return predictive_ai_engine.forecast_company_trajectory(company_name, years)
