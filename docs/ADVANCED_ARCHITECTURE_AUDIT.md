# Advanced Architecture Audit & System Inventory

**Document Version**: 2.0.0  
**Audit Date**: September 2026  
**Status**: Comprehensive Pre-Upgrade Codebase Inspection  

---

## 1. Codebase & Repository Structure

The project follows a clean decoupled client-server architecture:
- **`backend/`**: Python FastAPI microservice architecture with async route handlers, Pydantic data validation schemas, database abstraction clients, and a 5-agent RAG workflow.
- **`frontend/`**: Single Page Application (SPA) built using React 18, Vite 5, TypeScript 5.4, and Tailwind CSS 3.4 with custom canvas graphics and SVG components.
- **`docs/`**: Comprehensive system diagrams, research papers, and technical benchmark documentation.

---

## 2. Frontend Architecture & Component Inventory

- **Framework & Bundler**: React 18.3 + TypeScript 5.4 + Vite 8 (using `@vitejs/plugin-react`).
- **Styling**: Tailwind CSS 3.4 with dark mode slate/cyan/sky theme, custom Glassmorphism cards, and Lucide Icons.
- **State Management & Navigation**: In-memory tab router state (`activeTab` in `App.tsx`) supporting modular views:
  - `AnalyticsDashboardView.tsx`: Overview KPI metrics & triggerable 5-stage ETL pipeline progress stepper.
  - `CompanySearchView.tsx`: Natural language semantic search with real-time Valuation Screener range sliders.
  - `KnowledgeGraphView.tsx`: Interactive SVG/Canvas force-directed node physics visualizer with zoom controls, node selection drawer, and live Cypher query logger.
  - `ChatbotView.tsx`: Multi-model AI Copilot (Llama 3.1 405B, GPT-4o, Claude 3.5 Sonnet, DeepSeek R1), Web Speech voice dictation, Markdown exporter, citation drawer, and 5-agent execution telemetry modal (`AgenticWorkflowModal.tsx`).
  - `CompanyComparisonView.tsx`: Side-by-side comparative matrix with visual financial bar charts.
  - `ValuationForecastView.tsx`: 1-5 Year ML valuation and revenue trajectory projection engine.
  - `NotebookView.tsx`: Interactive Jupyter/Notion-style code execution notebook supporting Python 3.12, SQL, and Cypher cells.
  - `ReportGeneratorView.tsx`: Automated PDF report download and CSV dataset export using Blob streams.
  - `AdminDashboardView.tsx`: Role-Based Access Control (RBAC) user permissions table and cluster health monitors.
  - `LandingPageView.tsx`: Glassmorphism hero showcase landing view.
  - `CommandPalette.tsx`: Keyboard navigation menu (`Ctrl + K` / `Cmd + K`).

---

## 3. Backend Architecture & Service Layer

- **Framework**: Python 3.12 + FastAPI 0.111.
- **Middleware**: GZip compression, CORS middleware, and processing time headers (`X-Process-Time-Sec`).
- **Modular Routers** (`backend/api/`):
  - `auth.py`: JWT token generation and user registration/login.
  - `companies.py`: CRUD operations over enterprise company profiles.
  - `search.py`: Semantic vector search and hybrid alpha re-ranking.
  - `graph.py`: Neo4j graph nodes and relationships retrieval.
  - `chat.py`: Multi-agent RAG chatbot workflow endpoint.
  - `recommendation.py`: Graph-based company recommendations.
  - `dashboard.py`: BI analytics dashboard summary metrics.
  - `reports.py`: PDF report generation and CSV dataset streams.
  - `bookmarks.py`: User saved searches and bookmarks API.
  - `forecasting.py`: 1-5 year valuation & revenue growth projections.

---

## 4. PostgreSQL Relational Schema (`backend/database/postgres_schema.sql`)

