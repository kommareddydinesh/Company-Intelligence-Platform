from fastapi import APIRouter
from backend.models.schemas import AnalyticsDashboardResponse
from backend.analytics.analytics_service import analytics_service

router = APIRouter(prefix="/dashboard", tags=["Analytics Dashboard"])

@router.get("/analytics", response_model=AnalyticsDashboardResponse)
async def get_analytics_metrics():
    return analytics_service.get_dashboard_metrics()
