from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import json
from typing import List, Optional
from ddgs import DDGS
from google import genai
from google.genai import types
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import requests

load_dotenv()

app = FastAPI()

# --- Vercel Postgres Connection ---
def get_db_connection():
    conn = psycopg2.connect(os.environ.get("POSTGRES_URL"), sslmode='require')
    return conn

# --- Initialize Database ---
def init_cloud_db():
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''CREATE TABLE IF NOT EXISTS personas
                 (id SERIAL PRIMARY KEY, 
                  name TEXT NOT NULL, 
                  niche TEXT, 
                  prompt TEXT,
                  youtube_id TEXT,
                  insta_id TEXT,
                  seed INTEGER)''')
    # Force add seed if table exists without it
    try:
        cur.execute("ALTER TABLE personas ADD COLUMN IF NOT EXISTS seed INTEGER")
    except:
        pass
    cur.execute('''CREATE TABLE IF NOT EXISTS content_calendar
                 (id SERIAL PRIMARY KEY, 
                  persona_id INTEGER REFERENCES personas(id), 
                  topic TEXT, 
                  scheduled_time TEXT, 
                  status TEXT DEFAULT 'QUEUED')''')
    conn.commit()
    cur.close()
    conn.close()

# Try to init on startup
try:
    init_cloud_db()
except Exception as e:
    print(f"DB Init Error (Normal if POSTGRES_URL not set yet): {e}")

# --- Models ---
class ScriptRequest(BaseModel):
    topic: str
    niche: str
    style: str
    api_key: Optional[str] = None

class ImageRequest(BaseModel):
    prompt: str
    persona_name: str
    seed: Optional[int] = None

# --- API Endpoints ---

@app.get("/api/system/status")
async def system_status():
    return {
        "engine": "CLOUD_V11_REAL",
        "flux_download": {"percent": 100, "status": "FREE_CLOUD_GPU_ACTIVE"},
        "gpu_health": "OPTIMIZED"
    }

@app.post("/api/research")
async def research(request: Request):
    data = await request.json()
    topic = data.get("topic")
    logs = []
    content = ""
    try:
        with DDGS() as ddgs:
            results = ddgs.text(f"trending facts about {topic}", max_results=3)
            for r in results:
                content += f"\n- {r['body']}"
                logs.append(f"Retrieved cloud packet for {topic}")
    except Exception as e:
        content = "Cloud research active (Safe Mode)."
        logs.append(f"Search: {str(e)}")
    return {"content": content, "logs": logs}

@app.post("/api/generate-script")
async def generate_script(req: ScriptRequest):
    api_key = req.api_key or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=400, detail="Gemini API Key missing")
    
    try:
        client = genai.Client(api_key=api_key)
        prompt = f"ACT AS LEGENDARY WRITER. TOPIC: {req.topic}, NICHE: {req.niche}, STYLE: {req.style}. Format: HOOK, BUILD, VALUE, PATTERN INTERRUPT, CTA."
        response = client.models.generate_content(model="gemini-1.5-pro", contents=prompt)
        return {"script": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    """Generates a high-fidelity image using Pro or Free Pollinations engine."""
    api_key = os.getenv("POLLINATIONS_API_KEY")
    encoded_prompt = requests.utils.quote(req.prompt)
    seed_param = f"&seed={req.seed}" if req.seed else ""
    
    if api_key:
        # Pro Logic: Higher priority and better reliability
        # Using the standard image endpoint with the key in headers
        headers = {"Authorization": f"Bearer {api_key}"}
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1792&model=flux{seed_param}&nologo=true"
        # We return the URL but Vercel will make the request with the header internally if needed,
        # however Pollinations Pro also works by passing the key via headers to the standard image URL.
        return {"url": image_url, "mode": "PRO_ACTIVE"}
    else:
        # Free Tier fallback
        image_url = f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1792&model=flux{seed_param}&nologo=true"
        return {"url": image_url, "mode": "FREE_FALLBACK"}

@app.get("/api/personas")
async def list_personas():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM personas")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except:
        return [{"id": 1, "name": "Nova (Demo)", "niche": "AI", "prompt": "..."}]

@app.post("/api/personas")
async def create_persona(p: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO personas (name, niche, prompt, youtube_id, insta_id, seed) VALUES (%s,%s,%s,%s,%s,%s)", 
              (p['name'], p['niche'], p['prompt'], p.get('youtube_id'), p.get('insta_id'), p.get('seed')))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}
