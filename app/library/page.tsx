'use client'

import { useState } from 'react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function LibraryPage() {
  const { data: assets, isLoading } = useSWR('/api/library', fetcher)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000', color: '#fff', fontFamily: 'sans-serif' }}>
      <div style={{ width: '250px', borderRight: '1px solid #222', padding: '30px' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '40px' }}>CLICKBAIT LABS</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <a href="/" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>FACTORY FLOOR</a>
          <a href="/matrix" style={{ color: '#555', textDecoration: 'none', fontWeight: 'bold' }}>TALENT AGENCY</a>
          <a href="/library" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>ASSET LIBRARY</a>
        </nav>
      </div>

      <main style={{ flex: 1, padding: '60px' }}>
        <h1 style={{ fontSize: '64px', fontWeight: 'bold', letterSpacing: '-2px', marginBottom: '60px' }}>Archives.</h1>
        
        {isLoading ? <p>Loading archives...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px' }}>
            {assets?.map((a: any) => (
              <div key={a.id} style={{ aspectRatio: '9/16', backgroundColor: '#111', borderRadius: '16px', overflow: 'hidden', border: '1px solid #222', position: 'relative' }}>
                {a.type === 'image' ? (
                  <img src={a.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <video src={a.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                )}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '15px', background: 'linear-gradient(transparent, rgba(0,0,0,0.8))' }}>
                   <p style={{ fontSize: '10px', fontWeight: 'bold' }}>{a.persona_name}</p>
                   <a href={a.url} download style={{ fontSize: '10px', color: '#00f', textDecoration: 'none' }}>Download</a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
