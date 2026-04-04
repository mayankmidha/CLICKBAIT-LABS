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
  RotateCcw,
  Zap,
  Star
} from 'lucide-react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MatrixPage() {
  const { data: personas, isLoading } = useSWR('/api/personas', fetcher)
  const [showAddModal, setShowAddModal] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('AI & Tech')
  const [yt, setYt] = useState('')
  const [ig, setIg] = useState('')
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('555555')

  async function handleAdd() {
    await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, niche, prompt, youtube_id: yt, insta_id: ig, seed: parseInt(seed) })
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
                  Talent Roster
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Identity <span className="text-zinc-500 italic font-light">Matrix.</span>
              </h1>
            </div>

            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
            >
              Sign New Talent <Plus size={16} />
            </button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[400px] bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
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
                  className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-white/10 transition-all flex flex-col shadow-2xl"
                >
                  <div className="aspect-[4/5] w-full relative bg-black overflow-hidden">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent("Hyper-realistic close up professional portrait, " + persona.prompt + ", visible skin pores, 8k UHD, cinematic lighting")}&width=512&height=640&seed=${persona.seed}&model=flux&nologo=true`}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                      alt={persona.name}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent" />
                    <div className="absolute top-6 left-6 flex gap-2">
                       <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full">
                          Ready
                       </span>
                       <span className="px-3 py-1 bg-black/40 backdrop-blur-md border border-white/10 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded-full">
                          Face-Locked
                       </span>
                    </div>
                  </div>

                  <div className="p-10 space-y-6 flex-1 flex flex-col bg-zinc-900/50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight text-white">{persona.name}</h3>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.3em] mt-1">{persona.niche}</p>
                      </div>
                      <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-6 py-4 border-y border-white/5">
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Voice Architecture</p>
                          <p className="text-[10px] font-bold text-zinc-300">Natural / Low-Pitch</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest">Vibe Score</p>
                          <div className="flex gap-0.5 text-amber-500">
                             {[1,2,3,4,5].map(s => <Star key={s} size={8} fill="currentColor" />)}
                          </div>
                       </div>
                    </div>

                    <p className="text-xs text-zinc-500 font-medium italic line-clamp-2 leading-relaxed opacity-60 flex-1 mt-4">
                      "{persona.prompt}"
                    </p>

                    <div className="pt-8 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Video size={14} className="opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Camera size={14} className="opacity-40" />
                          <span className="text-[10px] font-bold uppercase tracking-widest">Active</span>
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-zinc-700 bg-black/50 px-3 py-1 rounded-full border border-white/5">
                        REF_{persona.seed}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

        </div>
      </main>

      {/* Sign New Talent Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden"
            >
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white border border-white/10">
                    <Dna size={28} />
                  </div>
                  <div>
                    <h2 className="text-4xl font-bold tracking-tight">Onboard Talent</h2>
                    <p className="text-zinc-500 text-sm">Initialize a new persistent digital identity.</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Name</label>
                    <input 
                      placeholder="e.g. Aura"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm font-medium focus:border-white/20 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Niche</label>
                    <select 
                      value={niche}
                      onChange={e => setNiche(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm font-bold appearance-none hover:border-white/20 transition-all"
                    >
                      {["AI & Tech", "Finance", "Gaming", "Luxury", "Fitness", "Storytelling"].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Visual DNA / Prompt</label>
                  <textarea 
                    placeholder="Japanese-Brazilian tech minimalist, black turtleneck..."
                    value={prompt}
                    onChange={e => setPrompt(e.target.value)}
                    className="w-full bg-black/50 border border-white/5 rounded-3xl p-6 text-sm font-medium focus:border-white/20 transition-all h-32 resize-none leading-relaxed"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Identity Seed</label>
                    <input 
                      placeholder="e.g. 555555"
                      type="number"
                      value={seed}
                      onChange={e => setSeed(e.target.value)}
                      className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-sm font-mono text-amber-500 focus:border-white/20 transition-all"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                     <p className="text-[10px] text-zinc-600 leading-relaxed italic">
                        This number locks the face. Use the same seed for consistency across all renders.
                     </p>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={handleAdd}
                    className="flex-1 py-5 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-2xl"
                  >
                    Generate & Link Talent
                  </button>
                  <button 
                    onClick={() => setShowAddModal(false)}
                    className="px-10 py-5 bg-zinc-800 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-700 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
