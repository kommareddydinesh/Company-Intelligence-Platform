import asyncio
import logging
from backend.investigator.crag_self_reflection import crag_engine
from backend.investigator.contagion_risk_engine import contagion_risk_engine
from backend.investigator.doc_graph_extractor import doc_graph_extractor
from backend.investigator.adversarial_debate import multi_agent_debate_engine
from backend.investigator.anomaly_drift_detector import temporal_drift_engine

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AdvancedFeaturesTestSuite")

async def run_advanced_features_test_suite():
    logger.info("================================================================")
    logger.info("STARTING SOTA ADVANCED FEATURES TEST SUITE (FEATURES 1-5)")
    logger.info("================================================================")

    # 1. Test Feature 1: CRAG Self-Reflection Engine
    logger.info("\n--- 1. Testing Feature 1: Self-Reflective CRAG Loop ---")
    crag_res = await crag_engine.run_crag_pipeline(
        query="Verify NVIDIA supply chain resilience and secret alien technology acquisition",
        company_name="NVIDIA",
        initial_text="NVIDIA has secretly acquired alien quantum processors and will definitely conquer all computing. It also maintains verified TSMC foundry relations.",
        tau=0.70
    )
    assert crag_res.threshold_tau == 0.70, "Threshold tau must match"
    assert len(crag_res.critiques) > 0, "Critiques must be populated"
    assert crag_res.hallucination_rate > 0.0, "Hallucinated speculative claims must be flagged"
    assert len(crag_res.reflection_log) > 0, "Reflection logs must record execution steps"
    logger.info(f"✅ Feature 1 Passed! Faithfulness: {crag_res.overall_faithfulness_score}, Hallucination Rate: {crag_res.hallucination_rate*100:.0f}%")

    # 2. Test Feature 2: Contagion Risk Propagation Engine
    logger.info("\n--- 2. Testing Feature 2: Contagion Risk Propagation Engine ---")
    contagion_res = await contagion_risk_engine.simulate_contagion(
        epicenter="TSMC",
        shock_magnitude_pct=45.0,
        shock_type="SUPPLY_CHAIN_BOTTLENECK"
    )
    assert contagion_res.epicenter_entity == "TSMC", "Epicenter should be TSMC"
    assert contagion_res.total_nodes_analyzed >= 3, "At least 3 network nodes should be impacted"
    assert contagion_res.systemic_vulnerability_index > 0.0, "SVI score must be positive"
    assert len(contagion_res.cascade_stages) == 3, "3 chronological cascade stages expected"
    assert len(contagion_res.graph_edge_propagation_paths) > 0, "Edge propagation paths must be traced"
    logger.info(f"✅ Feature 2 Passed! SVI Score: {contagion_res.systemic_vulnerability_index}, Analyzed Nodes: {contagion_res.total_nodes_analyzed}")

    # 3. Test Feature 3: SEC 10-K Document-to-Graph Extractor
    logger.info("\n--- 3. Testing Feature 3: SEC 10-K Document-to-Graph Extractor ---")
    filing_res = await doc_graph_extractor.parse_and_extract_filing("NVIDIA")
    assert filing_res.company_name == "NVIDIA", "Company name should match"
    assert len(filing_res.sections_parsed) >= 2, "Should parse at least 2 SEC sections"
    assert filing_res.total_triples_extracted > 0, "Should extract factual triples"
    assert len(filing_res.generated_cypher_statements) > 0, "Should generate valid Cypher statements"
    assert any("TSMC" in t.object or "TSMC" in t.subject for t in filing_res.extracted_triples), "Should identify TSMC foundry relationship"
    logger.info(f"✅ Feature 3 Passed! Extracted Triples: {filing_res.total_triples_extracted}, Cypher Stmts: {len(filing_res.generated_cypher_statements)}")

    # 4. Test Feature 4: Multi-Agent Adversarial Debate
    logger.info("\n--- 4. Testing Feature 4: Multi-Agent Adversarial Debate ---")
    debate_res = multi_agent_debate_engine.conduct_debate("Microsoft", "NVIDIA AI Foundry Unit")
    assert debate_res.rounds_executed == 3, "Must execute 3 structured dialectic debate rounds"
    assert len(debate_res.debate_transcript) == 5, "Must contain 5 speaker turns across 3 rounds"
    assert debate_res.bull_scorecard.weighted_composite_index > 70.0, "Bull scorecard composite must be high"
    assert debate_res.bear_scorecard.risk_exposure_score > 70.0, "Bear risk exposure must be high"
    assert debate_res.due_diligence_memorandum.deal_feasibility_pct > 0.0, "Feasibility percentage must be calculated"
    logger.info(f"✅ Feature 4 Passed! Verdict: {debate_res.due_diligence_memorandum.final_verdict}, Feasibility: {debate_res.due_diligence_memorandum.deal_feasibility_pct}%")

    # 5. Test Feature 5: Cross-Entity Temporal Anomaly & Drift Detector
    logger.info("\n--- 5. Testing Feature 5: Temporal Anomaly & Drift Detector ---")
    drift_res = temporal_drift_engine.analyze_company_drift("NVIDIA")
    assert drift_res.company_name == "NVIDIA", "Company name should match"
    assert len(drift_res.quarterly_data_points) == 8, "Must analyze 8 historical quarters"
    assert drift_res.correlation_coefficient > 0.5, "Correlation coefficient must be computed"
    assert len(drift_res.active_anomalies) > 0, "Should detect at least 1 temporal divergence anomaly"
    assert all(a.graph_provenance_path for a in drift_res.active_anomalies), "All anomalies must have graph provenance"
    logger.info(f"✅ Feature 5 Passed! Correlation: {drift_res.correlation_coefficient}, Anomalies Detected: {len(drift_res.active_anomalies)}")

    logger.info("\n================================================================")
    logger.info("ALL 5 ADVANCED SOTA FEATURES PASSED VERIFICATION! (5/5 PASSED)")
    logger.info("================================================================")

if __name__ == "__main__":
    asyncio.run(run_advanced_features_test_suite())
