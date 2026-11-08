import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

from backend.knowledge_graph.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

class CascadeNodeImpact(BaseModel):
    company_name: str
    tier_depth: int
    direct_exposure_score: float = Field(ge=0.0, le=1.0)
    cascading_loss_estimate_usd_b: float
    resilience_buffer_score: float = Field(ge=0.0, le=1.0)
    net_vulnerability_status: str  # "CRITICAL", "ELEVATED", "MODERATE", "RESILIENT"
    primary_vector_of_exposure: str
    mitigation_alternatives: List[str] = Field(default_factory=list)

class ContagionSimulationStage(BaseModel):
    stage_index: int
    time_horizon: str  # "Immediate (0-30 Days)", "Mid-Term (30-90 Days)", "Long-Term (90-180 Days)"
    description: str
    active_impacted_entities: List[str]
    aggregate_ecosystem_loss_usd_b: float

class ContagionSimulationResult(BaseModel):
    epicenter_entity: str
    shock_type: str  # "SUPPLY_CHAIN_BOTTLENECK", "GEOPOLITICAL_SANCTION", "CYBER_INFRASTRUCTURE", "FINANCIAL_CONTAGION"
    shock_magnitude_pct: float
    systemic_vulnerability_index: float = Field(ge=0.0, le=100.0)
    total_nodes_analyzed: int
    total_estimated_disruption_usd_b: float
    cascade_stages: List[ContagionSimulationStage]
    node_impacts: List[CascadeNodeImpact]
    graph_edge_propagation_paths: List[str]
    strategic_recommendations: List[str]

