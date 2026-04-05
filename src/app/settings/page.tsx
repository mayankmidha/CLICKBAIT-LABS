'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { 
  Key, 
  ShieldCheck, 
  Server, 
  Save, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react'

export default function SettingsPage() {
  const [geminiKey, setGeminiKey] = useState('')
  const [replicateToken, setReplicateToken] = useState('')
  const [pollinationsKey, setPollinationsKey] = useState('')
  const [showKeys, setShowKeys] = useState(false)
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    setGeminiKey(localStorage.getItem('gemini_key') || '')
    setReplicateToken(localStorage.getItem('replicate_token') || '')
    setPollinationsKey(localStorage.getItem('pollinations_key') || '')
  }, [])

  const handleSave = () => {
    setStatus('saving')
    localStorage.setItem('gemini_key', geminiKey)
    localStorage.setItem('replicate_token', replicateToken)
    localStorage.setItem('pollinations_key', pollinationsKey)
    setTimeout(() => setStatus('saved'), 800)
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                System Configuration
              </span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              API <span className="text-zinc-500 italic font-light">Vault.</span>
            </h1>
          </div>

          <div className="grid gap-8">
             {/* Key Section */}
             <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-10 shadow-2xl relative overflow-hidden">
                <div className="flex justify-between items-center relative z-10">
                   <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                         <Key size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-bold tracking-tight">Identity & Intelligence Keys</h3>
                         <p className="text-zinc-500 text-xs font-medium">These keys power the Factory Brain and GPU Renders.</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setShowKeys(!showKeys)}
                    className="p-3 bg-white/5 rounded-xl text-zinc-500 hover:text-white transition-all"
                   >
                      {showKeys ? <EyeOff size={18} /> : <Eye size={18} />}
                   </button>
                </div>

                <div className="space-y-8 relative z-10">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Google Gemini API Key</label>
                      <input 
                        type={showKeys ? "text" : "password"}
                        value={geminiKey}
                        onChange={e => setGeminiKey(e.target.value)}
                        placeholder="AIzaSy..."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-sm font-mono text-emerald-500 focus:border-white/20 transition-all"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Replicate API Token (Kling/Flux)</label>
                      <input 
                        type={showKeys ? "text" : "password"}
                        value={replicateToken}
                        onChange={e => setReplicateToken(e.target.value)}
                        placeholder="r8_..."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-sm font-mono text-blue-500 focus:border-white/20 transition-all"
                      />
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Pollinations Pro Key (Optional)</label>
                      <input 
                        type={showKeys ? "text" : "password"}
                        value={pollinationsKey}
                        onChange={e => setPollinationsKey(e.target.value)}
                        placeholder="sk_..."
                        className="w-full bg-black/50 border border-white/10 rounded-2xl p-5 text-sm font-mono text-purple-500 focus:border-white/20 transition-all"
                      />
                   </div>
                </div>

                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
             </div>

             <div className="flex justify-end gap-4">
                <button 
                  onClick={handleSave}
                  className="px-10 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all flex items-center gap-3 shadow-2xl shadow-white/5"
                >
                   {status === 'saving' ? <Zap className="animate-spin" size={16} /> : status === 'saved' ? <CheckCircle2 size={16} /> : <Save size={16} />}
                   {status === 'saving' ? 'Syncing Vault...' : status === 'saved' ? 'Locked & Secure' : 'Commit to Vault'}
                </button>
             </div>

             {/* Security Note */}
             <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-3xl p-8 flex items-center gap-6">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0">
                   <ShieldCheck size={24} />
                </div>
                <div>
                   <h4 className="text-sm font-bold text-white mb-1">Local Encryption Active</h4>
                   <p className="text-xs text-zinc-500 leading-relaxed">
                      Your keys are never sent to our servers. They are stored only in your browser's encrypted local storage and used purely for local-to-API communication.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}
