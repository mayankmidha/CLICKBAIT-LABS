'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function UnifiedStudio() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [tab, setTab] = useState('factory')
  const [isBuilding, setIsBuilding] = useState(false)
  
  const { data: projects, isLoading: projectsLoading } = useSWR('/api/projects', fetcher)
  const { data: personas, isLoading: personasLoading } = useSWR('/api/personas', fetcher)

  useEffect(() => {
    if (localStorage.getItem('factory_access') === 'granted') setIsAuthenticated(true)
  }, [])

  const handleLogin = (e: any) => {
    e.preventDefault()
    if (password === 'admin123') {
      localStorage.setItem('factory_access', 'granted')
      setIsAuthenticated(true)
    } else {
      alert("Invalid Access Code")
    }
  }

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', padding: '40px', borderRadius: '24px', textAlign: 'center', border: '1px solid #333' }}>
          <h1 style={{ letterSpacing: '2px', fontSize: '20px', marginBottom: '30px' }}>FACTORY VAULT</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="password" 
              placeholder="Access Code" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              style={{ width: '100%', padding: '15px', marginBottom: '20px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', textAlign: 'center', borderRadius: '12px' }}
            />
            <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>ENTER STUDIO</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>CLICKBAIT LABS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button onClick={() => setTab('factory')} style={{ textAlign: 'left', background: 'none', border: 'none', color: tab === 'factory' ? '#fff' : '#555', cursor: 'pointer', fontWeight: 'bold' }}>FACTORY FLOOR</button>
          <button onClick={() => setTab('matrix')} style={{ textAlign: 'left', background: 'none', border: 'none', color: tab === 'matrix' ? '#fff' : '#555', cursor: 'pointer', fontWeight: 'bold' }}>TALENT AGENCY</button>
          <button onClick={() => setTab('settings')} style={{ textAlign: 'left', background: 'none', border: 'none', color: tab === 'settings' ? '#fff' : '#555', cursor: 'pointer', fontWeight: 'bold' }}>SETTINGS</button>
        </nav>
      </div>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '60px' }}>
        {tab === 'factory' && (
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '40px' }}>Active Projects.</h1>
            {projectsLoading ? <p>Syncing Neural Link...</p> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {projects?.map((p: any) => (
                  <div key={p.id} style={{ padding: '30px', backgroundColor: '#111', borderRadius: '24px', border: '1px solid #222', display: 'flex', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>{p.title}</h3>
                      <p style={{ color: '#555', fontSize: '12px' }}>{p.persona_name} • {p.status}</p>
                    </div>
                    <button style={{ padding: '10px 20px', backgroundColor: '#222', border: 'none', borderRadius: '10px', color: '#fff' }}>Open</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === 'matrix' && (
          <div>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '40px' }}>Talent Matrix.</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '30px' }}>
              {personas?.map((p: any) => (
                <div key={p.id} style={{ backgroundColor: '#111', borderRadius: '24px', border: '1px solid #222', overflow: 'hidden' }}>
                  <div style={{ height: '200px', backgroundColor: '#000' }}>
                    <img src={`https://image.pollinations.ai/prompt/${encodeURIComponent(p.prompt)}&width=512&height=512&seed=${p.seed}&model=flux`} style={{ width: '100%', height: '100%', objectCover: 'cover' }} />
                  </div>
                  <div style={{ padding: '20px' }}>
                    <h3 style={{ fontWeight: 'bold' }}>{p.name}</h3>
                    <p style={{ color: '#555', fontSize: '10px' }}>{p.niche}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'settings' && (
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '48px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '40px' }}>Settings.</h1>
            <div style={{ backgroundColor: '#111', padding: '40px', borderRadius: '24px', border: '1px solid #222' }}>
              <p style={{ color: '#555', marginBottom: '20px' }}>Your API keys are stored securely in your browser's local storage.</p>
              <button onClick={() => { localStorage.clear(); window.location.reload(); }} style={{ padding: '15px 30px', backgroundColor: '#f00', color: '#fff', borderRadius: '12px', border: 'none', fontWeight: 'bold' }}>Reset Factory Session</button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
