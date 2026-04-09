"use client";

import { useState } from "react";
import { initialScripts } from "@/lib/data";
import { Script } from "@/lib/types";
import { ScriptTable } from "@/components/ScriptTable";
import { Cpu, Search, Filter, X } from "lucide-react";

export default function TechPage() {
  const [scripts, setScripts] = useState<Script[]>(
    initialScripts.filter(s => s.channel === 'tech' && s.status !== 'deleted')
  );
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);

  const handleApprove = (id: string) => {
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleReject = (id: string) => {
    // In a real app, this would update DB and move to 'bin'
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <Cpu size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Production Pipeline</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Tech Channel</h1>
          <p className="text-zinc-500 mt-2">Manage and approve high-retention tech scripts for the 2026 roadmap.</p>
        </div>
        
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search scripts..." 
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm focus:outline-none focus:border-red-600/50 transition-all w-64"
            />
          </div>
          <button className="btn-secondary flex items-center gap-2 text-sm">
            <Filter size={16} />
            Filter
          </button>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-4">
        <div className="vercel-card p-6">
          <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Queue</p>
          <p className="text-3xl font-bold">{scripts.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="vercel-card p-6">
          <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-500">{scripts.filter(s => s.status === 'approved').length}</p>
        </div>
        <div className="vercel-card p-6">
          <p className="text-zinc-500 text-xs font-medium uppercase mb-1">Ready to Shoot</p>
          <p className="text-3xl font-bold text-red-500">2</p>
        </div>
      </div>

      <ScriptTable 
        scripts={scripts} 
        onApprove={handleApprove}
        onReject={handleReject}
        onView={setSelectedScript}
      />

      {selectedScript && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-8">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-4xl max-h-[80vh] rounded-xl flex flex-col shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-bold">{selectedScript.title}</h2>
                <p className="text-xs text-zinc-500 mt-1 uppercase tracking-wider">{selectedScript.channel} • {selectedScript.duration}</p>
              </div>
              <button 
                onClick={() => setSelectedScript(null)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 font-mono text-sm leading-relaxed text-zinc-300">
              <pre className="whitespace-pre-wrap">{selectedScript.content}</pre>
            </div>
            <div className="p-6 border-t border-white/10 bg-zinc-900/50 flex justify-end gap-3">
              <button onClick={() => setSelectedScript(null)} className="btn-secondary text-sm px-6">Close</button>
              {selectedScript.status === 'pending' && (
                <button 
                  onClick={() => {
                    handleApprove(selectedScript.id);
                    setSelectedScript(null);
                  }} 
                  className="btn-primary text-sm px-8"
                >
                  Approve Script
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