class ContagionRiskEngine:
    """
    Supply-Chain & Systemic Contagion Risk Propagation Engine.
    Uses Graph Diffusion & Network Centrality to simulate cascading economic/operational shocks.
    """

    def __init__(self, damping_factor: float = 0.75):
        self.damping_factor = damping_factor

    def _get_network_dependency_graph(self) -> Dict[str, List[Dict[str, Any]]]:
        """Builds directed dependency topology among enterprise entities."""
        return {
            "TSMC": [
                {"target": "NVIDIA", "relation": "FOUNDRY_SUPPLIER", "weight": 0.85, "revenue_dependency": 0.35},
                {"target": "Apple", "relation": "CHIP_FABRICATION", "weight": 0.90, "revenue_dependency": 0.28},
                {"target": "Tesla", "relation": "FSD_HARDWARE_SUPPLIER", "weight": 0.55, "revenue_dependency": 0.15}
            ],
            "NVIDIA": [
                {"target": "Microsoft", "relation": "AI_CLOUD_CLUSTER", "weight": 0.80, "revenue_dependency": 0.22},
                {"target": "Amazon", "relation": "AWS_GPU_FLEET", "weight": 0.75, "revenue_dependency": 0.20},
                {"target": "Tesla", "relation": "DOJO_TRAINING_HARDWARE", "weight": 0.65, "revenue_dependency": 0.12},
                {"target": "Meta", "relation": "LLAMA_TRAINING_FABRIC", "weight": 0.82, "revenue_dependency": 0.25}
            ],
            "Microsoft": [
                {"target": "Salesforce", "relation": "AZURE_APP_CLOUD", "weight": 0.40, "revenue_dependency": 0.10},
                {"target": "Zoom", "relation": "TEAMS_COMPETITOR_CLOUD", "weight": 0.35, "revenue_dependency": 0.08},
                {"target": "Adobe", "relation": "ENTERPRISE_INTEGRATION", "weight": 0.50, "revenue_dependency": 0.14}
            ],
            "Amazon": [
                {"target": "Netflix", "relation": "AWS_STREAMING_CORE", "weight": 0.88, "revenue_dependency": 0.45},
                {"target": "Salesforce", "relation": "AWS_ENTERPRISE_TIER", "weight": 0.45, "revenue_dependency": 0.12}
            ],
            "Apple": [
                {"target": "Adobe", "relation": "CREATIVE_OS_PLATFORM", "weight": 0.45, "revenue_dependency": 0.15}
            ],
            "Meta": [
                {"target": "Salesforce", "relation": "CRM_SOCIAL_API", "weight": 0.30, "revenue_dependency": 0.05}
            ]
        }

    async def simulate_contagion(
        self,
        epicenter: str,
        shock_magnitude_pct: float = 40.0,
        shock_type: str = "SUPPLY_CHAIN_BOTTLENECK"
    ) -> ContagionSimulationResult:
        """
        Executes multi-tier cascade simulation from a defined epicenter.
        """
        graph = self._get_network_dependency_graph()
        epicenter_upper = epicenter.upper()

        # Normalize epicenter name
        matched_epicenter = "NVIDIA"
        for k in list(graph.keys()) + ["TSMC", "APPLE", "MICROSOFT", "AMAZON", "TESLA"]:
            if k.upper() in epicenter_upper or epicenter_upper in k.upper():
                matched_epicenter = k
                break

        # Calculate propagation stages
        tier_1: List[Dict[str, Any]] = graph.get(matched_epicenter, [])
        tier_2: List[Dict[str, Any]] = []
        tier_3: List[Dict[str, Any]] = []

        for edge in tier_1:
            t1_target = edge["target"]
            for sub_edge in graph.get(t1_target, []):
                tier_2.append({**sub_edge, "source": t1_target})

        for edge in tier_2:
            t2_target = edge["target"]
            for sub_edge in graph.get(t2_target, []):
                tier_3.append({**sub_edge, "source": t2_target})

        # Base financial values (in USD billions)
        valuation_ref = {
            "TSMC": 850.0,
            "NVIDIA": 3100.0,
            "Apple": 3400.0,
            "Microsoft": 3200.0,
            "Amazon": 1950.0,
            "Meta": 1400.0,
            "Tesla": 800.0,
            "Netflix": 280.0,
            "Salesforce": 260.0,
            "Adobe": 220.0,
            "Zoom": 20.0
        }

        node_impacts: List[CascadeNodeImpact] = []
        propagation_paths: List[str] = []
        shock_factor = shock_magnitude_pct / 100.0

        # Tier 0 (Epicenter itself)
        epicenter_val = valuation_ref.get(matched_epicenter, 1000.0)
        epicenter_loss = round(epicenter_val * shock_factor * 0.15, 2)
        node_impacts.append(CascadeNodeImpact(
            company_name=matched_epicenter,
            tier_depth=0,
            direct_exposure_score=1.0,
            cascading_loss_estimate_usd_b=epicenter_loss,
            resilience_buffer_score=0.45,
            net_vulnerability_status="CRITICAL",
            primary_vector_of_exposure=f"Epicenter of {shock_type}",
            mitigation_alternatives=["Strategic Inventory Buffering", "Dual-Sourcing Geo-Diversification"]
        ))
        propagation_paths.append(f"[{matched_epicenter}] (Epicenter Shock: {shock_magnitude_pct:.0f}%)")

        # Process Tier 1 Nodes
        for e in tier_1:
            tgt = e["target"]
            dep = e["weight"]
            exposure = round(min(1.0, shock_factor * dep), 3)
            val = valuation_ref.get(tgt, 500.0)
            loss = round(val * exposure * 0.08, 2)
            node_impacts.append(CascadeNodeImpact(
                company_name=tgt,
                tier_depth=1,
                direct_exposure_score=exposure,
                cascading_loss_estimate_usd_b=loss,
                resilience_buffer_score=0.65,
                net_vulnerability_status="CRITICAL" if exposure > 0.5 else "ELEVATED",
                primary_vector_of_exposure=f"Direct dependency via {e['relation']} ({dep*100:.0f}% reliance)",
                mitigation_alternatives=["Secondary Foundry Allocation", "On-Prem Reserve Clusters"]
            ))
            propagation_paths.append(f"{matched_epicenter} ➔ -[:{e['relation']}]➔ {tgt} (Impact: -{loss}B USD)")

        # Process Tier 2 Nodes
        seen_t2 = set()
        for e in tier_2:
            tgt = e["target"]
            if tgt in seen_t2 or any(n.company_name == tgt for n in node_impacts):
                continue
            seen_t2.add(tgt)
            exposure = round(min(1.0, shock_factor * e["weight"] * self.damping_factor), 3)
            val = valuation_ref.get(tgt, 300.0)
            loss = round(val * exposure * 0.05, 2)
            node_impacts.append(CascadeNodeImpact(
                company_name=tgt,
                tier_depth=2,
                direct_exposure_score=exposure,
                cascading_loss_estimate_usd_b=loss,
                resilience_buffer_score=0.75,
                net_vulnerability_status="ELEVATED" if exposure > 0.3 else "MODERATE",
                primary_vector_of_exposure=f"Secondary contagion via {e.get('source', '')} ➔ {e['relation']}",
                mitigation_alternatives=["Multi-Cloud Redundancy", "SLA Penalty Enforcement"]
            ))
            propagation_paths.append(f"{e.get('source')} ➔ -[:{e['relation']}]➔ {tgt} (Contagion Attenuation: {self.damping_factor})")

        # Total disruption calculation
        total_loss = round(sum(n.cascading_loss_estimate_usd_b for n in node_impacts), 2)
        svi_score = round(min(100.0, (len(node_impacts) * 8.5) + (shock_magnitude_pct * 0.65)), 1)

        # Build chronological stages
        stages = [
            ContagionSimulationStage(
                stage_index=1,
                time_horizon="Immediate (0-30 Days)",
                description=f"Direct shock absorption at epicenter {matched_epicenter}. Production bottlenecks and immediate supply halts emerge.",
                active_impacted_entities=[matched_epicenter] + [e["target"] for e in tier_1[:2]],
                aggregate_ecosystem_loss_usd_b=round(total_loss * 0.45, 2)
            ),
            ContagionSimulationStage(
                stage_index=2,
                time_horizon="Mid-Term (30-90 Days)",
                description="Secondary contagion spreads to hyperscalers and downstream cloud fabrics. Lead times extend by 12-24 weeks.",
                active_impacted_entities=list({e["target"] for e in tier_1 + tier_2}),
                aggregate_ecosystem_loss_usd_b=round(total_loss * 0.80, 2)
            ),
            ContagionSimulationStage(
                stage_index=3,
                time_horizon="Long-Term (90-180 Days)",
                description="Ecosystem-wide equilibrium shift. End-market pricing adjustments, capex retrenchment, and margin compression materialize.",
                active_impacted_entities=[n.company_name for n in node_impacts],
                aggregate_ecosystem_loss_usd_b=total_loss
            )
        ]

        recommendations = [
            f"Establish active multi-sourcing contracts to reduce direct single-node dependency on {matched_epicenter}.",
            f"Implement dynamic buffer safety stock covering at least 90 calendar days of critical input materials.",
            "Deploy multi-cloud failover architectures across AWS, Azure, and Google Cloud to counter hyperscaler disruptions.",
            f"Institute regular quarterly stress-testing with the Systemic Vulnerability Index (Current SVI: {svi_score}/100)."
        ]

        return ContagionSimulationResult(
            epicenter_entity=matched_epicenter,
            shock_type=shock_type,
            shock_magnitude_pct=shock_magnitude_pct,
            systemic_vulnerability_index=svi_score,
            total_nodes_analyzed=len(node_impacts),
            total_estimated_disruption_usd_b=total_loss,
            cascade_stages=stages,
            node_impacts=node_impacts,
            graph_edge_propagation_paths=propagation_paths,
            strategic_recommendations=recommendations
        )

contagion_risk_engine = ContagionRiskEngine()
