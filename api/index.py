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
import datetime

load_dotenv()

app = FastAPI()

# --- Database Core ---
def get_db_connection():
    url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
    if not url:
        raise Exception("Database Connection Missing")
    return psycopg2.connect(url, sslmode='require')

def init_db():
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        
        # 1. Personas (The Identity)
        cur.execute('''CREATE TABLE IF NOT EXISTS personas
                     (id SERIAL PRIMARY KEY, 
                      name TEXT NOT NULL UNIQUE, 
                      niche TEXT, 
                      prompt TEXT,
                      youtube_id TEXT,
                      insta_id TEXT,
                      seed BIGINT DEFAULT 555555)''')
        
        # 2. Projects (The Content Engine)
        cur.execute('''CREATE TABLE IF NOT EXISTS projects
                     (id SERIAL PRIMARY KEY, 
                      persona_id INTEGER REFERENCES personas(id), 
                      title TEXT, 
                      topic TEXT, 
                      research_content TEXT,
                      script TEXT,
                      status TEXT DEFAULT 'DRAFT',
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        # 3. Renders (The Assets)
        cur.execute('''CREATE TABLE IF NOT EXISTS renders
                     (id SERIAL PRIMARY KEY, 
                      project_id INTEGER REFERENCES projects(id), 
                      url TEXT, 
                      type TEXT, 
                      status TEXT DEFAULT 'READY',
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        conn.commit()
        cur.close()
        conn.close()
        return True
    except Exception as e:
        print(f"DB Error: {e}")
        return False

# Initialize on boot
init_db()

# --- Models ---
class ProjectCreate(BaseModel):
    persona_id: int
    title: str
    topic: str

class ScriptUpdate(BaseModel):
    script: str

class ImageGenRequest(BaseModel):
    project_id: int
    prompt_override: Optional[str] = None

# --- API Endpoints ---

@app.get("/api/health")
async def health():
    return {"status": "Clickbait Labs OS v2.0 Online"}

# --- Persona Management ---
@app.get("/api/personas")
async def get_personas():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM personas ORDER BY name ASC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/personas")
async def create_persona(p: dict):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""INSERT INTO personas (name, niche, prompt, seed) 
                 VALUES (%s, %s, %s, %s) ON CONFLICT (name) DO UPDATE 
                 SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed""",
              (p['name'], p['niche'], p['prompt'], p.get('seed', 555555)))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}

# --- Project & Pipeline Management ---
@app.get("/api/projects")
async def list_projects():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""SELECT p.*, per.name as persona_name 
                 FROM projects p 
                 JOIN personas per ON p.persona_id = per.id 
                 ORDER BY p.created_at DESC""")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/projects")
async def create_project(data: ProjectCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("INSERT INTO projects (persona_id, title, topic) VALUES (%s, %s, %s) RETURNING id",
              (data.persona_id, data.title, data.topic))
    project_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"id": project_id}

@app.get("/api/projects/{id}")
async def get_project(id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT p.*, per.name as persona_name, per.prompt as persona_prompt, per.seed as persona_seed FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (id,))
    project = cur.fetchone()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    cur.execute("SELECT * FROM renders WHERE project_id = %s", (id,))
    renders = cur.fetchall()
    
    cur.close()
    conn.close()
    return {**project, "renders": renders}

# --- Core Intelligence Engines ---

@app.post("/api/projects/{id}/research")
async def run_research(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT topic FROM projects WHERE id = %s", (id,))
    topic = cur.fetchone()[0]
    
    content = ""
    try:
        with DDGS() as ddgs:
            # Triple-Scan Strategy
            res1 = ddgs.text(f"viral news trends {topic}", max_results=3)
            res2 = ddgs.text(f"site:reddit.com {topic} controversy opinions", max_results=2)
            combined = list(res1) + list(res2)
            for r in combined:
                content += f"\n- {r['body']}"
    except Exception as e:
        content = f"Research completed with errors: {e}"

    cur.execute("UPDATE projects SET research_content = %s, status = 'RESEARCHED' WHERE id = %s", (content, id))
    conn.commit()
    cur.close()
    conn.close()
    return {"content": content}

@app.post("/api/projects/{id}/generate-script")
async def run_scriptwriter(id: int):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key: raise HTTPException(status_code=400, detail="Gemini Key Missing")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT p.topic, p.research_content, per.name, per.prompt 
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id,))
    data = cur.fetchone()
    
    prompt = (
        "ACT AS A $100M VIRAL CREATOR. USE TRIPLE-PASS TECHNIQUE.\n"
        f"PERSONA: {data[2]}. DNA: {data[3]}.\n"
        f"TOPIC: {data[0]}. RESEARCH: {data[1]}.\n"
        "GOAL: Write a high-retention script (Max 180 words). Output ONLY the script."
    )
    
    try:
        client = genai.Client(api_key=api_key)
        response = client.models.generate_content(model="gemini-1.5-pro", contents=prompt)
        script = response.text
    except:
        # Fallback
        encoded = requests.utils.quote(prompt)
        script = requests.get(f"https://text.pollinations.ai/{encoded}?model=openai").text

    cur.execute("UPDATE projects SET script = %s, status = 'SCRIPTED' WHERE id = %s", (script, id))
    conn.commit()
    cur.close()
    conn.close()
    return {"script": script}

@app.post("/api/projects/{id}/render-image")
async def run_visualizer(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT per.prompt, per.seed, p.script 
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id,))
    data = cur.fetchone()
    
    # Realism Shell
    prefix = "Hyper-realistic raw photo, 8k UHD, shot on 35mm lens, f/1.8, "
    suffix = ", visible pores, natural skin grain, cinematic lighting, sharp focus, masterwork."
    
    prompt = f"{prefix}{data[0]}, {data[2][:100]}{suffix}"
    encoded = requests.utils.quote(prompt)
    seed_param = f"&seed={data[1]}"
    
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1792&model=flux{seed_param}&nologo=true"
    
    cur.execute("INSERT INTO renders (project_id, url, type) VALUES (%s, %s, 'image')", (id, url))
    conn.commit()
    cur.close()
    conn.close()
    return {"url": url}
