from fastapi import APIRouter, HTTPException
from models.schemas import SearchJobsRequest, SearchJobsResponse
from services.job_search import find_matching_jobs

router = APIRouter(prefix="/search-jobs", tags=["search-jobs"])


@router.post("", response_model=SearchJobsResponse)
def search(req: SearchJobsRequest):
    if not req.resumeText.strip():
        raise HTTPException(status_code=422, detail="resumeText is empty")

    jobs = find_matching_jobs(resume_text=req.resumeText, job_title=req.jobTitle, location=req.location)
    return SearchJobsResponse(jobs=jobs)