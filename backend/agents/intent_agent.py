import re
import logging
from typing import Dict, Any, List

logger = logging.getLogger(__name__)

class IntentDetectionAgent:
    """Agent 1: Detects user intent and extracts target entities from input query."""
    
    INTENTS = {
        "COMPETITOR_ANALYSIS": ["competitor", "vs", "competes", "rival", "market share"],
        "TECH_STACK": ["technology", "tech stack", "uses", "framework", "architecture", "gpu", "cuda"],
        "FUNDING_INVESTMENT": ["funding", "investor", "valuation", "series a", "series b", "raised", "capital"],
        "COMPARISON": ["compare", "difference", "versus", "between"],
        "GENERAL_SEMANTIC": []
    }

    def detect_intent(self, query: str) -> Dict[str, Any]:
        query_lower = query.lower()
        detected_intent = "GENERAL_SEMANTIC"
        confidence = 0.70

        for intent, keywords in self.INTENTS.items():
            for kw in keywords:
                if kw in query_lower:
                    detected_intent = intent
                    confidence = 0.95
                    break
            if detected_intent != "GENERAL_SEMANTIC":
                break

        # Extract entities (simple company candidate regex)
        company_candidates = list(set(re.findall(r'\b[A-Z][a-zA-Z0-9\.\-]+\b', query)))

        logger.info(f"Intent Detection Agent -> Intent: {detected_intent} (Confidence: {confidence})")
        return {
            "query": query,
            "intent": detected_intent,
            "confidence": confidence,
            "extracted_entities": company_candidates
        }

intent_agent = IntentDetectionAgent()
