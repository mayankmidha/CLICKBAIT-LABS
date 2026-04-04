'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Clapperboard, 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Zap, 
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Layout,
  Plus,
  Loader2
} from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function StudioPage() {
  const { data: personas } = useSWR('/api/personas', fetcher)
  const [script, setScript] = useState('')
  const [selectedPersona, setSelectedPersona] = useState('')
  const [isRendering, setIsRendering] = useState(false)
  const [thumbnailPrompt, setThumbnailPrompt] = useState('')
  const [isThumbGenerating, setIsThumbGenerating] = useState(false)
  const [precision, setPrecision] = useState('FP8')

  const [previewUrl, setPreviewUrl] = useState('')

  async function handleRender() {
    if (!selectedPersona) return
    setIsRendering(true)
    
    // Find selected persona seed
    const pData = personas?.find((p: any) => p.name === selectedPersona)
    const seed = pData?.seed || null

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `High fidelity professional portrait of ${selectedPersona}, cinematic studio lighting, 8k resolution, realistic skin textures`, 
          persona_name: selectedPersona,
          seed: seed
        })
      })
      const data = await res.json()
      setPreviewUrl(data.url)
    } catch (e) {
      console.error(e)
    } finally {
      setIsRendering(false)
    }
  }

  async function handleThumbnail() {
    setIsThumbGenerating(true)
    try {
      const res = await fetch('/api/generate-thumbnail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script, persona: selectedPersona, api_key: '' })
      })
      const data = await res.json()
      setThumbnailPrompt(data.prompt)
    } catch (e) {
      console.error(e)
    } finally {
      setIsThumbGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Production Suite
              </span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              Visual <span className="text-zinc-500 italic font-light">Studio.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            
            <div className="space-y-8">
              {/* Character & Script */}
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Active Persona</label>
                  <select 
                    value={selectedPersona}
                    onChange={(e) => setSelectedPersona(e.target.value)}
                    className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold appearance-none"
                  >
                    <option value="">Select Character...</option>
                    {personas?.map((p: any) => (
                      <option key={p.id} value={p.name}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Production Script</label>
                  <textarea 
                    value={script}
                    onChange={(e) => setScript(e.target.value)}
                    placeholder="Final script for rendering..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-sm font-medium focus:border-white/20 focus:ring-0 transition-all min-h-[200px] resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Render Precision</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => setPrecision('FP8')}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${precision === 'FP8' ? 'bg-white text-black border-white shadow-lg' : 'bg-black text-zinc-500 border-white/5 hover:border-white/10'}`}
                    >
                      Turbo (FP8)
                    </button>
                    <button 
                      onClick={() => setPrecision('Full')}
                      className={`py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${precision === 'Full' ? 'bg-blue-500 text-white border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.4)]' : 'bg-black text-zinc-500 border-white/5 hover:border-white/10'}`}
                    >
                      Elite (Full)
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleRender}
                  disabled={isRendering || !script}
                  className="w-full py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl disabled:opacity-20"
                >
                  {isRendering ? <Loader2 className="animate-spin" size={18} /> : <Video size={18} className="fill-black" />}
                  Commence 4K Render
                </button>
              </div>

              {/* Thumbnail Designer */}
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Thumbnail Designer</h3>
                  <button 
                    onClick={handleThumbnail}
                    disabled={isThumbGenerating || !script}
                    className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors disabled:opacity-20"
                  >
                    {isThumbGenerating ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                    Draft Concept
                  </button>
                </div>

                {thumbnailPrompt ? (
                  <div className="space-y-4">
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-6 text-xs font-mono text-zinc-400 leading-relaxed italic">
                      {thumbnailPrompt}
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2 ml-auto">
                      Inject into Flux <ChevronRight size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="py-12 border border-dashed border-white/5 rounded-2xl flex flex-col items-center gap-4 text-center opacity-30">
                    <ImageIcon size={32} strokeWidth={1} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Awaiting Script context</p>
                  </div>
                )}
              </div>
            </div>

            {/* Preview & Status */}
            <div className="space-y-8">
               <div className="bg-black border border-white/10 rounded-[2.5rem] aspect-[9/16] max-h-[700px] mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
                  
                  {previewUrl ? (
                    <motion.img 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      src={previewUrl}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                  ) : (
                    <>
                      <Clapperboard size={64} strokeWidth={0.5} className="text-zinc-800 mb-6 group-hover:scale-110 transition-transform duration-700" />
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Production Standby</p>
                    </>
                  )}
                  
                  <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md z-20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{isRendering ? "Rendering Engine" : "Cloud GPU Status"}</span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase">{isRendering ? "Generating..." : "Optimized"}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={isRendering ? { x: ['-100%', '100%'] } : { x: 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-1/2 h-full bg-blue-500/50 blur-[2px]"
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security</p>
                      <p className="text-xs font-bold text-white">Local Hardware Encryption</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">HIPAA Certified</span>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
