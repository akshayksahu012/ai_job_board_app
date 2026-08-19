from pydantic import BaseModel


class ParseResumeRequest(BaseModel):
    rawText: str


class ParseResumeResponse(BaseModel):
    skills: list[str]
    jobTitle: str


class SearchJobsRequest(BaseModel):
    resumeText: str
    jobTitle: str = ""
    location: str = ""


class JobMatchResult(BaseModel):
    job_role: str
    company_name: str
    job_location: str
    job_link: str


class SearchJobsResponse(BaseModel):
    jobs: list[JobMatchResult]
