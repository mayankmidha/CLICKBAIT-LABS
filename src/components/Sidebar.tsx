"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Cpu, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  LayoutDashboard, 
  ChevronRight,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const founderItems = [
  { name: "Overview", icon: LayoutDashboard, href: "/" },
  { name: "Tech Channel", icon: Cpu, href: "/tech" },
  { name: "Finance Channel", icon: TrendingUp, href: "/finance" },
  { name: "The Bin", icon: Trash2, href: "/bin" },
];

const creatorItems = [
  { name: "Shoot Schedule", icon: Calendar, href: "/schedule" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [role, setRole] = useState<'founder' | 'creator'>('founder');

  const menuItems = role === 'founder' ? founderItems : creatorItems;

  return (
    <aside className="w-64 border-r border-white/10 flex flex-col bg-black min-h-screen">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center font-bold text-white group-hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] transition-all">
            CB
          </div>
          <span className="font-bold tracking-tighter text-xl italic">CLICKBAIT</span>
        </Link>
      </div>

      <div className="px-4 mb-6">
        <button 
          onClick={() => setRole(role === 'founder' ? 'creator' : 'founder')}
          className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-zinc-900 border border-white/5 hover:border-red-600/30 transition-all group"
        >
          <div className="flex items-center gap-2">
            {role === 'founder' ? <ShieldCheck size={14} className="text-red-500" /> : <Zap size={14} className="text-amber-500" />}
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 group-hover:text-white">
              Mode: {role}
            </span>
          </div>
          <ChevronRight size={12} className="text-zinc-600 group-hover:text-white" />
        </button>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        <p className="px-3 text-[9px] font-black uppercase tracking-[0.2em] text-zinc-600 mb-2">Navigation</p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-md text-xs font-bold uppercase tracking-wider transition-all group",
                isActive 
                  ? "bg-red-600/10 text-red-500 border border-red-600/20 shadow-[0_0_10px_rgba(255,0,0,0.05)]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon size={16} className={isActive ? "text-red-500" : "group-hover:text-white"} />
                {item.name}
              </div>
              {isActive && <div className="w-1 h-1 rounded-full bg-red-500 shadow-[0_0_5px_#ff0000]" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10 bg-zinc-950/50">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border border-white/10 ring-2 ring-red-600/20">
            <User size={16} className="text-zinc-400" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-black uppercase tracking-tight text-white">
              {role === 'founder' ? 'MAYANK' : 'CREATOR'}
            </p>
            <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest leading-none mt-1">
              {role === 'founder' ? 'Co-Founder' : 'Production Team'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
