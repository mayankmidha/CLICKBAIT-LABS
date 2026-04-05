'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Home, User, Image, Settings, Zap } from 'lucide-react'

const navItems = [
  { name: 'Factory Floor', href: '/', icon: Home },
  { name: 'Talent Agency', href: '/matrix', icon: User },
  { name: 'Asset Library', href: '/library', icon: Image },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 h-screen bg-black border-r border-white/10 flex flex-col p-6 fixed left-0 top-0 z-50">
      <div className="flex items-center gap-3 mb-12 px-2">
        <Zap className="text-white" size={24} />
        <span className="font-bold tracking-tighter text-lg text-white">CLICKBAIT LABS</span>
      </div>

      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive ? "bg-white/5 text-white" : "text-zinc-500 hover:text-white"}`}
            >
              <item.icon size={18} />
              <span className="font-medium text-sm">{item.name}</span>
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
          <span className="font-medium text-sm text-white">Settings</span>
        </Link>
      </div>
    </div>
  )
}
