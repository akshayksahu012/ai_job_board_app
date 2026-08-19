import requests
from config import settings

SEARCH_URL = f"https://{settings.jsearch_host}/search-v2"


def search_jobs(query: str, location: str = "", num_pages: int = 1) -> list[dict]:
    """Hits JSearch (RapidAPI) for live job postings matching the query.
    Returns a normalized list - just the fields we actually use downstream."""
    params = {"query": f"{query} {location}".strip(), "page": "1", "num_pages": str(num_pages)}
    headers = {
        "X-RapidAPI-Key": settings.jsearch_api_key,
        "X-RapidAPI-Host": settings.jsearch_host,
    }

    res = requests.get(SEARCH_URL, headers=headers, params=params, timeout=15)
    if not res.ok:
        raise RuntimeError(
            f"JSearch request failed ({res.status_code}) for {res.url}: {res.text[:500]}"
        )
    body = res.json()
    data = body.get("data", {})
    jobs = data.get("jobs", []) if isinstance(data, dict) else data
    if not isinstance(jobs, list):
       
        raise RuntimeError(f"Unexpected JSearch response shape: {body}")

    return [
        {
            "title": job.get("job_title", "Untitled role"),
            "company": job.get("employer_name", "Unknown company"),
            "location": ", ".join(
                filter(None, [job.get("job_city"), job.get("job_country")])
            ) or ("Remote" if job.get("job_is_remote") else "Not specified"),
            "description": job.get("job_description", ""),
            "applyLink": job.get("job_apply_link", ""),
            "skills": job.get("job_required_skills") or [],
        }
        for job in jobs
        if job.get("job_description")
    ]