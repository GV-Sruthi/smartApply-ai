import os
import json
import time
import pdfplumber
import google.generativeai as genai

from dotenv import load_dotenv
from typing import Any, Dict, List

from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel("gemini-2.5-flash")

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


def extract_pdf_text(pdf_path):
    text = ""

    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()

                if page_text:
                    text += page_text + "\n"

    except Exception as e:
        print(e)

    return text


def _read_results() -> List[Dict[str, Any]]:
    if not os.path.exists(RESULTS_PATH):
        return []

    try:
        with open(RESULTS_PATH, "r", encoding="utf-8") as f:
            data = json.load(f)
            return data if isinstance(data, list) else []

    except Exception:
        return []


def _write_results(items: List[Dict[str, Any]]):

    with open(RESULTS_PATH, "w", encoding="utf-8") as f:
        json.dump(items, f, indent=2)


@app.get("/")
def home():
    return {
        "message": "Backend Running"
    }


@app.post("/analyze")
async def analyze(

    job_description: str = Form(...),
    resume: UploadFile = File(...)

):

    timestamp = int(time.time())

    filename = f"{timestamp}_{resume.filename}"

    filepath = os.path.join(UPLOADS_DIR, filename)

    contents = await resume.read()

    with open(filepath, "wb") as f:
        f.write(contents)

    resume_text = extract_pdf_text(filepath)

    prompt = f"""
You are an ATS Expert.

Compare the resume with the Job Description.

Resume:
{resume_text}

Job Description:
{job_description}

Return ONLY a VALID JSON object.

NO explanation.

NO markdown.

NO code block.

Use exactly this format:

{{
  "match_score": 87,
  "ats_score": 91,
  "missing_skills": [
    "Docker",
    "AWS"
  ],
  "matching_skills": [
    "React",
    "Python"
  ],
  "recommendation": "Write 5-10 lines explaining how to improve the resume.",
  "resume_roast": "Write a funny but helpful roast in markdown using headings and bullet points."
}}
"""

    try:

        response = model.generate_content(prompt)

        ai_text = response.text.strip()

        print("\n=========== GEMINI RAW RESPONSE ===========\n")
        print(ai_text)
        print("\n===========================================\n")

        ai_text = (
            ai_text
            .replace("```json", "")
            .replace("```", "")
            .strip()
        )

        analysis = json.loads(ai_text)

    except Exception as e:

        print("Gemini Parsing Error:")
        print(e)

        analysis = {

            "match_score": 0,

            "ats_score": 0,

            "missing_skills": [],

            "matching_skills": [],

            "recommendation": "Gemini returned invalid JSON.",

            "resume_roast": ai_text if 'ai_text' in locals() else "No response received."
        }

    record = {

        "id": timestamp,

        "resume_filename": filename,

        "created_at": timestamp,

        "analysis": analysis

    }

    results = _read_results()

    results.append(record)

    _write_results(results)

    return {
        "analysis": analysis
    }