- **`roles`**: `(id, name, description)` — default `ADMIN` and `USER`.
- **`users`**: `(id, email, hashed_password, full_name, role_id, is_active, created_at)`
- **`companies`**: `(id, name, industry, description, products, technologies, ceo_name, employee_count, revenue_usd, total_funding_usd, valuation_usd, country, website, founded_year)`
- **`founders`**: `(id, company_id, name, title, bio)`
- **`funding_rounds`**: `(id, company_id, round_type, amount_usd, announcement_date, lead_investors)`
- **`acquisitions`**: `(id, acquiring_company_id, target_company_name, deal_size_usd, acquisition_year)`
- **`news_articles`**: `(id, company_id, title, summary, published_date, source_url, sentiment)`
- **`ai_reports`**: `(id, user_id, company_id, report_title, summary, swot_analysis, competitor_analysis, technology_stack, pdf_filename)`

---

## 5. Neo4j Property Knowledge Graph Schema (`backend/knowledge_graph/neo4j_schema.cypher`)

- **Node Labels**: `:Company`, `:Industry`, `:Technology`, `:Person`, `:Investor`, `:Country`, `:Product`.
- **Uniqueness Constraints**: Uniqueness constraints on `c.id`, `c.name`, `i.name`, `t.name`, `p.name`, `inv.name`, `ctr.name`, `prd.name`.
- **Relationships**:
  - `(c1:Company)-[:COMPETES_WITH {similarity_score}]->(c2:Company)`
  - `(inv:Investor)-[:INVESTED_IN {round_type, amount_usd}]->(c:Company)`
  - `(c:Company)-[:USES_TECHNOLOGY]->(t:Technology)`
  - `(c:Company)-[:LOCATED_IN]->(ctr:Country)`
  - `(c:Company)-[:OPERATES_IN]->(i:Industry)`
  - `(c1:Company)-[:ACQUIRED {amount_usd, year}]->(c2:Company)`
  - `(p:Person)-[:FOUNDED]->(c:Company)`
  - `(c:Company)-[:OFFERS_PRODUCT]->(prd:Product)`

---

## 6. ChromaDB Vector Store Configuration (`backend/database/chroma.py`)

- **Collection Name**: `enterprise_companies`
- **Embedding Model**: `SentenceTransformer("all-MiniLM-L6-v2")` producing 384-dimensional dense vectors.
- **Distance Metric**: HNSW Cosine Distance (`metadata={"hnsw:space": "cosine"}`).
- **Client Configuration**: Primary `HttpClient` targeting `CHROMADB_HOST` and `CHROMADB_PORT` (port 8000) with automatic fallback to local `PersistentClient(path="./chroma_db_data")`.

---

## 7. Redis Cache Layer (`backend/database/redis_client.py`)

- **Connection**: Asynchronous `redis.asyncio` client connecting to `REDIS_URL` (`redis://localhost:6379/0`).
- **Functionality**: `get(key)` and `set(key, value, expire_seconds=3600)` with automatic in-memory fallback if Redis connection is unavailable.

---

## 8. Autonomous 5-Agent RAG Pipeline (`backend/agents/`)

1. **`intent_agent.py`**: Categorizes user input into `COMPARISON`, `TECH_STACK`, `FUNDING_INVESTMENT`, or `GENERAL_SEMANTIC` with extracted entities.
2. **`query_planner.py`**: Generates parallel retrieval plans (`vector_plan` top-$k$ and `graph_plan` Cypher query pattern).
3. **`vector_agent.py`**: Executes dense vector similarity retrieval against ChromaDB.
4. **`graph_agent.py`**: Executes Cypher query patterns against Neo4j.
5. **`context_merger.py`**: Fuses vector chunks and graph relationship lists into structured Markdown responses with source document citations.

---

## 9. Existing Datasets

Seed dataset contains detailed corporate profiles for 11 enterprise global leaders:
- **NVIDIA**, **OpenAI**, **Tesla**, **Anthropic**, **Google (Alphabet)**, **Microsoft**, **Meta**, **SpaceX**, **Palantir Technologies**, **Databricks**, **Stripe**.

---

## 10. Verification & Test Suite

- **Test Script**: `backend/tests/test_agents.py` testing intent routing, vector search execution, graph query execution, and context merger output.
- **Documentation**:
  - `docs/ARCHITECTURE_DIAGRAMS.md`
  - `docs/IEEE_PAPER_FINAL.md`
  - `docs/PROJECT_PRESENTATION_PPT.md`
  - `README.md`
