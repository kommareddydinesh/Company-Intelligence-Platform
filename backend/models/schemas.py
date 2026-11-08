from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID

# ==========================================
# Authentication & User Schemas
# ==========================================
class UserRegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: Optional[str] = "USER"

class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: UUID
    email: EmailStr
    full_name: str
    role: str
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

# ==========================================
# Company & Sub-Entity Schemas
# ==========================================
class FounderBase(BaseModel):
    name: str
    title: Optional[str] = "Founder"
    bio: Optional[str] = None

class FundingRoundBase(BaseModel):
    round_type: str
    amount_usd: float
    announcement_date: str
    lead_investors: List[str] = []

class AcquisitionBase(BaseModel):
    target_company_name: str
    deal_size_usd: Optional[float] = 0.0
    acquisition_year: int

class NewsArticleBase(BaseModel):
    title: str
    summary: str
    published_date: str
    source_url: Optional[str] = None
    sentiment: Optional[str] = "NEUTRAL"

class CompanyCreateRequest(BaseModel):
    name: str
    industry: str
    description: str
    products: List[str] = []
    technologies: List[str] = []
    ceo_name: Optional[str] = None
    employee_count: Optional[int] = 0
    revenue_usd: Optional[float] = 0.0
    total_funding_usd: Optional[float] = 0.0
    valuation_usd: Optional[float] = 0.0
    country: str
    website: Optional[str] = None
    founded_year: Optional[int] = None
    founders: List[FounderBase] = []
    funding_rounds: List[FundingRoundBase] = []
    acquisitions: List[AcquisitionBase] = []
    competitors: List[str] = []
    investors: List[str] = []
    news: List[NewsArticleBase] = []

class CompanyResponse(BaseModel):
    id: UUID
    name: str
    industry: str
    description: str
    products: List[str]
    technologies: List[str]
    ceo_name: Optional[str]
    employee_count: int
    revenue_usd: float
    total_funding_usd: float
    valuation_usd: float
    country: str
    website: Optional[str]
    founded_year: Optional[int]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ==========================================
# Vector Search & Semantic Search Schemas
# ==========================================
class SemanticSearchRequest(BaseModel):
    query: str
    top_k: int = Field(default=5, ge=1, le=50)
    industry_filter: Optional[str] = None
    country_filter: Optional[str] = None
    hybrid_alpha: float = Field(default=0.5, ge=0.0, le=1.0) # 0 = pure BM25/keyword, 1 = pure dense vector

class VectorSearchResult(BaseModel):
    id: str
    name: str
    industry: str
    country: str
    description: str
    similarity_score: float
    matched_technologies: List[str] = []

# ==========================================
# Knowledge Graph Schemas
# ==========================================
class GraphNode(BaseModel):
    id: str
    label: str
    group: str # Company, Industry, Technology, Investor, Person
    properties: Dict[str, Any] = {}

class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str # COMPETES_WITH, INVESTED_IN, USES_TECHNOLOGY, etc.
    properties: Dict[str, Any] = {}

class KnowledgeGraphResponse(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

# ==========================================
# RAG Chatbot & Recommendation Schemas
# ==========================================
class ChatMessage(BaseModel):
    role: str # user, assistant, system
    content: str

class ChatRequest(BaseModel):
    message: str
    chat_history: List[ChatMessage] = []
    include_graph_context: bool = True
    top_k_vector: int = 4

class SourceDocument(BaseModel):
    company_name: str
    source_type: str # VectorDB, KnowledgeGraph, Postgres
    content_snippet: str
    relevance_score: Optional[float] = None

class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceDocument] = []
    cypher_query_used: Optional[str] = None
    graph_context_nodes: List[str] = []

class RecommendationRequest(BaseModel):
    company_name: str
    top_k: int = 5
    filter_by_same_industry: bool = False

class CompanyRecommendation(BaseModel):
    company: CompanyResponse
    similarity_score: float
    common_technologies: List[str]
    common_investors: List[str]
    reasoning: str

# ==========================================
# Analytics Dashboard Schemas
# ==========================================
class IndustryDistribution(BaseModel):
    industry: str
    company_count: int
    total_funding_usd: float

class AnalyticsDashboardResponse(BaseModel):
    total_companies: int
    total_funding_usd: float
    total_revenue_usd: float
    top_industries: List[IndustryDistribution]
    country_breakdown: Dict[str, int]
    top_technologies: Dict[str, int]
    funding_distribution_by_year: Dict[str, float]

# ==========================================
# AI Report Generation Schemas
# ==========================================
class ReportGenerateRequest(BaseModel):
    company_name: str
    include_swot: bool = True
    include_competitor_analysis: bool = True
    include_tech_stack: bool = True

class ReportGenerateResponse(BaseModel):
    report_id: UUID
    company_name: str
    title: str
    summary: str
    swot_analysis: Dict[str, List[str]]
    competitor_analysis: Dict[str, Any]
    technology_analysis: Dict[str, Any]
    pdf_download_url: str
    generated_at: datetime
