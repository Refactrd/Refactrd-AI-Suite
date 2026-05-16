import markdown
from weasyprint import HTML
import re


# ─── Font options ─────────────────────────────────────────────────────────────

FONT_OPTIONS = {
    "playfair": {
        "name": "Playfair Display",
        "google": "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&display=swap",
        "heading": "'Playfair Display', Georgia, serif",
        "body": "Georgia, serif",
    },
    "inter": {
        "name": "Inter",
        "google": "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap",
        "heading": "'Inter', system-ui, sans-serif",
        "body": "'Inter', system-ui, sans-serif",
    },
    "lato": {
        "name": "Lato",
        "google": "https://fonts.googleapis.com/css2?family=Lato:wght@300;400;700;900&display=swap",
        "heading": "'Lato', system-ui, sans-serif",
        "body": "'Lato', system-ui, sans-serif",
    },
    "merriweather": {
        "name": "Merriweather",
        "google": "https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700&display=swap",
        "heading": "'Merriweather', Georgia, serif",
        "body": "'Merriweather', Georgia, serif",
    },
    "montserrat": {
        "name": "Montserrat",
        "google": "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap",
        "heading": "'Montserrat', system-ui, sans-serif",
        "body": "'Montserrat', system-ui, sans-serif",
    },
    "raleway": {
        "name": "Raleway",
        "google": "https://fonts.googleapis.com/css2?family=Raleway:wght@300;400;500;600;700&display=swap",
        "heading": "'Raleway', system-ui, sans-serif",
        "body": "'Raleway', system-ui, sans-serif",
    },
    "nunito": {
        "name": "Nunito",
        "google": "https://fonts.googleapis.com/css2?family=Nunito:wght@300;400;600;700&display=swap",
        "heading": "'Nunito', system-ui, sans-serif",
        "body": "'Nunito', system-ui, sans-serif",
    },
    "josefin": {
        "name": "Josefin Sans",
        "google": "https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@300;400;600;700&display=swap",
        "heading": "'Josefin Sans', system-ui, sans-serif",
        "body": "'Josefin Sans', system-ui, sans-serif",
    },
    "cormorant": {
        "name": "Cormorant Garamond",
        "google": "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap",
        "heading": "'Cormorant Garamond', Georgia, serif",
        "body": "Georgia, serif",
    },
    "dm_serif": {
        "name": "DM Serif Display",
        "google": "https://fonts.googleapis.com/css2?family=DM+Serif+Display&display=swap",
        "heading": "'DM Serif Display', Georgia, serif",
        "body": "Georgia, serif",
    },
}


# ─── Colour presets ───────────────────────────────────────────────────────────

COLOUR_PRESETS = {
    "obsidian": {
        "name": "Obsidian & Copper",
        "primary": "#1a1a2e",
        "accent": "#c9782a",
        "bg": "#f7f5f0",
        "surface": "#ffffff",
        "border": "#e8e2d9",
        "text": "#1a1a2e",
        "muted": "#6b6560",
    },
    "midnight": {
        "name": "Midnight & Electric",
        "primary": "#0d1117",
        "accent": "#58a6ff",
        "bg": "#f6f8fa",
        "surface": "#ffffff",
        "border": "#d0d7de",
        "text": "#24292f",
        "muted": "#656d76",
    },
    "forest": {
        "name": "Forest & Gold",
        "primary": "#1c3d2e",
        "accent": "#d4a843",
        "bg": "#f8f9f4",
        "surface": "#ffffff",
        "border": "#dde8e0",
        "text": "#1c3d2e",
        "muted": "#5a7060",
    },
    "crimson": {
        "name": "Crimson & Cream",
        "primary": "#7b1e2e",
        "accent": "#e8c547",
        "bg": "#fdf8f0",
        "surface": "#ffffff",
        "border": "#f0e0c0",
        "text": "#3a0f19",
        "muted": "#8a5a5a",
    },
    "slate": {
        "name": "Slate & Coral",
        "primary": "#1e2d3d",
        "accent": "#e8533a",
        "bg": "#f4f6f9",
        "surface": "#ffffff",
        "border": "#dce3ed",
        "text": "#1e2d3d",
        "muted": "#5a6a7a",
    },
    "plum": {
        "name": "Plum & Mint",
        "primary": "#3b1f4e",
        "accent": "#2ec4b6",
        "bg": "#f7f4fb",
        "surface": "#ffffff",
        "border": "#e0d8ed",
        "text": "#3b1f4e",
        "muted": "#7a6a8a",
    },
    "charcoal": {
        "name": "Charcoal & Emerald",
        "primary": "#1f2937",
        "accent": "#059669",
        "bg": "#f9fafb",
        "surface": "#ffffff",
        "border": "#e5e7eb",
        "text": "#111827",
        "muted": "#6b7280",
    },
    "navy": {
        "name": "Navy & Amber",
        "primary": "#0f1f3d",
        "accent": "#f59e0b",
        "bg": "#f8f9fb",
        "surface": "#ffffff",
        "border": "#dce3ed",
        "text": "#0f1f3d",
        "muted": "#5a6a7a",
    },
    "espresso": {
        "name": "Espresso & Sage",
        "primary": "#2c1810",
        "accent": "#6b9e78",
        "bg": "#faf8f5",
        "surface": "#ffffff",
        "border": "#e8e0d8",
        "text": "#2c1810",
        "muted": "#7a6a5a",
    },
    "minimal": {
        "name": "Minimal Black",
        "primary": "#111111",
        "accent": "#555555",
        "bg": "#ffffff",
        "surface": "#fafafa",
        "border": "#e0e0e0",
        "text": "#111111",
        "muted": "#666666",
    },
}


