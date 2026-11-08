import time
import logging
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

logger = logging.getLogger(__name__)

class PipelineStageTrace(BaseModel):
    stage_name: str
    status: str  # "SUCCESS", "WARNING", "ERROR"
    execution_time_ms: float
    results_count: int
    confidence_score: Optional[float] = None
    details: str
    error_message: Optional[str] = None

class InvestigationExecutionTrace(BaseModel):
    investigation_id: str
    query: str
    total_latency_ms: float
    started_at: str
    completed_at: str
    stages: List[PipelineStageTrace]

class ObservabilityTraceEngine:
    """Captures stage-by-stage latency, execution logs, result counts, and confidence metrics."""

    def create_empty_trace(self, investigation_id: str, query: str) -> Dict[str, Any]:
        return {
            "investigation_id": investigation_id,
            "query": query,
            "start_time": time.time(),
            "stages": []
        }

    def record_stage(
        self,
        trace: Dict[str, Any],
        stage_name: str,
        status: str,
        execution_time_ms: float,
        results_count: int,
        details: str,
        confidence_score: Optional[float] = None,
        error_message: Optional[str] = None
    ):
        trace["stages"].append(PipelineStageTrace(
            stage_name=stage_name,
            status=status,
            execution_time_ms=round(execution_time_ms, 2),
            results_count=results_count,
            confidence_score=confidence_score,
            details=details,
            error_message=error_message
        ))

    def finalize_trace(self, trace: Dict[str, Any]) -> InvestigationExecutionTrace:
        total_latency = round((time.time() - trace["start_time"]) * 1000, 2)
        start_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(trace["start_time"]))
        end_str = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())

        return InvestigationExecutionTrace(
            investigation_id=trace["investigation_id"],
            query=trace["query"],
            total_latency_ms=total_latency,
            started_at=start_str,
            completed_at=end_str,
            stages=trace["stages"]
        )

observability_trace_engine = ObservabilityTraceEngine()
