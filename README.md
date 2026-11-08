# 🚀 Autonomous Company Intelligence & GraphRAG Investigation Platform

> A publication-quality, research-grade Enterprise SaaS Intelligence & Investigation Platform combining **Knowledge Graphs (Neo4j)**, **Dense Vector Search (ChromaDB)**, **Relational Analytics (PostgreSQL)**, and **Autonomous Agentic RAG**.

---

## 🌟 Key Platform Capabilities

- **🕵️ GraphRAG Intelligence Investigator**: Multi-stage investigation pipeline executing structured 8-dimension investigation plans.
- **🔗 Multi-Source Evidence Fusion**: Fuses evidence items across PostgreSQL, ChromaDB 384d vectors, and Neo4j Cypher path records with source IDs, paths, relevance scores, and timestamps.
- **🛡️ Claim Verification Engine**: Grounded statement verification assigning `Supported`, `Partially Supported`, or `Unsupported` with interactive "Why does the system say this?" evidence drill-downs.
- **💻 Natural Language ➔ Safe Cypher Studio**: Translates natural language queries to safe Neo4j Cypher queries with strict AST/regex validation preventing destructive commands (`DELETE`, `DETACH`, `CREATE`, `DROP`, `SET`).
- **🕸️ Explainable Graph Reasoning**: Multi-hop path inspector (`Company A ➔ Relationship ➔ Entity B`) displaying exact safe Cypher query statements.
- **Clock Company Intelligence Timeline & What-Changed Diff**: Historical 2023-2026 intelligence timeline and snapshot diff comparison matrix.
- **🔍 Indirect Multi-Hop Graph Discovery**: Identifies indirect connections (`Company A ➔ Tech X ➔ Company B ➔ Investor Y`) using actual Neo4j paths.
- **Target What-If Strategic Scenario Simulator**: Simulates market entry scenarios in an isolated in-memory graph state labeled `"Hypothetical Simulation — Production Graph Untouched"`.
- **Activity AI Investigation Execution Trace**: Stage-by-stage execution latency telemetry (ms) and confidence metrics.

---

## 💻 Quick Start & Running Instructions

### 1️⃣ Launch Backend (FastAPI & AI Engines)
```powershell
cd backend
.\venv\Scripts\python.exe main.py
```
> **Backend URL**: `http://localhost:8085`  
> **Interactive API Docs**: `http://localhost:8085/docs`

### 2️⃣ Launch Frontend (React 18 + Vite)
```powershell
cd frontend
npm run dev
```
> **Platform Web UI**: `http://localhost:3000`

---

## 📚 Technical Documentation & Research Papers

- **[Advanced Architecture Audit](docs/ADVANCED_ARCHITECTURE_AUDIT.md)**: Pre-upgrade inspection & inventory.
- **[Advanced Features Specification](docs/ADVANCED_FEATURES.md)**: Deep dive into all 7 research-grade modules.
- **[Investigation Pipeline Specification](docs/INVESTIGATION_PIPELINE.md)**: Multi-stage investigation sequence & schemas.
- **[Performance Benchmark Telemetry](docs/PERFORMANCE_BENCHMARK.md)**: Empirical latency & throughput metrics.
- **[Evaluation Methodology](docs/EVALUATION_METHODOLOGY.md)**: Precision@K, Recall@K, and faithfulness metrics.
- **[IEEE Conference Paper](docs/IEEE_PAPER_FINAL.md)**: 6-page double-column publication draft.
- **[Project Presentation Deck](docs/PROJECT_PRESENTATION_PPT.md)**: 10-slide B.Tech defense presentation.
- **[Architecture & UML Diagrams](docs/ARCHITECTURE_DIAGRAMS.md)**: Complete Mermaid.js diagrams.
