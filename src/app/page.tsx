'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, ArrowRight, CheckCircle2, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NICHES: Record<string, string> = {
  'AI & Tech': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Finance': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Luxury': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Fitness': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Gaming': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

type Persona = {
  name: string
  niche: string
  dna: string
  script?: string
  loading?: boolean
}

type Phase = 'idle' | 'building' | 'done'

export default function OverviewPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('idle')
  const [personas, setPersonas] = useState<Persona[]>([])
  const [statusMsg, setStatusMsg] = useState('')

  async function runAutopilot() {
    setPhase('building')
    setPersonas([])
    setStatusMsg('Initializing personas...')

    // Step 1: Create all 5 personas
    let entities: Persona[] = []
    try {
      const res = await fetch('/api/empire-builder')
      const data = await res.json()
      entities = data.entities || []
      // Show all 5 immediately as loading
      setPersonas(entities.map((e: Persona) => ({ ...e, loading: true })))
      setStatusMsg('Generating scripts...')
    } catch {
      setStatusMsg('Connection error. Try again.')
      setPhase('idle')
      return
    }

    // Step 2: Generate a script for each persona one by one
    const filled: Persona[] = []
    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i]
      let script = ''
      try {
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: `Viral debut for ${ent.name}`,
            niche: ent.niche,
            style: 'Aggressive Viral',
          }),
        })
        const data = await res.json()
        script = data.script || 'Script unavailable — check your Gemini API key.'
      } catch {
        script = 'Script unavailable — check your Gemini API key.'
      }
      filled.push({ ...ent, script, loading: false })
      setPersonas([...filled, ...entities.slice(i + 1).map((e: Persona) => ({ ...e, loading: true }))])
    }

    setStatusMsg('All 5 personas ready.')
    setPhase('done')
  }

  function openInStudio(persona: Persona) {
    localStorage.setItem('studio_persona', persona.name)
    localStorage.setItem('studio_script', persona.script || '')
    router.push('/studio')
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl mx-auto space-y-16">

          {/* Header */}
          <div className="space-y-3">
            <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Command Center
            </span>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              Empire <span className="text-zinc-500 italic font-light">Builder.</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium">
              One click — 5 AI personas, 5 viral scripts, ready to render in Studio.
            </p>
          </div>

          {/* Step indicators */}
          <div className="flex items-center gap-4">
            {['Create 5 Personas', 'Generate 5 Scripts', 'Render in Studio'].map((label, i) => {
              const active = (i === 0 && phase !== 'idle') || (i === 1 && phase !== 'idle') || (i === 2 && phase === 'done')
              const done = (i === 0 && phase !== 'idle') || (i === 1 && phase === 'done') || (i === 2 && false)
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                    active ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-500 border-white/10'
                  }`}>
                    {done && phase === 'done' && i < 2
                      ? <CheckCircle2 size={12} />
                      : <span>{i + 1}</span>
                    }
                    {label}
                  </div>
                  {i < 2 && <div className="w-8 h-px bg-white/10" />}
                </div>
              )
            })}
          </div>

          {/* CTA — only when idle */}
          {phase === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={runAutopilot}
                className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.15em] hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 group"
              >
                <Zap size={18} className="fill-black group-hover:scale-110 transition-transform" />
                Run Empire Autopilot
              </button>
            </motion.div>
          )}

          {/* Building / Done — persona cards */}
          {(phase === 'building' || phase === 'done') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  {statusMsg}
                </h2>
                {phase === 'done' && (
                  <button
                    onClick={runAutopilot}
                    className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                  >
                    Regenerate
                  </button>
                )}
              </div>

              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {personas.map((persona, i) => (
                    <motion.div
                      key={persona.name}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 flex items-start gap-6 group hover:border-white/10 transition-colors"
                    >
                      {/* Left: persona info */}
                      <div className="flex-1 space-y-3 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="text-lg font-bold tracking-tight">{persona.name}</h3>
                          <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${NICHES[persona.niche] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                            {persona.niche}
                          </span>
                        </div>

                        {persona.loading ? (
                          <div className="flex items-center gap-2 text-zinc-600">
                            <Loader2 size={12} className="animate-spin" />
                            <span className="text-[10px] font-medium">Generating script...</span>
                          </div>
                        ) : (
                          <p className="text-sm text-zinc-400 leading-relaxed line-clamp-2 italic">
                            {persona.script}
                          </p>
                        )}
                      </div>

                      {/* Right: Open in Studio */}
                      {!persona.loading && (
                        <button
                          onClick={() => openInStudio(persona)}
                          className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all opacity-0 group-hover:opacity-100"
                        >
                          Open in Studio <ArrowRight size={12} />
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Bottom CTA when all done */}
              {phase === 'done' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="pt-4 flex items-center gap-4"
                >
                  <div className="flex items-center gap-2 text-emerald-500">
                    <CheckCircle2 size={16} />
                    <span className="text-xs font-bold">5 personas ready</span>
                  </div>
                  <span className="text-zinc-700 text-xs">•</span>
                  <p className="text-zinc-500 text-xs">Hover any card and click <strong className="text-white">Open in Studio</strong> to generate the image.</p>
                </motion.div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
