'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Users, 
  BarChart3, 
  Settings,
  Zap,
  FolderKanban
} from 'lucide-react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const navItems = [
  { name: 'Factory Floor', href: '/', icon: LayoutDashboard },
  { name: 'Talent Agency', href: '/matrix', icon: Users },
  { name: 'Asset Library', href: '/library', icon: FolderKanban },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
          <Zap className="text-black fill-black" size={18} />
        </div>
        <span className="font-bold tracking-tighter text-lg">CLICKBAIT LABS</span>
      </div>

      <nav className="flex-1 space-y-2">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700 mb-4 px-4">Navigation</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative",
                isActive ? "text-white" : "text-zinc-500 hover:text-white"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="active-nav"
                  className="absolute inset-0 bg-white/5 rounded-xl border border-white/10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon size={18} className={cn("relative z-10", isActive ? "text-white" : "group-hover:text-white")} />
              <span className="relative z-10 font-medium text-sm">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      <div className="mt-auto pt-6 border-t border-white/5">
        <Link
          href="/settings"
          className="flex items-center gap-3 px-4 py-3 text-zinc-500 hover:text-white transition-colors"
        >
          <Settings size={18} />
          <span className="font-medium text-sm">Settings</span>
        </Link>
      </div>
    </div>
  )
}
