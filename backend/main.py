import sys
import os

# Automatically resolves 'backend.xxx' imports whether executed from root or inside backend/
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import logging
import time

from backend.config import settings
from backend.knowledge_graph.neo4j_client import neo4j_client
from backend.database.chroma import chroma_store

logging.basicConfig(
    level=settings.LOG_LEVEL,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("EnterprisePlatformBackend")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Enterprise Company Intelligence Platform Backend...")
    # Initialize DB connections
    try:
        await neo4j_client.connect()
    except Exception as e:
        logger.warning(f"Neo4j startup notice: {e}")

    try:
        chroma_store.initialize()
    except Exception as e:
        logger.warning(f"ChromaDB startup notice: {e}")

    yield

    logger.info("Shutting down backend services...")
    await neo4j_client.close()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Publication-Quality Enterprise Company Intelligence Platform combining Knowledge Graphs, Vector Search, and Hybrid RAG.",
    lifespan=lifespan
)

from fastapi.middleware.gzip import GZipMiddleware

# Add GZip Compression Middleware (Compress responses larger than 500 bytes)
app.add_middleware(GZipMiddleware, minimum_size=500)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Latency Middleware
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time-Sec"] = f"{process_time:.4f}"
    return response

# Register Feature API Routers
from backend.api import auth, companies, search, graph, chat, recommendation, dashboard, reports, bookmarks, forecasting, investigator
from backend.services.strategic_ai import strategic_ai_engine
from backend.services.data_pipeline import etl_pipeline

app.include_router(auth.router, prefix="/api/v1")
app.include_router(companies.router, prefix="/api/v1")
app.include_router(search.router, prefix="/api/v1")
app.include_router(graph.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")
app.include_router(recommendation.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(bookmarks.router, prefix="/api/v1")
app.include_router(forecasting.router, prefix="/api/v1")
app.include_router(investigator.router, prefix="/api/v1")

@app.get("/api/v1/strategic-analysis/{company_name}")
async def get_strategic_analysis(company_name: str):
    """Returns SWOT, PESTLE, Porter 5 Forces, Risk & Investment analysis for a company."""
    return {
        "company_name": company_name,
        "swot": strategic_ai_engine.generate_swot(company_name),
        "pestle": strategic_ai_engine.generate_pestle(company_name),
        "porters_five_forces": strategic_ai_engine.generate_porters_five_forces(company_name),
        "investment_recommendation": strategic_ai_engine.generate_risk_and_investment_recommendation(company_name)
    }

@app.post("/api/v1/data-pipeline/trigger")
async def trigger_data_pipeline():
    """Triggers full 5-stage ETL data pipeline ingestion."""
    return etl_pipeline.run_full_pipeline()

# Root & Health Check Endpoints
@app.get("/")
async def root():
    return {
        "status": "online",
        "system": settings.PROJECT_NAME,
        "environment": settings.ENVIRONMENT,
        "docs_url": "/docs"
    }

@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": time.time(),
        "services": {
            "postgres": "configured",
            "neo4j": "configured",
            "chromadb": "configured"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host=settings.HOST, port=settings.PORT, reload=True)

