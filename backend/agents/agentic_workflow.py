import logging
from typing import Dict, Any
from backend.agents.intent_agent import intent_agent
from backend.agents.query_planner import query_planner_agent
from backend.agents.vector_agent import vector_agent
from backend.agents.graph_agent import graph_agent
from backend.agents.context_merger import context_merger_agent
from backend.models.schemas import ChatResponse

logger = logging.getLogger(__name__)

class AgenticWorkflowOrchestrator:
    """Master Multi-Agent Orchestrator connecting Intent, Planner, Vector, Graph, and Merger Agents."""

    def __init__(self):
        self._response_cache: dict = {}

    def clear_cache(self):
        self._response_cache.clear()

    async def process_user_query(self, query: str) -> ChatResponse:
        clean_key = query.strip().lower()
        if clean_key in self._response_cache:
            logger.info(f"Agentic Workflow -> Serving cached response for: '{query}'")
            return self._response_cache[clean_key]

        logger.info(f"Agentic Workflow Started for Query: '{query}'")

        # Step 1: Intent Detection Agent
        intent_output = intent_agent.detect_intent(query)

        # Step 2: Query Planner Agent
        plan_output = query_planner_agent.plan_query(intent_output)

        # Step 3 & 4: Parallel Retrieval Execution (Vector Search Agent + Knowledge Graph Agent)
        vector_results = vector_agent.execute(plan_output["vector_plan"])
        graph_records = await graph_agent.execute(plan_output["graph_plan"])

        # Step 5: Context Merger & Response Formatter Agent
        intent_output["cypher_used"] = plan_output["graph_plan"]["cypher_pattern"]
        response = context_merger_agent.merge_and_format(query, intent_output, vector_results, graph_records)

        # Cache response
        if len(self._response_cache) < 500:
            self._response_cache[clean_key] = response

        logger.info("Agentic Workflow Execution Completed Successfully.")
        return response

agentic_workflow = AgenticWorkflowOrchestrator()
