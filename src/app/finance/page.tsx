"use client";

import { useState, useMemo, useEffect } from "react";
import { getScripts, updateScriptStatus } from "@/app/actions/scripts";
import { Script, ScriptStatus } from "@/lib/types";
import { ScriptTable } from "@/components/ScriptTable";
import { TrendingUp, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FinancePage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);
  const [statusFilter, setStatusFilter] = useState<ScriptStatus | 'all'>('pending');
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function loadScripts() {
      try {
        const data = await getScripts('finance');
        if (data && data.length > 0) {
          setScripts(data as any);
        }
      } catch (e) {
        console.error('Finance Sync Error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadScripts();
  }, []);

  const filteredScripts = useMemo(() => {
    return scripts.filter((s: any) => {
      const matchesStatus = statusFilter === 'all' ? s.status !== 'deleted' : s.status === statusFilter;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.hook.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [scripts, statusFilter, searchQuery]);

  const handleApprove = async (id: string) => {
    await updateScriptStatus(id, 'approved');
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'approved' } : s));
  };

  const handleReject = async (id: string) => {
    await updateScriptStatus(id, 'rejected');
    setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'rejected' } : s));
  };

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-zinc-800">Neural Sync in Progress...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <TrendingUp size={20} />
            <span className="text-xs font-bold uppercase tracking-widest">Macro-Economic Forge</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Finance Channel</h1>
          <p className="text-zinc-500 mt-2">Manage investigative finance scripts, tax playbooks, and market exposes.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 md:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search scripts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-md text-sm focus:outline-none focus:border-red-600/50 transition-all w-full md:w-64"
            />
          </div>
          
          <div className="flex bg-zinc-900 border border-white/10 rounded-md p-1">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1 rounded text-[10px] font-bold uppercase tracking-tighter transition-all",
                  statusFilter === status 
                    ? "bg-red-600 text-white shadow-lg" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="vercel-card p-6">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Queue</p>
          <p className="text-3xl font-bold">{scripts.filter(s => s.status === 'pending').length}</p>
        </div>
        <div className="vercel-card p-6 border-l-4 border-l-green-500/50">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Approved</p>
          <p className="text-3xl font-bold text-green-500">{scripts.filter(s => s.status === 'approved').length}</p>
        </div>
        <div className="vercel-card p-6 border-l-4 border-l-red-600/50">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Rejected</p>
          <p className="text-3xl font-bold text-red-500">{scripts.filter(s => s.status === 'rejected').length}</p>
        </div>
        <div className="vercel-card p-6 border-l-4 border-l-red-600/50">
          <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Cap at Risk</p>
          <p className="text-3xl font-bold text-red-500">₹{scripts.length * 1.5}L</p>
        </div>
      </div>

      <ScriptTable 
        scripts={filteredScripts} 
        onApprove={handleApprove}
        onReject={handleReject}
        onView={setSelectedScript}
      />

      {selectedScript && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-8">
          <div className="bg-zinc-950 border border-white/10 w-full max-w-5xl max-h-[90vh] rounded-xl flex flex-col shadow-[0_0_50px_rgba(255,0,0,0.1)] overflow-hidden">
            <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
              <div>
                <h2 className="text-xl font-bold text-white">{selectedScript.title}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedScript.channel} CHANNEL</span>
                  <div className="w-1 h-1 rounded-full bg-zinc-700" />
                  <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{selectedScript.duration} ESTIMATED</span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedScript(null)}
                className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-all border border-transparent hover:border-red-500/20"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 md:p-12 font-mono text-sm leading-relaxed text-zinc-300 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed">
              <div className="max-w-3xl mx-auto space-y-4">
                {selectedScript.content.split('\n').map((line, i) => {
                  const isVisual = line.startsWith('[VISUAL') || line.startsWith('**VISUAL');
                  const isHost = line.startsWith('HOST:') || line.startsWith('**HOST:');
                  const isHeading = line.startsWith('#');
                  
                  return (
                    <p key={i} className={cn(
                      "min-h-[1em]",
                      isVisual && "text-red-500/80 italic text-xs border-l-2 border-red-500/30 pl-4 py-1 my-4",
                      isHost && "text-white font-bold text-lg mt-6 mb-2",
                      isHeading && "text-3xl font-black text-white border-b-2 border-red-600 pb-4 mb-10 mt-12",
                      !isVisual && !isHost && !isHeading && line.trim() !== "" && "text-zinc-400"
                    )}>
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-zinc-900/80 flex flex-col md:flex-row justify-end gap-4">
              <button 
                onClick={() => setSelectedScript(null)} 
                className="px-8 py-3 rounded-md bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 border border-white/10"
              >
                Close Reader
              </button>
              {selectedScript.status === 'pending' && (
                <>
                  <button 
                    onClick={() => { handleReject(selectedScript.id); setSelectedScript(null); }}
                    className="px-8 py-3 rounded-md bg-red-600/10 text-red-500 font-bold uppercase tracking-widest text-[10px] hover:bg-red-600/20 border border-red-600/30"
                  >
                    Reject Script
                  </button>
                  <button 
                    onClick={() => { handleApprove(selectedScript.id); setSelectedScript(null); }}
                    className="px-12 py-3 rounded-md bg-red-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-red-700 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                  >
                    Approve for Production
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
