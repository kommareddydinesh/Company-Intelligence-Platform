# GraphRAG Investigation Pipeline Specification

**Document Version**: 3.0.0  
**Status**: Multi-Stage Autonomous Investigation Architecture  

---

## 1. Sequence & Stage Architecture

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Planner as Investigation Planner
    participant Postgres as PostgreSQL Analytics
    participant Vector as ChromaDB Vector Store
    participant Graph as Neo4j Property Graph
    participant Fusion as Evidence Fusion Engine
    participant LLM as LLM Synthesis Engine
    participant Verifier as Claim Verification Engine

    User->>Planner: Submit Query ("Investigate NVIDIA")
    Planner->>Planner: Formulate 8-Dimension Plan JSON
    par Parallel Research Tasks
        Planner->>Postgres: Query Financial & Relational Metrics
        Planner->>Vector: Retrieve HNSW Dense Vector Chunks (384d)
        Planner->>Graph: Execute Cypher Multi-Hop Traversal
    end
    Postgres-->>Fusion: Relational Records
    Vector-->>Fusion: Dense Document Chunks
    Graph-->>Fusion: Edge Topologies & Path Records
    Fusion->>Fusion: Build Fused Evidence Items (IDs, Paths, Scores)
    Fusion->>LLM: Grounded Context Injection
    LLM->>LLM: Synthesize Intelligence Report
    LLM->>Verifier: Extract Statements & Verify Claims
    Verifier-->>User: Return Full Report + Claims + Evidence + Trace
```

---

## 2. 8-Dimension Structured Investigation Plan JSON

```json
{
  "company_profile": true,
  "financial_analysis": true,
  "technology_analysis": true,
  "competitor_analysis": true,
  "investor_analysis": true,
  "leadership_analysis": true,
  "risk_analysis": true,
  "relationship_analysis": true
}
```

---

## 3. Multi-Source Evidence Schema

```json
{
  "evidence_id": "ev_4f82a10",
  "source_type": "knowledge_graph",
  "source": "Neo4j",
  "path": "NVIDIA → [USES_TECHNOLOGY] → CUDA",
  "retrieved_content": "Graph Relationship: NVIDIA → [USES_TECHNOLOGY] → CUDA",
  "relevance_score": 0.92,
  "confidence": 0.95,
  "timestamp": "2026-09-25T10:30:00Z"
}
```
