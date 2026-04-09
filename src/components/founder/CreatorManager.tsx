"use client";

import { useState } from "react";
import { useRole } from "@/lib/store/RoleContext";
import type { ScriptChannel } from "@/lib/types";
import { ObsidianCard, VortexButton } from "../ui/Kit";
import { UserPlus, Trash2, Mail, Briefcase, User } from "lucide-react";

export function CreatorManager() {
  const { creators, addCreator, removeCreator } = useRole();
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    niche: ScriptChannel;
  }>({ name: "", email: "", niche: "tech" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCreator(form);
    setForm({ name: "", email: "", niche: "tech" });
    setIsAdding(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <User className="text-red-600" size={20} />
          Influencer Roster
        </h2>
        <VortexButton onClick={() => setIsAdding(!isAdding)} variant="secondary" className="flex items-center gap-2">
          <UserPlus size={16} />
          Add Creator
        </VortexButton>
      </div>

      {isAdding && (
        <ObsidianCard className="p-6 border-red-600/20 bg-red-600/[0.02]">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label htmlFor="creator-name" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Full Name
              </label>
              <input 
                id="creator-name"
                required
                value={form.name}
                onChange={e => setForm({...form, name: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-red-600/50"
                placeholder="e.g. Valkyrie"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="creator-email" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Email Address
              </label>
              <input 
                id="creator-email"
                required
                type="email"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-red-600/50"
                placeholder="creator@clickbait.com"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="creator-niche" className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Primary Niche
              </label>
              <select 
                id="creator-niche"
                value={form.niche}
                onChange={e => setForm({...form, niche: e.target.value as ScriptChannel})}
                className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-red-600/50"
              >
                <option value="tech">Tech Channel</option>
                <option value="finance">Finance Channel</option>
              </select>
            </div>
            <div className="flex gap-2">
              <VortexButton type="submit" className="flex-1">Create Account</VortexButton>
              <VortexButton type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</VortexButton>
            </div>
          </form>
        </ObsidianCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {creators.map((creator) => (
          <ObsidianCard key={creator.id} className="p-5 group">
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:border-red-600/50 transition-all">
                <User size={20} />
              </div>
              <button 
                onClick={() => removeCreator(creator.id)}
                className="p-2 text-zinc-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
            <h3 className="font-bold text-zinc-100">{creator.name}</h3>
            <div className="space-y-2 mt-3">
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Mail size={12} />
                {creator.email}
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Briefcase size={12} />
                <span className="capitalize">{creator.niche} Expert</span>
              </div>
            </div>
            <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-600">
              <span>JOINED: {creator.createdAt}</span>
              <span className="text-red-600 font-bold uppercase tracking-tighter">Active</span>
            </div>
          </ObsidianCard>
        ))}
      </div>
    </div>
  );
}
