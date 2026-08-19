import json
import re


def safe_json_parse(raw: str, fallback: dict) -> dict:
    """Gemini sometimes wraps JSON in markdown fences - strip those before parsing.
    Falls back to a default dict instead of blowing up the request."""
    cleaned = re.sub(r"```json|```", "", raw).strip()
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return fallback
