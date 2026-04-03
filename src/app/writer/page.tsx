'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Sparkles, 
  Search, 
  Terminal, 
  Send, 
  Flame, 
  Zap, 
  ChevronRight,
  Loader2
} from 'lucide-react'

export default function WriterPage() {
  const [topic, setTopic] = useState('')
  const [niche, setNiche] = useState('AI & Tech')
  const [style, setStyle] = useState('Aggressive Viral')
  const [isGenerating, setIsGenerating] = useState(false)
  const [script, setScript] = useState('')
  const [logs, setLogs] = useState<string[]>([])

  async function handleGenerate() {
    if (!topic) return
    setIsGenerating(true)
    setLogs(["[SYS] Initiating Global Research Scan..."])
    
    try {
      // 1. Research Phase
      const resRes = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      })
      const resData = await resRes.json()
      setLogs(prev => [...prev, ...resData.logs, "[SYS] Research synthesized. Engaging Legendary Writer..."])

      // 2. Generation Phase
      const scriptRes = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, niche, style })
      })
      const scriptData = await scriptRes.json()
      setScript(scriptData.script)
      setLogs(prev => [...prev, "[SYS] Script deployment successful."])
    } catch (error) {
      setLogs(prev => [...prev, "[ERR] Neural Link Interrupted."])
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-purple-500/30">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-6xl mx-auto space-y-12">
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Cognitive Engine
              </span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              Writer&apos;s <span className="text-zinc-500 italic font-light">Room.</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-5 gap-12">
            
            {/* Input Panel */}
            <div className="lg:col-span-3 space-y-8">
              <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-10 space-y-8 backdrop-blur-xl">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Video Concept</label>
                  <textarea 
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Describe the viral topic..."
                    className="w-full bg-black/50 border border-white/10 rounded-2xl p-6 text-xl font-medium focus:border-white/20 focus:ring-0 transition-all min-h-[150px] resize-none"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Niche</label>
                    <select 
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold appearance-none"
                    >
                      {["AI & Tech", "Finance & Wealth", "Gaming", "Luxury", "Fitness"].map(n => (
                        <option key={n} value={n}>{n}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Strategy</label>
                    <select 
                      value={style}
                      onChange={(e) => setStyle(e.target.value)}
                      className="w-full bg-black/50 border border-white/10 rounded-xl p-4 text-sm font-bold appearance-none"
                    >
                      {["Aggressive Viral", "High Status", "Fast Action"].map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <button 
                  onClick={handleGenerate}
                  disabled={isGenerating || !topic}
                  className="w-full py-5 bg-white text-black rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-zinc-200 transition-all shadow-2xl disabled:opacity-20"
                >
                  {isGenerating ? <Loader2 className="animate-spin" size={18} /> : <Zap size={18} className="fill-black" />}
                  Deploy Strategist
                </button>
              </div>

              {script && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-zinc-900/50 border border-white/10 rounded-3xl p-10 relative overflow-hidden"
                >
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-8">
                      <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Master Draft</h3>
                      <button className="text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Copy Script</button>
                    </div>
                    <div className="text-lg leading-relaxed text-zinc-300 whitespace-pre-wrap font-medium italic">
                      {script}
                    </div>
                  </div>
                  <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                </motion.div>
              )}
            </div>

            {/* Research HUD */}
            <div className="lg:col-span-2 space-y-8">
               <div className="bg-black border border-white/5 rounded-3xl p-8 h-fit">
                  <div className="flex items-center gap-3 mb-8">
                    <Terminal size={18} className="text-emerald-500" />
                    <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">System Scan</h3>
                  </div>
                  
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                    {logs.length === 0 ? (
                      <div className="text-[10px] font-mono text-zinc-700 italic">> Awaiting deployment command...</div>
                    ) : (
                      logs.map((log, i) => (
                        <motion.div 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          key={i} 
                          className="text-[10px] font-mono text-emerald-500/80 leading-relaxed"
                        >
                          {`> ${log}`}
                        </motion.div>
                      ))
                    )}
                  </div>
               </div>

               <div className="bg-zinc-900/20 border border-dashed border-white/5 rounded-3xl p-8 text-center space-y-4">
                  <Flame size={24} className="mx-auto text-orange-500 opacity-40" />
                  <p className="text-xs text-zinc-500 font-medium leading-relaxed">
                    This module uses real-time DuckDuckGo scraping to find controversial angles that beat the algorithm.
                  </p>
               </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
