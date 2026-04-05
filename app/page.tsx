'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function ClickbaitLabsOS() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('floor')
  const [activeProjectId, setActiveProjectId] = useState(null)
  
  const { data: projects } = useSWR('/api/projects', fetcher)
  const { data: personas } = useSWR('/api/personas', fetcher)

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('access') === 'true') setIsAuthenticated(true)
  }, [])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === 'admin123') {
      localStorage.setItem('access', 'true')
      setIsAuthenticated(true)
    } else {
      alert("Invalid Code")
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '350px', backgroundColor: '#111', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #222' }}>
          <h1 style={{ letterSpacing: '2px', fontSize: '18px', marginBottom: '30px' }}>FACTORY VAULT</h1>
          <form onSubmit={handleLogin}>
            <input type="password" placeholder="Access Code" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '8px', textAlign: 'center' }} />
            <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#fff', color: '#000', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer' }}>ENTER STUDIO</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <aside style={{ width: '220px', borderRight: '1px solid #222', padding: '25px' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 'bold', marginBottom: '40px' }}>CLICKBAIT LABS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button onClick={() => setTab('floor')} style={{ textAlign: 'left', background: tab === 'floor' ? '#111' : 'none', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>FACTORY FLOOR</button>
          <button onClick={() => setTab('matrix')} style={{ textAlign: 'left', background: tab === 'matrix' ? '#111' : 'none', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>IDENTITY MATRIX</button>
          <button onClick={() => setTab('settings')} style={{ textAlign: 'left', background: tab === 'settings' ? '#111' : 'none', border: 'none', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>SETTINGS</button>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '50px' }}>
        {tab === 'floor' && (
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '30px' }}>Active Projects.</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {projects?.map((p: any) => (
                <div key={p.id} style={{ padding: '25px', backgroundColor: '#111', borderRadius: '20px', border: '1px solid #222' }}>
                  <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{p.title}</span>
                  <p style={{ color: '#555', fontSize: '11px' }}>{p.persona_name} • {p.status}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'matrix' && (
          <div>
            <h1 style={{ fontSize: '40px', fontWeight: 'bold', marginBottom: '30px' }}>Talent Roster.</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '25px' }}>
              {personas?.map((p: any) => (
                <div key={p.id} style={{ backgroundColor: '#111', borderRadius: '20px', border: '1px solid #222', overflow: 'hidden' }}>
                  <div style={{ height: '220px', backgroundColor: '#000' }}>
                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(p.prompt)}&width=512&height=512&seed=${p.seed}&model=flux`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <p style={{ fontWeight: 'bold', margin: 0 }}>{p.name}</p>
                    <p style={{ color: '#555', fontSize: '10px' }}>{p.niche}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div>
            <h1>Settings</h1>
            <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '15px 30px', backgroundColor: '#200', color: '#f55', borderRadius: '12px', border: 'none', cursor: 'pointer' }}>Reset Session</button>
          </div>
        )}
      </main>
    </div>
  )
}
