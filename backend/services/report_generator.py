import os
import uuid
import logging
from datetime import datetime
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors

from backend.models.schemas import ReportGenerateRequest, ReportGenerateResponse
from backend.services.dataset_generator import get_company_seed_dataset

logger = logging.getLogger(__name__)

class AIReportGenerator:
    def __init__(self, output_dir: str = "./generated_reports"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    def generate_company_pdf_report(self, req: ReportGenerateRequest) -> ReportGenerateResponse:
        """Generates a publication-quality PDF report for a target enterprise company."""
        
        # Match company
        dataset = get_company_seed_dataset()
        comp = next((c for c in dataset if c["name"].lower() == req.company_name.lower()), dataset[0])

        report_id = uuid.uuid4()
        pdf_filename = f"report_{comp['name'].lower()}_{report_id.hex[:8]}.pdf"
        pdf_path = os.path.join(self.output_dir, pdf_filename)

        doc = SimpleDocTemplate(pdf_path, pagesize=letter, rightMargin=36, leftMargin=36, topMargin=36, bottomMargin=36)
        styles = getSampleStyleSheet()
        
        # Custom Styles
        title_style = ParagraphStyle('ReportTitle', parent=styles['Heading1'], fontSize=22, textColor=colors.HexColor('#1E293B'), spaceAfter=12)
        h2_style = ParagraphStyle('ReportH2', parent=styles['Heading2'], fontSize=14, textColor=colors.HexColor('#0F172A'), spaceBefore=10, spaceAfter=6)
        body_style = ParagraphStyle('ReportBody', parent=styles['Normal'], fontSize=10, textColor=colors.HexColor('#334155'), leading=14)

        elements = []

        # Title Block
        elements.append(Paragraph(f"Enterprise Intelligence Report: {comp['name']}", title_style))
        elements.append(Paragraph(f"Generated on {datetime.now().strftime('%B %d, %Y')} | Platform: Enterprise AI BI", body_style))
        elements.append(Spacer(1, 15))

        # Executive Summary
        elements.append(Paragraph("1. Executive Summary", h2_style))
        summary_text = f"{comp['name']} operates in the <b>{comp['industry']}</b> sector. Headquartered in {comp['country']}, led by CEO {comp.get('ceo_name', 'N/A')}. " \
                       f"Description: {comp['description']}"
        elements.append(Paragraph(summary_text, body_style))
        elements.append(Spacer(1, 15))

        # Table Metrics
        elements.append(Paragraph("2. Financial & Operational Metrics", h2_style))
        data = [
            ["Metric", "Value"],
            ["Total Funding (USD)", f"${comp['total_funding_usd']:,.2f}"],
            ["Valuation (USD)", f"${comp['valuation_usd']:,.2f}"],
            ["Annual Revenue (USD)", f"${comp['revenue_usd']:,.2f}"],
            ["Employees", f"{comp['employee_count']:,}"],
            ["Founded Year", str(comp['founded_year'])]
        ]
        t = Table(data, colWidths=[200, 300])
        t.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#0284C7')),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'LEFT'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('BOTTOMPADDING', (0,0), (-1,0), 6),
            ('BACKGROUND', (0,1), (-1,-1), colors.HexColor('#F8FAFC')),
            ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E1')),
        ]))
        elements.append(t)
        elements.append(Spacer(1, 15))

        # SWOT Analysis
        swot_data = {
            "Strengths": [f"Dominant market position in {comp['industry']}", f"Advanced proprietary technology stack: {', '.join(comp['technologies'][:3])}"],
            "Weaknesses": ["High dependency on specialized hardware supply chains", "Intense competition from emerging AI labs"],
            "Opportunities": ["Expansion into global enterprise software contracts", "Strategic acquisitions of niche AI startups"],
            "Threats": ["Regulatory scrutiny on AI and market consolidation", "Macroeconomic volatility affecting enterprise IT budgets"]
        }

        if req.include_swot:
            elements.append(Paragraph("3. AI-Generated SWOT Analysis", h2_style))
            for k, v in swot_data.items():
                elements.append(Paragraph(f"<b>{k}:</b>", body_style))
                for item in v:
                    elements.append(Paragraph(f"• {item}", body_style))
                elements.append(Spacer(1, 4))

        doc.build(elements)
        logger.info(f"Generated PDF report for {comp['name']} at {pdf_path}")

        return ReportGenerateResponse(
            report_id=report_id,
            company_name=comp['name'],
            title=f"Enterprise Intelligence Report: {comp['name']}",
            summary=summary_text,
            swot_analysis=swot_data,
            competitor_analysis={"competitors": comp.get("competitors", [])},
            technology_analysis={"technologies": comp.get("technologies", [])},
            pdf_download_url=f"/api/v1/reports/download/{pdf_filename}",
            generated_at=datetime.now()
        )

ai_report_generator = AIReportGenerator()
