# AI-Enhanced Job Board Platform

The AI service does exactly one thing: **take a resume and find real, live jobs that
match it.** Everything else the AI layer used to do (chat assistant, internal-DB
recommendations, generic embedding endpoint) has been removed.

## Architecture
```
React (Vite)  →  Node/Express (auth, job postings CRUD, resume upload/orchestration)  →  Python/FastAPI (LangChain + Gemini + JSearch: RAG resume-to-job matching)
                          │
                       MongoDB
```

Job posting/browsing (recruiter side) is plain MERN CRUD with no AI involved — it's
just a board. The AI feature is entirely on the candidate side: upload a resume, and
the AI service searches JSearch for live postings and RAG-scores each one against it.

## Stack
- **Frontend:** React 19, React Router 6, Axios, plain CSS (Vite)
- **Backend (Node):** Express, JWT, Multer, bcrypt — ES Modules, Node 20+
- **AI service (Python):** FastAPI, LangChain (`langchain-google-genai`), NumPy, JSearch (RapidAPI)
- **Database:** MongoDB (Mongoose) — stores users, job postings, and parsed resumes
- **LLM:** Google Gemini (`gemini-1.5-flash` generation, `text-embedding-004` embeddings)

## AI service — only two endpoints
- `POST /parse-resume` — LangChain + Gemini extract skills, education, experience,
  a likely job title, and an embedding from raw resume text.
- `POST /search-jobs` — the core RAG pipeline:
  1. Query **JSearch** (RapidAPI) for live postings using the resume's likely job title.
  2. For each posting, chunk the resume with LangChain's `RecursiveCharacterTextSplitter`,
     embed the job description, and retrieve the resume chunks most relevant to it
     (cosine similarity via NumPy) — that's the **retrieval** step.
  3. Send the job description + those top chunks to Gemini to **generate** a match
     score, strengths, missing skills, and an explanation.
  4. Return postings ranked by match score, each with a real `applyLink`.

No `/chat`, no `/recommend`, no standalone `/embed` — those are gone.

## Setup

### 1. Prerequisites
- Node.js 20+, Python 3.11+, MongoDB
- Gemini API key: https://aistudio.google.com/apikey
- JSearch API key (RapidAPI, free tier available): https://rapidapi.com/letscrape-6bRBa3QguO5/api/jsearch

### 2. AI service (Python)
```bash
cd ai-service
python3 -m venv venv && source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# edit .env: set GOOGLE_API_KEY and JSEARCH_API_KEY
uvicorn main:app --reload --port 8000
```
Docs at http://localhost:8000/docs

### 3. Backend (Node)
```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET (AI_SERVICE_URL defaults to localhost:8000)
npm install
npm run dev
```

### 4. Frontend
```bash
cd client
npm install
npm run dev
```

### 5. Try it out
1. Register as a **recruiter** and post a job or two (plain listing, browse-only).
2. Register as a **candidate**, go to the dashboard, upload a PDF/DOCX resume.
3. Click **"Find Matching Jobs"** (optionally add a location) — the AI service queries
   JSearch for live postings matching your resume's likely role and RAG-scores each
   one against your actual resume content.
4. Each result card shows match %, strengths, missing skills, an explanation, and a
   real "Apply" link to the original posting.

## Folder structure
```
ai-service/
  main.py            FastAPI app - only 2 routers
  config.py          env settings (Gemini + JSearch keys)
  models/schemas.py  pydantic models: parse-resume, search-jobs
  routers/           resume.py, search_jobs.py
  services/
    gemini.py          LangChain Gemini client (embeddings + generation)
    resume_parser.py   structured resume extraction
    jsearch_client.py  calls the JSearch API
    matcher.py         RAG: chunk + retrieve + score one job against a resume
    job_search.py       orchestrates JSearch + matcher across multiple postings
  utils/             chunking (LangChain splitter), similarity (NumPy), json_utils
server/
  controllers/   authController, jobController (plain CRUD), resumeController (calls AI service)
  routes/        auth, jobs, resume
  services/      aiServiceClient.js - fetch wrapper around the Python service
  models/        User, Job, Resume (no Chat/Application models - removed with those features)
client/
  src/
    pages/       Home, Login, Register, JobListings, JobDetails, CandidateDashboard, RecruiterDashboard, PostJob
    components/  Navbar, JobCard (internal listings), MatchedJobCard (AI results), ProtectedRoute
```
