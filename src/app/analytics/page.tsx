'use client'

import { Sidebar } from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { 
  TrendingUp, 
  BarChart3, 
  Eye, 
  Users, 
  DollarSign, 
  ArrowUpRight,
  Target,
  Zap,
  Clock
} from 'lucide-react'

export default function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-black text-white flex selection:bg-indigo-500/30">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-12">
        <div className="max-w-7xl mx-auto space-y-12">
          
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-zinc-400">
                Performance Intelligence
              </span>
            </div>
            <h1 className="text-6xl font-bold tracking-tighter leading-[0.9]">
              Empire <span className="text-zinc-500 italic font-light">Analytics.</span>
            </h1>
          </div>

          {/* Core Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Total Impressions', value: '12.4M', icon: Eye, color: 'text-blue-500' },
              { label: 'Network Conversion', value: '8.2%', icon: Target, color: 'text-purple-500' },
              { label: 'Est. Monthly Rev', value: '$42,805', icon: DollarSign, color: 'text-emerald-500' },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-zinc-900/30 border border-white/5 p-10 rounded-[2.5rem] backdrop-blur-xl relative overflow-hidden group"
              >
                <div className="relative z-10 flex justify-between items-center">
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{metric.label}</p>
                    <h3 className="text-5xl font-bold tracking-tighter">{metric.value}</h3>
                  </div>
                  <div className={`w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center ${metric.color} shadow-2xl`}>
                    <metric.icon size={32} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>

          {/* Charts Row */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="bg-zinc-900/20 border border-white/5 rounded-[3rem] p-12 space-y-10">
               <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold tracking-tight">Retention Velocity</h3>
                    <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest">Average Across All Channels</p>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-500 text-xs font-black">
                    <TrendingUp size={14} /> +12.4%
                  </div>
               </div>
               <div className="h-64 flex items-end gap-3 px-4">
                  {[40, 65, 80, 85, 90, 88, 82, 70, 65, 60, 58, 55, 45, 40].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ delay: i * 0.05, duration: 1 }}
                      className="flex-1 bg-gradient-to-t from-indigo-500/40 to-indigo-400 rounded-full hover:to-white transition-all cursor-pointer relative group/bar"
                    >
                       <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-black text-[8px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap">
                          {h}% Watch
                       </div>
                    </motion.div>
                  ))}
               </div>
               <div className="flex justify-between px-2 text-[10px] font-black uppercase tracking-widest text-zinc-700">
                  <span>0s</span>
                  <span>15s</span>
                  <span>30s</span>
                  <span>45s</span>
               </div>
            </div>

            <div className="space-y-8">
               <div className="bg-zinc-900/30 border border-white/5 rounded-[2.5rem] p-10 space-y-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500">Channel Distribution</h3>
                  <div className="space-y-6">
                    {[
                      { name: 'Tech / AI', value: 45, color: 'bg-blue-500' },
                      { name: 'Finance', value: 30, color: 'bg-purple-500' },
                      { name: 'Luxury', value: 15, color: 'bg-amber-500' },
                      { name: 'Gaming', value: 10, color: 'bg-emerald-500' },
                    ].map((item) => (
                      <div key={item.name} className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-zinc-400">
                          <span>{item.name}</span>
                          <span>{item.value}%</span>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${item.value}%` }}
                            transition={{ duration: 1.5 }}
                            className={`h-full ${item.color}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
               </div>

               <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 rounded-[2.5rem] p-8 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                      <Zap size={24} className="fill-emerald-500" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white tracking-tight italic">Optimization Protocol</p>
                      <p className="text-[10px] font-medium text-zinc-500">AI just refined 12 hooks for higher CTR.</p>
                    </div>
                  </div>
                  <ArrowUpRight size={20} className="text-zinc-700 group-hover:text-white transition-colors" />
               </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
