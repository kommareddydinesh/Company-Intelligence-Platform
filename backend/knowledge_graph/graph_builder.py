import logging
from typing import Dict, Any, List
from backend.knowledge_graph.neo4j_client import neo4j_client
from backend.models.schemas import KnowledgeGraphResponse, GraphNode, GraphEdge

logger = logging.getLogger(__name__)

class KnowledgeGraphBuilder:
    def __init__(self):
        pass

    async def ingest_company_graph(self, company_id: str, company: Dict[str, Any]):
        """Ingests a company record into Neo4j with full graph entities and relationships."""
        query = """
        // 1. Create or Update Company Node
        MERGE (c:Company {id: $company_id})
        SET c.name = $name,
            c.industry = $industry,
            c.country = $country,
            c.revenue_usd = $revenue_usd,
            c.total_funding_usd = $total_funding_usd,
            c.valuation_usd = $valuation_usd,
            c.employee_count = $employee_count

        // 2. Connect to Industry
        MERGE (ind:Industry {name: $industry})
        MERGE (c)-[:OPERATES_IN]->(ind)

        // 3. Connect to Country
        MERGE (ctr:Country {name: $country})
        MERGE (c)-[:LOCATED_IN]->(ctr)

        // 4. Connect to Founders / CEO
        FOREACH (f IN $founders |
            MERGE (p:Person {name: f})
            MERGE (p)-[:FOUNDED]->(c)
        )
        WITH c
        FOREACH (t IN $technologies |
            MERGE (tech:Technology {name: t})
            MERGE (c)-[:USES_TECHNOLOGY]->(tech)
        )
        WITH c
        FOREACH (prod IN $products |
            MERGE (p:Product {name: prod})
            MERGE (c)-[:OFFERS_PRODUCT]->(p)
        )
        WITH c
        FOREACH (inv IN $investors |
            MERGE (i:Investor {name: inv})
            MERGE (i)-[:INVESTED_IN]->(c)
        )
        WITH c
        FOREACH (comp IN $competitors |
            MERGE (comp_c:Company {name: comp})
            MERGE (c)-[:COMPETES_WITH]->(comp_c)
        )
        """

        params = {
            "company_id": str(company_id),
            "name": company.get("name"),
            "industry": company.get("industry"),
            "country": company.get("country"),
            "revenue_usd": float(company.get("revenue_usd", 0.0)),
            "total_funding_usd": float(company.get("total_funding_usd", 0.0)),
            "valuation_usd": float(company.get("valuation_usd", 0.0)),
            "employee_count": int(company.get("employee_count", 0)),
            "founders": company.get("founders", []),
            "technologies": company.get("technologies", []),
            "products": company.get("products", []),
            "investors": company.get("investors", []),
            "competitors": company.get("competitors", [])
        }

        try:
            await neo4j_client.execute_query(query, params)
            logger.info(f"Ingested company '{company.get('name')}' into Neo4j Knowledge Graph.")
        except Exception as e:
            logger.error(f"Error ingesting company '{company.get('name')}' into Neo4j: {e}")

    async def get_entire_graph(self, limit: int = 100) -> KnowledgeGraphResponse:
        """Retrieves nodes and edges for rendering in React Flow."""
        query = f"""
        MATCH (n)-[r]->(m)
        RETURN n, type(r) AS rel_type, m
        LIMIT {limit}
        """
        records = await neo4j_client.execute_query(query)
        
        nodes_dict: Dict[str, GraphNode] = {}
        edges: List[GraphEdge] = []

        for record in records:
            source_node = record["n"]
            target_node = record["m"]
            rel_type = record["rel_type"]

            # Extract node IDs and labels
            src_id = source_node.get("name") or source_node.get("id") or str(source_node.element_id)
            tgt_id = target_node.get("name") or target_node.get("id") or str(target_node.element_id)

            src_group = list(source_node.labels)[0] if hasattr(source_node, 'labels') and source_node.labels else "Entity"
            tgt_group = list(target_node.labels)[0] if hasattr(target_node, 'labels') and target_node.labels else "Entity"

            if src_id not in nodes_dict:
                nodes_dict[src_id] = GraphNode(id=src_id, label=src_id, group=src_group, properties=dict(source_node))
            if tgt_id not in nodes_dict:
                nodes_dict[tgt_id] = GraphNode(id=tgt_id, label=tgt_id, group=tgt_group, properties=dict(target_node))

            edge_id = f"{src_id}-{rel_type}-{tgt_id}"
            edges.append(GraphEdge(id=edge_id, source=src_id, target=tgt_id, label=rel_type))

        return KnowledgeGraphResponse(nodes=list(nodes_dict.values()), edges=edges)

graph_builder = KnowledgeGraphBuilder()
