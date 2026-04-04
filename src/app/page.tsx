'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { Zap, Loader2, ArrowRight, RotateCcw, CheckCircle2, AlertTriangle } from 'lucide-react'
import { useRouter } from 'next/navigation'

const PERSONAS = [
  { 
    name: 'Aura',  
    niche: 'AI & Tech', 
    seed: 555555,  
    dna: 'Japanese-Brazilian tech minimalist, black turtleneck, lab background', 
    topic: 'Why your GPU is about to become obsolete',
    color: 'from-blue-500/20 to-blue-500/5',   
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
  },
  { 
    name: 'Kira',  
    niche: 'Finance',   
    seed: 7721094, 
    dna: 'Indo-Australian wealth strategist, Sydney coastal office, professional linen', 
    topic: 'The secret inflation hedge the 1% are using',
    color: 'from-emerald-500/20 to-emerald-500/5', 
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
  },
  { 
    name: 'Elara', 
    niche: 'Luxury',    
    seed: 338812,  
    dna: 'Indo-French fashion visionary, Paris studio, silk and structured style', 
    topic: 'Why quiet luxury is dying in 2026',
    color: 'from-amber-500/20 to-amber-500/5',  
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
  },
  { 
    name: 'Maya',  
    niche: 'Fitness',   
    seed: 992211,  
    dna: 'Scandinavian-Indian biohacker, minimalist gym, focused and athletic', 
    topic: '3 biohacks to double your energy in 24 hours',
    color: 'from-rose-500/20 to-rose-500/5',    
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
  },
  { 
    name: 'Luna',  
    niche: 'Gaming',    
    seed: 445566,  
    dna: 'American-Indian pro-gamer, neon cyberpunk setup, high-energy', 
    topic: 'The game that will kill the open world genre',
    color: 'from-purple-500/20 to-purple-500/5', 
    badge: 'bg-purple-500/10 text-purple-400 border-purple-500/20' 
  },
]

type ScriptState = { text: string; loading: boolean; source?: string }

export default function OverviewPage() {
  const router = useRouter()
  const [scripts, setScripts]       = useState<Record<string, ScriptState>>({})
  const [generatingAll, setGeneratingAll] = useState(false)

  async function generateScript(persona: typeof PERSONAS[0]) {
    const { name, niche, dna, topic } = persona
    setScripts(prev => ({ ...prev, [name]: { text: '', loading: true } }))
    try {
      const res = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: topic, 
          niche, 
          style: 'Aggressive Viral',
          persona_name: name,
          persona_dna: dna
        }),
      })
      const data = await res.json()
      setScripts(prev => ({ ...prev, [name]: { text: data.script || 'Generation failed.', loading: false, source: data.source } }))
    } catch {
      setScripts(prev => ({ ...prev, [name]: { text: 'Network error — try again.', loading: false } }))
    }
  }

  async function generateAll() {
    setGeneratingAll(true)
    for (const p of PERSONAS) {
      await generateScript(p)
    }
    setGeneratingAll(false)
  }

  function openStudio(persona: typeof PERSONAS[0]) {
    localStorage.setItem('studio_persona', persona.name)
    localStorage.setItem('studio_script', scripts[persona.name]?.text || '')
    router.push('/studio')
  }

  const doneCount = Object.values(scripts).filter(s => !s.loading && s.text).length

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Clickbait Labs · Command Center</p>
              <h1 className="text-5xl font-bold tracking-tighter">Empire Builder</h1>
              <p className="text-zinc-500 text-sm">5 AI personas · Generate scripts · Render in Studio</p>
            </div>

            <button
              onClick={generateAll}
              disabled={generatingAll}
              className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-all disabled:opacity-40"
            >
              {generatingAll
                ? <><Loader2 size={14} className="animate-spin" /> Generating {doneCount}/5</>
                : <><Zap size={14} className="fill-black" /> Generate All Scripts</>
              }
            </button>
          </div>

          {/* Persona Grid */}
          <div className="grid grid-cols-1 gap-4">
            {PERSONAS.map((persona, i) => {
              const s = scripts[persona.name]
              const hasScript = s && !s.loading && s.text
              const isLoading = s?.loading

              return (
                <motion.div
                  key={persona.name}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-zinc-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-colors"
                >
                  <div className="p-6 flex items-start gap-6">
                    {/* Avatar placeholder */}
                    <div className={`shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${persona.color} flex items-center justify-center text-lg font-bold`}>
                      {persona.name[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-base font-bold">{persona.name}</h3>
                        <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${persona.badge}`}>
                          {persona.niche}
                        </span>
                        {s?.source === 'template' && (
                          <span className="flex items-center gap-1 text-[9px] text-amber-500 font-bold">
                            <AlertTriangle size={9} /> Sample script (AI unavailable)
                          </span>
                        )}
                        {hasScript && s?.source !== 'template' && (
                          <span className="flex items-center gap-1 text-[9px] text-emerald-500 font-bold">
                            <CheckCircle2 size={9} /> Script ready
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-600 italic">{persona.dna}</p>
                    </div>

                    {/* Actions */}
                    <div className="shrink-0 flex gap-3">
                      <button
                        onClick={() => generateScript(persona)}
                        disabled={isLoading}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:border-white/20 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-40"
                      >
                        {isLoading ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                        {isLoading ? 'Writing...' : hasScript ? 'Retry' : 'Generate'}
                      </button>

                      <button
                        onClick={() => openStudio(persona)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                      >
                        Studio <ArrowRight size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Script Output */}
                  {isLoading && (
                    <div className="border-t border-white/5 px-6 py-4 flex items-center gap-3 text-zinc-600">
                      <Loader2 size={12} className="animate-spin" />
                      <span className="text-xs font-medium">Generating script via AI...</span>
                    </div>
                  )}

                  {hasScript && (
                    <div className="border-t border-white/5 px-6 py-5">
                      <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-line">{s.text}</p>
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>

          {doneCount > 0 && !generatingAll && (
            <p className="text-xs text-zinc-600 text-center">
              {doneCount}/5 scripts ready · Click <strong className="text-white">Studio →</strong> on any card to render the image
            </p>
          )}
        </div>
      </main>
    </div>
  )
}
