'use client'

import { useState, useEffect, useRef } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Zap, Loader2, Download, RotateCcw, Image as ImageIcon,
  Trash2, Clock, Video, Play
} from 'lucide-react'

const PERSONAS = [
  { name: 'Aura',  niche: 'AI & Tech', seed: 555555  },
  { name: 'Kira',  niche: 'Finance',   seed: 7721094 },
  { name: 'Elara', niche: 'Luxury',    seed: 338812  },
  { name: 'Maya',  niche: 'Fitness',   seed: 992211  },
  { name: 'Luna',  niche: 'Gaming',    seed: 445566  },
]

type RenderMode = 'portrait' | 'video'
type Tab = 'studio' | 'gallery'
type Render = { id: string; persona: string; niche: string; url: string; type: 'portrait' | 'video'; timestamp: string }

const STORAGE_KEY = 'studio_renders'

function loadRenders(): Render[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveRender(r: Omit<Render, 'id' | 'timestamp'>): Render {
  const all = loadRenders()
  const next: Render = { ...r, id: Date.now().toString(), timestamp: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...all].slice(0, 50)))
  return next
}

// Poll Replicate until done or failed
async function pollVideo(jobId: string, onProgress: (msg: string) => void): Promise<string> {
  for (let i = 0; i < 60; i++) {
    await new Promise(r => setTimeout(r, 3000))
    const res = await fetch(`/api/video-status/${jobId}`)
    const data = await res.json()
    if (data.status === 'succeeded' && data.url) return data.url
    if (data.status === 'failed') throw new Error(data.error || 'Video generation failed')
    onProgress(data.status === 'processing' ? `Processing${data.progress ? ` · ${data.progress}` : ''}...` : 'Starting render...')
  }
  throw new Error('Timed out after 3 minutes')
}

