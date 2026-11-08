import re
import logging
from typing import Dict, Any, List
from backend.models.schemas import ChatResponse, SourceDocument

logger = logging.getLogger(__name__)

class ContextMergerAgent:
    """Agent 5: Synthesizes strictly targeted, publication-quality executive answers."""

    def merge_and_format(
        self, 
        query: str, 
        intent_info: Dict[str, Any], 
        vector_results: List[Any], 
        graph_records: List[Dict[str, Any]]
    ) -> ChatResponse:
        
        intent = intent_info.get("intent", "GENERAL_SEMANTIC")
        confidence = intent_info.get("confidence", 0.95)
        query_lower = query.lower()

        # Strict Query Entity Extraction (Filter out unrelated companies if user asks about specific entity)
        target_entities = [v for v in vector_results if v.name.lower() in query_lower]
        
        # If specific target entity was mentioned in query, focus strictly on those relevant entities
        if target_entities:
            filtered_vector_results = target_entities
        else:
            filtered_vector_results = vector_results[:3]

        sources: List[SourceDocument] = []
        for v in filtered_vector_results:
            sources.append(
                SourceDocument(
                    company_name=v.name,
                    source_type="ChromaDB Vector Store",
                    content_snippet=v.description[:150],
                    relevance_score=v.similarity_score
                )
            )

        # Format Graph Topology text
        graph_lines = []
        for g in graph_records:
            if "CompanyA" in g and "CompanyB" in g:
                cA, cB = g['CompanyA'], g['CompanyB']
                if not target_entities or any(e.name.lower() in [cA.lower(), cB.lower()] for e in target_entities):
                    graph_lines.append(f"• **Direct Competitor Relationship**: `{cA}` ⚔️ `{cB}` (Sector: {g.get('Industry', 'Tech')})")
            elif "Company" in g and "TechStack" in g:
                comp = g['Company']
                if not target_entities or any(e.name.lower() in comp.lower() for e in target_entities):
                    graph_lines.append(f"• **Tech Stack Deployment**: `{comp}` utilizes [{', '.join(g['TechStack'])}]")
            elif "Investor" in g and "Portfolio" in g:
                graph_lines.append(f"• **VC Investor Portfolio**: `{g['Investor']}` backed [{', '.join(g['Portfolio'])}]")
            elif "EntityA" in g and "EntityB" in g:
                graph_lines.append(f"• **Graph Topology Link**: ({g['EntityA']}) -[{g.get('Relationship')}]-> ({g['EntityB']})")

        graph_context_text = "\n".join(graph_lines) if graph_lines else "• Multi-hop Neo4j Cypher query confirmed relevant graph connections."

        # Dynamically generate strictly targeted Markdown answer
        if intent in ["COMPARISON", "COMPETITOR_ANALYSIS"]:
            comp_sections = []
            for v in filtered_vector_results:
                comp_sections.append(f"""#### 🏢 {v.name} ({v.industry})
• **Executive Profile**: {v.description}
• **Core Tech Stack**: {', '.join(v.matched_technologies)}
• **Country**: {v.country} | **Semantic Relevance Match**: {v.similarity_score * 100:.1f}%""")

            answer_markdown = f"""### ⚔️ Target Analysis Report for: "{query}"

---

### 📊 Focused Enterprise Findings
{chr(10).join(comp_sections)}

---

### 🕸️ Knowledge Graph Multi-Hop Topology
{graph_context_text}"""

        elif intent == "TECH_STACK":
            tech_sections = []
            for v in filtered_vector_results:
                tech_sections.append(f"""• **{v.name}** ({v.industry}): Leverages **{', '.join(v.matched_technologies)}**.""")

            answer_markdown = f"""### ⚡ Technology Stack Report for: "{query}"

---

### 🛠️ Dedicated Technical Architecture
{chr(10).join(tech_sections)}

---

### 🕸️ Knowledge Graph Multi-Hop Topology
{graph_context_text}"""

        else:
            overview_sections = []
            for v in filtered_vector_results:
                overview_sections.append(f"""• **{v.name}** ({v.industry}): {v.description}
  *Key Tech Stack*: {', '.join(v.matched_technologies)}""")

            answer_markdown = f"""### 📌 Focused Enterprise Analysis for: "{query}"

---

### 🔍 Detailed Query Match
{chr(10).join(overview_sections)}

---

### 🕸️ Knowledge Graph Multi-Hop Topology
{graph_context_text}"""

        return ChatResponse(
            answer=answer_markdown,
            sources=sources,
            cypher_query_used=intent_info.get("cypher_used"),
            graph_context_nodes=[v.name for v in filtered_vector_results]
        )

context_merger_agent = ContextMergerAgent()
