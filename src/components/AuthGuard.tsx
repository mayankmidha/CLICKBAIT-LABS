'use client'

import { useState, useEffect } from 'react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem('factory_access')
      if (auth === 'granted') {
        setIsAuthenticated(true)
      }
    }
    setIsChecking(false)
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

  if (isChecking) return null

  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '400px', backgroundColor: '#111', border: '1px solid #333', borderRadius: '24px', padding: '40px', textAlign: 'center' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>FACTORY VAULT</h1>
          <form onSubmit={handleLogin}>
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '15px', backgroundColor: '#000', border: '1px solid #333', borderRadius: '12px', color: '#fff', textAlign: 'center', marginBottom: '20px' }}
              placeholder="Access Code"
            />
            <button 
              type="submit"
              style={{ width: '100%', padding: '15px', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              ENTER STUDIO
            </button>
          </form>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
