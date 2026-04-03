'use client'

import { motion } from 'framer-motion'
import { 
  Cpu, 
  Sparkles, 
  Zap, 
  Video, 
  Mic2, 
  Layers,
  ArrowRight
} from 'lucide-react'

const steps = [
  { id: 'image', name: 'Identity Engine', icon: Cpu, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'audio', name: 'Vocal Synthesis', icon: Mic2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'motion', name: 'Motion Mapping', icon: Layers, color: 'text-amber-500', bg: 'bg-amber-500/10' },
  { id: 'render', name: '4K Rendering', icon: Video, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
]

export function StudioCanvas() {
  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-12 relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white">
            <Zap size={20} className="fill-white" />
          </div>
          <div>
            <h3 className="text-xl font-bold tracking-tight uppercase font-mono italic">Production Pipeline</h3>
            <p className="text-zinc-500 text-xs font-medium tracking-widest uppercase mt-1">Real-time Node Orchestration</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
          {/* Connector Line */}
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

          {steps.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="flex flex-col items-center gap-4 relative z-10"
            >
              <div className={`w-20 h-20 rounded-2xl ${step.bg} border border-white/5 flex items-center justify-center ${step.color} shadow-2xl backdrop-blur-xl group-hover:scale-110 transition-transform duration-500`}>
                <step.icon size={32} strokeWidth={1.5} />
              </div>
              <div className="text-center">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">{step.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-black text-zinc-600 uppercase tracking-tighter">Ready</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white text-black px-12 py-4 rounded-full font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 shadow-2xl hover:bg-zinc-200 transition-all"
          >
            Launch Core Engine <ArrowRight size={16} />
          </motion.button>
        </div>
      </div>
    </div>
  )
}
