import os
import io
import csv
import logging
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, Response
from fastapi.responses import StreamingResponse
from backend.models.schemas import ReportGenerateRequest, ReportGenerateResponse
from backend.services.report_generator import ai_report_generator
from backend.services.dataset_generator import get_company_seed_dataset

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

@router.post("/generate", response_model=ReportGenerateResponse)
async def generate_company_report(req: ReportGenerateRequest):
    """Generates an executive report metadata and PDF link for a company."""
    return ai_report_generator.generate_company_pdf_report(req)

@router.post("/pdf", response_class=Response)
async def generate_pdf_report(payload: Dict[str, Any]):
    """Generates an executive PDF report for a company directly as binary PDF bytes."""
    company_name = payload.get("company_name", "OpenAI")
    req = ReportGenerateRequest(company_name=company_name, include_swot=True)
    res = ai_report_generator.generate_company_pdf_report(req)
    
    # Read generated pdf file
    pdf_filename = res.pdf_download_url.split("/")[-1]
    pdf_path = f"./generated_reports/{pdf_filename}"
    
    if os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
    else:
        pdf_bytes = b"%PDF-1.4 Executive Report Sample"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={company_name}_Executive_Report.pdf"}
    )

@router.get("/csv", response_class=StreamingResponse)
async def export_companies_csv():
    """Exports all company records as a downloadable CSV file."""
    dataset = get_company_seed_dataset()
    
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Write CSV Header
    writer.writerow([
        "Company Name", "Industry", "Description", "CEO", "Valuation (USD)", 
        "Revenue (USD)", "Employees", "Country", "Founded Year", "Technologies"
    ])
    
    # Write CSV Rows
    for c in dataset:
        writer.writerow([
            c.get("name", ""),
            c.get("industry", ""),
            c.get("description", "")[:100],
            c.get("ceo_name", ""),
            c.get("valuation_usd", 0),
            c.get("revenue_usd", 0),
            c.get("employee_count", 0),
            c.get("country", ""),
            c.get("founded_year", 2000),
            ", ".join(c.get("technologies", []))
        ])
    
    output.seek(0)
    return StreamingResponse(
        io.BytesIO(output.getvalue().encode()),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=Enterprise_Companies_Dataset.csv"}
    )
