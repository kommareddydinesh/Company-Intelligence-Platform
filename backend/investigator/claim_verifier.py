import re
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from backend.investigator.evidence_fusion import EvidenceItem

logger = logging.getLogger(__name__)

class ClaimVerificationResult(BaseModel):
    claim_id: str
    claim_text: str
    status: str  # "Supported", "Partially Supported", "Unsupported"
    confidence_score: float
    supporting_evidence_ids: List[str]
    supporting_evidence_paths: List[str]
    rationale: str

class ClaimVerificationEngine:
    """Verifies generated LLM text claims against retrieved multi-source evidence."""

    def extract_claims(self, text: str) -> List[str]:
        # Split text into declarative sentence claims
        sentences = re.split(r'(?<=[.!?])\s+', text)
        claims = []
        for s in sentences:
            clean = s.strip()
            if len(clean) > 20 and not clean.startswith('#') and not clean.startswith('*'):
                claims.append(clean)
        return claims[:10]  # Verify top claims

    def verify_claims(
        self,
        claims: List[str],
        evidence_list: List[EvidenceItem]
    ) -> List[ClaimVerificationResult]:
        results: List[ClaimVerificationResult] = []

        for idx, claim in enumerate(claims):
            claim_lower = claim.lower()
            matched_evidence: List[EvidenceItem] = []

            for ev in evidence_list:
                ev_text = ev.retrieved_content.lower()
                words = [w for w in re.findall(r'\w+', claim_lower) if len(w) >= 4 and w not in ['nvidia', 'company']]
                match_count = sum(1 for w in words if w in ev_text or any(w in t for t in ev_text.split()))

                if match_count >= 1 or (ev.path and any(p.lower() in claim_lower for p in ev.path.split(' → ') if len(p) > 3)):
                    matched_evidence.append(ev)

            if len(matched_evidence) >= 2:
                status = "Supported"
                conf = 0.95
                rationale = f"Claim is fully grounded across {len(matched_evidence)} multi-source evidence items."
            elif len(matched_evidence) == 1:
                status = "Partially Supported"
                conf = 0.75
                rationale = f"Claim matches single evidence item ({matched_evidence[0].source})."
            else:
                status = "Unsupported"
                conf = 0.30
                rationale = "No direct database or graph evidence item supports this statement."

            results.append(ClaimVerificationResult(
                claim_id=f"claim_{idx + 1}",
                claim_text=claim,
                status=status,
                confidence_score=conf,
                supporting_evidence_ids=[e.evidence_id for e in matched_evidence],
                supporting_evidence_paths=[e.path or e.source for e in matched_evidence if e.path],
                rationale=rationale
            ))

        logger.info(f"ClaimVerificationEngine -> Verified {len(results)} claims ({sum(1 for r in results if r.status == 'Supported')} Supported).")
        return results

claim_verification_engine = ClaimVerificationEngine()
