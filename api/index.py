from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import requests
import time
from typing import Optional

load_dotenv()

app = FastAPI()

def get_db_connection():
    url = os.environ.get("POSTGRES_URL") or os.environ.get("DATABASE_URL")
    if not url: return None
    try:
        return psycopg2.connect(url, sslmode='require')
    except: return None

@app.get("/api/health")
async def health():
    return {"status": "Clickbait Labs OS v7.0 - DIRECT LINK ACTIVE", "db": "CONNECTED" if get_db_connection() else "OFFLINE"}

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
async def save_persona(req: Request):
    p = await req.json()
    conn = get_db_connection()
    if not conn: raise HTTPException(status_code=500, detail="Database Offline")
    cur = conn.cursor()
    # Support both new and edit
    pid = p.get('id')
    if pid:
        cur.execute("UPDATE personas SET name=%s, niche=%s, prompt=%s, seed=%s WHERE id=%s", 
                  (p['name'], p['niche'], p['prompt'], p['seed'], pid))
    else:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s) ON CONFLICT (name) DO UPDATE SET niche=EXCLUDED.niche, prompt=EXCLUDED.prompt, seed=EXCLUDED.seed", 
                  (p['name'], p['niche'], p['prompt'], p['seed']))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "success"}

@app.get("/api/factory-reset")
async def factory_reset():
    personas = [
        {"name": "Aura", "niche": "AI & Tech", "seed": 555555, "dna": "Japanese-Brazilian techwear lab"},
        {"name": "Kira", "niche": "Finance", "seed": 7721094, "dna": "Indo-Australian linen office"},
        {"name": "Valkyrie", "niche": "Gaming", "seed": 9922881, "dna": "Indo-Japanese gamer neon room"},
        {"name": "Isla", "niche": "AI & Tech", "seed": 1100229, "dna": "Scottish red-hair tech architect Edinburgh loft"}
    ]
    conn = get_db_connection()
    if not conn: return {"status": "DB_OFFLINE"}
    cur = conn.cursor()
    cur.execute("DELETE FROM personas")
    for p in personas:
        cur.execute("INSERT INTO personas (name, niche, prompt, seed) VALUES (%s,%s,%s,%s)", 
                  (p['name'], p['niche'], p['dna'], p['seed']))
    conn.commit()
    cur.close()
    conn.close()
    return {"status": "SUCCESS"}

# Re-export for Vercel
app = app
