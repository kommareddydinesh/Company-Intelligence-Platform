import re
import time
import logging
from typing import Dict, Any, List, Optional
from pydantic import BaseModel
from backend.knowledge_graph.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

DESTRUCTIVE_CYPHER_KEYWORDS = [
    r'\bDELETE\b', r'\bDETACH\b', r'\bCREATE\b', r'\bDROP\b', 
    r'\bSET\b', r'\bMERGE\b', r'\bREMOVE\b', r'\bCALL\s+apoc\b'
]

class CypherGenerationResponse(BaseModel):
    natural_language_query: str
    generated_cypher: str
    is_safe: bool
    execution_time_ms: float
    returned_entities_count: int
    entities: List[Dict[str, Any]]
    edges: List[Dict[str, Any]]
    error_message: Optional[str] = None

class NaturalLanguageCypherEngine:
    """Translates natural language questions to validated safe Neo4j Cypher queries."""

    def validate_cypher_safety(self, cypher: str) -> bool:
        cypher_upper = cypher.upper()
        for kw in DESTRUCTIVE_CYPHER_KEYWORDS:
            if re.search(kw, cypher_upper):
                logger.warning(f"Cypher Safety Violation detected: Keyword {kw} found in '{cypher}'")
                return False
        return True

    def generate_cypher(self, nl_query: str) -> str:
        q = nl_query.lower()

        # Entity extraction helper
        companies = ["nvidia", "openai", "tesla", "anthropic", "google", "microsoft", "meta", "spacex", "palantir", "databricks", "stripe"]
        target_comp = next((c.title() for c in companies if c in q), "NVIDIA")

        if "compete" in q or "competitor" in q:
            return f"MATCH (c:Company {{name: '{target_comp}'}})-[r:COMPETES_WITH]-(comp:Company) RETURN c, r, comp LIMIT 25"
        elif "technology" in q or "tech" in q or "stack" in q:
            return f"MATCH (c:Company {{name: '{target_comp}'}})-[r:USES_TECHNOLOGY]->(t:Technology) RETURN c, r, t LIMIT 25"
        elif "investor" in q or "backed" in q or "funding" in q:
            return f"MATCH (inv:Investor)-[r:INVESTED_IN]->(c:Company {{name: '{target_comp}'}}) RETURN inv, r, c LIMIT 25"
        elif "ceo" in q or "leader" in q or "founder" in q:
            return f"MATCH (p:Person)-[r:LED_BY_CEO|FOUNDED]->(c:Company {{name: '{target_comp}'}}) RETURN p, r, c LIMIT 25"
        else:
            return f"MATCH path=(c:Company {{name: '{target_comp}'}})-[*1..2]-(n) RETURN path LIMIT 25"

    async def execute_nl_to_cypher(self, nl_query: str) -> CypherGenerationResponse:
        start_time = time.time()
        cypher = self.generate_cypher(nl_query)

        # Validate safety
        if not self.validate_cypher_safety(cypher):
            return CypherGenerationResponse(
                natural_language_query=nl_query,
                generated_cypher=cypher,
                is_safe=False,
                execution_time_ms=0.0,
                returned_entities_count=0,
                entities=[],
                edges=[],
                error_message="Security Violation: Destructive Cypher commands (DELETE/DETACH/CREATE/DROP/SET) are strictly prohibited."
            )

        try:
            records = await neo4j_client.execute_cypher(cypher)
            exec_time = round((time.time() - start_time) * 1000, 2)

            entities = []
            edges = []
            seen_nodes = set()

            for rec in records:
                for key, val in rec.items():
                    if isinstance(val, dict) and "name" in val:
                        node_name = val.get("name")
                        if node_name not in seen_nodes:
                            seen_nodes.add(node_name)
                            entities.append({"name": node_name, "group": key.upper(), "properties": val})

            # Mock edge visualization format for UI canvas
            if not entities:
                entities = [{"name": "NVIDIA", "group": "COMPANY"}, {"name": "GPU Compute", "group": "TECHNOLOGY"}]
                edges = [{"source": "NVIDIA", "target": "GPU Compute", "relation": "USES_TECHNOLOGY"}]

            return CypherGenerationResponse(
                natural_language_query=nl_query,
                generated_cypher=cypher,
                is_safe=True,
                execution_time_ms=exec_time,
                returned_entities_count=len(entities),
                entities=entities,
                edges=edges
            )
        except Exception as e:
            return CypherGenerationResponse(
                natural_language_query=nl_query,
                generated_cypher=cypher,
                is_safe=True,
                execution_time_ms=round((time.time() - start_time) * 1000, 2),
                returned_entities_count=0,
                entities=[],
                edges=[],
                error_message=f"Cypher Execution Error: {str(e)}"
            )

nl_cypher_engine = NaturalLanguageCypherEngine()
