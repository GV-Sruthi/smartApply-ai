import json
import os
import time
import pdfplumber
import google.generativeai as genai
from dotenv import load_dotenv
from typing import Any, Dict, List

from fastapi import FastAPI, File, Form, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

app = FastAPI()

load_dotenv()


genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

# allow frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BACKEND_DIR = os.path.dirname(__file__)
UPLOADS_DIR = os.path.join(BACKEND_DIR, "uploads")
RESULTS_PATH = os.path.join(BACKEND_DIR, "results.json")

os.makedirs(UPLOADS_DIR, exist_ok=True)


def _read_results() -> List[Dict[str, Any]]:
    if not os.path.exists(RESULTS_PATH):
        return []
    try:
        with open(RESULTS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []
    except Exception:
        return []


def _write_results(items: List[Dict[str, Any]]) -> None:
    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, ensure_ascii=False, indent=2)


@app.get("/")
def home():
    return {"message": "Backend Running"}


@app.post("/analyze")
async def analyze(
    job_description: str = Form(...),
    resume: UploadFile = File(...),
):
    # Save uploaded resume
    timestamp = int(time.time())
    safe_name = os.path.basename(resume.filename or f"resume_{timestamp}")
    stored_name = f"{timestamp}_{safe_name}"
    stored_path = os.path.join(UPLOADS_DIR, stored_name)

    contents = await resume.read()
    with open(stored_path, "wb") as f:
        f.write(contents)
    resume_text = extract_pdf_text(stored_path)
    prompt = f"""
    You are an expert ATS reviewer.

    Analyze the following resume against the job description.

    Resume:
    {resume_text}

    Job Description:
    {job_description}

    Return ONLY valid JSON.

    {{
    "match_score": 0,
    "ats_score": 0,
    "missing_skills": [],
    "matching_skills": [],
    "recommendation": "",
    "resume_roast": ""
    }}

    For resume_roast return markdown format like:

    # Resume Roast 🔥

    ## Strengths
    - point
    - point

    ## Weaknesses
    - point
    - point

    ## Suggestions
    - point
    - point

    ## Final Verdict
    short verdict
    """

    response = model.generate_content(prompt)
    ai_result = response.text.strip()

    if ai_result.startswith("```json"):
        ai_result = ai_result.replace("```json", "")
        ai_result = ai_result.replace("```", "")
        ai_result = ai_result.strip()

    analysis = json.loads(ai_result)



    # For now, we just store/echo metadata (plug your scoring later)
    record = {
        "id": timestamp,
        "resume_filename": stored_name,
        "original_resume_filename": resume.filename,
        "jd_length": len(job_description or ""),
        "created_at": timestamp,
        "result": {
            "status": "stored_only",
            "message": "Upload received and stored. Add your resume-vs-JD analysis here.",
        },
    }

    items = _read_results()
    items.append(record)
    _write_results(items)

    return {
        "analysis": analysis
    }


def extract_pdf_text(pdf_path: str) -> str:
    text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

    except Exception as e:
        print("PDF Error:", e)

    return text