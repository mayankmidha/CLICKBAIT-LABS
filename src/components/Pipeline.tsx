'use client'

import { motion } from 'framer-motion'
import { 
  Zap, 
  Brain, 
  Eye, 
  Video, 
  ChevronRight, 
  CheckCircle2, 
  Loader2,
  AlertCircle
} from 'lucide-react'

const steps = [
  { id: 'research', name: 'Intelligence', icon: Zap, color: 'text-blue-500', bg: 'bg-blue-500/10' },
  { id: 'script',   name: 'Scripting',    icon: Brain, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  { id: 'vision',   name: 'Vision',       icon: Eye,   color: 'text-amber-500',  bg: 'bg-amber-500/10' },
  { id: 'motion',   name: 'Motion',       icon: Video, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
]

export function Pipeline({ currentStatus }: { currentStatus: string }) {
  const getStatusIndex = (status: string) => {
    if (status === 'DRAFT') return -1
    if (status === 'RESEARCHED') return 0
    if (status === 'SCRIPTED') return 1
    if (status === 'VISUALIZED') return 2
    if (status === 'RENDERED') return 3
    return -1
  }

  const currentIndex = getStatusIndex(currentStatus)

  return (
    <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 relative overflow-hidden group">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
        {/* Connector Line */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent hidden md:block" />

        {steps.map((step, i) => {
          const isDone = i <= currentIndex
          const isActive = i === currentIndex + 1

          return (
            <div key={step.id} className="flex flex-col items-center gap-4 relative z-10">
              <div className={`w-16 h-16 rounded-2xl ${isDone ? step.bg : 'bg-white/5'} border border-white/5 flex items-center justify-center ${isDone ? step.color : 'text-zinc-700'} transition-all duration-500`}>
                <step.icon size={24} strokeWidth={isDone ? 2 : 1} />
              </div>
              <div className="text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest ${isDone ? 'text-zinc-300' : 'text-zinc-600'}`}>{step.name}</p>
                <div className="flex items-center justify-center gap-1 mt-1">
                  {isDone ? (
                    <span className="text-[8px] font-bold text-emerald-500 uppercase">Complete</span>
                  ) : isActive ? (
                    <>
                      <span className="w-1 h-1 rounded-full bg-blue-500 animate-pulse" />
                      <span className="text-[8px] font-bold text-blue-500 uppercase tracking-tighter">Current</span>
                    </>
                  ) : (
                    <span className="text-[8px] font-bold text-zinc-800 uppercase tracking-tighter">Locked</span>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
