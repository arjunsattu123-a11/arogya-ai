
# main.py
# Backend server for Arogya AI
# Made by Arjun
# Run: py -3.12 -m uvicorn main:app --port 8000

import os
from dotenv import load_dotenv

# Load .env first before anything else
load_dotenv()

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from safety_engine import run_safety_checks
from prompt_composer import build_prompt
from database import get_drugs, get_guidelines, save_reminder

app = FastAPI(title="Arogya AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

AI_API_KEY = os.environ.get("AI_API_KEY")
AI_API_URL = os.environ.get("AI_API_URL")


class PatientData(BaseModel):
    name: str
    age: int
    condition: str
    hba1c: float | None = None
    egfr: float | None = None
    has_heart_failure: bool = False
    current_drugs: list[str] = []
    budget: str = "low"

class ReminderRequest(BaseModel):
    patient_name: str
    mobile_number: str
    drug_name: str
    reminder_time: str
    frequency: str


@app.post("/recommend")
async def get_recommendation(patient: PatientData):
    safety_alerts = run_safety_checks(
        condition=patient.condition,
        egfr=patient.egfr,
        has_heart_failure=patient.has_heart_failure,
        current_drugs=patient.current_drugs,
        hba1c=patient.hba1c
    )
    drugs = get_drugs(patient.condition, patient.budget)
    guidelines = get_guidelines(patient.condition)
    prompt = build_prompt(patient.dict(), drugs, guidelines, safety_alerts)

    try:
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {AI_API_KEY}"
        }
        body = {
            "model": "llama-3.3-70b-versatile",
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": 1000
        }
        response = requests.post(AI_API_URL, headers=headers, json=body)
        response.raise_for_status()
        data = response.json()
        ai_response = data["choices"][0]["message"]["content"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

    return {
        "recommendation": ai_response,
        "safety_alerts": safety_alerts,
        "drugs_shown": drugs[:5],
    }


@app.post("/reminder")
async def create_reminder(reminder: ReminderRequest):
    result = save_reminder(reminder.dict())
    if result:
        return {"message": "Reminder saved", "data": result}
    raise HTTPException(status_code=500, detail="Could not save reminder")


@app.get("/drugs/{category}")
async def list_drugs(category: str):
    try:
        drugs = get_drugs(category, budget="all")
        return {"drugs": drugs}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/health")
async def health_check():
    return {"status": "ok", "message": "Arogya AI is running"}
