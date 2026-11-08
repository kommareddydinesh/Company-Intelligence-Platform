import logging
from typing import Dict, Any, Optional
from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel

from backend.investigator.investigation_pipeline import graphrag_investigator_pipeline, FullIntelligenceReportResponse
from backend.investigator.cypher_generator import nl_cypher_engine, CypherGenerationResponse
from backend.investigator.explainable_graph import explainable_graph_engine, RelationshipExplanationResponse
from backend.investigator.temporal_timeline import company_timeline_engine, CompanyTimelineResponse
from backend.investigator.what_changed_engine import what_changed_engine, CompanyChangeDiffResponse
from backend.investigator.graph_discovery import graph_discovery_engine, GraphDiscoveryResponse
from backend.investigator.scenario_simulator import scenario_simulator, StrategicScenarioResponse

# Import Advanced SOTA Investigator Modules
from backend.investigator.crag_self_reflection import crag_engine, CRAGReflectionResult
from backend.investigator.contagion_risk_engine import contagion_risk_engine, ContagionSimulationResult
from backend.investigator.doc_graph_extractor import doc_graph_extractor, FilingAnalysisResult
from backend.investigator.adversarial_debate import multi_agent_debate_engine, AdversarialDebateResult
from backend.investigator.anomaly_drift_detector import temporal_drift_engine, TemporalDriftResult

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/investigator", tags=["Autonomous GraphRAG Investigator"])

# Existing Request Models
class InvestigationRequest(BaseModel):
    query: str
    target_company: Optional[str] = None

class NlToCypherRequest(BaseModel):
    query: str

# New SOTA Feature Request Models
class CRAGRequest(BaseModel):
    query: str
    company_name: str
    initial_text: Optional[str] = "NVIDIA is a leader in accelerated compute with confirmed hyperscaler partnerships."
    tau: Optional[float] = 0.70

class ContagionRequest(BaseModel):
    epicenter: str = "TSMC"
    shock_magnitude_pct: float = 40.0
    shock_type: str = "SUPPLY_CHAIN_BOTTLENECK"

class FilingExtractionRequest(BaseModel):
    company_name: str = "NVIDIA"
    custom_text: Optional[str] = None

class AdversarialDebateRequest(BaseModel):
    acquirer_company: str = "Microsoft"
    target_company_or_initiative: str = "NVIDIA AI Foundry Unit"

# Existing Endpoints
@router.post("/investigate", response_model=FullIntelligenceReportResponse)
async def run_investigation(req: InvestigationRequest):
    """Executes an autonomous multi-stage GraphRAG intelligence investigation."""
    try:
        return await graphrag_investigator_pipeline.execute_investigation(req.query)
    except Exception as e:
        logger.error(f"Investigation execution error: {e}")
        raise HTTPException(status_code=500, detail=f"Investigation failed: {str(e)}")

@router.post("/nl-to-cypher", response_model=CypherGenerationResponse)
async def generate_nl_cypher(req: NlToCypherRequest):
    """Translates natural language questions to validated safe Neo4j Cypher queries."""
    return await nl_cypher_engine.execute_nl_to_cypher(req.query)

@router.get("/explain-relationship", response_model=RelationshipExplanationResponse)
async def explain_relationship(
    company_name: str = Query(..., description="Source company name"),
    target_entity: str = Query("", description="Optional target entity name")
):
    """Explains multi-hop relationships with path breakdown and Cypher queries."""
    return await explainable_graph_engine.explain_relationship(company_name, target_entity)

@router.get("/timeline/{company_name}", response_model=CompanyTimelineResponse)
async def get_company_timeline(company_name: str):
    """Retrieves verified historical company intelligence timeline (2023-2026)."""
    return company_timeline_engine.get_company_timeline(company_name)

@router.get("/what-changed/{company_name}", response_model=CompanyChangeDiffResponse)
async def get_company_changes(
    company_name: str,
    snapshot_a: str = Query("2024", description="Baseline snapshot year"),
    snapshot_b: str = Query("2026", description="Target snapshot year")
):
    """Compares historical company snapshots to highlight metric and relationship diffs."""
    return what_changed_engine.compare_snapshots(company_name, snapshot_a, snapshot_b)

@router.get("/graph-discovery/{company_name}", response_model=GraphDiscoveryResponse)
async def discover_graph_relationships(company_name: str):
    """Identifies multi-hop indirect connections across entities using actual Neo4j paths."""
    return await graph_discovery_engine.discover_indirect_relationships(company_name)

