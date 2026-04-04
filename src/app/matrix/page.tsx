'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, 
  Plus, 
  Search, 
  Globe, 
  Camera, 
  Video, 
  ShieldCheck,
  CheckCircle2,
  MoreVertical,
  Dna,
  RefreshCcw,
  Zap
} from 'lucide-react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MatrixPage() {
  const { data: personas, isLoading } = useSWR('/api/personas', fetcher)
  const [showAddModal, setShowAddModal] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  
  async function handleSuperSync() {
    setIsSyncing(true)
    await fetch('/api/db-sync')
    mutate('/api/personas')
    setTimeout(() => setIsSyncing(false), 1000)
  }
  
  // Form State
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('AI & Tech')
  const [yt, setYt] = useState('')
  const [ig, setIg] = useState('')
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('')

  async function handleAdd() {
    await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, niche, prompt, youtube_id: yt, insta_id: ig, seed: parseInt(seed) || null })
    })
    mutate('/api/personas')
    setShowAddModal(false)
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Identity Matrix
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Persona <span className="text-zinc-500 italic font-light">Network.</span>
              </h1>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleSuperSync}
                className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
              >
                {isSyncing ? <RefreshCcw className="animate-spin" size={16} /> : <Zap size={16} />}
                Super Sync
              </button>
              <button 
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
              >
                Deploy New Entity <Plus size={16} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[300px] bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personas?.map((persona: any, i: number) => (
                <motion.div
                  key={persona.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/30 border border-white/5 rounded-3xl overflow-hidden group hover:border-white/10 transition-all flex flex-col h-full shadow-2xl"
                >
                  {/* Avatar Preview */}
                  <div className="aspect-[4/5] w-full relative bg-black overflow-hidden border-b border-white/5">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent("Hyper-realistic close up professional portrait, " + persona.prompt + ", visible skin pores, 8k UHD, cinematic lighting")}&width=512&height=640&seed=${persona.seed}&model=flux&nologo=true`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      alt={persona.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 flex gap-2">
                       <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-md">
                          Live Identity
                       </span>
                       <span className="px-2 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-md">
                          Seed Locked
                       </span>
                    </div>
                  </div>

                  <div className="p-8 space-y-6 relative z-10 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-2xl font-bold tracking-tight text-white">{persona.name}</h3>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{persona.niche}</p>
                      </div>
                      <button className="text-zinc-600 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    {/* Vibe & Voice Intelligence */}
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Performance Vibe</p>
                          <p className="text-[10px] font-bold text-zinc-300">
                             {persona.niche === 'AI & Tech' ? 'Sophisticated / Neutral' : 
                              persona.niche === 'Finance' ? 'Aggressive / Authority' : 'Relatable / High-Energy'}
                          </p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Voice Blueprint</p>
                          <p className="text-[10px] font-bold text-zinc-300">Deep / Vocal Fry / 140bpm</p>
                       </div>
                    </div>

                    <p className="text-xs text-zinc-400 font-medium italic line-clamp-2 leading-relaxed opacity-60 flex-1">
                      "{persona.prompt}"
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Video size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{persona.youtube_id || 'unlinked'}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-500">
                          <Camera size={14} />
                          <span className="text-[10px] font-bold uppercase tracking-tight">{persona.insta_id || 'unlinked'}</span>
                        </div>
                      </div>
                      <div className="text-[8px] font-mono text-zinc-700 bg-white/5 px-2 py-1 rounded border border-white/5">
                        S_{persona.seed}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Add Persona Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[2.5rem] p-12 space-y-10 shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white">
                    <Dna size={24} />
                  </div>
                  <h2 className="text-3xl font-bold tracking-tight">Initialize Entity</h2>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <input 
                    placeholder="Entity Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all"
                  />
                  <select 
                    value={niche}
                    onChange={e => setNiche(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-bold appearance-none"
                  >
                    {["AI & Tech", "Finance", "Gaming", "Luxury", "Storytelling"].map(n => (
                      <option key={n} value={n}>{n}</option>
                    ))}
                  </select>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <input 
                    placeholder="YouTube Handle"
                    value={yt}
                    onChange={e => setYt(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all"
                  />
                  <input 
                    placeholder="Instagram Handle"
                    value={ig}
                    onChange={e => setIg(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all"
                  />
                  <input 
                    placeholder="Lock Seed"
                    type="number"
                    value={seed}
                    onChange={e => setSeed(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm font-medium focus:border-white/20 transition-all"
                  />
                </div>

                <textarea 
                  placeholder="Visual DNA Prompt (Flux instructions)..."
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  className="w-full bg-black/50 border border-white/5 rounded-2xl p-6 text-sm font-medium focus:border-white/20 transition-all h-32 resize-none"
                />

                <div className="flex gap-4">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                  >
                    Initialize Matrix Entry
                  </button>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="px-8 py-4 bg-zinc-800 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
