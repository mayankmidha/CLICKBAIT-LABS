'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldAlert, Zap, Loader2, ChevronRight } from 'lucide-react'

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const auth = localStorage.getItem('factory_access')
    if (auth === 'granted') {
      setIsAuthenticated(true)
    }
    setIsChecking(false)
  }, [])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // You can change this 'admin123' to whatever you want
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
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px]" />
           <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-zinc-900/50 border border-white/10 rounded-[2.5rem] p-12 space-y-10 backdrop-blur-3xl relative z-10 shadow-2xl"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center mx-auto shadow-2xl shadow-white/5">
               <Lock className="text-black" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tighter uppercase tracking-[0.1em]">Factory Vault</h1>
              <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-2">Authorization Required</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
               <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Access Code</label>
               <input 
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                autoFocus
                className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-2xl p-5 text-center text-xl font-mono focus:border-white/20 transition-all outline-none`}
                placeholder="••••••••"
               />
            </div>

            <button 
              type="submit"
              className="w-full py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
            >
              Enter Studio <ChevronRight size={16} />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 pt-4 opacity-30">
             <ShieldAlert size={12} />
             <span className="text-[8px] font-black uppercase tracking-tighter">Encrypted Session Layer Active</span>
          </div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
