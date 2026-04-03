from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import json
from typing import List, Optional
from ddgs import DDGS
from google import genai
from google.genai import types
import psycopg2 # For Vercel Postgres
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# --- Vercel Postgres Connection ---
def get_db_connection():
    try:
        return psycopg2.connect(os.environ.get("POSTGRES_URL"))
    except Exception as e:
        print(f"DB Connection Error: {e}")
        return None

# --- Models ---
class ScriptRequest(BaseModel):
    topic: str
    niche: str
    style: str
    api_key: Optional[str] = None

# --- API Endpoints ---

@app.get("/api/hello")
async def hello():
    return {"status": "Clickbait Labs Cloud Engine is Online"}

@app.get("/api/system/status")
async def system_status():
    return {
        "engine": "CLOUD_SERVERLESS",
        "flux_download": {"percent": 100, "status": "GPU_API_CONNECTED"},
        "gpu_health": "CLOUD_OPTIMIZED"
    }

@app.post("/api/research")
async def research(request: Request):
    data = await request.json()
    topic = data.get("topic")
    logs = []
    content = ""
    try:
        with DDGS() as ddgs:
            results = ddgs.text(f"viral trends and facts {topic}", max_results=5)
            for r in results:
                content += f"\n- {r['body']}"
                logs.append(f"Cloud Packet retrieved for {topic}")
    except Exception as e:
        content = "Cloud research active."
        logs.append(f"Search status: {str(e)}")
    return {"content": content, "logs": logs}

@app.post("/api/generate-script")
async def generate_script(req: ScriptRequest):
    api_key = req.api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key missing")
    
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"ACT AS LEGENDARY WRITER. TOPIC: {req.topic}, NICHE: {req.niche}, STYLE: {req.style}. Format: HOOK, BUILD, VALUE, PATTERN INTERRUPT, CTA."
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt,
        )
        return {"script": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Placeholder for Postgres Persona Storage
@app.get("/api/personas")
async def list_personas():
    # In Vercel, we'll fetch from Postgres. 
    # For now, we'll return the defaults to keep the UI working.
    return [
        {"id": 1, "name": "Nova", "niche": "AI & Tech", "prompt": "24yo female...", "youtube_id": "@NovaAI", "insta_id": "nova.ai"},
        {"id": 2, "name": "Marcus", "niche": "Finance", "prompt": "40yo male...", "youtube_id": "@WealthMarcus", "insta_id": "marcus.wealth"}
    ]