def preprocess_markdown(text: str) -> str:
    """
    Pre-process markdown to fix bullet points that start with **bold title** followed by description.
    Converts: - **Title** description text
    To:        - **Title**\n  description text
    So WeasyPrint renders the title on its own line above the description.
    """
    import re
    lines = text.split('\n')
    result = []
    for line in lines:
        # Match list items starting with **bold** followed by more text
        # Pattern: optional whitespace, bullet (- or *), space, **bold**, space, rest
        match = re.match(r'^(\s*[-*]\s)(\*\*[^*]+\*\*)(\s+)(.+)$', line)
        if match:
            bullet = match.group(1)
            bold = match.group(2)
            rest = match.group(4).strip()
            # Put bold on first line, description indented on next line
            result.append(f'{bullet}{bold}')
            result.append(f'  {rest}')
        else:
            result.append(line)
    return '\n'.join(result)


def md_to_html(text: str) -> str:
    """Convert markdown text to clean HTML."""
    if not text:
        return ""
    processed = preprocess_markdown(text)
    return markdown.markdown(
        processed,
        extensions=["extra", "nl2br", "sane_lists"]
    )


def build_sow_html(sow: dict, branding: dict) -> str:
    font_key = branding.get("font", "playfair")
    colour_key = branding.get("colourPreset", "obsidian")
    font_size = branding.get("fontSize", "medium")

    font = FONT_OPTIONS.get(font_key, FONT_OPTIONS["playfair"])
    colours = COLOUR_PRESETS.get(colour_key, COLOUR_PRESETS["obsidian"])

    size_map = {
        "small": {"base": "10pt", "h1": "24pt", "h2": "14pt", "h3": "11pt", "small": "8pt"},
        "medium": {"base": "11pt", "h1": "28pt", "h2": "16pt", "h3": "12pt", "small": "9pt"},
        "large": {"base": "12pt", "h1": "32pt", "h2": "18pt", "h3": "13pt", "small": "10pt"},
    }
    sizes = size_map.get(font_size, size_map["medium"])

    sections = [
        ("executiveSummary", sow.get("executiveSummary", {})),
        ("scopeOfWork", sow.get("scopeOfWork", {})),
        ("phasingAndTimeline", sow.get("phasingAndTimeline", {})),
        ("deliverables", sow.get("deliverables", {})),
        ("pricingTiers", sow.get("pricingTiers", {})),
        ("exclusions", sow.get("exclusions", {})),
        ("assumptions", sow.get("assumptions", {})),
        ("paymentTerms", sow.get("paymentTerms", {})),
    ]

    # Build packages HTML
    packages_html = ""
    matched = sow.get("matchedPackages", [])
    if matched:
        pkg_items = ""
        for pkg in matched:
            rate_min = pkg.get("rate_min", 0)
            rate_max = pkg.get("rate_max")
            rate_type = pkg.get("rate_type", "project")

            if rate_type == "fixed":
                rate_str = f"${rate_min:,}"
            elif rate_type == "monthly":
                rate_str = f"${rate_min:,}/month"
            elif rate_max:
                rate_str = f"${rate_min:,} – ${rate_max:,}"
            else:
                rate_str = f"${rate_min:,}"

            dur_min = pkg.get("duration_weeks_min")
            dur_max = pkg.get("duration_weeks_max")
            dur_str = ""
            if dur_min:
                if dur_max and dur_max != dur_min:
                    dur_str = f"{dur_min}–{dur_max} weeks"
                else:
                    dur_str = f"{dur_min} weeks"

            pkg_items += f"""
            <div class="pkg-card">
                <div class="pkg-name">{pkg.get('name', '')}</div>
                <div class="pkg-rate">{rate_str}</div>
                {'<div class="pkg-dur">' + dur_str + '</div>' if dur_str else ''}
            </div>"""

        packages_html = f"""
        <div class="packages-block">
            <div class="packages-label">Recommended Packages</div>
            <div class="packages-row">{pkg_items}</div>
        </div>"""

    # Build sections HTML
    sections_html = ""
    for i, (key, section) in enumerate(sections):
        content = section.get("content", "")
        title = section.get("title", "")
        if not content:
            continue
        content_html = md_to_html(content)
        num = str(i + 1).zfill(2)
        sections_html += f"""
        <div class="section">
            <div class="section-head">
                <span class="section-num">{num}</span>
                <span class="section-title">{title}</span>
            </div>
            <div class="section-body">{content_html}</div>
        </div>"""

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<style>

