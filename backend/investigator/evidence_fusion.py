import time
import uuid
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class EvidenceItem(BaseModel):
    evidence_id: str = Field(default_factory=lambda: f"ev_{uuid.uuid4().hex[:8]}")
    source_type: str  # "knowledge_graph", "vector_db", "postgres_relational"
    source: str       # "Neo4j", "ChromaDB", "PostgreSQL"
    path: Optional[str] = None  # e.g. "Company → Technology → Industry"
    retrieved_content: str
    relevance_score: float = 0.85
    confidence: float = 0.90
    timestamp: str = Field(default_factory=lambda: time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
    metadata: Dict[str, Any] = Field(default_factory=dict)

class EvidenceFusionEngine:
    """Fuses multi-source evidence from PostgreSQL, ChromaDB, and Neo4j into unified verified context."""

    def fuse_evidence(
        self,
        postgres_data: List[Dict[str, Any]],
        vector_results: List[Dict[str, Any]],
        graph_records: List[Dict[str, Any]]
    ) -> List[EvidenceItem]:
        fused: List[EvidenceItem] = []

        # 1. Fuse PostgreSQL Relational Data
        for row in postgres_data:
            comp_name = row.get("name", "Unknown Company")
            content = f"Company: {comp_name} | Industry: {row.get('industry', 'N/A')} | Valuation: ${row.get('valuation_usd', 0):,.0f} | Revenue: ${row.get('revenue_usd', 0):,.0f} | CEO: {row.get('ceo_name', 'N/A')} | Country: {row.get('country', 'N/A')}"
            fused.append(EvidenceItem(
                source_type="postgres_relational",
                source="PostgreSQL",
                path=f"PostgreSQL Table 'companies' → {comp_name}",
                retrieved_content=content,
                relevance_score=0.98,
                confidence=0.99,
                metadata={"company_name": comp_name, "raw": row}
            ))

        # 2. Fuse ChromaDB Vector Search Chunks
        for idx, vec in enumerate(vector_results):
            comp_name = vec.get("name", "Target Entity")
            score = float(vec.get("similarity_score", 0.85))
            desc = vec.get("description", "")
            techs = ", ".join(vec.get("matched_technologies", []))
            content = f"Company Profile Chunk ({comp_name}): {desc} [Matched Technologies: {techs}]"
            fused.append(EvidenceItem(
                source_type="vector_db",
                source="ChromaDB",
                path=f"ChromaDB HNSW Vector Collection → {comp_name}",
                retrieved_content=content,
                relevance_score=score,
                confidence=round(min(0.95, score + 0.05), 2),
                metadata={"company_name": comp_name, "rank": idx + 1}
            ))

        # 3. Fuse Neo4j Graph Relationship Records
        for rec in graph_records:
            source_node = rec.get("source", "Company")
            relation = rec.get("relation", "CONNECTED_TO")
            target_node = rec.get("target", "Entity")
            path_str = f"{source_node} → [{relation}] → {target_node}"
            content = f"Graph Topology Relationship: {path_str}"
            fused.append(EvidenceItem(
                source_type="knowledge_graph",
                source="Neo4j",
                path=path_str,
                retrieved_content=content,
                relevance_score=0.92,
                confidence=0.95,
                metadata={"source_node": source_node, "relation": relation, "target_node": target_node}
            ))

        logger.info(f"EvidenceFusionEngine -> Successfully fused {len(fused)} evidence items.")
        return fused

evidence_fusion_engine = EvidenceFusionEngine()
