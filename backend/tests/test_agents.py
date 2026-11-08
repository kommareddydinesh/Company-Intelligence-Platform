import asyncio
import logging
from backend.agents.agentic_workflow import agentic_workflow
from backend.investigator.evidence_fusion import evidence_fusion_engine
from backend.investigator.claim_verifier import claim_verification_engine
from backend.investigator.cypher_generator import nl_cypher_engine
from backend.investigator.explainable_graph import explainable_graph_engine
from backend.investigator.temporal_timeline import company_timeline_engine
from backend.investigator.what_changed_engine import what_changed_engine
from backend.investigator.graph_discovery import graph_discovery_engine
from backend.investigator.scenario_simulator import scenario_simulator
from backend.investigator.investigation_pipeline import graphrag_investigator_pipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("SystemTestSuite")

async def run_full_system_test_suite():
    logger.info("==================================================")
    logger.info("STARTING COMPREHENSIVE GRAPHRAG SYSTEM TEST SUITE")
    logger.info("==================================================")

    # 1. Test Cypher Safety Validation
    logger.info("\n--- 1. Testing Cypher Safety Validation ---")
    safe_valid = nl_cypher_engine.validate_cypher_safety("MATCH (c:Company) RETURN c")
    unsafe_valid = nl_cypher_engine.validate_cypher_safety("MATCH (c:Company) DETACH DELETE c")
    assert safe_valid is True, "Safe query should pass validation"
    assert unsafe_valid is False, "Unsafe DELETE query should fail validation"
    logger.info("✅ Cypher Safety Validation Test Passed.")

    # 2. Test Evidence Fusion Engine
    logger.info("\n--- 2. Testing Evidence Fusion Engine ---")
    postgres_data = [{"name": "NVIDIA", "industry": "AI Hardware", "valuation_usd": 3e12, "revenue_usd": 6e10}]
    vector_res = [{"name": "NVIDIA", "description": "GPU leader", "similarity_score": 0.95}]
    graph_records = [{"source": "NVIDIA", "relation": "USES_TECHNOLOGY", "target": "CUDA"}]
    fused = evidence_fusion_engine.fuse_evidence(postgres_data, vector_res, graph_records)
    assert len(fused) == 3, f"Expected 3 fused evidence items, got {len(fused)}"
    logger.info("✅ Evidence Fusion Test Passed.")

    # 3. Test Claim Verification Engine
    logger.info("\n--- 3. Testing Claim Verification Engine ---")
    claims = ["NVIDIA is a leader in GPU compute.", "Unrelated statement regarding alien space probes."]
    verifications = claim_verification_engine.verify_claims(claims, fused)
    assert len(verifications) == 2, "Expected 2 claim verification outputs"
    assert verifications[0].status == "Supported", "Claim 1 should be Supported"
    assert verifications[1].status == "Unsupported", "Claim 2 should be Unsupported"
    logger.info("✅ Claim Verification Test Passed.")

    # 4. Test Explainable Graph Reasoning
    logger.info("\n--- 4. Testing Explainable Graph Reasoning ---")
    explanation = await explainable_graph_engine.explain_relationship("NVIDIA", "OpenAI")
    assert len(explanation.path_hops) > 0, "Expected path hops in relationship explanation"
    logger.info("✅ Explainable Graph Reasoning Test Passed.")

    # 5. Test Company Timeline & What-Changed Engine
    logger.info("\n--- 5. Testing Timeline & What-Changed Engine ---")
    timeline = company_timeline_engine.get_company_timeline("NVIDIA")
    diff = what_changed_engine.compare_snapshots("NVIDIA", "2024", "2026")
    assert timeline.total_events > 0, "Timeline should contain events"
    assert len(diff.metric_changes) > 0, "What-Changed diff should contain metric changes"
    logger.info("✅ Timeline & What-Changed Test Passed.")

    # 6. Test Scenario Simulator (Isolated Graph)
    logger.info("\n--- 6. Testing Strategic Scenario Simulator ---")
    scenario = scenario_simulator.simulate_scenario("NVIDIA", "Quantum Computing")
    assert scenario.is_hypothetical_simulation is True, "Scenario must be labeled as hypothetical"
    logger.info("✅ Strategic Scenario Simulator Test Passed.")

    # 7. Test GraphRAG Investigator End-to-End Pipeline
    logger.info("\n--- 7. Testing Full GraphRAG Investigator End-to-End ---")
    report = await graphrag_investigator_pipeline.execute_investigation("Investigate NVIDIA")
    assert report.company_name == "NVIDIA", "Report target company should match"
    assert len(report.fused_evidence) > 0, "Report must contain fused evidence"
    assert len(report.verified_claims) > 0, "Report must contain verified claims"
    assert report.execution_trace.total_latency_ms > 0, "Execution trace latency must be recorded"
    logger.info("✅ Full GraphRAG Investigator End-to-End Test Passed.")

    logger.info("\n==================================================")
    logger.info("ALL SYSTEM TESTS PASSED SUCCESSFULLY! (7/7 PASSED)")
    logger.info("==================================================")

if __name__ == "__main__":
    asyncio.run(run_full_system_test_suite())
