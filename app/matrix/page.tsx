'use client'

import { useState, useEffect } from 'react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MatrixPage() {
  const { data: personas, isLoading } = useSWR('/api/personas', fetcher)
  const [isSyncing, setIsSyncing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('Gaming')
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('555555')

  async function handleFactoryReset() {
    setIsSyncing(true)
    await fetch('/api/factory-reset')
    mutate('/api/personas')
    setTimeout(() => setIsSyncing(false), 1000)
  }

  async function handleSave() {
    await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, niche, prompt, seed: parseInt(seed) })
    })
    mutate('/api/personas')
    setShowModal(false)
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      {/* Sidebar Placeholder */}
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>CLICKBAIT LABS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>FACTORY FLOOR</a>
          <a href="/matrix" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>TALENT AGENCY</a>
          <a href="/library" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>ASSET LIBRARY</a>
        </nav>
      </div>

      <main style={{ flex: 1, padding: '60px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
          <div>
            <p style={{ color: '#555', fontSize: '10px', fontWeight: 'bold', letterSpacing: '2px', marginBottom: '10px' }}>TALENT ROSTER v3.0</p>
            <h1 style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '-2px', margin: 0 }}>Identity Matrix.</h1>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button onClick={handleFactoryReset} style={{ padding: '15px 30px', backgroundColor: '#111', border: '1px solid #333', color: '#fff', borderRadius: '12px', fontWeight: 'bold' }}>
              {isSyncing ? 'Syncing...' : 'Factory Init'}
            </button>
            <button onClick={() => setShowModal(true)} style={{ padding: '15px 30px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>
              Sign New Talent
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '40px' }}>
          {personas?.map((p: any) => (
            <div key={p.id} style={{ backgroundColor: '#111', borderRadius: '32px', border: '1px solid #222', overflow: 'hidden' }}>
              <div style={{ height: '350px', backgroundColor: '#000' }}>
                <img 
                  src={`https://image.pollinations.ai/prompt/${encodeURIComponent(p.prompt + ", realistic skin, high fidelity")}&width=512&height=640&seed=${p.seed}&model=flux`} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '24px', fontWeight: 'bold' }}>{p.name}</h3>
                <p style={{ color: '#555', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{p.niche}</p>
                <p style={{ color: '#444', fontSize: '10px', marginTop: '20px' }}>SEED: {p.seed}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ width: '100%', maxWidth: '500px', backgroundColor: '#111', padding: '40px', borderRadius: '24px', border: '1px solid #333' }}>
            <h2 style={{ marginBottom: '30px' }}>New Identity</h2>
            <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '12px' }} />
            <textarea placeholder="Visual DNA" value={prompt} onChange={e => setPrompt(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '15px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '12px', height: '100px' }} />
            <input placeholder="Seed" type="number" value={seed} onChange={e => setSeed(e.target.value)} style={{ width: '100%', padding: '15px', marginBottom: '20px', backgroundColor: '#000', border: '1px solid #333', color: '#fff', borderRadius: '12px' }} />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={handleSave} style={{ flex: 1, padding: '15px', backgroundColor: '#fff', color: '#000', borderRadius: '12px', fontWeight: 'bold', border: 'none' }}>Save</button>
              <button onClick={() => setShowModal(false)} style={{ flex: 1, padding: '15px', backgroundColor: '#222', color: '#fff', borderRadius: '12px', border: 'none' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
