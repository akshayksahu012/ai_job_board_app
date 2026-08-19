from services.gemini import generate
from services.vectorstore import build_resume_index, retrieve_relevant_chunks
from utils.chunking import chunk_text
from utils.json_utils import safe_json_parse

PROMPT = """You are an AI recruiter assistant. Compare the candidate context against the job description
and return ONLY valid JSON (no markdown) with this shape:

{{
  "matchScore": number (0-100),
  "explanation": "one sentence on why this is or isn't a good fit"
}}

Job Title: {title}
Job Description:
\"\"\"{description}\"\"\"

Required/Preferred Skills: {skills}

Most Relevant Candidate Resume Sections:
\"\"\"{context}\"\"\"
"""


def score_resume_against_job(job: dict, resume_text: str) -> float:
    """RAG core, LangChain-native:
    1. Chunk the resume and index it in an in-memory FAISS store (HuggingFace embeddings).
    2. Retrieve the chunks most relevant to the job (FAISS similarity search - the retrieval step).
    3. Ask Gemini to score the match using only that retrieved context (the generation step).
    Only the numeric score is used - the API response itself stays limited to
    job_role / company_name / job_location / job_link, so this score is for ranking only.
    """
    chunks = chunk_text(resume_text)
    vectorstore = build_resume_index(chunks)

    query = f"{job['title']}. {job['description']}"
    retrieved = retrieve_relevant_chunks(vectorstore, query, k=4)

    top_context = "\n---\n".join(chunk for chunk, _ in retrieved)
    overall_relevance = max((score for _, score in retrieved), default=0.0)

    prompt = PROMPT.format(
        title=job.get("title", ""),
        description=job["description"][:6000],
        skills=", ".join(job.get("skills", [])) or "not specified",
        context=top_context,
    )

    try:
        raw = generate(prompt)
        parsed = safe_json_parse(raw, {"matchScore": round(overall_relevance * 100)})
        return float(parsed.get("matchScore", overall_relevance * 100))
    except Exception:
        # Gemini call failed - fall back to pure semantic similarity so ranking still works
        return round(overall_relevance * 100)
