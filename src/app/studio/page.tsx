'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Loader2, Download, RotateCcw, Image as ImageIcon, Trash2, Clock } from 'lucide-react'

const PERSONAS = [
  { name: 'Aura',  niche: 'AI & Tech', seed: 555555,  dna: 'Japanese-Brazilian tech minimalist, black turtleneck, minimalist Tokyo tech lab, blue neon ambient glow' },
  { name: 'Kira',  niche: 'Finance',   seed: 7721094, dna: 'Indo-Australian woman, professional linen blazer, Sydney coastal office, golden hour window light' },
  { name: 'Elara', niche: 'Luxury',    seed: 338812,  dna: 'Indo-French woman, silk structured outfit, Parisian atelier, soft editorial lighting' },
  { name: 'Maya',  niche: 'Fitness',   seed: 992211,  dna: 'Scandinavian-Indian woman, athletic wear, minimalist gym, crisp white background' },
  { name: 'Luna',  niche: 'Gaming',    seed: 445566,  dna: 'American-Indian woman, cyberpunk neon setup, RGB lighting, dark gaming room' },
]

type Render = { id: string; persona: string; niche: string; url: string; timestamp: string }

const STORAGE_KEY = 'studio_renders'

function loadRenders(): Render[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}

function saveRender(r: Omit<Render, 'id' | 'timestamp'>) {
  const renders = loadRenders()
  const next: Render = { ...r, id: Date.now().toString(), timestamp: new Date().toISOString() }
  localStorage.setItem(STORAGE_KEY, JSON.stringify([next, ...renders].slice(0, 50)))
  return next
}

