from fastapi import APIRouter, HTTPException
from models.schemas import ParseResumeRequest, ParseResumeResponse
from services.resume_parser import parse_resume

router = APIRouter(prefix="/parse-resume", tags=["resume"])


@router.post("", response_model=ParseResumeResponse)
def parse(req: ParseResumeRequest):
    if not req.rawText.strip():
        raise HTTPException(status_code=422, detail="rawText is empty")
    return parse_resume(req.rawText)
