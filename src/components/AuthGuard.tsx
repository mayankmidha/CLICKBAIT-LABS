'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lock, Shield, Zap, ChevronRight } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const auth = typeof window !== 'undefined' ? localStorage.getItem('factory_access') : null
    if (auth === 'granted') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === 'admin123') {
      localStorage.setItem('factory_access', 'granted')
      setIsAuthenticated(true)
      setError(false)
    } else {
      setError(true)
      setTimeout(() => setError(false), 2000)
    }
  }

  if (isChecking) return null

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 font-sans">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-md bg-zinc-900 border border-white/10 rounded-3xl p-12 space-y-10 relative z-10 shadow-2xl"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto">
               <Lock className="text-black" size={32} />
            </div>
            <h1 className="text-3xl font-bold tracking-tighter uppercase">Factory Vault</h1>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <input 
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-black border border-white/10 rounded-2xl p-5 text-center text-white"
              placeholder="Enter Access Code"
            />
            <button 
              type="submit"
              className="w-full py-5 bg-white text-black rounded-2xl font-black uppercase text-xs tracking-widest"
            >
              Enter Studio
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
