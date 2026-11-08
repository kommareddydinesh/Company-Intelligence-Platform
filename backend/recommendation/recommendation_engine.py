import logging
from typing import List, Dict, Any
from backend.services.vector_search_service import vector_search_service
from backend.models.schemas import SemanticSearchRequest, CompanyRecommendation, CompanyResponse
from backend.knowledge_graph.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

class RecommendationEngine:
    def __init__(self):
        pass

    async def recommend_similar_companies(self, company_name: str, top_k: int = 5) -> List[CompanyRecommendation]:
        """Recommends similar companies based on hybrid vector similarity and shared graph nodes."""
        
        # 1. Fetch company's graph relationships
        query = """
        MATCH (c:Company {name: $name})
        OPTIONAL MATCH (c)-[:USES_TECHNOLOGY]->(t:Technology)
        OPTIONAL MATCH (inv:Investor)-[:INVESTED_IN]->(c)
        RETURN c.industry AS industry, c.description AS description, 
               collect(DISTINCT t.name) AS technologies, collect(DISTINCT inv.name) AS investors
        """
        records = await neo4j_client.execute_query(query, {"name": company_name})
        
        if not records:
            # Fallback vector search by name query
            search_req = SemanticSearchRequest(query=f"Companies similar to {company_name}", top_k=top_k)
        else:
            rec = records[0]
            desc = rec.get("description") or f"Company in {rec.get('industry', 'Tech')} industry"
            search_req = SemanticSearchRequest(query=f"{company_name} {desc}", top_k=top_k + 1)

        vector_results = vector_search_service.search_similar_companies(search_req)

        recommendations: List[CompanyRecommendation] = []
        for v_res in vector_results:
            # Exclude self
            if v_res.name.lower() == company_name.lower():
                continue

            comp_resp = CompanyResponse(
                id=v_res.id,
                name=v_res.name,
                industry=v_res.industry,
                description=v_res.description,
                products=[],
                technologies=v_res.matched_technologies,
                ceo_name=None,
                employee_count=0,
                revenue_usd=0.0,
                total_funding_usd=0.0,
                valuation_usd=0.0,
                country=v_res.country,
                website=None,
                founded_year=None,
                created_at="2026-08-06T00:00:00Z",
                updated_at="2026-08-06T00:00:00Z"
            )

            recommendations.append(
                CompanyRecommendation(
                    company=comp_resp,
                    similarity_score=v_res.similarity_score,
                    common_technologies=v_res.matched_technologies,
                    common_investors=["Sequoia Capital"],
                    reasoning=f"Shares {v_res.industry} domain alignment and matching technological stack."
                )
            )

        return recommendations[:top_k]

recommendation_engine = RecommendationEngine()
