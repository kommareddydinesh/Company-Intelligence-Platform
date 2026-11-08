import logging
from typing import Dict, Any
from pydantic import BaseModel

logger = logging.getLogger(__name__)

class InvestigationPlan(BaseModel):
    target_company: str
    investigation_query: str
    company_profile: bool = True
    financial_analysis: bool = True
    technology_analysis: bool = True
    competitor_analysis: bool = True
    investor_analysis: bool = True
    leadership_analysis: bool = True
    risk_analysis: bool = True
    relationship_analysis: bool = True

class InvestigationPlannerEngine:
    """Generates structured investigation plans for target enterprise queries."""

    def plan_investigation(self, query: str) -> InvestigationPlan:
        # Extract target company name
        companies = ["NVIDIA", "OpenAI", "Tesla", "Anthropic", "Google", "Microsoft", "Meta", "SpaceX", "Palantir", "Databricks", "Stripe"]
        matched_comp = next((c for c in companies if c.lower() in query.lower()), "NVIDIA")

        plan = InvestigationPlan(
            target_company=matched_comp,
            investigation_query=query,
            company_profile=True,
            financial_analysis=True,
            technology_analysis=True,
            competitor_analysis=True,
            investor_analysis=True,
            leadership_analysis=True,
            risk_analysis=True,
            relationship_analysis=True
        )
        logger.info(f"InvestigationPlannerEngine -> Created investigation plan for '{matched_comp}'.")
        return plan

investigation_planner_engine = InvestigationPlannerEngine()
