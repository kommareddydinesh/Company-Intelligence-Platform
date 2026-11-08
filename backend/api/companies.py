import uuid
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, HTTPException, Query

from backend.models.schemas import CompanyResponse, CompanyCreateRequest
from backend.services.dataset_generator import get_company_seed_dataset
from backend.services.data_preprocessor import preprocessor
from backend.services.vector_search_service import vector_search_service
from backend.knowledge_graph.graph_builder import graph_builder

router = APIRouter(prefix="/companies", tags=["Companies"])

# In-memory storage seeded with enterprise dataset
COMPANIES_CACHE: List[CompanyResponse] = []

def _init_companies_cache():
    if not COMPANIES_CACHE:
        raw_seed = get_company_seed_dataset()
        for idx, raw in enumerate(raw_seed):
            cleaned = preprocessor.preprocess_company_data(raw)
            c_id = uuid.uuid5(uuid.NAMESPACE_DNS, cleaned["name"])
            c_resp = CompanyResponse(
                id=c_id,
                name=cleaned["name"],
                industry=cleaned["industry"],
                description=cleaned["description"],
                products=cleaned["products"],
                technologies=cleaned["technologies"],
                ceo_name=cleaned.get("ceo_name"),
                employee_count=cleaned["employee_count"],
                revenue_usd=cleaned["revenue_usd"],
                total_funding_usd=cleaned["total_funding_usd"],
                valuation_usd=cleaned["valuation_usd"],
                country=cleaned["country"],
                website=cleaned.get("website"),
                founded_year=cleaned.get("founded_year"),
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
            COMPANIES_CACHE.append(c_resp)
            # Index in VectorDB
            vector_search_service.index_company(str(c_id), cleaned)

_init_companies_cache()

@router.get("", response_model=List[CompanyResponse])
async def list_companies(
    industry: Optional[str] = None,
    country: Optional[str] = None,
    search: Optional[str] = None,
    limit: int = Query(default=20, ge=1, le=100)
):
    results = COMPANIES_CACHE
    if industry:
        results = [c for c in results if industry.lower() in c.industry.lower()]
    if country:
        results = [c for c in results if country.lower() in c.country.lower()]
    if search:
        results = [c for c in results if search.lower() in c.name.lower() or search.lower() in c.description.lower()]
    return results[:limit]

@router.get("/{company_id}", response_model=CompanyResponse)
async def get_company_by_id(company_id: uuid.UUID):
    for c in COMPANIES_CACHE:
        if c.id == company_id:
            return c
    raise HTTPException(status_code=404, detail="Company not found")

@router.post("", response_model=CompanyResponse, status_code=201)
async def create_company(req: CompanyCreateRequest):
    c_id = uuid.uuid4()
    cleaned = preprocessor.preprocess_company_data(req.model_dump())
    new_company = CompanyResponse(
        id=c_id,
        name=cleaned["name"],
        industry=cleaned["industry"],
        description=cleaned["description"],
        products=cleaned["products"],
        technologies=cleaned["technologies"],
        ceo_name=cleaned.get("ceo_name"),
        employee_count=cleaned["employee_count"],
        revenue_usd=cleaned["revenue_usd"],
        total_funding_usd=cleaned["total_funding_usd"],
        valuation_usd=cleaned["valuation_usd"],
        country=cleaned["country"],
        website=cleaned.get("website"),
        founded_year=cleaned.get("founded_year"),
        created_at=datetime.utcnow(),
        updated_at=datetime.utcnow()
    )
    COMPANIES_CACHE.append(new_company)
    vector_search_service.index_company(str(c_id), cleaned)
    await graph_builder.ingest_company_graph(str(c_id), cleaned)
    return new_company