* {{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
}}

@page {{
    size: A4;
    margin: 0;
    @bottom-left {{
        content: "Powered by Refactrd Engines";
        font-family: {font["body"]};
        font-size: 7pt;
        color: rgba(255,255,255,0.35);
        padding-bottom: 8mm;
        padding-left: 15mm;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: {font["body"]};
        font-size: 7pt;
        color: rgba(255,255,255,0.35);
        padding-bottom: 8mm;
        padding-right: 15mm;
    }}
}}

@page content-page {{
    size: A4;
    margin: 15mm 15mm 20mm 15mm;
    @bottom-left {{
        content: "Powered by Refactrd Engines";
        font-family: {font["body"]};
        font-size: 7pt;
        color: {colours["muted"]};
        padding-bottom: 4mm;
    }}
    @bottom-center {{
        content: "{sow.get('clientName', '')} · Scope of Work · Confidential";
        font-family: {font["body"]};
        font-size: 7pt;
        color: {colours["muted"]};
        padding-bottom: 4mm;
    }}
    @bottom-right {{
        content: "Page " counter(page) " of " counter(pages);
        font-family: {font["body"]};
        font-size: 7pt;
        color: {colours["muted"]};
        padding-bottom: 4mm;
    }}
}}

body {{
    font-family: {font["body"]};
    font-size: {sizes["base"]};
    color: {colours["text"]};
    background: {colours["bg"]};
    line-height: 1.65;
}}

/* ── COVER PAGE ────────────────────────────────────────── */

.cover {{
    page: cover;
    background-color: {colours["primary"]};
    width: 210mm;
    height: 297mm;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    padding: 0;
    page-break-after: always;
}}

.cover-top-bar {{
    padding: 12mm 16mm 0 16mm;
    display: block;
}}

.cover-logo {{
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4mm;
}}

.cover-logo-box {{
    width: 32px;
    height: 32px;
    background: {colours["accent"]};
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}}

.cover-logo-letter {{
    color: white;
    font-family: {font["heading"]};
    font-size: 16pt;
    font-weight: 700;
    line-height: 1;
}}

.cover-logo-name {{
    color: rgba(255,255,255,0.9);
    font-family: {font["heading"]};
    font-size: 13pt;
    font-weight: 600;
}}

.cover-doc-label {{
    color: rgba(255,255,255,0.35);
    font-family: {font["body"]};
    font-size: {sizes["small"]};
    letter-spacing: 2px;
    text-transform: uppercase;
    padding-left: 2px;
}}

.cover-graphic {{
    position: absolute;
    top: 0;
    right: 0;
    width: 80mm;
    height: 80mm;
    background: radial-gradient(circle at 80% 20%, {colours["accent"]}20 0%, transparent 70%);
}}

