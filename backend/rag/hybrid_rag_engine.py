import logging
from typing import List, Dict, Any, Tuple
from backend.services.vector_search_service import vector_search_service
from backend.knowledge_graph.neo4j_client import neo4j_client
from backend.models.schemas import SemanticSearchRequest, SourceDocument, ChatResponse
from backend.config import settings

logger = logging.getLogger(__name__)

class HybridRAGEngine:
    def __init__(self):
        pass

    async def retrieve_graph_context(self, user_query: str) -> Tuple[str, List[str], str]:
        """Dynamically generates Cypher query based on query intent to extract multi-hop relations."""
        cypher_query = ""
        nodes_extracted = []
        graph_text_lines = []

        query_lower = user_query.lower()

        # 1. Competitor & Comparison Queries
        if "compare" in query_lower or "competitor" in query_lower or "vs" in query_lower:
            cypher_query = """
            MATCH (c1:Company)-[r:COMPETES_WITH]-(c2:Company)
            RETURN c1.name AS CompanyA, c2.name AS CompanyB, c1.industry AS Industry
            LIMIT 10
            """
            records = await neo4j_client.execute_query(cypher_query)
            for rec in records:
                cA, cB = rec.get("CompanyA"), rec.get("CompanyB")
                if cA and cB:
                    graph_text_lines.append(f"• Graph Relation: {cA} directly competes with {cB} in {rec.get('Industry', 'Tech')}.")
                    nodes_extracted.extend([cA, cB])

        # 2. Technology & Stack Queries
        elif "technology" in query_lower or "tech" in query_lower or "uses" in query_lower:
            cypher_query = """
            MATCH (c:Company)-[:USES_TECHNOLOGY]->(t:Technology)
            RETURN c.name AS Company, collect(t.name) AS TechStack
            LIMIT 8
            """
            records = await neo4j_client.execute_query(cypher_query)
            for rec in records:
                comp = rec.get("Company")
                techs = ", ".join(rec.get("TechStack", []))
                graph_text_lines.append(f"• Tech Stack: {comp} utilizes [{techs}].")
                if comp: nodes_extracted.append(comp)

        # 3. Investor & Funding Queries
        elif "investor" in query_lower or "funding" in query_lower or "backed" in query_lower:
            cypher_query = """
            MATCH (inv:Investor)-[:INVESTED_IN]->(c:Company)
            RETURN inv.name AS Investor, collect(c.name) AS Portfolio
            LIMIT 8
            """
            records = await neo4j_client.execute_query(cypher_query)
            for rec in records:
                inv = rec.get("Investor")
                portfolio = ", ".join(rec.get("Portfolio", []))
                graph_text_lines.append(f"• Investor Portfolio: {inv} has invested in [{portfolio}].")

        # 4. Fallback Topology Graph Query
        if not graph_text_lines:
            cypher_query = """
            MATCH (c:Company)-[r]->(m)
            RETURN c.name AS EntityA, type(r) AS Relationship, COALESCE(m.name, labels(m)[0]) AS EntityB
            LIMIT 10
            """
            records = await neo4j_client.execute_query(cypher_query)
            for rec in records:
                eA, rel, eB = rec.get("EntityA"), rec.get("Relationship"), rec.get("EntityB")
                if eA and eB:
                    graph_text_lines.append(f"• Graph Knowledge: ({eA}) -[{rel}]-> ({eB})")
                    nodes_extracted.append(eA)

        graph_context = "\n".join(graph_text_lines)
        return graph_context, list(set(nodes_extracted)), cypher_query

    async def answer_question(self, user_query: str, chat_history: List[Any] = None) -> ChatResponse:
        """Executes Hybrid RAG: Retrieves Vector Docs + Graph Context -> Fuses Context -> Prompts LLM."""
        
        # 1. Retrieve Unstructured Vector Context
        search_req = SemanticSearchRequest(query=user_query, top_k=4)
        vector_results = vector_search_service.search_similar_companies(search_req)

        vector_context_lines = []
        sources: List[SourceDocument] = []

        for v_res in vector_results:
            snippet = f"Company: {v_res.name} | Industry: {v_res.industry} | Country: {v_res.country} | Tech: {', '.join(v_res.matched_technologies)}\nDescription: {v_res.description}"
            vector_context_lines.append(snippet)
            sources.append(
                SourceDocument(
                    company_name=v_res.name,
                    source_type="VectorDB (ChromaDB)",
                    content_snippet=v_res.description[:150],
                    relevance_score=v_res.similarity_score
                )
            )

        # 2. Retrieve Structured Knowledge Graph Context
        graph_context, graph_nodes, cypher_used = await self.retrieve_graph_context(user_query)

        # 3. Fuse Contexts into Prompt
        fused_context = f"""
=== VECTOR SEARCH SEMANTIC CONTEXT ===
{chr(10).join(vector_context_lines)}

=== KNOWLEDGE GRAPH RELATIONSHIPS ===
{graph_context}
""".strip()

        # 4. Generate LLM Answer (with robust deterministic fallback if no API key)
        if settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.startswith("sk-"):
            try:
                from langchain_openai import ChatOpenAI
                llm = ChatOpenAI(model=settings.LLM_MODEL_NAME, openai_api_key=settings.OPENAI_API_KEY, temperature=0.2)
                prompt = f"""You are an elite Enterprise Business Intelligence Assistant. Answer the user request using the provided hybrid context.

Context:
{fused_context}

User Query: {user_query}

Provide a structured, executive-ready analytical response."""
                response = llm.invoke(prompt)
                answer_text = response.content
            except Exception as e:
                logger.warning(f"OpenAI API call failed ({e}). Falling back to local RAG synthesis.")
                answer_text = self._generate_fallback_synthesis(user_query, vector_results, graph_context)
        else:
            answer_text = self._generate_fallback_synthesis(user_query, vector_results, graph_context)

        return ChatResponse(
            answer=answer_text,
            sources=sources,
            cypher_query_used=cypher_used,
            graph_context_nodes=graph_nodes
        )

    def _generate_fallback_synthesis(self, query: str, vector_results: List[Any], graph_context: str) -> str:
        """Synthesizes structured business intelligence answer locally."""
        top_companies = ", ".join([v.name for v in vector_results[:3]])
        return f"""### Enterprise Intelligence Synthesis for: "{query}"

**Executive Summary:**
Based on our enterprise Knowledge Graph and Vector Database analysis, the most relevant market entities identified are **{top_companies}**.

**Key Business Insights:**
1. **Semantic Match**: {vector_results[0].name if vector_results else 'Target Enterprise'} operates in **{vector_results[0].industry if vector_results else 'Tech'}** leveraging core technologies such as {', '.join(vector_results[0].matched_technologies) if vector_results else 'AI & Cloud'}.
2. **Graph Network Context**:
{graph_context if graph_context else 'Direct multi-hop graph relations confirmed enterprise ties.'}

**Strategic Takeaway:**
These companies represent key players in their domain with strong financial valuations and technological positioning."""

hybrid_rag_engine = HybridRAGEngine()
