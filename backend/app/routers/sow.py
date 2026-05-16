import json
from fastapi import APIRouter, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel
from supabase import create_client
from app.config import get_settings
from app.services.pdf_generator import generate_pdf, FONT_OPTIONS, COLOUR_PRESETS
import anthropic

settings = get_settings()
router = APIRouter()
claude = anthropic.Anthropic(api_key=settings.anthropic_api_key)
supabase = create_client(settings.supabase_url, settings.supabase_service_role_key)


# ─── Models ───────────────────────────────────────────────────────────────────

class ExtractRequest(BaseModel):
    notes: str


class ExtractionResult(BaseModel):
    clientName: str
    industry: str
    companySize: str
    problemStatement: str
    projectType: str
    keyRequirements: list[str]
    timelineSignals: str
    budgetSignals: str
    successMetrics: list[str]
    additionalNotes: str


class GenerateRequest(BaseModel):
    extraction: dict
    notes: str
    sessionId: str


class SOWSection(BaseModel):
    title: str
    content: str


class SOWDocument(BaseModel):
    executiveSummary: SOWSection
    scopeOfWork: SOWSection
    phasingAndTimeline: SOWSection
    deliverables: SOWSection
    pricingTiers: SOWSection
    exclusions: SOWSection
    assumptions: SOWSection
    paymentTerms: SOWSection
    matchedPackages: list[dict]
    clientName: str
    projectType: str
    preparedBy: str


# ─── Tool definitions ─────────────────────────────────────────────────────────

PRICING_TOOL = {
    "name": "get_pricing_packages",
    "description": "Fetches relevant service packages from the Nexus Labs pricing database based on the project type and requirements. Use this to find the right packages to include in the SOW.",
    "input_schema": {
        "type": "object",
        "properties": {
            "categories": {
                "type": "array",
                "items": {"type": "string"},
                "description": "List of package categories to fetch. Options: Strategy, Automation, AI Assistants, Analytics, Agentic AI, Retainer"
            },
            "max_packages": {
                "type": "integer",
                "description": "Maximum number of packages to return. Usually 2-3 for a focused SOW.",
                "default": 3
            }
        },
        "required": ["categories"]
    }
}


def fetch_pricing_packages(categories: list[str], max_packages: int = 3) -> list[dict]:
    """Fetch pricing packages from Supabase by category."""
    try:
        result = supabase.table("pricing_packages") \
            .select("*") \
            .in_("category", categories) \
            .eq("is_active", True) \
            .limit(max_packages) \
            .execute()
        return result.data or []
    except Exception:
        return []


# ─── Extraction endpoint ──────────────────────────────────────────────────────

@router.post("/sow/extract", response_model=ExtractionResult)
async def extract_discovery_notes(request: ExtractRequest):
    if len(request.notes.strip()) < 100:
        raise HTTPException(
            status_code=422,
            detail="Notes must be at least 100 characters."
        )

    system_prompt = """You are an expert business analyst who extracts structured information from discovery call notes.

Your job is to read raw discovery call notes and extract key information into a structured JSON format.

Return ONLY valid JSON with no preamble, no markdown, no code blocks. Just the raw JSON object.

The JSON must have exactly these fields:
{
  "clientName": "string - the client company name",
  "industry": "string - the industry or sector",
  "companySize": "string - headcount or company size if mentioned",
  "problemStatement": "string - a clear 1-2 sentence summary of the core business problem",
  "projectType": "string - the type of project needed (e.g. Workflow Automation, AI Assistant, Data Dashboard)",
  "keyRequirements": ["array of strings - specific functional requirements mentioned"],
  "timelineSignals": "string - any timeline or deadline information mentioned",
  "budgetSignals": "string - any budget range or signals mentioned",
  "successMetrics": ["array of strings - how the client would measure success"],
  "additionalNotes": "string - any other relevant context"
}

If a field is not mentioned in the notes, use an empty string or empty array as appropriate.
Be specific and factual. Do not invent information not present in the notes."""

    try:
        response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1500,
            system=system_prompt,
            messages=[
                {
                    "role": "user",
                    "content": f"Extract the key information from these discovery call notes:\n\n{request.notes}"
                }
            ],
        )

        raw = response.content[0].text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        data = json.loads(raw)
        return ExtractionResult(**data)

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to parse extraction response. Please try again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Extraction failed: {str(e)}"
        )