.cover-graphic-2 {{
    position: absolute;
    bottom: 40mm;
    left: 0;
    width: 60mm;
    height: 60mm;
    background: radial-gradient(circle at 20% 80%, {colours["accent"]}10 0%, transparent 70%);
}}

.cover-accent-bar {{
    position: absolute;
    top: 0;
    right: 0;
    width: 4mm;
    height: 100%;
    background: {colours["accent"]};
    opacity: 0.6;
}}

.cover-main {{
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 0 16mm;
}}

.cover-eyebrow {{
    color: {colours["accent"]};
    font-family: {font["body"]};
    font-size: {sizes["small"]};
    font-weight: 700;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 6mm;
}}

.cover-divider {{
    width: 12mm;
    height: 2px;
    background: {colours["accent"]};
    margin-bottom: 6mm;
}}

.cover-client {{
    color: #ffffff;
    font-family: {font["heading"]};
    font-size: {sizes["h1"]};
    font-weight: 700;
    line-height: 1.15;
    margin-bottom: 4mm;
}}

.cover-project {{
    color: rgba(255,255,255,0.55);
    font-family: {font["body"]};
    font-size: 13pt;
    margin-bottom: 10mm;
}}

.cover-meta-table {{
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 7mm;
    display: flex;
    flex-direction: column;
    gap: 5mm;
}}

.cover-meta-row {{
    display: flex;
    align-items: baseline;
    gap: 8mm;
}}

.cover-meta-key {{
    color: rgba(255,255,255,0.35);
    font-family: {font["body"]};
    font-size: {sizes["small"]};
    text-transform: uppercase;
    letter-spacing: 1px;
    min-width: 36mm;
}}

.cover-meta-val {{
    color: rgba(255,255,255,0.85);
    font-family: {font["body"]};
    font-size: {sizes["base"]};
    font-weight: 500;
}}

