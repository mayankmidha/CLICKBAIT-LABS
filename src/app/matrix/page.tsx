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
  Dna
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

  async function handleAdd() {
    await fetch('/api/personas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, niche, prompt, youtube_id: yt, insta_id: ig })
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

            <button 
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
            >
              Deploy New Entity <Plus size={16} />
            </button>
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
                  className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden group hover:border-white/10 transition-colors"
                >
                  <div className="relative z-10 space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-zinc-400">
                        <Users size={28} />
                      </div>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest rounded-full border border-emerald-500/20">
                          Active
                        </span>
                        <button className="text-zinc-600 hover:text-white transition-colors">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-bold tracking-tight">{persona.name}</h3>
                      <p className="text-zinc-500 text-xs font-medium uppercase tracking-[0.2em] mt-1">{persona.niche}</p>
                    </div>

                    <p className="text-sm text-zinc-400 font-display italic line-clamp-2 leading-relaxed">
                      {persona.prompt}
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center gap-6">
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Video size={16} />
                        <span className="text-[10px] font-bold">{persona.youtube_id || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-500">
                        <Camera size={16} />
                        <span className="text-[10px] font-bold">{persona.insta_id || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
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

                <div className="grid md:grid-cols-2 gap-6">
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
