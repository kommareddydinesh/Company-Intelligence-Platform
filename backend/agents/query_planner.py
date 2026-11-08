import logging
from typing import Dict, Any

logger = logging.getLogger(__name__)

class QueryPlannerAgent:
    """Agent 2: Formulates sub-execution strategies for Vector DB and Knowledge Graph DB."""
    
    def plan_query(self, intent_output: Dict[str, Any]) -> Dict[str, Any]:
        intent = intent_output["intent"]
        query = intent_output["query"]
        entities = intent_output["extracted_entities"]

        vector_plan = {
            "query": query,
            "top_k": 5,
            "hybrid_alpha": 0.6
        }

        graph_plan = {
            "cypher_pattern": "FALLBACK",
            "parameters": {}
        }

        if intent == "COMPETITOR_ANALYSIS":
            graph_plan["cypher_pattern"] = """
            MATCH (c1:Company)-[r:COMPETES_WITH]-(c2:Company)
            RETURN c1.name AS CompanyA, c2.name AS CompanyB, c1.industry AS Industry
            LIMIT 10
            """
        elif intent == "TECH_STACK":
            graph_plan["cypher_pattern"] = """
            MATCH (c:Company)-[:USES_TECHNOLOGY]->(t:Technology)
            RETURN c.name AS Company, collect(t.name) AS TechStack
            LIMIT 10
            """
        elif intent == "FUNDING_INVESTMENT":
            graph_plan["cypher_pattern"] = """
            MATCH (inv:Investor)-[:INVESTED_IN]->(c:Company)
            RETURN inv.name AS Investor, collect(c.name) AS Portfolio
            LIMIT 10
            """
        else:
            graph_plan["cypher_pattern"] = """
            MATCH (c:Company)-[r]->(m)
            RETURN c.name AS EntityA, type(r) AS Relationship, COALESCE(m.name, labels(m)[0]) AS EntityB
            LIMIT 10
            """

        logger.info(f"Query Planner Agent -> Generated Execution Plan for Intent: {intent}")
        return {
            "intent": intent,
            "vector_plan": vector_plan,
            "graph_plan": graph_plan
        }

query_planner_agent = QueryPlannerAgent()
