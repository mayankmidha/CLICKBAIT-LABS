'use client'

import { Sidebar } from '@/components/Sidebar'
import { StatsGrid } from '@/components/StatsGrid'
import { StudioCanvas } from '@/components/StudioCanvas'
import { motion } from 'framer-motion'
import { Sparkles, ArrowUpRight } from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function OverviewPage() {
  const { data: status } = useSWR('/api/system/status', fetcher, { refreshInterval: 5000 })
  
  const fluxPercent = status?.flux_download?.percent || 0
  const fluxGB = status?.flux_download?.size || 0

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
               <button className="flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
                  Deploy Strategist <Sparkles size={14} />
               </button>
            </div>
          </div>

          <StatsGrid />

          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <StudioCanvas />
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
