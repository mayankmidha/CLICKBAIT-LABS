'use client'

import { motion } from 'framer-motion'
import { TrendingUp, Users, Play, Activity } from 'lucide-react'

const stats = [
  { name: 'Active Personas', value: '12', icon: Users, change: '+2 this week' },
  { name: 'Videos Rendered', value: '1,402', icon: Play, change: '+128 this month' },
  { name: 'Projected Views', value: '4.2M', icon: TrendingUp, change: '+12% growth' },
  { name: 'System Health', value: '100%', icon: Activity, change: 'Optimal Performance' },
]

export function StatsGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-zinc-900/50 border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-colors group"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-zinc-400 group-hover:text-white transition-colors">
              <stat.icon size={20} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded">
              {stat.change}
            </span>
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-medium">{stat.name}</p>
            <h3 className="text-2xl font-bold tracking-tight mt-1">{stat.value}</h3>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
