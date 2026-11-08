import logging
from typing import List, Dict, Any, Optional
from backend.database.chroma import chroma_store
from backend.embeddings.embedding_service import embedding_service
from backend.models.schemas import VectorSearchResult, SemanticSearchRequest

logger = logging.getLogger(__name__)

class VectorSearchService:
    def __init__(self):
        pass

    def index_company(self, company_id: str, company_data: Dict[str, Any]):
        """Embeds and indexes a company's text profile in ChromaDB."""
        collection = chroma_store.get_collection()
        
        # Combine rich text fields for semantic representation
        searchable_text = f"""
        Company Name: {company_data.get('name')}
        Industry: {company_data.get('industry')}
        Description: {company_data.get('description')}
        Products: {', '.join(company_data.get('products', []))}
        Technologies: {', '.join(company_data.get('technologies', []))}
        Country: {company_data.get('country')}
        CEO: {company_data.get('ceo_name', '')}
        """.strip()

        vector = embedding_service.generate_embedding(searchable_text)

        metadata = {
            "company_id": str(company_id),
            "name": company_data.get("name", ""),
            "industry": company_data.get("industry", ""),
            "country": company_data.get("country", ""),
            "technologies": ", ".join(company_data.get("technologies", [])),
            "total_funding_usd": float(company_data.get("total_funding_usd", 0.0))
        }

        collection.upsert(
            ids=[str(company_id)],
            embeddings=[vector],
            documents=[searchable_text],
            metadatas=[metadata]
        )
        logger.info(f"Indexed company '{company_data.get('name')}' in ChromaDB collection.")

    def search_similar_companies(self, search_req: SemanticSearchRequest) -> List[VectorSearchResult]:
        """Performs semantic vector search with optional metadata filtering."""
        collection = chroma_store.get_collection()
        
        query_vector = embedding_service.generate_embedding(search_req.query)

        where_clause = {}
        if search_req.industry_filter:
            where_clause["industry"] = search_req.industry_filter
        if search_req.country_filter:
            where_clause["country"] = search_req.country_filter

        results = collection.query(
            query_embeddings=[query_vector],
            n_results=search_req.top_k,
            where=where_clause if where_clause else None
        )

        formatted_results: List[VectorSearchResult] = []
        if results and results["ids"] and results["ids"][0]:
            ids = results["ids"][0]
            metadatas = results["metadatas"][0]
            documents = results["documents"][0]
            distances = results["distances"][0] if "distances" in results else [0.0] * len(ids)

            for cid, meta, doc, dist in zip(ids, metadatas, documents, distances):
                # Calculate cosine similarity score from distance
                similarity_score = max(0.0, 1.0 - float(dist)) if dist <= 1.0 else 1.0 / (1.0 + float(dist))
                tech_list = [t.strip() for t in meta.get("technologies", "").split(",") if t.strip()]

                formatted_results.append(
                    VectorSearchResult(
                        id=cid,
                        name=meta.get("name", "Unknown"),
                        industry=meta.get("industry", "N/A"),
                        country=meta.get("country", "N/A"),
                        description=doc[:250] + "...",
                        similarity_score=round(similarity_score, 4),
                        matched_technologies=tech_list
                    )
                )

        return formatted_results

vector_search_service = VectorSearchService()
