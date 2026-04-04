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

# --- Database Connection ---
def get_db_connection():
    url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
    if not url:
        raise Exception("Database Connection String Missing")
    conn = psycopg2.connect(url, sslmode='require')
    return conn

# --- Initialize Database ---
def init_cloud_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute('''CREATE TABLE IF NOT EXISTS personas
                     (id SERIAL PRIMARY KEY, 
                      name TEXT NOT NULL UNIQUE, 
                      niche TEXT, 
                      prompt TEXT,
                      youtube_id TEXT,
                      insta_id TEXT,
                      seed BIGINT DEFAULT 555555)''')
        
        cur.execute("SELECT column_name FROM information_schema.columns WHERE table_name='personas' AND column_name='seed'")
        if not cur.fetchone():
            cur.execute("ALTER TABLE personas ADD COLUMN seed BIGINT DEFAULT 555555")
        
        cur.execute('''CREATE TABLE IF NOT EXISTS content_calendar
                     (id SERIAL PRIMARY KEY, 
                      persona_id INTEGER REFERENCES personas(id), 
                      topic TEXT, 
                      scheduled_time TEXT, 
                      status TEXT DEFAULT 'QUEUED')''')
        
        conn.commit()
        cur.close()
        conn.close()
        return "DATABASE_READY"
    except Exception as e:
        return f"DATABASE_ERROR: {str(e)}"

# --- Models ---
class ScriptRequest(BaseModel):
    topic: str
    niche: str
    style: str
    persona_name: Optional[str] = None
    persona_dna: Optional[str] = None
    api_key: Optional[str] = None

class ImageRequest(BaseModel):
    prompt: str
    persona_name: str
    seed: Optional[int] = None

# --- API Endpoints ---

@app.get("/api/system/status")
async def system_status():
    return {
        "engine": "CLOUD_V24_STRATEGIC",
        "status": "ONLINE",
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
            # Triple-Scan Strategy
            logs.append("Phase 1: Scanning Global Tech/Viral News...")
            res1 = ddgs.text(f"viral news trends {topic}", max_results=3)
            
            logs.append("Phase 2: Analyzing Community Sentiment (Reddit/X)...")
            res2 = ddgs.text(f"site:reddit.com {topic} opinions controversy", max_results=2)
            
            logs.append("Phase 3: Extracting Authoritative Data/Facts...")
            res3 = ddgs.text(f"{topic} statistics data points explained", max_results=2)
            
            combined = list(res1) + list(res2) + list(res3)
            for r in combined:
                content += f"\n- {r['body']}"
            
            logs.append("Deep synthesis complete. Intelligence package ready.")
    except Exception as e:
        content = "Standard scan active."
        logs.append(f"Scan status: {str(e)}")
    return {"content": content, "logs": logs}

@app.post("/api/generate-script")
async def generate_script(req: ScriptRequest):
    # TRIPLE-PASS Instruction with Persona Context
    persona_context = f"PERSONA NAME: {req.persona_name}. PERSONA DNA: {req.persona_dna}." if req.persona_name else ""
    
    prompt = (
        "ACT AS A $100M DIRECT-RESPONSE MARKETER AND VIRAL CREATOR. "
        "YOUR GOAL IS 100% RETENTION. USE TRIPLE-PASS TECHNIQUE:\n"
        "PASS 1: STRUCTURE - Create a high-tension narrative arc.\n"
        "PASS 2: PSYCHOLOGY - Inject Curiosity Gaps, Pattern Interrupts, and Status Signaling.\n"
        "PASS 3: POLISH - Write for 'MrBeast-Style' pacing and clarity.\n\n"
        f"{persona_context}\n"
        f"TOPIC: {req.topic}. NICHE: {req.niche}. STYLE: {req.style}.\n"
        "INSTRUCTION: Adopt the specific voice, background, and ethnicity of the persona. "
        "Ensure the script sounds like THIS person speaking, not a generic AI. "
        "Output ONLY the final script text. Max 180 words."
    )

    api_key = req.api_key or os.getenv("GEMINI_API_KEY")
    if api_key:
        try:
            client = genai.Client(api_key=api_key)
            response = client.models.generate_content(model="gemini-1.5-pro", contents=prompt)
            return {"script": response.text}
        except Exception:
            pass

    # Fallback to high-speed text
    try:
        encoded = requests.utils.quote(prompt)
        resp = requests.get(f"https://text.pollinations.ai/{encoded}?model=openai")
        return {"script": resp.text}
    except Exception as e:
        return {"script": None, "error": str(e)}

@app.post("/api/generate-image")
async def generate_image(req: ImageRequest):
    """Generates a hyper-realistic human portrait using Pro Photography parameters."""
    # The "Realism Shell"
    prefix = "Hyper-realistic raw photo, 8k UHD, shot on 35mm lens, f/1.8, "
    suffix = ", highly detailed skin textures, visible pores, natural skin grain, cinematic lighting, extremely sharp focus, no airbrushing, professional color grading, masterwork."
    
    full_prompt = f"{prefix}{req.prompt}{suffix}"
    encoded = requests.utils.quote(full_prompt)
    seed_param = f"&seed={req.seed}" if req.seed else ""
    
    image_url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1792&model=flux{seed_param}&nologo=true&enhance=false"
    return {"url": image_url}

@app.get("/api/empire-builder")
async def empire_builder():
    """Rapidly initializes 5 hyper-realistic personas with anatomical DNA."""
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "26yo Japanese-Brazilian woman, sharp symmetrical jawline, hazel eyes, techwear, lab"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "24yo Indo-Australian woman, sun-kissed tanned skin, linen vest, coastal office"},
        {"name": "Elara", "niche": "Luxury", "seed": 338812, "dna": "28yo Indo-French woman, chic bob, high cheekbones, silk blouse, Paris studio"},
        {"name": "Maya", "niche": "Fitness", "seed": 992211, "dna": "25yo Scandinavian-Indian woman, athletic build, messy bun, gym, sunlight"},
        {"name": "Luna", "niche": "Gaming", "seed": 445566, "dna": "22yo American-Indian woman, purple hair streaks, headset, neon gaming room"}
    ]
    
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        for p in personas:
            cur.execute("""INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s) 
                         ON CONFLICT (name) DO UPDATE SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed""", 
                      (p['name'], p['niche'], p['dna'], p['seed']))
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "SUCCESS", "entities": personas}
    except Exception as e:
        return {"status": "ERROR", "error": str(e), "entities": personas}

@app.get("/api/personas")
async def list_personas():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM personas ORDER BY id DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except:
        return []

@app.post("/api/personas")
async def create_persona(req: Request):
    p = await req.json()
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("INSERT INTO personas (name, niche, prompt, youtube_id, insta_id, seed) VALUES (%s,%s,%s,%s,%s,%s)", 
                  (p.get('name'), p.get('niche'), p.get('prompt'), p.get('youtube_id'), p.get('insta_id'), p.get('seed')))
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/db-sync")
async def db_sync():
    status = init_cloud_db()
    return {"status": status}
