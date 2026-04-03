import sqlite3
import os

VAULT_DB = "vault.db"

def init_vault():
    conn = sqlite3.connect(VAULT_DB)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS credentials
                 (persona_id INTEGER PRIMARY KEY, 
                  yt_refresh_token TEXT, 
                  insta_session_id TEXT,
                  last_updated DATETIME DEFAULT CURRENT_TIMESTAMP)''')
    conn.commit()
    conn.close()

def save_credentials(persona_id, yt_token=None, insta_session=None):
    conn = sqlite3.connect(VAULT_DB)
    c = conn.cursor()
    c.execute('''INSERT OR REPLACE INTO credentials (persona_id, yt_refresh_token, insta_session_id) 
                 VALUES (?, ?, ?)''', (persona_id, yt_token, insta_session))
    conn.commit()
    conn.close()

init_vault()
