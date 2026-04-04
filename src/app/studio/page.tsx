'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { Zap, Loader2, Download, RotateCcw, Image as ImageIcon } from 'lucide-react'

const PERSONAS = [
  { name: 'Aura',  niche: 'AI & Tech', seed: 555555,  dna: 'Japanese-Brazilian tech minimalist, black turtleneck, minimalist Tokyo tech lab, blue neon ambient glow' },
  { name: 'Kira',  niche: 'Finance',   seed: 7721094, dna: 'Indo-Australian woman, professional linen blazer, Sydney coastal office, golden hour window light' },
  { name: 'Elara', niche: 'Luxury',    seed: 338812,  dna: 'Indo-French woman, silk structured outfit, Parisian atelier, soft editorial lighting' },
  { name: 'Maya',  niche: 'Fitness',   seed: 992211,  dna: 'Scandinavian-Indian woman, athletic wear, minimalist gym, crisp white background' },
  { name: 'Luna',  niche: 'Gaming',    seed: 445566,  dna: 'American-Indian woman, cyberpunk neon setup, RGB lighting, dark gaming room' },
]

export default function StudioPage() {
  const [selected, setSelected] = useState('')
  const [script, setScript]     = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    const p = localStorage.getItem('studio_persona')
    const s = localStorage.getItem('studio_script')
    if (p) setSelected(p)
    if (s) setScript(s)
  }, [])

  const persona = PERSONAS.find(p => p.name === selected)

  async function generate() {
    if (!persona) return
    setLoading(true)
    setError('')
    setImageUrl('')

    const imagePrompt = `Photorealistic portrait of a 26-year-old AI influencer. ${persona.dna}. Cinematic studio lighting, 8K resolution, professional photography, ultra-detailed skin textures, sharp focus. ${script ? `Mood: ${script.substring(0, 60)}` : ''}`

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: imagePrompt, seed: persona.seed }),
      })
      const data = await res.json()
      if (data.url) {
        setImageUrl(data.url)
      } else {
        setError('Image URL not returned')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />

      <main className="flex-1 ml-64 p-10">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="space-y-2">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Clickbait Labs · Visual Studio</p>
            <h1 className="text-5xl font-bold tracking-tighter">Studio</h1>
            <p className="text-zinc-500 text-sm">Select a persona and render their portrait.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">

            {/* Left — Controls */}
            <div className="space-y-6">

              {/* Persona selector */}
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
                {persona && (
                  <p className="text-xs text-zinc-600 italic">{persona.dna}</p>
                )}
              </div>

              {/* Script context (optional) */}
              <div className="bg-zinc-900/40 border border-white/5 rounded-2xl p-6 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Script Context <span className="text-zinc-700 normal-case font-medium">(optional — improves mood)</span></p>
                <textarea
                  value={script}
                  onChange={e => setScript(e.target.value)}
                  placeholder="Paste your script here to inform the visual mood..."
                  className="w-full bg-black/50 border border-white/5 rounded-xl p-4 text-sm text-zinc-300 focus:border-white/20 focus:outline-none resize-none h-32 transition-colors"
                />
              </div>

              {/* Render button */}
              <button
                onClick={generate}
                disabled={!selected || loading}
                className="w-full py-4 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-100 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> Rendering via Pollinations...</>
                  : <><Zap size={16} className="fill-black" /> Render Portrait</>
                }
              </button>

              {error && (
                <p className="text-xs text-red-400 text-center">{error}</p>
              )}

              {/* Info */}
              <div className="bg-zinc-900/20 border border-white/5 rounded-xl p-4">
                <p className="text-[10px] text-zinc-600 leading-relaxed">
                  Images are generated via <strong className="text-zinc-400">Pollinations AI (Flux)</strong> at 1024×1792px.
                  Each persona has a locked seed for visual consistency.
                  Generation takes 10–30 seconds.
                </p>
              </div>
            </div>

            {/* Right — Preview */}
            <div className="space-y-4">
              <div className="bg-zinc-950 border border-white/5 rounded-2xl aspect-[9/16] flex items-center justify-center overflow-hidden relative">
                {loading && (
                  <div className="flex flex-col items-center gap-4 text-center px-8">
                    <Loader2 size={32} className="animate-spin text-zinc-600" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-zinc-400">Rendering {selected}...</p>
                      <p className="text-[10px] text-zinc-600">Flux model generating 1024×1792 portrait</p>
                    </div>
                  </div>
                )}

                {!loading && !imageUrl && (
                  <div className="flex flex-col items-center gap-3 text-center px-8 opacity-30">
                    <ImageIcon size={40} strokeWidth={1} />
                    <p className="text-xs font-bold uppercase tracking-widest">Production Standby</p>
                    <p className="text-[10px]">Select a persona and hit Render</p>
                  </div>
                )}

                {imageUrl && !loading && (
                  <motion.img
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    src={imageUrl}
                    alt={`${selected} portrait`}
                    className="w-full h-full object-cover"
                    onError={() => setError('Image failed to load — Pollinations may be slow. Try again.')}
                  />
                )}
              </div>

              {imageUrl && !loading && (
                <div className="flex gap-3">
                  <a
                    href={imageUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Download size={12} /> Open Full Size
                  </a>
                  <button
                    onClick={generate}
                    className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/20 transition-all"
                  >
                    <RotateCcw size={12} /> Regenerate
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
