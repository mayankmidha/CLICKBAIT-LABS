from fastapi import FastAPI, HTTPException, Request, Body
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
import datetime
import time

load_dotenv()

app = FastAPI()

# --- Database Core ---
def get_db_connection():
    url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
    if not url: return None
    try:
        return psycopg2.connect(url, sslmode='require')
    except: return None

def init_db():
    conn = get_db_connection()
    if not conn: return False
    try:
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS personas (id SERIAL PRIMARY KEY, name TEXT UNIQUE, niche TEXT, prompt TEXT, youtube_id TEXT, insta_id TEXT, seed BIGINT DEFAULT 555555)")
        cur.execute("CREATE TABLE IF NOT EXISTS projects (id SERIAL PRIMARY KEY, persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE, title TEXT, topic TEXT, research_content TEXT, script TEXT, status TEXT DEFAULT 'DRAFT', created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        cur.execute("CREATE TABLE IF NOT EXISTS renders (id SERIAL PRIMARY KEY, project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, url TEXT, type TEXT, status TEXT DEFAULT 'READY', replicate_id TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)")
        conn.commit()
        cur.close()
        conn.close()
        return True
    except: return False

init_db()

# --- Models ---
class PersonaCreate(BaseModel):
    id: Optional[int] = None
    name: str
    niche: str
    prompt: str
    seed: int

class ProjectCreate(BaseModel):
    persona_id: int
    title: str
    topic: str

class ActionRequest(BaseModel):
    project_id: int

# --- API Endpoints ---

@app.get("/api/onboard-isla")
async def onboard_isla():
    """Directly onboards the Scottish AI Architect to the database."""
    dna = "28yo Scottish woman, striking blue eyes, red hair undercut, sharp bone structure, visible skin pores, tech vest, Edinburgh loft background"
    conn = get_db_connection()
    cur = conn.cursor()
    try:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s) ON CONFLICT (name) DO UPDATE SET prompt=EXCLUDED.prompt, seed=EXCLUDED.seed", 
                  ("Isla", "AI & Tech", dna, 1100229))
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "ISLA_ONBOARDED_SUCCESSFULLY"}
    except Exception as e:
        return {"status": "ERROR", "message": str(e)}

@app.get("/api/personas")
async def get_personas():
    conn = get_db_connection()
    if not conn: return []
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM personas ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/personas")
async def save_persona(p: PersonaCreate):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Database Offline")
    cur = conn.cursor()
    if p.id:
        cur.execute("UPDATE personas SET name=%s, niche=%s, prompt=%s, seed=%s WHERE id=%s", (p.name, p.niche, p.prompt, p.seed, p.id))
    else:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s) ON CONFLICT (name) DO UPDATE SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed", (p.name, p.niche, p.prompt, p.seed))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}

@app.delete("/api/personas/{id}")
async def delete_persona(id: int):
    conn = get_db_connection()
    if not conn: return {"status": "error"}
    cur = conn.cursor()
    cur.execute("DELETE FROM personas WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "deleted"}

@app.get("/api/projects")
async def list_projects():
    conn = get_db_connection()
    if not conn: return []
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT p.*, per.name as persona_name FROM projects p JOIN personas per ON p.persona_id = per.id ORDER BY p.created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/projects")
async def create_project(data: ProjectCreate):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Database Offline")
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (persona_id, title, topic) VALUES (%s, %s, %s) RETURNING id", (data.persona_id, data.title, data.topic))
    project_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": project_id}

@app.get("/api/projects/{id}")
async def get_project(id: int):
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Database Offline")
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT p.*, per.name as persona_name, per.prompt as persona_prompt, per.seed as persona_seed FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (id,))
    project = cur.fetchone()
    if not project: return None
    cur.execute("SELECT * FROM renders WHERE project_id = %s ORDER BY created_at DESC", (id,))
    renders = cur.fetchall()
    
    # Live Sync
    token = os.getenv("REPLICATE_API_TOKEN")
    if token:
        for r in renders:
            if r['status'] == 'PROCESSING' and r['replicate_id']:
                rep_res = requests.get(f"https://api.replicate.com/v1/predictions/{r['replicate_id']}", headers={"Authorization": f"Token {token}"})
                if rep_res.status_code == 200:
                    d = rep_res.json()
                    if d['status'] == 'succeeded':
                        cur.execute("UPDATE renders SET url = %s, status = 'READY' WHERE id = %s", (d['output'], r['id']))
                        r['url'] = d['output']
                        r['status'] = 'READY'
                    elif d['status'] == 'failed':
                        cur.execute("UPDATE renders SET status = 'FAILED' WHERE id = %s", (r['id'],))
                        r['status'] = 'FAILED'
    conn.commit()
    cur.close()
    conn.close()
    return {**project, "renders": renders}

