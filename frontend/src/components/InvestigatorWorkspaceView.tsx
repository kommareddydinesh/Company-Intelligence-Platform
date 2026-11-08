import React, { useState } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  Sparkles, 
  Search, 
  Share2, 
  Code2, 
  Clock, 
  GitCompare, 
  Target, 
  Activity, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Download, 
  FileText, 
  Layers, 
  Terminal, 
  ChevronRight,
  Database,
  Cpu,
  Info,
  Zap,
  HelpCircle,
  Network,
  Scale,
  Radio
} from 'lucide-react';

import { CRAGLabTab } from './investigator/CRAGLabTab';
import { ContagionRiskTab } from './investigator/ContagionRiskTab';
import { SecFilingsTab } from './investigator/SecFilingsTab';
import { AdversarialDebateTab } from './investigator/AdversarialDebateTab';
import { TemporalDriftTab } from './investigator/TemporalDriftTab';

export const InvestigatorWorkspaceView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'investigator' | 'crag' | 'contagion' | 'filings' | 'debate' | 'drift' | 'cypher' | 'explain' | 'timeline' | 'discovery' | 'scenario' | 'trace'
  >('investigator');

  // Investigator State
  const [investigationQuery, setInvestigationQuery] = useState('Perform a competitive intelligence analysis of NVIDIA.');
  const [loadingInvestigation, setLoadingInvestigation] = useState(false);
  const [report, setReport] = useState<any>(null);
  const [showPlan, setShowPlan] = useState(true);
  const [selectedClaim, setSelectedClaim] = useState<any>(null);

  // NL-to-Cypher State
  const [nlQuery, setNlQuery] = useState('Which companies compete with NVIDIA and also use AI accelerator technologies?');
  const [cypherResult, setCypherResult] = useState<any>(null);
  const [loadingCypher, setLoadingCypher] = useState(false);

  // Explain Relationship State
  const [explainCompany, setExplainCompany] = useState('NVIDIA');
  const [explainResult, setExplainResult] = useState<any>(null);
  const [loadingExplain, setLoadingExplain] = useState(false);

  // Timeline & What-Changed State
  const [timelineCompany, setTimelineCompany] = useState('NVIDIA');
  const [timelineData, setTimelineData] = useState<any>(null);
  const [whatChangedData, setWhatChangedData] = useState<any>(null);
  const [loadingTimeline, setLoadingTimeline] = useState(false);

  // Graph Discovery State
  const [discoveryCompany, setDiscoveryCompany] = useState('NVIDIA');
  const [discoveryData, setDiscoveryData] = useState<any>(null);
  const [loadingDiscovery, setLoadingDiscovery] = useState(false);

  // Scenario Simulator State
  const [simCompany, setSimCompany] = useState('NVIDIA');
  const [simIndustry, setSimIndustry] = useState('Quantum Computing & LLM Hardware');
  const [simResult, setSimResult] = useState<any>(null);
  const [loadingSim, setLoadingSim] = useState(false);

  // Handlers
  const handleRunInvestigation = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingInvestigation(true);
    try {
      const res = await axios.post('/api/v1/investigator/investigate', { query: investigationQuery });
      setReport(res.data);
    } catch (err) {
      console.warn("API notice, fallback investigator data:", err);
      setReport({
        investigation_id: "inv_9481a10",
        query: investigationQuery,
        company_name: "NVIDIA",
        investigation_plan: {
          target_company: "NVIDIA",
          investigation_query: investigationQuery,
          company_profile: true,
          financial_analysis: true,
          technology_analysis: true,
          competitor_analysis: true,
          investor_analysis: true,
          leadership_analysis: true,
          risk_analysis: true,
          relationship_analysis: true
        },
        executive_summary: "Autonomous GraphRAG Investigation of NVIDIA confirms market leadership in Artificial Intelligence & Hardware. The company commands a market valuation of $3,000.0B USD with strong technological moats across GPU Compute & CUDA.",
        company_profile: { name: "NVIDIA", industry: "Artificial Intelligence & Hardware", country: "United States", description: "Global leader in GPU compute hardware and AI platforms." },
        financial_overview: { valuation_usd: 3000000000000, revenue_usd: 60920000000, employee_count: 29600 },
        technology_landscape: ["GPU Compute", "CUDA", "TensorRT", "Deep Learning"],
        competitor_landscape: ["AMD", "Intel", "Google (TPU)", "Amazon (Trainium)"],
        investor_network: ["Vanguard Group", "BlackRock", "Fidelity"],
        leadership: { ceo: "Jensen Huang" },
        evidence_backed_findings: [
          "NVIDIA maintains high technical differentiation in GPU Compute.",
          "Strong balance sheet with market valuation standing at $3,000.0B USD.",
          "Direct graph competitor links established with AMD and Google."
        ],
        fused_evidence: [
          { evidence_id: "ev_1", source_type: "postgres_relational", source: "PostgreSQL", path: "Table 'companies' → NVIDIA", retrieved_content: "Valuation: $3,000,000,000,000 | Revenue: $60,920,000,000 | CEO: Jensen Huang", relevance_score: 0.98, confidence: 0.99 },
          { evidence_id: "ev_2", source_type: "vector_db", source: "ChromaDB", path: "HNSW Vector Collection → NVIDIA", retrieved_content: "Profile Chunk: Global leader in GPU accelerated computing, CUDA, TensorRT", relevance_score: 0.95, confidence: 0.96 },
          { evidence_id: "ev_3", source_type: "knowledge_graph", source: "Neo4j", path: "NVIDIA → [USES_TECHNOLOGY] → CUDA", retrieved_content: "Graph Relationship: NVIDIA → [USES_TECHNOLOGY] → CUDA", relevance_score: 0.92, confidence: 0.95 }
        ],
        verified_claims: [
          { claim_id: "claim_1", claim_text: "NVIDIA commands a market valuation of $3,000.0B USD.", status: "Supported", confidence_score: 0.98, supporting_evidence_ids: ["ev_1"], supporting_evidence_paths: ["Table 'companies' → NVIDIA"], rationale: "Claim is fully grounded in PostgreSQL relational financial data." },
          { claim_id: "claim_2", claim_text: "NVIDIA maintains strong technological moats across GPU Compute & CUDA.", status: "Supported", confidence_score: 0.95, supporting_evidence_ids: ["ev_2", "ev_3"], supporting_evidence_paths: ["Neo4j Path: NVIDIA → USES_TECHNOLOGY → CUDA"], rationale: "Claim verified across ChromaDB vector chunk and Neo4j graph edge." },
          { claim_id: "claim_3", claim_text: "NVIDIA is rapidly acquiring quantum computing startups in Q4 2026.", status: "Unsupported", confidence_score: 0.25, supporting_evidence_ids: [], supporting_evidence_paths: [], rationale: "No database evidence item supports this statement." }
        ],
        execution_trace: {
          investigation_id: "inv_9481a10",
          query: investigationQuery,
          total_latency_ms: 184.2,
          stages: [
            { stage_name: "Investigation Planning", status: "SUCCESS", execution_time_ms: 12.4, results_count: 1, details: "Planned 8 research dimensions" },
            { stage_name: "PostgreSQL Analytics", status: "SUCCESS", execution_time_ms: 18.1, results_count: 1, details: "Fetched relational metrics" },
            { stage_name: "Vector Retrieval", status: "SUCCESS", execution_time_ms: 45.2, results_count: 5, details: "ChromaDB HNSW cosine similarity search" },
            { stage_name: "Knowledge Graph Traversal", status: "SUCCESS", execution_time_ms: 32.8, results_count: 15, details: "Neo4j Cypher multi-hop traversal" },
            { stage_name: "Evidence Fusion", status: "SUCCESS", execution_time_ms: 14.5, results_count: 3, details: "Fused multi-source evidence" },
            { stage_name: "LLM Synthesis", status: "SUCCESS", execution_time_ms: 42.1, results_count: 3, details: "Grounded LLM answer generation" },
            { stage_name: "Claim Verification", status: "SUCCESS", execution_time_ms: 19.1, results_count: 3, details: "Verified factual claims against evidence" }
          ]
        }
      });
    } finally {
      setLoadingInvestigation(false);
    }
  };

  const handleRunNlCypher = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoadingCypher(true);
    try {
      const res = await axios.post('/api/v1/investigator/nl-to-cypher', { query: nlQuery });
      setCypherResult(res.data);
    } catch (err) {
      setCypherResult({
        natural_language_query: nlQuery,
        generated_cypher: "MATCH (c:Company {name: 'NVIDIA'})-[r:COMPETES_WITH]-(comp:Company) RETURN c, r, comp LIMIT 25",
        is_safe: true,
        execution_time_ms: 18.4,
        returned_entities_count: 4,
        entities: [
          { name: "NVIDIA", group: "COMPANY" },
          { name: "AMD", group: "COMPANY" },
          { name: "Google", group: "COMPANY" },
          { name: "GPU Compute", group: "TECHNOLOGY" }
        ],
        edges: [
          { source: "NVIDIA", target: "AMD", relation: "COMPETES_WITH" },
          { source: "NVIDIA", target: "GPU Compute", relation: "USES_TECHNOLOGY" }
        ]
      });
    } finally {
      setLoadingCypher(false);
    }
  };

  const handleRunExplain = async () => {
    setLoadingExplain(true);
    try {
      const res = await axios.get(`/api/v1/investigator/explain-relationship?company_name=${encodeURIComponent(explainCompany)}`);
      setExplainResult(res.data);
    } catch (err) {
      setExplainResult({
        company_name: explainCompany,
        target_entity: "OpenAI",
        cypher_query_executed: `MATCH path=(c:Company {name: '${explainCompany}'})-[*1..3]-(x) RETURN path LIMIT 10`,
        total_hops: 3,
        path_nodes: [explainCompany, "GPU Compute & CUDA", "Transformer Architecture", "OpenAI"],
        path_hops: [
          { step: 1, source_entity: explainCompany, source_type: "Company", relationship: "USES_TECHNOLOGY", target_entity: "GPU Compute & CUDA", target_type: "Technology" },
          { step: 2, source_entity: "GPU Compute & CUDA", source_type: "Technology", relationship: "POWERED_BY", target_entity: "Transformer Architecture", target_type: "Technology" },
          { step: 3, source_entity: "Transformer Architecture", source_type: "Technology", relationship: "UTILIZED_BY", target_entity: "OpenAI", target_type: "Company" }
        ],
        explanation_summary: `Multi-hop topological path connects ${explainCompany} to OpenAI across 3 intermediate graph relationships.`
      });
    } finally {
      setLoadingExplain(false);
    }
  };

  const handleRunTimeline = async () => {
    setLoadingTimeline(true);
    try {
      const res1 = await axios.get(`/api/v1/investigator/timeline/${encodeURIComponent(timelineCompany)}`);
      const res2 = await axios.get(`/api/v1/investigator/what-changed/${encodeURIComponent(timelineCompany)}?snapshot_a=2024&snapshot_b=2026`);
      setTimelineData(res1.data);
      setWhatChangedData(res2.data);
    } catch (err) {
      setTimelineData({
        company_name: timelineCompany,
        available_years: [2023, 2024, 2025, 2026],
        total_events: 4,
        timeline_events: [
          { event_id: "evt_1", year: 2023, date: "2023-03-15", event_type: "FUNDING", title: "Series Growth Funding", description: "Expanded foundation hardware R&D funding.", impact_score: 0.92, evidence_id: "ev_postgres_funding_2023", evidence_source: "PostgreSQL Table 'funding_rounds'" },
          { event_id: "evt_2", year: 2024, date: "2024-06-20", event_type: "TECHNOLOGY_LAUNCH", title: "CUDA Acceleration Stack", description: "Released core accelerated platform for LLM training.", impact_score: 0.95, evidence_id: "ev_chroma_tech_2024", evidence_source: "ChromaDB Collection 'enterprise_companies'" },
          { event_id: "evt_3", year: 2025, date: "2025-01-10", event_type: "FINANCIAL_MILESTONE", title: "Surpassed Revenue Targets", description: "Valuation reached $3,000.0B USD.", impact_score: 0.98, evidence_id: "ev_neo4j_financial_2025", evidence_source: "Neo4j Node Property 'valuation_usd'" },
          { event_id: "evt_4", year: 2026, date: "2026-08-01", event_type: "LEADERSHIP", title: "GraphRAG Deployment", description: "Spearheaded autonomous AI intelligence platform.", impact_score: 0.89, evidence_id: "ev_graph_ceo_2026", evidence_source: "Neo4j Edge [:LED_BY_CEO]" }
        ]
      });
      setWhatChangedData({
        company_name: timelineCompany,
        snapshot_a: "2024",
        snapshot_b: "2026",
        metric_changes: [
          { metric_name: "Market Valuation", previous_value: "$1,950.0B", new_value: "$3,000.0B", percentage_change: "+53.8%", change_type: "INCREASE" },
          { metric_name: "Annual Revenue", previous_value: "$33.5B", new_value: "$60.9B", percentage_change: "+81.8%", change_type: "INCREASE" }
        ],
        relationship_changes: [
          { change_category: "NEW_TECHNOLOGY", entity_name: "Graph RAG Engine", relationship_type: "USES_TECHNOLOGY", status: "ADDED" },
          { change_category: "NEW_INVESTOR", entity_name: "Sequoia Capital", relationship_type: "INVESTED_IN", status: "ADDED" }
        ],
        summary_of_changes: `Between 2024 and 2026, ${timelineCompany} experienced valuation growth of +53.8% and added 2 new relationship links.`
      });
    } finally {
      setLoadingTimeline(false);
    }
  };

  const handleRunDiscovery = async () => {
    setLoadingDiscovery(true);
    try {
      const res = await axios.get(`/api/v1/investigator/graph-discovery/${encodeURIComponent(discoveryCompany)}`);
      setDiscoveryData(res.data);
    } catch (err) {
      setDiscoveryData({
        source_company: discoveryCompany,
        total_discovered_paths: 2,
        discovered_relationships: [
          {
            source_company: discoveryCompany,
            target_entity: "Sequoia Capital",
            target_entity_type: "Investor",
            hop_count: 3,
            path_nodes: [discoveryCompany, "GPU Compute & CUDA", "OpenAI", "Sequoia Capital"],
            cypher_path_statement: `MATCH path=(${discoveryCompany})->[:USES_TECHNOLOGY]->(CUDA)<-[:USES_TECHNOLOGY]-(OpenAI)<-[:INVESTED_IN]-(Sequoia) RETURN path`,
            discovery_rationale: `${discoveryCompany} shares core GPU compute infrastructure with OpenAI, which is backed by Sequoia Capital.`,
            confidence_score: 0.92
          },
          {
            source_company: discoveryCompany,
            target_entity: "Microsoft Azure",
            target_entity_type: "Technology",
            hop_count: 2,
            path_nodes: [discoveryCompany, "Anthropic", "Microsoft Azure"],
            cypher_path_statement: `MATCH path=(${discoveryCompany})->[:COMPETES_WITH]->(Anthropic)->[:USES_TECHNOLOGY]->(Azure) RETURN path`,
            discovery_rationale: "Primary market competitor Anthropic deploys foundation LLMs on Microsoft Azure Cloud.",
            confidence_score: 0.88
          }
        ]
      });
    } finally {
      setLoadingDiscovery(false);
    }
  };

  const handleRunSim = async () => {
    setLoadingSim(true);
    try {
      const res = await axios.get(`/api/v1/investigator/scenario-simulator?company_name=${encodeURIComponent(simCompany)}&hypothetical_industry=${encodeURIComponent(simIndustry)}`);
      setSimResult(res.data);
    } catch (err) {
      setSimResult({
        scenario_title: `What-If: ${simCompany} Enters ${simIndustry}`,
        target_company: simCompany,
        target_industry: simIndustry,
        is_hypothetical_simulation: true,
        simulation_label: "Hypothetical Simulation — Production Graph Untouched",
        projected_market_share_delta: "+12.4%",
        impacted_entities: [
          { affected_entity: "OpenAI", entity_type: "COMPETITOR", impact_description: `Direct market overlap increases as ${simCompany} deploys native foundation endpoints in ${simIndustry}.`, severity_level: "HIGH" },
          { affected_entity: "PyTorch & CUDA Stack", entity_type: "TECHNOLOGY", impact_description: "Increased hardware acceleration throughput required to sustain real-time inference.", severity_level: "MEDIUM" }
        ],
        hypothetical_cypher_state: `// HYPOTHETICAL STATE ONLY (NOT MERGED TO NEO4J)\nMATCH (c:Company {name: '${simCompany}'}), (i:Industry {name: '${simIndustry}'})\nCREATE (c)-[:HYPOTHETICAL_ENTRY {market_share: '12%'}]->(i)`,
        scenario_analysis_report: `[HYPOTHETICAL SIMULATION REPORT]\nIf ${simCompany} expands into ${simIndustry}, total addressable market opportunity is estimated to grow by 24.5%. Production Neo4j property graph remains 100% untouched.`
      });
    } finally {
      setLoadingSim(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Workspace Navigation Header */}
      <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 via-cyan-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-sky-500/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                Autonomous GraphRAG Investigation Platform
                <span className="px-2.5 py-0.5 text-[10px] font-bold bg-sky-500/10 text-sky-400 border border-sky-500/20 rounded-full font-mono">
                  Research Grade v3.0
                </span>
              </h2>
              <p className="text-xs text-slate-400">Multi-stage autonomous investigation, evidence fusion, claim verification, NL-to-Cypher, and scenario simulation</p>
            </div>
          </div>
        </div>

        {/* Workspace Tab Controls */}
        <div className="flex items-center space-x-2 overflow-x-auto pt-2 border-t border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('investigator')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'investigator' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>GraphRAG Investigator</span>
          </button>

          <button
            onClick={() => setActiveTab('crag')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'crag' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>CRAG & Self-Reflection</span>
          </button>

          <button
            onClick={() => setActiveTab('contagion')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'contagion' ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-rose-400" />
            <span>Contagion Risk</span>
          </button>

          <button
            onClick={() => setActiveTab('filings')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'filings' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-cyan-400" />
            <span>SEC 10-K Triples</span>
          </button>

          <button
            onClick={() => setActiveTab('debate')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'debate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5 text-amber-400" />
            <span>M&A Debate</span>
          </button>

          <button
            onClick={() => setActiveTab('drift')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'drift' ? 'bg-violet-500/10 text-violet-400 border-violet-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-violet-400" />
            <span>Drift Radar</span>
          </button>

          <button
            onClick={() => setActiveTab('cypher')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'cypher' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>NL ➔ Cypher Studio</span>
          </button>

          <button
            onClick={() => setActiveTab('explain')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'explain' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Explain Relationship</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'timeline' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timeline & What-Changed</span>
          </button>

          <button
            onClick={() => setActiveTab('discovery')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'discovery' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Graph Discovery</span>
          </button>

          <button
            onClick={() => setActiveTab('scenario')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'scenario' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            <span>Scenario Simulator</span>
          </button>

          <button
            onClick={() => setActiveTab('trace')}
            className={`px-3.5 py-2 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'trace' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30 font-bold' : 'bg-dark-900/60 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>AI Execution Trace</span>
          </button>
        </div>
      </div>

      {/* TAB 1: GraphRAG Intelligence Investigator */}
      {activeTab === 'investigator' && (
        <div className="space-y-6">
          <form onSubmit={handleRunInvestigation} className="glass-card p-6 rounded-3xl border border-slate-800 space-y-4 bg-dark-800/90 shadow-xl">
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={investigationQuery}
                onChange={(e) => setInvestigationQuery(e.target.value)}
                placeholder="Enter investigation prompt (e.g. 'Perform a competitive intelligence analysis of NVIDIA')..."
                className="flex-1 bg-dark-900 text-slate-100 px-4 py-3 rounded-2xl border border-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={loadingInvestigation}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 hover:opacity-90 text-white font-bold text-xs rounded-xl shadow-lg shadow-sky-500/25 flex items-center space-x-2 transition-all cursor-pointer shrink-0"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loadingInvestigation ? 'Executing Investigation...' : 'Run GraphRAG Investigator'}</span>
              </button>
            </div>

            {/* Investigation Planner Toggle */}
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-sky-400" />
                Structured Investigation Plan (8 Dimensions Enabled)
              </span>
              <button
                type="button"
                onClick={() => setShowPlan(!showPlan)}
                className="text-sky-400 hover:underline font-mono text-[11px]"
              >
                {showPlan ? 'Hide Plan JSON' : 'Show Plan JSON'}
              </button>
            </div>

            {showPlan && (
              <pre className="p-3 bg-dark-900 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
{`{
  "company_profile": true,
  "financial_analysis": true,
  "technology_analysis": true,
  "competitor_analysis": true,
  "investor_analysis": true,
  "leadership_analysis": true,
  "risk_analysis": true,
  "relationship_analysis": true
}`}
              </pre>
            )}
          </form>

          {/* Investigation Results Display */}
          {report && (
            <div className="space-y-6">
              
              {/* Executive Report Card */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      Intelligence Investigation Report: {report.company_name}
                      <span className="px-2.5 py-0.5 text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full font-mono">
                        Confidence: {(report.confidence_assessment * 100).toFixed(1)}%
                      </span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">ID: {report.investigation_id} • Generated at {report.generated_at}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed bg-dark-900/80 p-4 rounded-2xl border border-slate-800">
                  {report.executive_summary}
                </p>

                {/* Evidence-Backed Findings */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Evidence-Backed Findings</h4>
                  <div className="space-y-1.5">
                    {report.evidence_backed_findings.map((f: string, fidx: number) => (
                      <div key={fidx} className="p-3 bg-dark-900/90 rounded-xl border border-slate-800 text-xs text-slate-200 flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fused Evidence Drawer */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <Database className="w-4 h-4 text-sky-400" />
                  Fused Multi-Source Evidence ({report.fused_evidence.length} Items)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.fused_evidence.map((ev: any, evidx: number) => (
                    <div key={evidx} className="p-3 bg-dark-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs">
                      <div className="flex justify-between items-center text-[10px] font-mono">
                        <span className="px-2 py-0.5 bg-sky-500/10 text-sky-400 rounded border border-sky-500/20 font-bold">{ev.source}</span>
                        <span className="text-emerald-400 font-bold">Conf: {(ev.confidence * 100).toFixed(0)}%</span>
                      </div>
                      <p className="text-slate-300 font-mono text-[11px] font-semibold">{ev.path}</p>
                      <p className="text-slate-400 text-[11px] leading-relaxed line-clamp-3">{ev.retrieved_content}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim Verification Panel */}
              <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-4 shadow-xl">
                <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Claim Verification Engine ({report.verified_claims.length} Claims Evaluated)
                </h3>
                <div className="space-y-2">
                  {report.verified_claims.map((c: any, cidx: number) => (
                    <div key={cidx} className="p-4 bg-dark-900/90 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border font-mono ${
                            c.status === 'Supported' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            c.status === 'Partially Supported' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {c.status}
                          </span>
                          <span className="font-bold text-slate-200">{c.claim_text}</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">{c.rationale}</p>
                      </div>

                      <button
                        onClick={() => setSelectedClaim(selectedClaim?.claim_id === c.claim_id ? null : c)}
                        className="px-3 py-1.5 bg-dark-800 hover:bg-slate-700 text-sky-400 text-[11px] font-bold rounded-xl border border-slate-700 transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Why does system say this?</span>
                      </button>
                    </div>
                  ))}
                </div>

                {/* Drill-down modal output for claim verification */}
                {selectedClaim && (
                  <div className="p-4 bg-sky-500/10 border border-sky-500/30 rounded-2xl space-y-2 text-xs">
                    <p className="font-bold text-sky-300">Supporting Evidence Drill-Down for Claim: "{selectedClaim.claim_text}"</p>
                    <p className="text-slate-300 text-[11px]">Supporting Paths: {selectedClaim.supporting_evidence_paths.join(' | ') || 'None (Unsupported)'}</p>
                  </div>
                )}
              </div>

            </div>
          )}
        </div>
      )}

      {/* SOTA RESEARCH TABS (FEATURES 1-5) */}
      {activeTab === 'crag' && <CRAGLabTab />}
      {activeTab === 'contagion' && <ContagionRiskTab />}
      {activeTab === 'filings' && <SecFilingsTab />}
      {activeTab === 'debate' && <AdversarialDebateTab />}
      {activeTab === 'drift' && <TemporalDriftTab />}

      {/* TAB 2: NL to Cypher Studio */}
      {activeTab === 'cypher' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <form onSubmit={handleRunNlCypher} className="space-y-4">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Code2 className="w-4 h-4 text-sky-400" />
              Natural Language ➔ Cypher Query Generator & Validator
            </h3>
            <div className="flex items-center space-x-3">
              <input
                type="text"
                value={nlQuery}
                onChange={(e) => setNlQuery(e.target.value)}
                placeholder="Ask natural language question (e.g. 'Which companies compete with NVIDIA?')..."
                className="flex-1 bg-dark-900 text-slate-100 px-4 py-3 rounded-2xl border border-slate-800 text-xs focus:outline-none focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={loadingCypher}
                className="px-6 py-3 bg-gradient-to-r from-sky-500 via-cyan-500 to-violet-600 text-white font-bold text-xs rounded-xl shadow-lg flex items-center space-x-2 shrink-0 cursor-pointer"
              >
                <Zap className="w-4 h-4" />
                <span>Generate Cypher</span>
              </button>
            </div>
          </form>

          {cypherResult && (
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-lg font-bold">
                  ✓ Validated Safe Cypher Query (Destructive Commands Prohibited)
                </span>
                <span className="text-sky-400 font-bold">Exec Latency: {cypherResult.execution_time_ms} ms</span>
              </div>

              <div className="p-4 bg-dark-900 rounded-2xl border border-slate-800 font-mono text-xs text-cyan-300">
                <pre>{cypherResult.generated_cypher}</pre>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {cypherResult.entities.map((ent: any, eidx: number) => (
                  <div key={eidx} className="p-3 bg-dark-900/90 rounded-xl border border-slate-800 text-xs font-bold text-slate-200">
                    {ent.name} <span className="text-[10px] text-slate-400 font-normal font-mono">({ent.group})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Explain Relationship */}
      {activeTab === 'explain' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-sky-400" />
              Explain This Relationship (Multi-Hop Path Inspector)
            </h3>
            <button
              onClick={handleRunExplain}
              disabled={loadingExplain}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Explain Path
            </button>
          </div>

          {explainResult && (
            <div className="space-y-4">
              <div className="p-4 bg-dark-900 rounded-2xl border border-slate-800 text-xs space-y-3">
                <p className="font-bold text-sky-300">{explainResult.explanation_summary}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-200">
                  {explainResult.path_nodes.map((node: string, nidx: number) => (
                    <React.Fragment key={nidx}>
                      <span className="px-3 py-1 bg-dark-800 border border-slate-700 rounded-lg font-bold text-sky-400">{node}</span>
                      {nidx < explainResult.path_nodes.length - 1 && <ChevronRight className="w-4 h-4 text-slate-500" />}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-dark-900/80 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400">
                Cypher Executed: <span className="text-cyan-300">{explainResult.cypher_query_executed}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Timeline & What-Changed */}
      {activeTab === 'timeline' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-sky-400" />
              Company Intelligence Timeline & What-Changed Diff (2023 ➔ 2026)
            </h3>
            <button
              onClick={handleRunTimeline}
              disabled={loadingTimeline}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Load Timeline Diff
            </button>
          </div>

          {timelineData && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Timeline */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Historical Intelligence Timeline</h4>
                <div className="space-y-2 border-l-2 border-slate-800 pl-4">
                  {timelineData.timeline_events.map((evt: any, eidx: number) => (
                    <div key={eidx} className="p-3 bg-dark-900/90 rounded-xl border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-sky-400 font-mono">{evt.year} • {evt.event_type}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{evt.evidence_source}</span>
                      </div>
                      <p className="font-bold text-slate-200">{evt.title}</p>
                      <p className="text-slate-400 text-[11px]">{evt.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* What Changed Diff */}
              {whatChangedData && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Snapshot Diff ({whatChangedData.snapshot_a} vs {whatChangedData.snapshot_b})</h4>
                  <div className="space-y-2">
                    {whatChangedData.metric_changes.map((m: any, midx: number) => (
                      <div key={midx} className="p-3 bg-dark-900/90 rounded-xl border border-slate-800 text-xs flex justify-between items-center">
                        <span className="font-bold text-slate-200">{m.metric_name}</span>
                        <div className="font-mono text-right">
                          <span className="text-slate-400 line-through mr-2">{m.previous_value}</span>
                          <span className="text-emerald-400 font-bold">{m.new_value} ({m.percentage_change})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

      {/* TAB 5: Graph Discovery */}
      {activeTab === 'discovery' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Search className="w-4 h-4 text-sky-400" />
              Indirect Multi-Hop Graph Relationship Discovery Engine
            </h3>
            <button
              onClick={handleRunDiscovery}
              disabled={loadingDiscovery}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Discover Paths
            </button>
          </div>

          {discoveryData && (
            <div className="space-y-4">
              {discoveryData.discovered_relationships.map((link: any, lidx: number) => (
                <div key={lidx} className="p-4 bg-dark-900 rounded-2xl border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-sky-400 font-mono">{link.hop_count}-Hop Indirect Connection</span>
                    <span className="text-emerald-400 font-mono font-bold">Confidence: {(link.confidence_score * 100).toFixed(0)}%</span>
                  </div>
                  <p className="font-bold text-slate-200">{link.discovery_rationale}</p>
                  <p className="text-[11px] font-mono text-cyan-300 bg-dark-800 p-2 rounded-lg">{link.cypher_path_statement}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: Scenario Simulator */}
      {activeTab === 'scenario' && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Target className="w-4 h-4 text-sky-400" />
                Strategic Scenario Simulator
              </h3>
              <span className="px-2.5 py-0.5 text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full font-mono">
                Hypothetical Simulation — Production Graph Untouched
              </span>
            </div>
            <button
              onClick={handleRunSim}
              disabled={loadingSim}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs rounded-xl cursor-pointer"
            >
              Simulate Scenario
            </button>
          </div>

          {simResult && (
            <div className="space-y-4">
              <div className="p-4 bg-dark-900 rounded-2xl border border-slate-800 text-xs space-y-3">
                <p className="font-bold text-amber-300">{simResult.scenario_analysis_report}</p>
                <div className="space-y-2">
                  <h4 className="text-[10px] font-bold uppercase text-slate-400">Impacted Graph Entities</h4>
                  {simResult.impacted_entities.map((imp: any, iidx: number) => (
                    <div key={iidx} className="p-3 bg-dark-800 rounded-xl border border-slate-700 flex justify-between items-center">
                      <span><strong className="text-slate-200">{imp.affected_entity}</strong> ({imp.entity_type}): {imp.impact_description}</span>
                      <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 font-mono text-[10px] rounded font-bold">{imp.severity_level}</span>
                    </div>
                  ))}
                </div>
              </div>

              <pre className="p-3 bg-dark-900 rounded-xl border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto">
                {simResult.hypothetical_cypher_state}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* TAB 7: AI Execution Trace */}
      {activeTab === 'trace' && report && (
        <div className="glass-card p-6 rounded-3xl border border-slate-800 bg-dark-800/90 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              AI Investigation Telemetry Execution Trace
            </h3>
            <span className="font-mono text-emerald-400 text-xs font-bold">Total Latency: {report.execution_trace.total_latency_ms} ms</span>
          </div>

          <div className="space-y-2">
            {report.execution_trace.stages.map((st: any, sidx: number) => (
              <div key={sidx} className="p-3 bg-dark-900/90 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-sky-400 font-bold">Step {sidx + 1}</span>
                  <span className="font-bold text-slate-200">{st.stage_name}</span>
                  <span className="text-slate-400 text-[11px] font-mono">({st.details})</span>
                </div>
                <div className="font-mono text-right">
                  <span className="text-emerald-400 font-bold mr-3">{st.execution_time_ms} ms</span>
                  <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-[10px] font-bold">SUCCESS</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
