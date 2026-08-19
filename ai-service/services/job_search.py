from services.jsearch_client import search_jobs
from services.matcher import score_resume_against_job

MAX_JOBS_TO_SCORE = 10  # keep Gemini calls bounded - scoring is the expensive step


def find_matching_jobs(resume_text: str, job_title: str, location: str = "") -> list[dict]:
    """Full pipeline:
    1. Query JSearch for real, live postings using the candidate's likely job title.
    2. RAG-score each posting against the resume (FAISS retrieval + Gemini generation) - used for ranking only.
    3. Return them ranked highest match first, trimmed to only the 4 fields the UI needs.
    """
    postings = search_jobs(query=job_title or "Software Developer", location=location)[:MAX_JOBS_TO_SCORE]

    scored = []
    for job in postings:
        try:
            score = score_resume_against_job(job, resume_text)
        except Exception:
            score = 0  # one bad call shouldn't drop the job entirely, just rank it low
        scored.append((score, job))

    scored.sort(key=lambda pair: pair[0], reverse=True)

    return [
        {
            "job_role": job["title"],
            "company_name": job["company"],
            "job_location": job["location"],
            "job_link": job["applyLink"],
        }
        for _, job in scored
    ]
