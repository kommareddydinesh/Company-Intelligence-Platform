from fastapi import APIRouter
from backend.models.schemas import ChatRequest, ChatResponse
from backend.agents.agentic_workflow import agentic_workflow

router = APIRouter(prefix="/chat", tags=["Agentic AI Chatbot"])

@router.post("", response_model=ChatResponse)
async def chat_with_platform(req: ChatRequest):
    return await agentic_workflow.process_user_query(req.message)

