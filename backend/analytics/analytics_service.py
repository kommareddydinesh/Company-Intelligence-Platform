import logging
from typing import Dict, Any, List
from backend.services.dataset_generator import get_company_seed_dataset
from backend.models.schemas import AnalyticsDashboardResponse, IndustryDistribution

logger = logging.getLogger(__name__)

class AnalyticsService:
    def __init__(self):
        pass

    def get_dashboard_metrics(self) -> AnalyticsDashboardResponse:
        """Calculates aggregated business intelligence dashboard analytics."""
        companies = get_company_seed_dataset()

        total_companies = len(companies)
        total_funding = sum(c.get("total_funding_usd", 0.0) for c in companies)
        total_revenue = sum(c.get("revenue_usd", 0.0) for c in companies)

        industry_map: Dict[str, Dict[str, Any]] = {}
        country_map: Dict[str, int] = {}
        tech_map: Dict[str, int] = {}
        funding_by_year: Dict[str, float] = {}

        for c in companies:
            ind = c.get("industry", "Other")
            if ind not in industry_map:
                industry_map[ind] = {"count": 0, "funding": 0.0}
            industry_map[ind]["count"] += 1
            industry_map[ind]["funding"] += c.get("total_funding_usd", 0.0)

            ctr = c.get("country", "United States")
            country_map[ctr] = country_map.get(ctr, 0) + 1

            for t in c.get("technologies", []):
                tech_map[t] = tech_map.get(t, 0) + 1

            f_year = str(c.get("founded_year", 2020))
            funding_by_year[f_year] = funding_by_year.get(f_year, 0.0) + c.get("total_funding_usd", 0.0)

        top_industries = [
            IndustryDistribution(
                industry=ind,
                company_count=data["count"],
                total_funding_usd=data["funding"]
            )
            for ind, data in industry_map.items()
        ]

        return AnalyticsDashboardResponse(
            total_companies=total_companies,
            total_funding_usd=total_funding,
            total_revenue_usd=total_revenue,
            top_industries=top_industries,
            country_breakdown=country_map,
            top_technologies=tech_map,
            funding_distribution_by_year=funding_by_year
        )

analytics_service = AnalyticsService()
