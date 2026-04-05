'use client'

import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { 
  Calendar as CalendarIcon, 
  Clock, 
  CheckCircle2, 
  Circle, 
  ArrowRight,
  Plus,
  MoreVertical,
  ChevronRight
} from 'lucide-react'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then(res => res.json())

export default function CalendarPage() {
  const { data: events, isLoading } = useSWR('/api/calendar', fetcher)

  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-purple-500/30">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-5xl mx-auto space-y-12">
          
          <div className="flex justify-between items-end">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Distribution Engine
                </span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
                Content <span className="text-zinc-500 italic font-light">Calendar.</span>
              </h1>
            </div>

            <button className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:bg-zinc-200 transition-all shadow-xl shadow-white/5">
              Schedule Production <Plus size={16} />
            </button>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8 ml-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500">Upcoming Viral Drops</h2>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-zinc-900/50 rounded-3xl animate-pulse border border-white/5" />
                ))}
              </div>
            ) : (!events || events.length === 0) ? (
              <div className="bg-zinc-900/20 border border-dashed border-white/10 rounded-[3rem] py-32 text-center space-y-6">
                  <CalendarIcon size={48} strokeWidth={1} className="mx-auto text-zinc-800" />
                  <div className="space-y-2">
                    <p className="text-zinc-500 font-display italic text-xl">No content queued for this week.</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Deploy a strategist to fill the pipeline</p>
                  </div>
              </div>
            ) : (
              <div className="space-y-4">
                {events.map((event: any, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-zinc-900/30 border border-white/5 p-6 rounded-3xl flex items-center justify-between group hover:border-white/10 transition-colors"
                  >
                    <div className="flex items-center gap-8">
                      <div className="w-16 h-16 rounded-2xl bg-black border border-white/5 flex flex-col items-center justify-center text-center">
                         <span className="text-[10px] font-black text-zinc-600 uppercase">Apr</span>
                         <span className="text-xl font-bold leading-none">0{3 + i}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold tracking-tight text-white group-hover:text-blue-400 transition-colors">{event.topic}</h3>
                        <div className="flex items-center gap-4 mt-1">
                           <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{event.persona}</span>
                           <span className="text-zinc-800 text-xs">•</span>
                           <div className="flex items-center gap-1.5">
                              <Clock size={12} className="text-zinc-600" />
                              <span className="text-[10px] font-medium text-zinc-600">09:00 AM</span>
                           </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-12">
                       <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${event.status === 'QUEUED' ? 'bg-blue-500 animate-pulse' : 'bg-emerald-500'}`} />
                          <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">{event.status}</span>
                       </div>
                       <button className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-zinc-600 hover:text-white hover:border-white/20 transition-all">
                          <ChevronRight size={18} />
                       </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Stats Sidebar-style row */}
          <div className="grid md:grid-cols-2 gap-8 pt-12 border-t border-white/5">
             <div className="bg-gradient-to-br from-blue-500/10 to-transparent border border-blue-500/10 p-10 rounded-[3rem] space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-blue-400">Inventory Status</h4>
                <p className="text-2xl font-bold tracking-tighter">14 Videos Prepared</p>
                <p className="text-sm text-zinc-500 leading-relaxed font-medium italic font-display">Your Mac is currently rendering the final 4K masters for tomorrow&apos;s drop.</p>
             </div>
             <div className="bg-zinc-900/20 border border-white/5 p-10 rounded-[3rem] flex items-center justify-between">
                <div className="space-y-2">
                   <h4 className="text-xs font-black uppercase tracking-widest text-zinc-500">Auto-Poster</h4>
                   <p className="text-xl font-bold">Status: Standby</p>
                </div>
                <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-500">
                   <CheckCircle2 size={24} />
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  )
}