# ─── Generation endpoint ──────────────────────────────────────────────────────

@router.post("/sow/generate", response_model=SOWDocument)
async def generate_sow(request: GenerateRequest):
    extraction = request.extraction

    # ── Step 1: Use Claude with tool use to select pricing packages ───────────

    tool_messages = [
        {
            "role": "user",
            "content": f"""You are preparing a Scope of Work for a client engagement at Nexus Labs, an AI engineering studio.

Client: {extraction.get('clientName', 'Client')}
Industry: {extraction.get('industry', '')}
Project Type: {extraction.get('projectType', '')}
Problem: {extraction.get('problemStatement', '')}
Requirements: {', '.join(extraction.get('keyRequirements', []))}
Budget signals: {extraction.get('budgetSignals', 'Not specified')}

Use the get_pricing_packages tool to fetch the most relevant service packages for this engagement. Select 2-3 packages that best match the project type and requirements."""
        }
    ]

    matched_packages = []

    try:
        tool_response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=1000,
            tools=[PRICING_TOOL],
            messages=tool_messages,
        )

        # Process tool use
        for block in tool_response.content:
            if block.type == "tool_use" and block.name == "get_pricing_packages":
                tool_input = block.input
                packages = fetch_pricing_packages(
                    categories=tool_input.get("categories", []),
                    max_packages=tool_input.get("max_packages", 3)
                )
                matched_packages = packages

    except Exception:
        # Fallback: fetch a couple of default packages
        matched_packages = fetch_pricing_packages(
            categories=["Automation", "AI Assistants"],
            max_packages=2
        )

    # ── Step 2: Build pricing context for SOW generation ─────────────────────

    pricing_context = ""
    if matched_packages:
        pricing_context = "\n\nRECOMMENDED SERVICE PACKAGES FROM NEXUS LABS PRICING DATABASE:\n"
        for pkg in matched_packages:
            rate_str = ""
            if pkg.get("rate_type") == "fixed":
                rate_str = f"${pkg['rate_min']:,}"
            elif pkg.get("rate_type") == "monthly":
                rate_str = f"${pkg['rate_min']:,}/month"
            else:
                if pkg.get("rate_max"):
                    rate_str = f"${pkg['rate_min']:,} – ${pkg['rate_max']:,}"
                else:
                    rate_str = f"${pkg['rate_min']:,}"

            deliverables = pkg.get("deliverables", [])
            deliverables_str = "\n    - ".join(deliverables) if deliverables else ""

            duration = ""
            if pkg.get("duration_weeks_min"):
                if pkg.get("duration_weeks_max") and pkg["duration_weeks_max"] != pkg["duration_weeks_min"]:
                    duration = f"{pkg['duration_weeks_min']}–{pkg['duration_weeks_max']} weeks"
                else:
                    duration = f"{pkg['duration_weeks_min']} weeks"

            pricing_context += f"""
Package: {pkg['name']}
Rate: {rate_str}
Duration: {duration if duration else 'Ongoing'}
Description: {pkg['description']}
Deliverables:
    - {deliverables_str}
"""

    # ── Step 3: Generate the full SOW ─────────────────────────────────────────

    sow_system = """You are a senior business development consultant at Nexus Labs, an AI engineering studio based in Lagos that helps African businesses build and scale digital products and AI systems.

You write clear, professional, and compelling Scopes of Work that win clients and set clear expectations.

Your SOW writing style:
- Professional but warm, not cold and corporate
- Specific and concrete, not vague
- Confident about what Nexus Labs will deliver
- Honest about what is excluded to protect both parties
- Always use USD for pricing

Return ONLY valid JSON with no preamble, no markdown fences. Just the raw JSON object with exactly these fields:
{
  "executiveSummary": {"title": "Executive Summary", "content": "string"},
  "scopeOfWork": {"title": "Scope of Work", "content": "string"},
  "phasingAndTimeline": {"title": "Phasing and Timeline", "content": "string"},
  "deliverables": {"title": "Deliverables", "content": "string"},
  "pricingTiers": {"title": "Investment", "content": "string"},
  "exclusions": {"title": "Exclusions", "content": "string"},
  "assumptions": {"title": "Assumptions", "content": "string"},
  "paymentTerms": {"title": "Payment Terms", "content": "string"}
}

Use markdown formatting within content fields:
- Use **bold** for emphasis
- Use bullet points with - for lists
- Use ### for sub-headings within sections
- Keep each section substantive but focused (150-300 words per section)
- The pricingTiers section should clearly reference the matched packages and their investment ranges"""

    sow_user = f"""Generate a complete Scope of Work document for this engagement:

CLIENT DETAILS:
- Client: {extraction.get('clientName', 'Client')}
- Industry: {extraction.get('industry', '')}
- Company Size: {extraction.get('companySize', '')}
- Problem Statement: {extraction.get('problemStatement', '')}
- Project Type: {extraction.get('projectType', '')}
- Key Requirements: {json.dumps(extraction.get('keyRequirements', []))}
- Timeline: {extraction.get('timelineSignals', 'To be agreed')}
- Budget: {extraction.get('budgetSignals', 'To be agreed')}
- Success Metrics: {json.dumps(extraction.get('successMetrics', []))}
- Additional Notes: {extraction.get('additionalNotes', '')}

{pricing_context}

Write a complete, professional SOW based on these details and the matched packages above. Make it specific to this client's situation."""

    try:
        sow_response = claude.messages.create(
            model="claude-sonnet-4-20250514",
            max_tokens=4000,
            system=sow_system,
            messages=[{"role": "user", "content": sow_user}],
        )

        raw = sow_response.content[0].text.strip()

        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
        raw = raw.strip()

        sow_data = json.loads(raw)

        # Store in Supabase
        try:
            supabase.table("sow_documents").upsert({
                "session_id": request.sessionId,
                "client_name": extraction.get("clientName", ""),
                "project_type": extraction.get("projectType", ""),
                "extracted_data": extraction,
                "generated_sow": sow_data,
                "status": "generated",
            }).execute()
        except Exception:
            pass

        return SOWDocument(
            **sow_data,
            matchedPackages=matched_packages,
            clientName=extraction.get("clientName", "Client"),
            projectType=extraction.get("projectType", ""),
            preparedBy="Nexus Labs",
        )

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=500,
            detail="Failed to generate SOW. Please try again."
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Generation failed: {str(e)}"
        )


