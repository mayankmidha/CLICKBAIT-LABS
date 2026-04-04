'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, Plus, Globe, Camera, Video, ShieldCheck, CheckCircle2, 
  MoreVertical, Dna, RotateCcw, Zap, Trash2, Edit3, Loader2 
} from 'lucide-react'
import useSWR, { mutate } from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function MatrixPage() {
  const { data: personas, isLoading } = useSWR('/api/personas', fetcher)
  const [showModal, setShowModal] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isSyncing, setIsSyncing] = useState(false)
  
  // Form State
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('Gaming')
  const [prompt, setPrompt] = useState('')
  const [seed, setSeed] = useState('555555')

  function openEdit(p: any) {
    setEditingId(p.id)
    setName(p.name)
    setNiche(p.niche || 'Gaming')
    setPrompt(p.prompt)
    setSeed(p.seed.toString())
    setShowModal(true)
  }

  function openNew() {
    setEditingId(null)
    setName('')
    setNiche('Gaming')
    setPrompt('')
    setSeed('555555')
    setShowModal(true)
  }

  async function handleSave() {
    try {
      const res = await fetch('/api/personas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: editingId, 
          name, 
          niche, 
          prompt, 
          seed: parseInt(seed) 
        })
      })
      if (res.ok) {
        mutate('/api/personas')
        setShowModal(false)
      } else {
        const err = await res.json()
        alert(`Error: ${err.detail || 'Failed to save'}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Are you sure? This will delete all projects for this talent.")) return
    await fetch(`/api/personas/${id}`, { method: 'DELETE' })
    mutate('/api/personas')
  }

  async function handleFactoryInit() {
    setIsSyncing(true)
    await fetch('/api/empire-builder')
    mutate('/api/personas')
    setTimeout(() => setIsSyncing(false), 1000)
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12 text-white">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Talent Roster
                </span>
                <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[8px] font-black text-blue-400 uppercase">v2.5 - Valkyrie Active</span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Identity <span className="text-zinc-500 italic font-light">Matrix.</span>
              </h1>
            </div>

            <div className="flex gap-4">
              <button 
                onClick={handleFactoryInit}
                disabled={isSyncing}
                className="flex items-center gap-2 px-6 py-4 bg-zinc-900 border border-white/5 text-zinc-400 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all shadow-xl"
              >
                {isSyncing ? <RotateCcw className="animate-spin" size={16} /> : <Zap size={16} />}
                Factory Init
              </button>
              <button 
                onClick={openNew}
                className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
              >
                Sign New Talent <Plus size={16} />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-pulse">
               {[1,2,3].map(i => <div key={i} className="h-96 bg-white/5 rounded-3xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {personas?.map((persona: any) => (
                <div key={persona.id} className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] overflow-hidden flex flex-col shadow-2xl relative group border-white/10">
                  <div className="aspect-[4/5] w-full relative bg-black overflow-hidden border-b border-white/5">
                    <img 
                      src={`https://image.pollinations.ai/prompt/${encodeURIComponent("Hyper-realistic close up professional portrait, " + persona.prompt + ", female features, high fidelity, 8k")}&width=512&height=640&seed=${persona.seed}&model=flux&nologo=true`}
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
                      alt={persona.name}
                    />
                    <div className="absolute top-6 right-6 flex gap-2">
                       <button onClick={() => openEdit(persona)} className="p-3 bg-black/60 backdrop-blur-md border border-white/10 text-white rounded-full hover:bg-white hover:text-black transition-all">
                          <Edit3 size={16} />
                       </button>
                       <button onClick={() => handleDelete(persona.id)} className="p-3 bg-black/60 backdrop-blur-md border border-white/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  <div className="p-10 space-y-4 bg-zinc-900/50 flex-1 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-3xl font-bold tracking-tight">{persona.name}</h3>
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[8px] font-black uppercase tracking-widest rounded border border-blue-500/20">
                           {persona.niche || 'Gaming'}
                        </span>
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 font-medium italic line-clamp-3 opacity-60 flex-1">"{persona.prompt}"</p>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                       <span className="text-[10px] font-mono text-amber-500/50">S_{persona.seed}</span>
                       <div className="flex gap-2">
                          <ShieldCheck size={14} className="text-emerald-500" />
                          <span className="text-[8px] font-black uppercase text-zinc-600">Gender-Locked</span>
                       </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
            <div className="w-full max-w-2xl bg-zinc-900 border border-white/10 rounded-[3rem] p-12 space-y-10 shadow-2xl relative overflow-hidden">
              <div className="relative z-10 space-y-8">
                <h2 className="text-4xl font-bold tracking-tight">{editingId ? 'Edit' : 'New'} Identity</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Name</label>
                    <input placeholder="e.g. Valkyrie" value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-white focus:border-white/20 transition-all" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Market Niche</label>
                    <select value={niche} onChange={e => setNiche(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-white appearance-none">
                       {["Gaming", "AI & Tech", "Finance", "Luxury", "Fitness", "Reaction"].map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Visual DNA (Prompt)</label>
                  <textarea placeholder="Indo-Japanese pro-gamer..." value={prompt} onChange={e => setPrompt(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-white h-32 focus:border-white/20 transition-all" />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Identity Seed</label>
                  <input placeholder="555555" type="number" value={seed} onChange={e => setSeed(e.target.value)} className="w-full bg-black/50 border border-white/5 rounded-2xl p-5 text-amber-500 font-mono" />
                </div>

                <div className="flex gap-4">
                  <button onClick={handleSave} className="flex-1 py-5 bg-white text-black rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all">Save Identity</button>
                  <button onClick={() => setShowModal(false)} className="px-10 py-5 bg-zinc-800 text-white rounded-2xl hover:bg-zinc-700 transition-all">Cancel</button>
                </div>
              </div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