@router.get("/scenario-simulator", response_model=StrategicScenarioResponse)
async def simulate_strategic_scenario(
    company_name: str = Query("NVIDIA", description="Target company"),
    hypothetical_industry: str = Query("Quantum Computing & LLM Hardware", description="Hypothetical market entry")
):
    """Simulates strategic market entries in an isolated in-memory graph state."""
    return scenario_simulator.simulate_scenario(company_name, hypothetical_industry)


# =========================================================================
# NEW SOTA RESEARCH CAPABILITIES (FEATURES 1-5)
# =========================================================================

@router.post("/crag-self-reflection", response_model=CRAGReflectionResult)
async def execute_crag_self_reflection(req: CRAGRequest):
    """
    Feature 1: Self-Reflective / Adaptive GraphRAG (CRAG) Loop.
    Performs dynamic confidence thresholding (tau=0.70), adaptive k-hop expansion,
    faithfulness critique against graph triples, and hallucination self-correction.
    """
    try:
        return await crag_engine.run_crag_pipeline(
            query=req.query,
            company_name=req.company_name,
            initial_text=req.initial_text or "",
            tau=req.tau
        )
    except Exception as e:
        logger.error(f"CRAG execution error: {e}")
        raise HTTPException(status_code=500, detail=f"CRAG Self-Reflection failed: {str(e)}")

@router.post("/contagion-risk", response_model=ContagionSimulationResult)
async def simulate_contagion_risk(req: ContagionRequest):
    """
    Feature 2: Supply-Chain & Systemic Contagion Risk Propagation Engine.
    Models network shock cascades across supplier and partner dependencies,
    calculates Systemic Vulnerability Index (SVI), and traces propagation paths.
    """
    try:
        return await contagion_risk_engine.simulate_contagion(
            epicenter=req.epicenter,
            shock_magnitude_pct=req.shock_magnitude_pct,
            shock_type=req.shock_type
        )
    except Exception as e:
        logger.error(f"Contagion simulation error: {e}")
        raise HTTPException(status_code=500, detail=f"Contagion simulation failed: {str(e)}")

@router.post("/extract-filing", response_model=FilingAnalysisResult)
async def extract_filing_to_graph(req: FilingExtractionRequest):
    """
    Feature 3: Automated SEC 10-K / 10-Q Filing Document-to-Graph Extractor.
    Extracts structured entities, typed relationships, and generates Neo4j Cypher triples
    from regulatory 10-K filings and earnings call transcripts.
    """
    try:
        return await doc_graph_extractor.parse_and_extract_filing(
            company_name=req.company_name,
            custom_text=req.custom_text
        )
    except Exception as e:
        logger.error(f"Filing extraction error: {e}")
        raise HTTPException(status_code=500, detail=f"Filing extraction failed: {str(e)}")

@router.post("/adversarial-debate", response_model=AdversarialDebateResult)
async def conduct_adversarial_debate(req: AdversarialDebateRequest):
    """
    Feature 4: Multi-Agent Adversarial Debate System (M&A Due Diligence).
    Simulates a 3-round dialectic debate (Bull vs. Bear vs. CIO Arbiter)
    grounded in knowledge graph evidence with full scorecards and a synthesis memorandum.
    """
    try:
        return multi_agent_debate_engine.conduct_debate(
            acquirer=req.acquirer_company,
            target=req.target_company_or_initiative
        )
    except Exception as e:
        logger.error(f"Adversarial debate error: {e}")
        raise HTTPException(status_code=500, detail=f"Adversarial debate failed: {str(e)}")

@router.get("/temporal-drift/{company_name}", response_model=TemporalDriftResult)
async def detect_temporal_drift(company_name: str):
    """
    Feature 5: Cross-Entity Temporal Anomaly & Financial-Sentiment Drift Detector.
    Aligns chronological quarterly news sentiment with hard financial metrics,
    flags divergence anomalies (Bull Trap, Margin Decoupling), and traces graph provenance.
    """
    try:
        return temporal_drift_engine.analyze_company_drift(company_name)
    except Exception as e:
        logger.error(f"Temporal drift detection error: {e}")
        raise HTTPException(status_code=500, detail=f"Temporal drift detection failed: {str(e)}")