export default function StudioPage() {
  const [selected,  setSelected]  = useState('')
  const [script,    setScript]    = useState('')
  const [mode,      setMode]      = useState<RenderMode>('portrait')
  const [tab,       setTab]       = useState<Tab>('studio')
  const [mediaUrl,  setMediaUrl]  = useState('')
  const [loading,   setLoading]   = useState(false)
  const [progress,  setProgress]  = useState('')
  const [error,     setError]     = useState('')
  const [renders,   setRenders]   = useState<Render[]>([])
  const abortRef = useRef(false)

  useEffect(() => {
    const p = localStorage.getItem('studio_persona')
    const s = localStorage.getItem('studio_script')
    if (p) setSelected(p)
    if (s) setScript(s)
    setRenders(loadRenders())
  }, [])

  const persona = PERSONAS.find(p => p.name === selected)

  async function generate() {
    if (!persona) return
    setLoading(true)
    setError('')
    setMediaUrl('')
    setProgress(mode === 'video' ? 'Starting video render...' : 'Generating portrait...')
    abortRef.current = false

    try {
      if (mode === 'portrait') {
        const res = await fetch('/api/generate-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ persona_name: persona.name, seed: persona.seed }),
        })
        const data = await res.json()
        if (!data.url) throw new Error('No URL returned')
        setMediaUrl(data.url)
        const saved = saveRender({ persona: persona.name, niche: persona.niche, url: data.url, type: 'portrait' })
        setRenders(prev => [saved, ...prev])

      } else {
        // Video — start job then poll
        const res = await fetch('/api/generate-video', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            persona_name: persona.name, 
            script,
            image_url: mode === 'video' ? mediaUrl : null // Only if we already have a portrait
          }),
        })
        const data = await res.json()
        if (data.error) throw new Error(data.error)
        const videoUrl = await pollVideo(data.id, msg => { if (!abortRef.current) setProgress(msg) })
        if (abortRef.current) return
        setMediaUrl(videoUrl)
        const saved = saveRender({ persona: persona.name, niche: persona.niche, url: videoUrl, type: 'video' })
        setRenders(prev => [saved, ...prev])
      }
      setProgress('')
    } catch (e: any) {
      setError(e.message)
      setProgress('')
    } finally {
      setLoading(false)
    }
  }

  function cancel() { abortRef.current = true; setLoading(false); setProgress('') }

  function deleteRender(id: string) {
    const updated = renders.filter(r => r.id !== id)
    setRenders(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Clickbait Labs · Visual Studio</p>
              <h1 className="text-5xl font-bold tracking-tighter">Studio</h1>
            </div>
            {/* Tab */}
            <div className="flex bg-zinc-900/60 border border-white/5 rounded-xl p-1 gap-1">
              {(['studio', 'gallery'] as const).map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tab === t ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                  {t === 'gallery' ? `Gallery${renders.length ? ` (${renders.length})` : ''}` : 'Render'}
                </button>
              ))}
            </div>
          </div>

          {/* ── STUDIO TAB ── */}
          {tab === 'studio' && (
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Left */}
              <div className="space-y-5">

                {/* Mode toggle */}
                <div className="flex bg-zinc-900/40 border border-white/5 rounded-xl p-1 gap-1">
                  <button onClick={() => { setMode('portrait'); setMediaUrl(''); setError('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'portrait' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                    <ImageIcon size={12} /> Portrait
                  </button>
                  <button onClick={() => { setMode('video'); setMediaUrl(''); setError('') }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'video' ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'}`}>
                    <Video size={12} /> Video
                  </button>
                </div>

                {/* Persona */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Persona</p>
                  <div className="grid grid-cols-5 gap-2">
                    {PERSONAS.map(p => (
                      <button key={p.name} onClick={() => setSelected(p.name)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase transition-all border ${selected === p.name ? 'bg-white text-black border-white' : 'bg-black/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'}`}>
                        {p.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Script */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Script <span className="text-zinc-700 normal-case font-normal">(used for mood / video dialogue)</span>
                  </p>
                  <textarea value={script} onChange={e => setScript(e.target.value)}
                    placeholder="Paste your script here..."
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 focus:border-white/20 focus:outline-none resize-none h-28 transition-colors" />
                </div>

                {/* Video note */}
                {mode === 'video' && (
                  <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 space-y-1 shadow-lg">
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-400">Elite Video Generation</p>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Powered by <strong className="text-white">Kling 1.5 Pro</strong> via Replicate.
                      Generates 5-second cinematic HD clips. Best-in-class human realism.
                    </p>
                    <p className="text-[10px] text-zinc-600 mt-2">
                      Optimized for <strong className="text-white text-[8px] uppercase tracking-tighter">Human Physics & Weight</strong>.
                    </p>
                  </div>
                )}

                {/* Delivery Vibe */}
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Delivery Vibe</p>
                  <select className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-xs font-bold appearance-none hover:border-white/20 transition-all text-white">
                    <option>Aggressive & Urgent (Beast-Style)</option>
                    <option>Sophisticated & Tech-Minimal</option>
                    <option>Deep & Philosophical</option>
                    <option>High-Status & Luxury</option>
                  </select>
                </div>

                {/* Generate */}
                {loading ? (
                  <div className="space-y-3">
                    <div className="w-full py-4 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center gap-3 text-xs font-bold text-zinc-400">
                      <Loader2 size={16} className="animate-spin" />
                      {progress || 'Rendering...'}
                    </div>
                    {mode === 'video' && (
                      <button onClick={cancel} className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-colors">
                        Cancel
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={generate} disabled={!selected}
                    className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all disabled:opacity-30">
                    {mode === 'portrait'
                      ? <><ImageIcon size={14} /> Render Portrait</>
                      : <><Video size={14} /> Generate Video</>
                    }
                  </button>
                )}

                {error && (
                  <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4">
                    <p className="text-xs text-red-400">{error}</p>
                  </div>
                )}
              </div>

              {/* Right — Preview */}
              <div className="space-y-4">
                <div className="bg-zinc-950 border border-white/5 rounded-2xl aspect-[9/16] flex items-center justify-center overflow-hidden relative">

                  {loading && (
                    <div className="flex flex-col items-center gap-4 text-center px-8">
                      <Loader2 size={32} className="animate-spin text-zinc-600" />
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400">
                          {mode === 'video' ? `Rendering video for ${selected}` : `Generating portrait for ${selected}`}
                        </p>
                        <p className="text-[10px] text-zinc-600">{progress}</p>
                        {mode === 'video' && <p className="text-[10px] text-zinc-700 mt-2">MiniMax · 1–3 min</p>}
                      </div>
                    </div>
                  )}

                  {!loading && !mediaUrl && (
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      {mode === 'video' ? <Video size={40} strokeWidth={1} /> : <ImageIcon size={40} strokeWidth={1} />}
                      <p className="text-xs font-bold uppercase tracking-widest">Production Standby</p>
                    </div>
                  )}

                  {mediaUrl && !loading && mode === 'portrait' && (
                    <motion.img initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      src={mediaUrl} alt={selected}
                      className="w-full h-full object-cover"
                      onError={() => setError('Image failed — try regenerating.')} />
                  )}

                  {mediaUrl && !loading && mode === 'video' && (
                    <motion.video initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      src={mediaUrl} controls autoPlay loop playsInline
                      className="w-full h-full object-cover" />
                  )}
                </div>

                {mediaUrl && !loading && (
                  <div className="flex gap-3">
                    <a href={mediaUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2">
                      <Download size={12} /> {mode === 'video' ? 'Download Video' : 'Download Image'}
                    </a>
                    <button onClick={generate}
                      className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center gap-2">
                      <RotateCcw size={12} /> Retry
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── GALLERY TAB ── */}
          {tab === 'gallery' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-xs text-zinc-500">
                  {renders.length === 0 ? 'No renders yet.' : `${renders.length} render${renders.length !== 1 ? 's' : ''} saved`}
                </p>
                {renders.length > 0 && (
                  <button onClick={() => { setRenders([]); localStorage.removeItem(STORAGE_KEY) }}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-colors">
                    <Trash2 size={11} /> Clear All
                  </button>
                )}
              </div>

              {renders.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl py-24 flex flex-col items-center gap-4 opacity-30">
                  <ImageIcon size={40} strokeWidth={1} />
                  <p className="text-sm font-medium">Renders will appear here after generation</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {renders.map(render => (
                      <motion.div key={render.id}
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                        className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden aspect-[9/16] border border-white/5">

                        {render.type === 'video' ? (
                          <video src={render.url} muted loop playsInline
                            className="w-full h-full object-cover"
                            onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                            onMouseLeave={e => (e.target as HTMLVideoElement).pause()} />
                        ) : (
                          <img src={render.url} alt={render.persona} className="w-full h-full object-cover" />
                        )}

                        {/* Type badge */}
                        <div className="absolute top-3 left-3">
                          <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase ${render.type === 'video' ? 'bg-purple-500/80' : 'bg-blue-500/80'} text-white`}>
                            {render.type === 'video' ? '▶ Video' : '⬛ Portrait'}
                          </span>
                        </div>

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 gap-3">
                          <div>
                            <p className="text-sm font-bold">{render.persona}</p>
                            <div className="flex items-center gap-1 text-zinc-500 mt-0.5">
                              <Clock size={9} />
                              <span className="text-[9px]">{new Date(render.timestamp).toLocaleDateString()} {new Date(render.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <a href={render.url} target="_blank" rel="noopener noreferrer"
                              className="flex-1 py-2 bg-white text-black rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center justify-center gap-1">
                              <Download size={9} /> Save
                            </a>
                            <button onClick={() => deleteRender(render.id)}
                              className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors">
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
