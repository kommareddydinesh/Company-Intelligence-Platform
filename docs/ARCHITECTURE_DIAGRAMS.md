# System Architecture & Technical Diagrams

This document contains complete Mermaid.js UML, ER, Knowledge Graph, Sequence, Evidence Fusion, Claim Verification, Graph Reasoning, and Scenario Simulation diagrams for the **Autonomous Company Intelligence & GraphRAG Investigation Platform**.

---

## 1. System Architecture Diagram

```mermaid
graph TD
    Client["React 18 + Vite Frontend Workspace"] -->|HTTP / REST API| FastAPI["FastAPI Gateway (Python 3.12)"]
    FastAPI --> Auth["JWT & Security Middleware"]
    FastAPI --> Orchestrator["GraphRAG Investigation Pipeline Orchestrator"]

    subgraph "Autonomous Investigation Pipeline"
        Orchestrator --> Planner["1. Investigation Planner"]
        Planner --> Fusion["2. Multi-Source Evidence Fusion Engine"]
        Fusion --> ClaimEngine["3. Claim Verification Engine"]
        ClaimEngine --> LLM["4. Grounded LLM Synthesis"]
    end

    subgraph "Persistence & Multi-Database Layer"
        Fusion --> ChromaDB[("ChromaDB Vector Store (384d Embeddings)")]
        Fusion --> Neo4j[("Neo4j 5 Property Graph Database")]
        FastAPI --> Postgres[("PostgreSQL 16 Relational Storage")]
        FastAPI --> Redis[("Redis 7 In-Memory LRU Cache")]
    end

    LLM -->|Synthesized Evidence-Grounded Report| Client
```

---

## 2. Agent Architecture Diagram

```mermaid
graph LR
    UserQuery["User Prompt ('Investigate NVIDIA')"] --> IntentAgent["1. Intent Detection Agent"]
    IntentAgent --> QueryPlanner["2. Query Planner Agent"]
    QueryPlanner --> ParallelTasks{"Parallel Execution"}
    ParallelTasks --> VectorAgent["3. Vector Search Agent (ChromaDB)"]
    ParallelTasks --> GraphAgent["4. Knowledge Graph Agent (Neo4j)"]
    ParallelTasks --> PostgresAgent["5. Relational Agent (PostgreSQL)"]
    VectorAgent --> ContextMerger["6. Context Merger Agent"]
    GraphAgent --> ContextMerger
    PostgresAgent --> ContextMerger
    ContextMerger --> GroundedOutput["Verified Output Report"]
```

---

## 3. Investigation Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor User
    participant Workspace as React 18 Workspace
    participant API as FastAPI Gateway
    participant Planner as Investigation Planner
    participant Postgres as PostgreSQL Analytics
    participant Chroma as ChromaDB Vector Store
    participant Graph as Neo4j Cypher Graph
    participant Fusion as Evidence Fusion Engine
    participant Verifier as Claim Verification Engine

    User->>Workspace: Submit Investigation Prompt
    Workspace->>API: POST /api/v1/investigator/investigate
    API->>Planner: Formulate 8-Dimension Plan JSON
    par Parallel Research Tasks
        Planner->>Postgres: Query Financial & Relational Metrics
        Planner->>Chroma: Execute 384d Vector Similarity Search
        Planner->>Graph: Execute Cypher Multi-Hop Traversal
    end
    Postgres-->>Fusion: Relational Metrics
    Chroma-->>Fusion: Vector Chunks
    Graph-->>Fusion: Relationship Edges
    Fusion->>Fusion: Build Fused Evidence Items (IDs, Paths, Scores)
    Fusion->>Verifier: Extract Statements & Verify Claims
    Verifier-->>API: Full Intelligence Report + Claims + Evidence + Trace
    API-->>Workspace: Display Interactive Report & Drill-Downs
```

---

## 4. Evidence Fusion Architecture Diagram

```mermaid
flowchart TD
    A[PostgreSQL Relational Metrics] --> F[Evidence Fusion Engine]
    B[ChromaDB 384d Vector Chunks] --> F
    C[Neo4j Cypher Graph Paths] --> F
    F --> D[Structured Evidence Items: ID, Source, Path, Relevance, Confidence]
    D --> E[Context Injection for Grounded LLM Generation]
```

---

## 5. Claim Verification Flow Diagram

```mermaid
flowchart LR
    A[Generated LLM Statement] --> B[Claim Verification Engine]
    B --> C{Match Against Fused Evidence}
    C -->|≥ 2 Sources Match| D[Supported (Green)]
    C -->|1 Source Matches| E[Partially Supported (Amber)]
    C -->|0 Sources Match| F[Unsupported (Red)]
```

---

## 6. Knowledge Graph Reasoning Diagram

```mermaid
graph LR
    CompanyA["NVIDIA (Company)"] -->|USES_TECHNOLOGY| Tech1["GPU Compute & CUDA (Technology)"]
    Tech1 -->|POWERED_BY| Tech2["Transformer Architecture (Technology)"]
    Tech2 -->|UTILIZED_BY| CompanyB["OpenAI (Company)"]
    CompanyB -->|BACKED_BY| Investor["Sequoia Capital (Investor)"]
```

---

## 7. What-If Strategic Scenario Simulation Diagram

```mermaid
flowchart TD
    A[Scenario Query: 'What if NVIDIA enters Quantum Computing?'] --> B[Scenario Simulator Engine]
    B --> C[Create Isolated In-Memory Graph State]
    C --> D[Identify Affected Competitors, Technologies & Investors]
    D --> E[Generate Scenario Report & Hypothetical Cypher]
    E --> F[Label: 'Hypothetical Simulation — Production Graph Untouched']
```

---

## 8. PostgreSQL Relational ER Diagram

```mermaid
erDiagram
    COMPANIES ||--o{ FUNDING_ROUNDS : receives
    COMPANIES ||--o{ ACQUISITIONS : acquires
    COMPANIES ||--o{ NEWS : generates
    USERS ||--o{ BOOKMARKS : saves

    COMPANIES {
        uuid id PK
        string name
        string industry
        text description
        float valuation_usd
        float revenue_usd
        int employee_count
        string country
        int founded_year
    }

    FUNDING_ROUNDS {
        uuid id PK
        uuid company_id FK
        string round_type
        float amount_usd
        date announcement_date
    }

    ACQUISITIONS {
        uuid id PK
        uuid acquirer_company_id FK
        string target_company_name
        float deal_size_usd
        int acquisition_year
    }
```
