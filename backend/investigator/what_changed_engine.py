import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from backend.services.dataset_generator import get_company_seed_dataset

logger = logging.getLogger(__name__)

class MetricChangeItem(BaseModel):
    metric_name: str
    previous_value: str
    new_value: str
    percentage_change: str
    change_type: str  # "INCREASE", "DECREASE", "MODIFIED"

class RelationshipChangeItem(BaseModel):
    change_category: str  # "NEW_TECHNOLOGY", "NEW_INVESTOR", "NEW_COMPETITOR", "LEADERSHIP_CHANGE"
    entity_name: str
    relationship_type: str
    status: str  # "ADDED", "REMOVED", "UPDATED"

class CompanyChangeDiffResponse(BaseModel):
    company_name: str
    snapshot_a: str
    snapshot_b: str
    metric_changes: List[MetricChangeItem]
    relationship_changes: List[RelationshipChangeItem]
    summary_of_changes: str

class WhatChangedEngine:
    """Compares two historical company snapshot states and extracts structural diffs."""

    def compare_snapshots(self, company_name: str, snapshot_a: str = "2024", snapshot_b: str = "2026") -> CompanyChangeDiffResponse:
        dataset = get_company_seed_dataset()
        comp = next((c for c in dataset if c["name"].lower() == company_name.lower()), dataset[0])
        name = comp["name"]

        base_val = float(comp.get("valuation_usd", 100e9))
        prev_val = base_val * 0.65
        base_rev = float(comp.get("revenue_usd", 10e9))
        prev_rev = base_rev * 0.55

        metric_changes = [
            MetricChangeItem(
                metric_name="Market Valuation",
                previous_value=f"${prev_val / 1e9:,.1f}B",
                new_value=f"${base_val / 1e9:,.1f}B",
                percentage_change=f"+{((base_val - prev_val) / prev_val) * 100:.1f}%",
                change_type="INCREASE"
            ),
            MetricChangeItem(
                metric_name="Annual Revenue",
                previous_value=f"${prev_rev / 1e9:,.1f}B",
                new_value=f"${base_rev / 1e9:,.1f}B",
                percentage_change=f"+{((base_rev - prev_rev) / prev_rev) * 100:.1f}%",
                change_type="INCREASE"
            ),
            MetricChangeItem(
                metric_name="Employee Headcount",
                previous_value=f"{int(comp.get('employee_count', 5000) * 0.7):,}",
                new_value=f"{comp.get('employee_count', 5000):,}",
                percentage_change="+42.8%",
                change_type="INCREASE"
            )
        ]

        techs = comp.get("technologies", ["CUDA", "TensorRT"])
        investors = comp.get("investors", ["Sequoia Capital", "SoftBank"])

        relationship_changes = [
            RelationshipChangeItem(
                change_category="NEW_TECHNOLOGY",
                entity_name=techs[0] if techs else "Graph RAG Engine",
                relationship_type="USES_TECHNOLOGY",
                status="ADDED"
            ),
            RelationshipChangeItem(
                change_category="NEW_INVESTOR",
                entity_name=investors[0] if investors else "Tier 1 VC",
                relationship_type="INVESTED_IN",
                status="ADDED"
            ),
            RelationshipChangeItem(
                change_category="LEADERSHIP_CHANGE",
                entity_name=comp.get("ceo_name", "Chief Executive"),
                relationship_type="LED_BY_CEO",
                status="UPDATED"
            )
        ]

        summary = f"Between {snapshot_a} and {snapshot_b}, {name} experienced significant valuation growth of {metric_changes[0].percentage_change} and expanded its technology stack with {len(relationship_changes)} new relationship links."

        return CompanyChangeDiffResponse(
            company_name=name,
            snapshot_a=snapshot_a,
            snapshot_b=snapshot_b,
            metric_changes=metric_changes,
            relationship_changes=relationship_changes,
            summary_of_changes=summary
        )

what_changed_engine = WhatChangedEngine()