.cover-footer {{
    padding: 6mm 16mm 10mm 16mm;
    border-top: 1px solid rgba(255,255,255,0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
}}

.cover-footer-left {{
    color: rgba(255,255,255,0.25);
    font-family: {font["body"]};
    font-size: 7pt;
}}

.cover-footer-right {{
    color: {colours["accent"]};
    font-family: {font["body"]};
    font-size: 7pt;
    font-weight: 600;
    letter-spacing: 1px;
    text-transform: uppercase;
}}

/* ── CONTENT PAGES ─────────────────────────────────────── */

.content {{
    page: content-page;
    background: {colours["bg"]};
    padding: 0;
}}

/* Packages block */
.packages-block {{
    background: {colours["primary"]};
    border-radius: 8pt;
    padding: 14pt 16pt;
    margin-bottom: 14pt;
}}

.packages-label {{
    color: {colours["accent"]};
    font-family: {font["body"]};
    font-size: 7pt;
    font-weight: 700;
    letter-spacing: 2pt;
    text-transform: uppercase;
    margin-bottom: 10pt;
}}

.packages-row {{
    display: flex;
    gap: 10pt;
}}

.pkg-card {{
    flex: 1;
    background: rgba(255,255,255,0.06);
    border-left: 2pt solid {colours["accent"]};
    border-radius: 4pt;
    padding: 10pt 12pt;
}}

.pkg-name {{
    color: rgba(255,255,255,0.9);
    font-family: {font["heading"]};
    font-size: {sizes["small"]};
    font-weight: 700;
    margin-bottom: 3pt;
}}

.pkg-rate {{
    color: {colours["accent"]};
    font-family: {font["body"]};
    font-size: 11pt;
    font-weight: 700;
    margin-bottom: 2pt;
}}

.pkg-dur {{
    color: rgba(255,255,255,0.35);
    font-family: {font["body"]};
    font-size: 7pt;
}}

/* Section */
.section {{
    background: {colours["surface"]};
    border: 1pt solid {colours["border"]};
    border-radius: 8pt;
    margin-bottom: 14pt;
    overflow: hidden;
    page-break-inside: avoid;
}}

.section-head {{
    background: {colours["primary"]};
    padding: 10pt 16pt;
    display: flex;
    align-items: center;
    gap: 10pt;
}}

.section-num {{
    color: {colours["accent"]};
    font-family: {font["body"]};
    font-size: 8pt;
    font-weight: 700;
    opacity: 0.8;
    min-width: 16pt;
}}

.section-title {{
    color: #ffffff;
    font-family: {font["heading"]};
    font-size: {sizes["h2"]};
    font-weight: 700;
}}

.section-body {{
    padding: 14pt 16pt;
    color: {colours["text"]};
    font-family: {font["body"]};
    font-size: {sizes["base"]};
    line-height: 1.7;
}}

/* Markdown content */
.section-body p {{
    margin-bottom: 8pt;
    color: {colours["text"]};
}}

.section-body p:last-child {{
    margin-bottom: 0;
}}

.section-body strong {{
    font-weight: 700;
    color: {colours["text"]};
}}

.section-body em {{
    font-style: italic;
}}

.section-body h3 {{
    font-family: {font["heading"]};
    font-size: {sizes["h3"]};
    font-weight: 700;
    color: {colours["text"]};
    margin-top: 12pt;
    margin-bottom: 5pt;
}}

.section-body h4 {{
    font-size: {sizes["small"]};
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1pt;
    color: {colours["muted"]};
    margin-top: 10pt;
    margin-bottom: 4pt;
}}

.section-body ul {{
    list-style: none;
    margin: 6pt 0 10pt 0;
    padding: 0;
}}

.section-body ul li {{
    display: flex;
    align-items: flex-start;
    gap: 10pt;
    margin-bottom: 8pt;
    color: {colours["text"]};
    font-size: {sizes["base"]};
    line-height: 1.6;
}}

.section-body ul li::before {{
    content: '';
    display: block;
    width: 4pt;
    height: 4pt;
    min-width: 4pt;
    border-radius: 50%;
    background: {colours["accent"]};
    margin-top: 5pt;
    flex-shrink: 0;
}}

.section-body ol {{
    margin: 6pt 0 10pt 16pt;
    padding: 0;
}}

.section-body ol li {{
    margin-bottom: 6pt;
    color: {colours["text"]};
    font-size: {sizes["base"]};
    line-height: 1.6;
}}

.section-body blockquote {{
    border-left: 3pt solid {colours["accent"]};
    padding-left: 10pt;
    color: {colours["muted"]};
    margin: 8pt 0;
    font-style: italic;
}}

.section-body hr {{
    border: none;
    border-top: 1pt solid {colours["border"]};
    margin: 10pt 0;
}}

</style>
</head>
<body>

<!-- COVER PAGE -->
<div class="cover">
    <div class="cover-graphic"></div>
    <div class="cover-graphic-2"></div>
    <div class="cover-accent-bar"></div>

    <div class="cover-top-bar">
        <div class="cover-logo">
            <div class="cover-logo-box">
                <span class="cover-logo-letter">N</span>
            </div>
            <span class="cover-logo-name">Nexus Labs</span>
        </div>
        <div class="cover-doc-label">Scope of Work &amp; Proposal</div>
    </div>

    <div class="cover-main">
        <div class="cover-eyebrow">Scope of Work &amp; Proposal</div>
        <div class="cover-divider"></div>
        <div class="cover-client">{sow.get('clientName', 'Client')}</div>
        <div class="cover-project">{sow.get('projectType', '')}</div>

        <div class="cover-meta-table">
            <div class="cover-meta-row">
                <span class="cover-meta-key">Prepared by</span>
                <span class="cover-meta-val">Nexus Labs</span>
            </div>
            <div class="cover-meta-row">
                <span class="cover-meta-key">Prepared for</span>
                <span class="cover-meta-val">{sow.get('clientName', '')}</span>
            </div>
            <div class="cover-meta-row">
                <span class="cover-meta-key">Document type</span>
                <span class="cover-meta-val">Scope of Work &amp; Proposal</span>
            </div>
            <div class="cover-meta-row">
                <span class="cover-meta-key">Status</span>
                <span class="cover-meta-val">Draft for Review</span>
            </div>
        </div>
    </div>

    <div class="cover-footer">
        <span class="cover-footer-left">
            This document is confidential and intended solely for the named recipient.
        </span>
        <span class="cover-footer-right">Powered by Refactrd Engines</span>
    </div>
</div>

<!-- CONTENT PAGES -->
<div class="content">
    {packages_html}
    {sections_html}
</div>

</body>
</html>"""

    return html


def generate_pdf(sow: dict, branding: dict) -> bytes:
    """Generate a PDF from the SOW data and branding options."""
    html_content = build_sow_html(sow, branding)
    html = HTML(string=html_content)
    return html.write_pdf()