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
        cur.execute('''CREATE TABLE IF NOT EXISTS personas
                     (id SERIAL PRIMARY KEY, 
                      name TEXT NOT NULL UNIQUE, 
                      niche TEXT, 
                      prompt TEXT,
                      youtube_id TEXT,
                      insta_id TEXT,
                      seed BIGINT DEFAULT 555555)''')
        cur.execute('''CREATE TABLE IF NOT EXISTS projects
                     (id SERIAL PRIMARY KEY, 
                      persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE, 
                      title TEXT, 
                      topic TEXT, 
                      research_content TEXT,
                      script TEXT,
                      status TEXT DEFAULT 'DRAFT',
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        cur.execute('''CREATE TABLE IF NOT EXISTS renders
                     (id SERIAL PRIMARY KEY, 
                      project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE, 
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

class ImageGenRequest(BaseModel):
    persona_name: str
    prompt_override: Optional[str] = None
    seed: Optional[int] = 555555

# --- API Endpoints ---

@app.get("/api/health")
async def health():
    return {"status": "Clickbait Labs OS v3.5 - Pipeline Restored"}

@app.get("/api/personas")
async def get_personas():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM personas ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.post("/api/personas")
async def save_persona(p: PersonaCreate):
    conn = get_db_connection()
    cur = conn.cursor()
    if p.id:
        cur.execute("""UPDATE personas SET name=%s, niche=%s, prompt=%s, seed=%s WHERE id=%s""",
                  (p.name, p.niche, p.prompt, p.seed, p.id))
    else:
        cur.execute("""INSERT INTO personas (name, niche, prompt, seed) 
                     VALUES (%s, %s, %s, %s) ON CONFLICT (name) DO UPDATE 
                     SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed""",
                  (p.name, p.niche, p.prompt, p.seed))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}

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

@app.post("/api/research")
async def run_research(req: ActionRequest):
    id = req.project_id
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("SELECT topic FROM projects WHERE id = %s", (id,))
    topic = cur.fetchone()[0]
    content = ""
    try:
        with DDGS() as ddgs:
            res1 = ddgs.text(f"viral trends {topic}", max_results=3)
            for r in res1: content += f"\n- {r['body']}"
    except: content = "Research mode active."
    cur.execute("UPDATE projects SET research_content = %s, status = 'RESEARCHED' WHERE id = %s", (content, id))
    conn.commit()
    cur.close()
    conn.close()
    return {"content": content}

@app.post("/api/generate-script")
async def run_scriptwriter(req: ActionRequest):
    id = req.project_id
    api_key = os.getenv("GEMINI_API_KEY")
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT p.topic, p.research_content, per.name, per.prompt 
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id,))
    data = cur.fetchone()
    prompt = f"Write viral script for {data[2]} on {data[0]}. Research: {data[1]}. Max 180 words."
    try:
        client = genai.Client(api_key=api_key)
        script = client.models.generate_content(model="gemini-1.5-pro", contents=prompt).text
    except:
        script = requests.get(f"https://text.pollinations.ai/{requests.utils.quote(prompt)}?model=openai").text
    cur.execute("UPDATE projects SET script = %s, status = 'SCRIPTED' WHERE id = %s", (script, id))
    conn.commit()
    cur.close()
    conn.close()
    return {"script": script}

@app.post("/api/render-image")
async def run_visualizer(req: ActionRequest):
    id = req.project_id
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT per.prompt, per.seed, p.script 
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id,))
    data = cur.fetchone()
    prefix = "Hyper-realistic raw photo, 8k UHD, 35mm lens, f/1.8, "
    suffix = ", visible skin pores, natural skin texture, cinematic lighting, sharp focus."
    prompt = f"{prefix}{data[0]}, {data[2][:100]}{suffix}"
    encoded = requests.utils.quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1792&model=flux&seed={data[1]}&nologo=true"
    cur.execute("INSERT INTO renders (project_id, url, type) VALUES (%s, %s, 'image')", (id, url))
    cur.execute("UPDATE projects SET status = 'VISUALIZED' WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"url": url}

@app.get("/api/factory-reset")
async def factory_reset():
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "26yo Japanese-Brazilian woman, sharp jawline, techwear"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "24yo Indo-Australian woman, sun-kissed, professional linen"},
        {"name": "Valkyrie", "niche": "Gaming", "seed": 9922881, "dna": "21yo Indo-Japanese pro-gamer, sharp jawline, purple LED reflections, messy bun, esports jersey, neon room background"}
    ]
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM personas")
    for p in personas:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s)",
                  (p['name'], p['niche'], p['dna'], p['seed']))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "SUCCESS"}
