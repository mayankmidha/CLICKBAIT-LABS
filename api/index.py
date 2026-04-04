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
        
        # 1. Personas Table (DYNAMIC)
        cur.execute('''CREATE TABLE IF NOT EXISTS personas
                     (id SERIAL PRIMARY KEY, 
                      name TEXT NOT NULL UNIQUE, 
                      niche TEXT, 
                      prompt TEXT,
                      seed BIGINT DEFAULT 555555)''')
        
        # 2. Projects Table
        cur.execute('''CREATE TABLE IF NOT EXISTS projects
                     (id SERIAL PRIMARY KEY, 
                      persona_id INTEGER REFERENCES personas(id) ON DELETE CASCADE, 
                      title TEXT, 
                      topic TEXT, 
                      research_content TEXT,
                      script TEXT,
                      status TEXT DEFAULT 'DRAFT',
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)''')
        
        # 3. Renders Table
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

# --- API Endpoints ---

@app.get("/api/personas")
async def get_personas():
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT * FROM personas ORDER BY id DESC")
        rows = cur.fetchall()
        cur.close()
        conn.close()
        return rows
    except Exception as e:
        print(f"Fetch Error: {e}")
        return []

@app.post("/api/personas")
async def save_persona(p: PersonaCreate):
    try:
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
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/api/personas/{id}")
async def delete_persona(id: int):
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute("DELETE FROM personas WHERE id = %s", (id,))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "deleted"}

@app.get("/api/empire-builder")
async def empire_builder():
    """Initializes the base factory roster with hard-coded Valkyrie."""
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "26yo Japanese-Brazilian woman, sharp jawline, techwear"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "24yo Indo-Australian woman, sun-kissed, professional linen"},
        {"name": "Elara", "niche": "Luxury", "seed": 338812, "dna": "28yo Indo-French woman, chic bob, silk blouse"},
        {
            "name": "Valkyrie", 
            "niche": "Gaming", 
            "seed": 9922881, 
            "dna": "21yo Indo-Japanese pro-gamer, sharp jawline, purple LED reflections, raven-black hair with neon-purple streaks, messy high bun, matte-black esports jersey, white noise-canceling headphones, neon-lit gaming room background"
        }
    ]
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        for p in personas:
            cur.execute("""INSERT INTO personas (name, niche, prompt, seed) 
                         VALUES (%s,%s,%s,%s) ON CONFLICT (name) DO UPDATE 
                         SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed""",
                      (p['name'], p['niche'], p['dna'], p['seed']))
        conn.commit()
        cur.close()
        conn.close()
        return {"status": "SUCCESS"}
    except Exception as e:
        return {"status": "ERROR", "error": str(e)}
