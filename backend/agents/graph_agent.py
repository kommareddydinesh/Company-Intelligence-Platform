import logging
from typing import Dict, Any, List
from backend.knowledge_graph.neo4j_client import neo4j_client

logger = logging.getLogger(__name__)

class KnowledgeGraphAgent:
    """Agent 4: Executes multi-hop Cypher queries against Neo4j Graph DB."""

    async def execute(self, graph_plan: Dict[str, Any]) -> List[Dict[str, Any]]:
        cypher = graph_plan.get("cypher_pattern", "")
        params = graph_plan.get("parameters", {})
        
        try:
            records = await neo4j_client.execute_query(cypher, params)
            logger.info(f"Knowledge Graph Agent -> Retrieved {len(records)} Neo4j topology records.")
            return records
        except Exception as e:
            logger.warning(f"Graph Agent Query Notice: {e}")
            return []

graph_agent = KnowledgeGraphAgent()
