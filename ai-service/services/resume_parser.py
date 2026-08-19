from services.gemini import generate
from utils.json_utils import safe_json_parse

PROMPT = """You are a resume parser. Given the resume text below, return ONLY valid JSON
(no markdown, no backticks, no preamble) with this exact shape:

{{
  "skills": ["string"],
  "jobTitle": "the single most likely job title this candidate should search for, e.g. 'Full Stack Developer'"
}}

Resume text:
\"\"\"{resume_text}\"\"\"
"""

FALLBACK = {"skills": [], "jobTitle": ""}


def parse_resume(raw_text: str) -> dict:
    """Only pulls what's actually needed downstream: skills (for context) and a job
    title to search JSearch with. Kept intentionally minimal per the trimmed response scope."""
    prompt = PROMPT.format(resume_text=raw_text[:12000])
    raw = generate(prompt)
    parsed = safe_json_parse(raw, FALLBACK)

    return {
        "skills": parsed.get("skills", []),
        "jobTitle": parsed.get("jobTitle", ""),
    }
