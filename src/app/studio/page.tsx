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
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Download
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
  const [copied, setCopied] = useState(false)

  // Load script from Writer's Room automatically
  useEffect(() => {
    const savedScript = localStorage.getItem('studio_script') || localStorage.getItem('last_script')
    if (savedScript) setScript(savedScript)
  }, [])

  async function handleRender() {
    if (!selectedPersona) return
    setIsRendering(true)
    
    const pData = personas?.find((p: any) => p.name === selectedPersona)
    const seed = pData?.seed || null

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: `High fidelity professional portrait of ${selectedPersona}, cinematic studio lighting, 8k resolution, realistic skin textures, ${script.substring(0, 100)}`, 
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

  const copyPrompt = () => {
    navigator.clipboard.writeText(thumbnailPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Active Persona</label>
                  <button onClick={() => mutate('/api/personas')} className="text-zinc-600 hover:text-white transition-colors"><RefreshCw size={12} /></button>
                </div>
                <select 
                  value={selectedPersona}
                  onChange={(e) => setSelectedPersona(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold appearance-none hover:border-white/20 transition-all"
                >
                  <option value="">Select Character...</option>
                  {personas?.map((p: any) => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>

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
                  disabled={isRendering || !selectedPersona}
                  className="w-full py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl disabled:opacity-20 disabled:cursor-not-allowed group"
                >
                  {isRendering ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="fill-black group-hover:scale-110 transition-transform" />}
                  Commence 4K Render
                </button>
              </div>

              {/* Thumbnail Designer */}
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 italic">Thumbnail Designer</h3>
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
                    <div className="bg-black/50 border border-white/10 rounded-2xl p-6 text-xs font-mono text-zinc-400 leading-relaxed italic relative group">
                      {thumbnailPrompt}
                      <button 
                        onClick={copyPrompt}
                        className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 p-2 rounded-lg hover:bg-white/10"
                      >
                        {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                      </button>
                    </div>
                    <button className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-colors flex items-center gap-2 ml-auto group">
                      Inject into Flux <ChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
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
            <div className="space-y-8 text-center">
               <div className="bg-black border border-white/10 rounded-[2.5rem] aspect-[9/16] max-h-[700px] mx-auto flex flex-col items-center justify-center relative overflow-hidden shadow-2xl group ring-1 ring-white/5">
                  <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent pointer-events-none z-10" />
                  
                  {previewUrl ? (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <img 
                        src={previewUrl}
                        className="w-full h-full object-cover"
                        alt="AI Influencer Preview"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4 z-30">
                         <button className="p-4 bg-white text-black rounded-full hover:scale-110 transition-transform shadow-2xl">
                            <Download size={24} />
                         </button>
                      </div>
                    </motion.div>
                  ) : (
                    <div className="relative z-20 flex flex-col items-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                        <Clapperboard size={32} strokeWidth={1} className="text-zinc-600" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Production Standby</p>
                    </div>
                  )}
                  
                  <div className="absolute bottom-10 left-10 right-10 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md z-20 shadow-2xl">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">{isRendering ? "Neural Rendering" : "Cloud GPU Status"}</span>
                      <span className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">{isRendering ? "Processing Frames..." : "Ready"}</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        animate={isRendering ? { x: ['-100%', '100%'] } : { x: 0 }}
                        transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                        className="w-1/2 h-full bg-blue-500/50 blur-[1px]"
                      />
                    </div>
                  </div>
               </div>

               <div className="bg-zinc-900/20 border border-white/5 rounded-3xl p-8 flex items-center justify-between shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <ShieldCheck size={20} />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Security</p>
                      <p className="text-xs font-bold text-white">Full Identity Encryption</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">SSL Secure</span>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