export default function StudioPage() {
  const [selected, setSelected] = useState('')
  const [script, setScript]     = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [renders, setRenders]   = useState<Render[]>([])
  const [tab, setTab]           = useState<'studio' | 'gallery'>('studio')

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
    setImageUrl('')

    const imagePrompt = `Photorealistic portrait of a 26-year-old AI influencer. ${persona.dna}. Cinematic studio lighting, 8K resolution, professional photography, ultra-detailed skin textures, sharp focus.${script ? ` Mood: ${script.substring(0, 60)}` : ''}`

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, seed: persona.seed }),
      })
      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
        const saved = saveRender({ persona: persona.name, niche: persona.niche, url: data.url })
        setRenders(prev => [saved, ...prev])
      } else {
        setError('No image URL returned')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function deleteRender(id: string) {
    const updated = renders.filter(r => r.id !== id)
    setRenders(updated)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  }

  function clearAll() {
    setRenders([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Clickbait Labs · Visual Studio</p>
              <h1 className="text-5xl font-bold tracking-tighter">Studio</h1>
            </div>

            {/* Tab switch */}
            <div className="flex bg-zinc-900/60 border border-white/5 rounded-xl p-1 gap-1">
              {(['studio', 'gallery'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-5 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                    tab === t ? 'bg-white text-black' : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {t === 'gallery' ? `Gallery${renders.length ? ` (${renders.length})` : ''}` : 'Render'}
                </button>
              ))}
            </div>
          </div>

          {/* ── STUDIO TAB ── */}
          {tab === 'studio' && (
            <div className="grid lg:grid-cols-2 gap-8">

              {/* Left — Controls */}
              <div className="space-y-5">
                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Select Persona</p>
                  <div className="grid grid-cols-5 gap-2">
                    {PERSONAS.map(p => (
                      <button
                        key={p.name}
                        onClick={() => setSelected(p.name)}
                        className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all border ${
                          selected === p.name
                            ? 'bg-white text-black border-white'
                            : 'bg-black/50 text-zinc-500 border-white/5 hover:border-white/20 hover:text-white'
                        }`}
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                  {persona && <p className="text-xs text-zinc-600 italic">{persona.dna}</p>}
                </div>

                <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                    Script Context <span className="text-zinc-700 normal-case font-normal">(optional)</span>
                  </p>
                  <textarea
                    value={script}
                    onChange={e => setScript(e.target.value)}
                    placeholder="Paste script to influence the visual mood..."
                    className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 focus:border-white/20 focus:outline-none resize-none h-28 transition-colors"
                  />
                </div>

                <button
                  onClick={generate}
                  disabled={!selected || loading}
                  className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Rendering...</>
                    : <><Zap size={16} className="fill-black" /> Render Portrait</>
                  }
                </button>

                {error && <p className="text-xs text-red-400 text-center">{error}</p>}

                <p className="text-[10px] text-zinc-700 text-center">
                  Powered by Pollinations Flux · 1024×1792 · All renders saved to Gallery
                </p>
              </div>

              {/* Right — Preview */}
              <div className="space-y-4">
                <div className="bg-zinc-950 border border-white/5 rounded-2xl aspect-[9/16] flex items-center justify-center overflow-hidden relative">
                  {loading && (
                    <div className="flex flex-col items-center gap-4 text-center px-8">
                      <Loader2 size={32} className="animate-spin text-zinc-600" />
                      <div>
                        <p className="text-xs font-bold text-zinc-400">Rendering {selected}...</p>
                        <p className="text-[10px] text-zinc-600 mt-1">Takes 10–30 seconds</p>
                      </div>
                    </div>
                  )}
                  {!loading && !imageUrl && (
                    <div className="flex flex-col items-center gap-3 opacity-20">
                      <ImageIcon size={40} strokeWidth={1} />
                      <p className="text-xs font-bold uppercase tracking-widest">Production Standby</p>
                    </div>
                  )}
                  {imageUrl && !loading && (
                    <motion.img
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={imageUrl}
                      alt={`${selected} portrait`}
                      className="w-full h-full object-cover"
                      onError={() => setError('Image failed to load — try regenerating.')}
                    />
                  )}
                </div>

                {imageUrl && !loading && (
                  <div className="flex gap-3">
                    <a
                      href={imageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Download size={12} /> Open Full Size
                    </a>
                    <button
                      onClick={generate}
                      className="px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-all flex items-center gap-2"
                    >
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
                <p className="text-xs text-zinc-500 font-medium">
                  {renders.length === 0 ? 'No renders yet — go to Render tab to generate images.' : `${renders.length} render${renders.length !== 1 ? 's' : ''} saved locally`}
                </p>
                {renders.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 size={11} /> Clear All
                  </button>
                )}
              </div>

              {renders.length === 0 ? (
                <div className="border border-dashed border-white/10 rounded-2xl py-24 flex flex-col items-center gap-4 text-center opacity-30">
                  <ImageIcon size={40} strokeWidth={1} />
                  <p className="text-sm font-medium">Your renders will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  <AnimatePresence>
                    {renders.map((render) => (
                      <motion.div
                        key={render.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="group relative bg-zinc-900/50 rounded-2xl overflow-hidden aspect-[9/16] border border-white/5"
                      >
                        <img
                          src={render.url}
                          alt={render.persona}
                          className="w-full h-full object-cover"
                        />
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4">
                          <button
                            onClick={() => deleteRender(render.id)}
                            className="self-end p-2 bg-black/50 rounded-lg text-zinc-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={14} />
                          </button>
                          <div className="space-y-2">
                            <div>
                              <p className="text-sm font-bold">{render.persona}</p>
                              <p className="text-[10px] text-zinc-400">{render.niche}</p>
                            </div>
                            <div className="flex items-center gap-1 text-zinc-500">
                              <Clock size={10} />
                              <span className="text-[9px]">
                                {new Date(render.timestamp).toLocaleDateString()} {new Date(render.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <a
                              href={render.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center justify-center gap-1.5 w-full py-2 bg-white text-black rounded-lg text-[10px] font-black uppercase tracking-wider"
                            >
                              <Download size={10} /> Download
                            </a>
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
