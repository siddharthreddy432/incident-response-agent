from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from hindsight_client import Hindsight
from groq import Groq
from dotenv import load_dotenv
import os
import json
import uuid

load_dotenv()

BANK_ID = "incident-response-agent"

hindsight = Hindsight(
    base_url=os.getenv("HINDSIGHT_API_URL"),
    api_key=os.getenv("HINDSIGHT_API_KEY"),
)

groq = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI(
    title="Incident Response Agent API",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class IncidentRequest(BaseModel):
    title: str
    service: str
    severity: str
    description: str


@app.get("/")
def root():
    return {
        "name": "Incident Response Agent API",
        "status": "online",
        "memory": "Hindsight connected",
        "reasoning": "Groq connected",
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "hindsight": "connected",
        "groq": "connected",
    }


@app.post("/incidents/investigate")
def investigate_incident(incident: IncidentRequest):

    incident_id = f"INC-{uuid.uuid4().hex[:6].upper()}"

    incident_text = (
        f"Title: {incident.title}\n"
        f"Service: {incident.service}\n"
        f"Severity: {incident.severity}\n"
        f"Description: {incident.description}"
    )

    memories = hindsight.recall(
        bank_id=BANK_ID,
        query=(
            f"Find previous incidents similar to this production incident. "
            f"Look for matching services, symptoms, deployments, root causes "
            f"and successful resolutions.\n\n{incident_text}"
        ),
    )

    memory_text = "\n\n".join(
        f"- [{memory.type}] {memory.text}"
        for memory in memories.results[:10]
    )

    if not memory_text:
        memory_text = "No relevant historical incidents were found."

    prompt = f"""
You are an experienced Site Reliability Engineer investigating a production incident.

CURRENT INCIDENT:
{incident_text}

HISTORICAL INCIDENT MEMORY FROM HINDSIGHT:
{memory_text}

Use the historical memory as evidence, but do not invent facts.

Return ONLY valid JSON with exactly these fields:
{{
  "summary": "short incident assessment",
  "probable_root_cause": "most likely cause based on available evidence",
  "recommended_action": "specific immediate action",
  "memory_used": true,
  "confidence": "high/medium/low"
}}

If the historical memory strongly matches the current incident, explicitly use that experience when forming the recommendation.
"""

    response = groq.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a production incident response expert. Return only valid JSON.",
            },
            {
                "role": "user",
                "content": prompt,
            },
        ],
        temperature=0.2,
    )

    raw = response.choices[0].message.content.strip()

    try:
        analysis = json.loads(raw)
    except json.JSONDecodeError:
        analysis = {
            "summary": raw,
            "probable_root_cause": "See AI assessment",
            "recommended_action": "Review the AI assessment with an operator.",
            "memory_used": bool(memories.results),
            "confidence": "medium",
        }

    hindsight.retain(
        bank_id=BANK_ID,
        content=(
            f"Incident {incident_id}: {incident_text}\n"
            f"Agent investigation: {json.dumps(analysis)}"
        ),
        context="AI incident investigation and response recommendation.",
    )

    return {
        "incident_id": incident_id,
        "incident": incident.model_dump(),
        "historical_memories": [
            {
                "type": memory.type,
                "text": memory.text,
            }
            for memory in memories.results[:10]
        ],
        "analysis": analysis,
    }
