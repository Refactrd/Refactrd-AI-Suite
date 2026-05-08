import re
from fastapi import HTTPException

# ─── Abusive content patterns ─────────────────────────────────────────────────

ABUSIVE_PATTERNS = [
    r"\bshit\b",
    r"\bfuck\b",
    r"\bbitch\b",
    r"\basshole\b",
    r"\bbastard\b",
    r"\bidiot\b",
    r"\bdamn\b",
    r"\bcrap\b",
    r"\bstupid\b",
    r"\bmoron\b",
    r"kill\s+yourself",
    r"go\s+to\s+hell",
]

# ─── Prompt injection patterns ────────────────────────────────────────────────

INJECTION_PATTERNS = [
    r"ignore\s+(previous|prior|above|all)\s+instructions",
    r"forget\s+(everything|all|your\s+instructions)",
    r"you\s+are\s+now\s+(a|an|the)",
    r"new\s+instructions?:",
    r"system\s*prompt",
    r"jailbreak",
    r"act\s+as\s+(if\s+you\s+are|a|an)",
    r"pretend\s+(you\s+are|to\s+be)",
    r"disregard\s+(your|all|previous)",
]


def validate_input(question: str, max_chars: int = 500) -> None:
    """
    Validate user input before it reaches the LLM.
    Raises HTTPException with appropriate error codes on failure.
    """

    # Empty input
     # Empty input
    if not question or not question.strip():
        raise HTTPException(
            status_code=422,
            detail={
                "message": "Question cannot be empty.",
                "code": "UNCLEAR_INPUT",
            },
        )

    # Abusive content - check BEFORE length
    for pattern in ABUSIVE_PATTERNS:
        if re.search(pattern, question, re.IGNORECASE):
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "Abusive input detected.",
                    "code": "ABUSIVE_INPUT",
                },
            )

    # Prompt injection
    for pattern in INJECTION_PATTERNS:
        if re.search(pattern, question, re.IGNORECASE):
            raise HTTPException(
                status_code=422,
                detail={
                    "message": "Input not allowed.",
                    "code": "ABUSIVE_INPUT",
                },
            )

    # Length check - after content checks
    if len(question) > max_chars:
        raise HTTPException(
            status_code=422,
            detail={
                "message": f"Input exceeds {max_chars} character limit.",
                "code": "INPUT_TOO_LONG",
            },
        )