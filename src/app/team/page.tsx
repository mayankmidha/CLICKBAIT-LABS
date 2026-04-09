"use client";

import { CreatorManager } from "@/components/founder/CreatorManager";
import { Users, UserPlus } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <Users size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Global Operations</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-white">Team Management</h1>
          <p className="text-zinc-500 mt-2 text-lg">Create and manage accounts for your influencers and production crew.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="vercel-card p-8 bg-gradient-to-br from-red-600/10 to-transparent border-red-600/20">
          <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,0,0,0.3)]">
            <UserPlus size={24} className="text-white" />
          </div>
          <h3 className="text-xl font-bold mb-2 text-white">Scalable Talent</h3>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Add new creators instantly. Each account gets a personalized dashboard based on their niche.
          </p>
        </div>
        
        <div className="vercel-card p-8">
          <h3 className="text-3xl font-black text-white mb-1">12</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Total Creators</p>
          <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
            <div className="bg-red-600 h-full w-[65%]" />
          </div>
          <p className="text-[10px] text-zinc-600 mt-2 font-mono">CAPACITY: 65%</p>
        </div>

        <div className="vercel-card p-8">
          <h3 className="text-3xl font-black text-green-500 mb-1">ACTIVE</h3>
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-4">Pipeline Status</p>
          <p className="text-sm text-zinc-400">All systems operational. No pending shoot delays.</p>
        </div>
      </div>

      <CreatorManager />
    </div>
  );
}
