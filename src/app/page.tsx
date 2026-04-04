'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Loader2, ArrowRight, CheckCircle2, Zap, AlertCircle, Activity } from 'lucide-react'
import { useRouter } from 'next/navigation'

const NICHES: Record<string, string> = {
  'AI & Tech': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'Finance':   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Luxury':    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Fitness':   'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'Gaming':    'bg-purple-500/10 text-purple-400 border-purple-500/20',
}

type Persona = { name: string; niche: string; dna?: string; script?: string; loading?: boolean; error?: boolean }
type Phase   = 'idle' | 'building' | 'done'
type Health  = { status: string; services: Record<string, string> } | null

export default function OverviewPage() {
  const router = useRouter()
  const [phase, setPhase]     = useState<Phase>('idle')
  const [personas, setPersonas] = useState<Persona[]>([])
  const [statusMsg, setStatusMsg] = useState('')
  const [health, setHealth]   = useState<Health>(null)
  const [healthLoading, setHealthLoading] = useState(true)

  // Fetch health on load
  useEffect(() => {
    fetch('/api/health')
      .then(r => r.json())
      .then(d => { setHealth(d); setHealthLoading(false) })
      .catch(() => setHealthLoading(false))
  }, [])

  async function runAutopilot() {
    setPhase('building')
    setPersonas([])
    setStatusMsg('Initializing 5 personas...')

    let entities: Persona[] = []
    try {
      const res = await fetch('/api/empire-builder')
      const data = await res.json()
      entities = data.entities || []
      setPersonas(entities.map((e: Persona) => ({ ...e, loading: true })))
      setStatusMsg('Generating scripts — this takes ~30 seconds...')
    } catch {
      setStatusMsg('Failed to reach API. Check deployment.')
      setPhase('idle')
      return
    }

    const filled: Persona[] = []
    for (let i = 0; i < entities.length; i++) {
      const ent = entities[i]
      let script = ''
      let error = false
      try {
        const res = await fetch('/api/generate-script', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topic: `Viral debut for ${ent.name}`, niche: ent.niche, style: 'Aggressive Viral' }),
        })
        const data = await res.json()
        if (data.script) {
          script = data.script
        } else {
          script = data.error || 'Generation failed'
          error = true
        }
      } catch (err: any) {
        script = `Network error: ${err?.message}`
        error = true
      }
      filled.push({ ...ent, script, loading: false, error })
      setPersonas([...filled, ...entities.slice(i + 1).map((e: Persona) => ({ ...e, loading: true }))])
    }

    setStatusMsg(filled.some(p => p.error) ? 'Some scripts failed — see cards below.' : 'All 5 personas ready.')
    setPhase('done')
  }

  function openInStudio(persona: Persona) {
    localStorage.setItem('studio_persona', persona.name)
    localStorage.setItem('studio_script', persona.script || '')
    router.push('/studio')
  }

  const healthOk = health?.status === 'ALL_OK'

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-12">
        <div className="max-w-4xl mx-auto space-y-10">

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              Empire <span className="text-zinc-500 italic font-light">Builder.</span>
            </h1>
            <p className="text-zinc-500 text-sm">One click → 5 personas → 5 scripts → render in Studio.</p>
          </div>

          {/* Health Bar */}
          <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-zinc-500" />
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">System Health</span>
              </div>
              {healthLoading ? (
                <Loader2 size={12} className="animate-spin text-zinc-600" />
              ) : (
                <span className={`text-[10px] font-black uppercase tracking-widest ${healthOk ? 'text-emerald-500' : 'text-amber-500'}`}>
                  {health?.status || 'UNKNOWN'}
                </span>
              )}
            </div>
            {health && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(health.services).map(([key, val]) => {
                  const ok = val.startsWith('✓') || val.startsWith('—')
                  return (
                    <div key={key} className="flex items-center gap-2">
                      <span className={`text-[10px] ${ok ? 'text-emerald-500' : 'text-red-400'}`}>
                        {ok ? '●' : '●'}
                      </span>
                      <span className="text-[10px] text-zinc-500 font-mono capitalize">{key.replace(/_/g, ' ')}</span>
                      <span className={`text-[10px] font-bold ml-auto ${ok ? 'text-zinc-400' : 'text-red-400'}`}>{val}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3">
            {['Create 5 Personas', 'Generate Scripts', 'Render in Studio'].map((label, i) => {
              const active = i === 0 ? phase !== 'idle' : i === 1 ? phase !== 'idle' : phase === 'done'
              return (
                <div key={label} className="flex items-center gap-3">
                  <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                    active ? 'bg-white text-black border-white' : 'bg-white/5 text-zinc-600 border-white/5'
                  }`}>
                    <span>{i + 1}</span> {label}
                  </div>
                  {i < 2 && <div className="w-6 h-px bg-white/10" />}
                </div>
              )
            })}
          </div>

          {/* CTA */}
          {phase === 'idle' && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <button
                onClick={runAutopilot}
                className="flex items-center gap-3 px-10 py-5 bg-white text-black rounded-full font-black text-sm uppercase tracking-[0.15em] hover:bg-zinc-100 transition-all shadow-2xl shadow-white/10 group"
              >
                <Zap size={18} className="fill-black group-hover:scale-110 transition-transform" />
                Run Empire Autopilot
              </button>
            </motion.div>
          )}

          {/* Persona Cards */}
          {(phase === 'building' || phase === 'done') && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500 font-medium">{statusMsg}</p>
                {phase === 'done' && (
                  <button onClick={runAutopilot} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">
                    Regenerate
                  </button>
                )}
              </div>

              <AnimatePresence mode="popLayout">
                {personas.map((persona, i) => (
                  <motion.div
                    key={persona.name}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`bg-zinc-900/40 border rounded-2xl p-6 flex items-start gap-6 transition-colors ${
                      persona.error ? 'border-red-500/20' : 'border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className="flex-1 space-y-3 min-w-0">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="text-lg font-bold tracking-tight">{persona.name}</h3>
                        <span className={`px-2.5 py-0.5 text-[9px] font-black uppercase tracking-widest rounded-full border ${NICHES[persona.niche] || 'bg-white/5 text-zinc-400 border-white/10'}`}>
                          {persona.niche}
                        </span>
                        {persona.error && (
                          <span className="flex items-center gap-1 text-[9px] text-red-400 font-bold">
                            <AlertCircle size={10} /> Failed
                          </span>
                        )}
                      </div>

                      {persona.loading ? (
                        <div className="flex items-center gap-2 text-zinc-600">
                          <Loader2 size={12} className="animate-spin" />
                          <span className="text-xs font-medium">Writing script...</span>
                        </div>
                      ) : (
                        <p className={`text-sm leading-relaxed line-clamp-3 ${persona.error ? 'text-red-400/70 font-mono text-xs' : 'text-zinc-400 italic'}`}>
                          {persona.script}
                        </p>
                      )}
                    </div>

                    {/* Always-visible Studio button */}
                    {!persona.loading && !persona.error && (
                      <button
                        onClick={() => openInStudio(persona)}
                        className="shrink-0 flex items-center gap-2 px-5 py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
                      >
                        Studio <ArrowRight size={12} />
                      </button>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {phase === 'done' && !personas.some(p => p.error) && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-zinc-600 pt-2"
                >
                  <CheckCircle2 size={12} className="inline text-emerald-500 mr-1" />
                  All ready — click <strong className="text-white">Studio</strong> on any card to generate the image.
                </motion.p>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