@app.post("/api/research")
async def run_research(req: ActionRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT topic FROM projects WHERE id = %s", (req.project_id,))
    topic = cur.fetchone()[0]
    content = ""
    try:
        with DDGS() as ddgs:
            res = ddgs.text(f"trending news {topic}", max_results=5)
            for r in res: content += f"\n- {r['body']}"
    except: content = "Research scan complete."
    cur.execute("UPDATE projects SET research_content = %s, status = 'RESEARCHED' WHERE id = %s", (content, req.project_id))
    conn.commit()
    cur.close()
    conn.close()
    return {"content": content}

@app.post("/api/generate-script")
async def run_scriptwriter(req: ActionRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT p.topic, p.research_content, per.name, per.prompt FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (req.project_id,))
    d = cur.fetchone()
    prompt = f"ACT AS $100M VIRAL CREATOR. PERSONA: {d[2]}. DNA: {d[3]}. TOPIC: {d[0]}. RESEARCH: {d[1]}. Write high-retention script (Max 180 words)."
    try:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
        script = client.models.generate_content(model="gemini-1.5-pro", contents=prompt).text
    except:
        script = requests.get(f"https://text.pollinations.ai/{requests.utils.quote(prompt)}?model=openai").text
    cur.execute("UPDATE projects SET script = %s, status = 'SCRIPTED' WHERE id = %s", (script, req.project_id))
    conn.commit()
    cur.close()
    conn.close()
    return {"script": script}

@app.post("/api/render-image")
async def run_visualizer(req: ActionRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT per.prompt, per.seed FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (req.project_id,))
    d = cur.fetchone()
    # REALISM SHELL 4.0
    prefix = "A hyper-realistic 4MP raw portrait, authentic film photography, 35mm lens, f/1.8, extremely detailed skin textures, visible pores, natural skin grain, subtle imperfections, real-life person, "
    suffix = ", direct eye contact, cinematic lighting, masterpiece, shot on Kodak Portra 400."
    prompt = f"{prefix}{d[0]}{suffix}"
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token: raise HTTPException(status_code=401, detail="Key missing")
    rep_res = requests.post("https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions", headers={"Authorization": f"Token {token}", "Content-Type": "application/json"}, json={"input": {"prompt": prompt, "aspect_ratio": "9:16", "output_format": "jpg", "output_quality": 100}})
    pred = rep_res.json()
    time.sleep(5) # Pro renders are fast
    final = requests.get(f"https://api.replicate.com/v1/predictions/{pred['id']}", headers={"Authorization": f"Token {token}"}).json()
    url = final.get('output') or "https://via.placeholder.com/1024x1792?text=Processing..."
    cur.execute("INSERT INTO renders (project_id, url, type, status) VALUES (%s, %s, 'image', 'READY')", (req.project_id, url))
    cur.execute("UPDATE projects SET status = 'VISUALIZED' WHERE id = %s", (req.project_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"url": url}

@app.post("/api/render-video")
async def run_animator(req: ActionRequest):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT per.name, per.prompt, (SELECT url FROM renders WHERE project_id = %s AND type='image' ORDER BY id DESC LIMIT 1) FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (req.project_id, req.project_id))
    d = cur.fetchone()
    token = os.getenv("REPLICATE_API_TOKEN")
    video_prompt = f"A beautiful woman {d[0]} speaking to camera, {d[1][:100]}, hyper-realistic skin, natural movement."
    rep_res = requests.post("https://api.replicate.com/v1/models/kling-ai/kling-v1-5-pro/predictions", headers={"Authorization": f"Token {token}", "Content-Type": "application/json"}, json={"input": {"prompt": video_prompt, "start_image": d[2], "aspect_ratio": "9:16", "duration": 5}})
    pred = rep_res.json()
    cur.execute("INSERT INTO renders (project_id, url, type, status, replicate_id) VALUES (%s, %s, 'video', 'PROCESSING', %s)", (req.project_id, d[2], pred['id']))
    cur.execute("UPDATE projects SET status = 'RENDERED' WHERE id = %s", (req.project_id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "PROCESSING"}

@app.get("/api/factory-reset")
async def factory_reset():
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "26yo Japanese-Brazilian woman, sharp jawline, messy bun, techwear"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "24yo Indo-Australian woman, sun-kissed, professional linen"},
        {"name": "Valkyrie", "niche": "Gaming", "seed": 9922881, "dna": "21yo Indo-Japanese gamer, messy bun, purple streaks, gaming jersey"}
    ]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM personas")
    for p in personas: cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s)", (p['name'], p['niche'], p['dna'], p['seed']))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "SUCCESS"}

@app.get("/api/library")
async def get_global_library():
    conn = get_db_connection()
    if not conn: return []
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT r.*, p.title as project_title, per.name as persona_name FROM renders r JOIN projects p ON r.project_id = p.id JOIN personas per ON p.persona_id = per.id ORDER BY r.created_at DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
