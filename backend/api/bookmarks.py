import logging
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/bookmarks", tags=["Bookmarks"])

# In-memory storage for user bookmarks
BOOKMARKS_STORE: List[Dict[str, Any]] = [
    {
        "id": "bm-1",
        "company_name": "OpenAI",
        "industry": "Artificial Intelligence & LLMs",
        "valuation_usd": 80000000000.0,
        "saved_at": "2026-08-07 18:30:00"
    },
    {
        "id": "bm-2",
        "company_name": "NVIDIA",
        "industry": "Artificial Intelligence & Hardware",
        "valuation_usd": 3000000000000.0,
        "saved_at": "2026-08-07 19:15:00"
    }
]

class BookmarkRequest(BaseModel):
    company_name: str
    industry: str = "Technology"
    valuation_usd: float = 0.0

@router.get("", response_model=List[Dict[str, Any]])
async def get_bookmarks():
    """Returns all bookmarked companies for the user."""
    return BOOKMARKS_STORE

@router.post("", response_model=Dict[str, Any])
async def add_bookmark(req: BookmarkRequest):
    """Adds a new company to the user's bookmarks."""
    # Check if already bookmarked
    if any(b["company_name"].lower() == req.company_name.lower() for b in BOOKMARKS_STORE):
        return {"status": "ALREADY_BOOKMARKED", "message": f"{req.company_name} is already in bookmarks."}
    
    new_bm = {
        "id": f"bm-{len(BOOKMARKS_STORE) + 1}",
        "company_name": req.company_name,
        "industry": req.industry,
        "valuation_usd": req.valuation_usd,
        "saved_at": "2026-08-07 23:15:00"
    }
    BOOKMARKS_STORE.append(new_bm)
    return {"status": "SUCCESS", "bookmark": new_bm}

@router.delete("/{company_name}", response_model=Dict[str, Any])
async def delete_bookmark(company_name: str):
    """Deletes a bookmarked company by name."""
    global BOOKMARKS_STORE
    BOOKMARKS_STORE = [b for b in BOOKMARKS_STORE if b["company_name"].lower() != company_name.lower()]
    return {"status": "SUCCESS", "message": f"Removed {company_name} from bookmarks."}
