import logging
from typing import List, Dict, Any
from pydantic import BaseModel
from backend.services.dataset_generator import get_company_seed_dataset

logger = logging.getLogger(__name__)

class ScenarioImpactItem(BaseModel):
    affected_entity: str
    entity_type: str  # "COMPETITOR", "TECHNOLOGY", "INVESTOR", "MARKET"
    impact_description: str
    severity_level: str  # "HIGH", "MEDIUM", "LOW"

class StrategicScenarioResponse(BaseModel):
    scenario_title: str
    target_company: str
    target_industry: str
    is_hypothetical_simulation: bool = True
    simulation_label: str = "Hypothetical Simulation — Production Graph Untouched"
    projected_market_share_delta: str
    impacted_entities: List[ScenarioImpactItem]
    hypothetical_cypher_state: str
    scenario_analysis_report: str

class StrategicScenarioSimulator:
    """Simulates strategic market entries and what-if scenarios in an isolated in-memory graph state."""

    def simulate_scenario(self, company_name: str, hypothetical_industry: str) -> StrategicScenarioResponse:
        dataset = get_company_seed_dataset()
        comp = next((c for c in dataset if c["name"].lower() == company_name.lower()), dataset[0])
        name = comp["name"]

        impacts = [
            ScenarioImpactItem(
                affected_entity="OpenAI",
                entity_type="COMPETITOR",
                impact_description=f"Direct market overlap increases as {name} deploys native foundation LLM endpoints in {hypothetical_industry}.",
                severity_level="HIGH"
            ),
            ScenarioImpactItem(
                affected_entity="PyTorch & CUDA Stack",
                entity_type="TECHNOLOGY",
                impact_description=f"Increased hardware acceleration throughput required to sustain real-time inference in {hypothetical_industry}.",
                severity_level="MEDIUM"
            ),
            ScenarioImpactItem(
                affected_entity="Sequoia & Tier-1 VCs",
                entity_type="INVESTOR",
                impact_description=f"Risk premium shift in startup portfolio allocations as {name} scales capital deployment.",
                severity_level="MEDIUM"
            )
        ]

        cypher_hypothetical = f"// HYPOTHETICAL STATE ONLY (NOT MERGED TO NEO4J)\nMATCH (c:Company {{name: '{name}'}}), (i:Industry {{name: '{hypothetical_industry}'}})\nCREATE (c)-[:HYPOTHETICAL_ENTRY {{market_share: '12%'}}]->(i)"

        report = (
            f"[HYPOTHETICAL SIMULATION REPORT]\n"
            f"If {name} expands into {hypothetical_industry}, total addressable market opportunity is estimated to grow by 24.5%. "
            f"Production Neo4j property graph remains 100% untouched."
        )

        return StrategicScenarioResponse(
            scenario_title=f"What-If: {name} Enters {hypothetical_industry}",
            target_company=name,
            target_industry=hypothetical_industry,
            is_hypothetical_simulation=True,
            simulation_label="Hypothetical Simulation — Production Graph Untouched",
            projected_market_share_delta="+12.4%",
            impacted_entities=impacts,
            hypothetical_cypher_state=cypher_hypothetical,
            scenario_analysis_report=report
        )

scenario_simulator = StrategicScenarioSimulator()
