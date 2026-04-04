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

class ImageGenRequest(BaseModel):
    persona_name: str
    prompt_override: Optional[str] = None
    seed: Optional[int] = 555555

# --- API Endpoints ---

@app.get("/api/health")
async def health():
    return {"status": "Clickbait Labs OS v3.0 - FORCE RESET ACTIVE"}

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

@app.delete("/api/personas/{id}")
async def delete_persona(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM personas WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "deleted"}

@app.get("/api/factory-reset")
async def factory_reset():
    """Nuclear option: Clears and re-populates the entire roster including Valkyrie."""
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "26yo Japanese-Brazilian woman, sharp jawline, techwear"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "24yo Indo-Australian woman, sun-kissed, professional linen"},
        {"name": "Elara", "niche": "Luxury", "seed": 338812, "dna": "28yo Indo-French woman, chic bob, silk blouse"},
        {"name": "Maya", "niche": "Fitness", "seed": 992211, "dna": "25yo Scandinavian-Indian woman, athletic build"},
        {"name": "Luna", "niche": "Gaming", "seed": 445566, "dna": "22yo American-Indian woman, headset, neon"},
        {
            "name": "Valkyrie", 
            "niche": "Gaming", 
            "seed": 9922881, 
            "dna": "21yo Indo-Japanese pro-gamer, sharp jawline, purple LED reflections, raven-black hair with neon-purple streaks, messy high bun, matte-black esports jersey, white noise-canceling headphones, neon-lit gaming room background"
        }
    ]
    conn = get_db_connection()
    cur = conn.cursor()
    # Nuclear clear
    cur.execute("DELETE FROM personas")
    for p in personas:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s)",
                  (p['name'], p['niche'], p['dna'], p['seed']))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "FACTORY_RESET_SUCCESS", "new_count": len(personas)}

@app.post("/api/generate-image")
async def generate_image(req: ImageGenRequest):
    prefix = "Hyper-realistic 8k UHD raw photo of a beautiful WOMAN, highly detailed feminine facial features, "
    suffix = ", visible skin pores, natural skin texture, 35mm lens, f/1.8, cinematic studio lighting, sharp focus, masterpiece, no facial hair, no male traits."
    full_prompt = f"{prefix}{req.prompt_override}{suffix}"
    encoded = requests.utils.quote(full_prompt)
    image_url = f"https://image.pollinations.ai/prompt/{encoded}?width=1024&height=1792&model=flux&seed={req.seed}&nologo=true"
    return {"url": image_url}
