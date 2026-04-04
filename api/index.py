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
                      replicate_id TEXT,
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
class ActionRequest(BaseModel):
    project_id: int

# --- API Endpoints ---

@app.get("/api/health")
async def health():
    return {"status": "Clickbait Labs OS v6.0 - FLUX 1.1 PRO ACTIVE"}

@app.get("/api/personas")
async def get_personas():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT * FROM personas ORDER BY id DESC")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows

@app.get("/api/projects/{id}")
async def get_project(id: int):
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("SELECT p.*, per.name as persona_name, per.prompt as persona_prompt, per.seed as persona_seed FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s", (id,))
    project = cur.fetchone()
    if not project: raise HTTPException(status_code=404, detail="Project not found")
    
    cur.execute("SELECT * FROM renders WHERE project_id = %s ORDER BY created_at DESC", (id,))
    renders = cur.fetchall()
    
    # Background Sync for Processing Renders
    token = os.getenv("REPLICATE_API_TOKEN")
    if token:
        for r in renders:
            if r['status'] == 'PROCESSING' and r['replicate_id']:
                rep_res = requests.get(f"https://api.replicate.com/v1/predictions/{r['replicate_id']}", 
                                     headers={"Authorization": f"Token {token}"})
                if rep_res.status_code == 200:
                    data = rep_res.json()
                    if data['status'] == 'succeeded':
                        cur.execute("UPDATE renders SET url = %s, status = 'READY' WHERE id = %s", (data['output'], r['id']))
                        r['url'] = data['output']
                        r['status'] = 'READY'
                    elif data['status'] == 'failed':
                        cur.execute("UPDATE renders SET status = 'FAILED' WHERE id = %s", (r['id'],))
                        r['status'] = 'FAILED'
    
    conn.commit()
    cur.close()
    conn.close()
    return {**project, "renders": renders}

@app.post("/api/render-image")
async def run_visualizer(req: ActionRequest):
    id = req.project_id
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token: raise HTTPException(status_code=401, detail="REPLICATE_API_TOKEN missing")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT per.prompt, per.seed, p.script 
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id,))
    data = cur.fetchone()
    
    # UNCOMFORTABLE REALISM PROMPT
    prefix = "A hyper-realistic 4MP raw portrait, authentic film photography, 35mm lens, f/1.8, extremely detailed skin textures, visible pores, natural skin grain, subtle imperfections, real-life person, "
    suffix = ", direct eye contact, cinematic lighting, masterpiece, shot on Kodak Portra 400."
    prompt = f"{prefix}{data[0]}, {data[2][:50] if data[2] else ''}{suffix}"

    # Call Replicate Flux 1.1 Pro
    rep_res = requests.post(
        "https://api.replicate.com/v1/models/black-forest-labs/flux-1.1-pro/predictions",
        headers={"Authorization": f"Token {token}", "Content-Type": "application/json"},
        json={
            "input": {
                "prompt": prompt,
                "aspect_ratio": "9:16",
                "output_format": "jpg",
                "output_quality": 100
            }
        }
    )
    
    if rep_res.status_code != 201:
        raise HTTPException(status_code=rep_res.status_code, detail=rep_res.text)
    
    prediction = rep_res.json()
    # Portraits take ~5s, we poll once immediately
    time.sleep(5)
    final_res = requests.get(f"https://api.replicate.com/v1/predictions/{prediction['id']}", 
                           headers={"Authorization": f"Token {token}"})
    
    url = final_res.json().get('output') or "https://via.placeholder.com/1024x1792?text=Processing..."
    
    cur.execute("INSERT INTO renders (project_id, url, type, status) VALUES (%s, %s, 'image', 'READY')", (id, url))
    cur.execute("UPDATE projects SET status = 'VISUALIZED' WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"url": url}

@app.post("/api/render-video")
async def run_animator(req: ActionRequest):
    id = req.project_id
    token = os.getenv("REPLICATE_API_TOKEN")
    if not token: raise HTTPException(status_code=401, detail="REPLICATE_API_TOKEN missing")
    
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("""SELECT per.name, per.prompt, (SELECT url FROM renders WHERE project_id = %s AND type='image' ORDER BY id DESC LIMIT 1)
                 FROM projects p JOIN personas per ON p.persona_id = per.id WHERE p.id = %s""", (id, id))
    data = cur.fetchone()
    
    if not data[2]: raise HTTPException(status_code=400, detail="Render a portrait first.")

    # Call Kling 1.5 Pro (Image-to-Video)
    video_prompt = f"A beautiful woman {data[0]} speaking directly to camera, {data[1][:100]}, hyper-realistic skin, natural movement."
    rep_res = requests.post(
        "https://api.replicate.com/v1/models/kling-ai/kling-v1-5-pro/predictions",
        headers={"Authorization": f"Token {token}", "Content-Type": "application/json"},
        json={
            "input": {
                "prompt": video_prompt,
                "start_image": data[2],
                "aspect_ratio": "9:16",
                "duration": 5
            }
        }
    )
    
    prediction = rep_res.json()
    cur.execute("INSERT INTO renders (project_id, url, type, status, replicate_id) VALUES (%s, %s, 'video', 'PROCESSING', %s)", 
              (id, data[2], prediction['id']))
    cur.execute("UPDATE projects SET status = 'RENDERED' WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "PROCESSING"}

@app.get("/api/factory-reset")
async def factory_reset():
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "Japanese-Brazilian woman, sharp jawline, messy bun, techwear"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "Indo-Australian woman, sun-kissed skin, wavy hair, professional linen"},
        {"name": "Valkyrie", "niche": "Gaming", "seed": 9922881, "dna": "Indo-Japanese gamer, messy bun, purple streaks, gaming jersey"}
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

@app.get("/api/library")
async def get_global_library():
    conn = get_db_connection()
    cur = conn.cursor(cursor_factory=RealDictCursor)
    cur.execute("""SELECT r.*, p.title as project_title, per.name as persona_name 
                 FROM renders r 
                 JOIN projects p ON r.project_id = p.id 
                 JOIN personas per ON p.persona_id = per.id 
                 ORDER BY r.created_at DESC""")
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return rows
