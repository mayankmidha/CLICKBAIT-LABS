'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/Sidebar'
import { StatsGrid } from '@/components/StatsGrid'
import { StudioCanvas } from '@/components/StudioCanvas'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight, Loader2 } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function OverviewPage() {
  const { data: status } = useSWR('/api/system/status', fetcher, { refreshInterval: 5000 })
  const [autopilotData, setAutopilotData] = useState<any>(null)
  const [isBuilding, setIsBuilding] = useState(false)
  
  const fluxPercent = status?.flux_download?.percent || 0
  
  async function runAutopilot() {
    setIsBuilding(true)
    setAutopilotData({ entities: [], status: "Initializing Database..." })
    try {
      // 1. Create all 5 personas rapidly
      const res = await fetch('/api/empire-builder')
      const initialData = await res.json()
      
      if (initialData.status === "PARTIAL_OFFLINE") {
        setAutopilotData((prev: any) => ({ ...prev, status: "Demo Mode Active (DB Offline)" }))
      } else {
        setAutopilotData((prev: any) => ({ ...prev, status: "Generating Viral Content..." }))
      }
      
      const enrichedEntities: any[] = []
      
      // 2. Generate scripts for each one by one (to avoid Vercel timeouts)
      for (const ent of initialData.entities) {
        try {
          const scriptRes = await fetch('/api/generate-script', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              topic: `Viral debut for ${ent.name}`, 
              niche: ent.niche, 
              style: 'Aggressive Viral' 
            })
          })
          const scriptData = await scriptRes.json()
          enrichedEntities.push({ ...ent, script: scriptData.script || "Script processing..." })
          setAutopilotData((prev: any) => ({ ...prev, entities: [...enrichedEntities] })) 
        } catch (e) {
          enrichedEntities.push({ ...ent, script: "Neural bottleneck. Generating manually later." })
          setAutopilotData((prev: any) => ({ ...prev, entities: [...enrichedEntities] }))
        }
      }
      setAutopilotData((prev: any) => ({ ...prev, status: "Production Ready" }))
    } catch (e) {
      console.error(e)
      setAutopilotData({ entities: [], status: "Connection Error" })
    } finally {
      setIsBuilding(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400 shadow-sm">
                  Command Center
                </span>
                <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">v4.0.2</span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Empire <span className="text-zinc-500 italic font-light">Status.</span>
              </h1>
            </div>

            <div className="flex gap-4">
               <div className="flex flex-col items-end gap-1 px-6 py-2 bg-white/5 border border-white/10 rounded-xl">
                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500 text-right">Flux Engine Sync</span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div animate={{ width: `${fluxPercent}%` }} className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                    </div>
                    <span className="text-xs font-mono font-bold">{fluxPercent}%</span>
                  </div>
               </div>
               <button 
                onClick={runAutopilot}
                disabled={isBuilding}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5 disabled:opacity-50"
               >
                  {isBuilding ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Run Empire Autopilot
               </button>
            </div>
          </div>

          <StatsGrid />

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <StudioCanvas />
              
              {autopilotData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-12 bg-zinc-900/30 border border-white/10 rounded-3xl p-10 space-y-8 shadow-2xl"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-black uppercase tracking-widest text-blue-500">Autopilot Production Feed</h3>
                    <span className="text-[10px] font-bold text-zinc-500 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                      {autopilotData.status}
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    {autopilotData.entities.map((ent: any, i: number) => (
                      <div key={i} className="bg-black/50 p-6 rounded-2xl border border-white/5 space-y-4">
                        <h4 className="font-bold text-white flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500" /> {ent.name}
                        </h4>
                        <p className="text-[10px] text-zinc-500 leading-relaxed line-clamp-3 italic">
                          {ent.script}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>

            <div className="space-y-8">
               <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-6">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Live Research Feed</h3>
                  <div className="space-y-4">
                     {[
                       "Scanned NVIDIA Blackwell benchmarks...",
                       "Acquired 12 viral hooks for 'Finance'...",
                       "Flux model download @ 46.6%",
                       "LoRA training finalized for 'Nova'..."
                     ].map((log, i) => (
                       <div key={i} className="flex gap-3 text-xs font-mono">
                          <span className="text-zinc-700">[{new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}]</span>
                          <span className="text-emerald-500/80">{log}</span>
                       </div>
                     ))}
                  </div>
               </div>

               <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden group">
                  <div className="relative z-10 space-y-4">
                    <h3 className="text-lg font-bold tracking-tight italic">Upcoming Milestone</h3>
                    <p className="text-sm text-zinc-400 leading-relaxed font-medium">
                      Your tech influencer "Nova" is projected to hit 100k views this week based on current retention trends.
                    </p>
                    <button className="text-xs font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-2">
                      View Projections <ArrowUpRight size={14} />
                    </button>
                  </div>
                  <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
// Cloud Engine V18.1 - Production Sync