# ─── PDF export endpoint ──────────────────────────────────────────────────────

class ExportRequest(BaseModel):
    sow: dict
    sessionId: str
    branding: dict = {}


class BrandingOptions(BaseModel):
    font: str = "playfair"
    colourPreset: str = "obsidian"
    fontSize: str = "medium"
    customPrimary: str = ""
    customAccent: str = ""


@router.get("/sow/branding-options")
async def get_branding_options():
    """Return available font and colour options for the PDF."""
    return {
        "fonts": [
            {"key": k, "name": v["name"]}
            for k, v in FONT_OPTIONS.items()
        ],
        "colourPresets": [
            {"key": k, "name": v["name"], "primary": v["primary"], "accent": v["accent"]}
            for k, v in COLOUR_PRESETS.items()
        ],
        "fontSizes": [
            {"key": "small", "name": "Small"},
            {"key": "medium", "name": "Medium"},
            {"key": "large", "name": "Large"},
        ]
    }


@router.post("/sow/export-pdf")
async def export_pdf(request: ExportRequest):
    """Generate and return a branded PDF of the SOW."""
    try:
        pdf_bytes = generate_pdf(request.sow, request.branding)

        client_name = request.sow.get("clientName", "SOW").replace(" ", "-")
        filename = f"{client_name}-Scope-of-Work.pdf"

        # Update status in Supabase
        try:
            supabase.table("sow_documents").update({
                "status": "exported",
                "branding": request.branding,
            }).eq("session_id", request.sessionId).execute()
        except Exception:
            pass

        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={
                "Content-Disposition": f'attachment; filename="{filename}"',
                "Content-Length": str(len(pdf_bytes)),
            }
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"PDF export failed: {str(e)}"
        )