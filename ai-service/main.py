from fastapi import FastAPI
from routers import resume, search_jobs

app = FastAPI(
    title="AI Job Board - AI Service",
    description="Resume-to-job matching only: parses resumes, pulls live postings from JSearch, "
                "and RAG-scores them against the resume using LangChain + Gemini.",
    version="2.0.0",
)

app.include_router(resume.router)
app.include_router(search_jobs.router)


@app.get("/health")
def health():
    return {"status": "ok"}
