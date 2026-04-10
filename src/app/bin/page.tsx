"use client";

import { useState, useEffect } from "react";
import { getScripts, updateScriptStatus } from "@/app/actions/scripts";
import { Script } from "@/lib/types";
import { ScriptTable } from "@/components/ScriptTable";
import { Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function BinPage() {
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedScript, setSelectedScript] = useState<Script | null>(null);

  useEffect(() => {
    async function loadScripts() {
      try {
        const data = await getScripts(undefined, 'rejected');
        if (data && data.length > 0) {
          setScripts(data as any);
        }
      } catch (e) {
        console.error('Bin Sync Error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadScripts();
  }, []);

  const handleRestore = async (id: string) => {
    await updateScriptStatus(id, 'pending');
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-zinc-800">Neural Sync in Progress...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header>
        <div className="flex items-center gap-2 text-red-500 mb-2">
          <Trash2 size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Archive</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">The Bin</h1>
        <p className="text-zinc-500 mt-2">Rejected or archived scripts. Only Mayank & Tathagat can restore from here.</p>
      </header>

      {scripts.length === 0 ? (
        <div className="vercel-card p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-zinc-900 flex items-center justify-center mb-4">
            <Trash2 size={24} className="text-zinc-700" />
          </div>
          <h3 className="text-xl font-bold text-zinc-400">The bin is empty</h3>
          <p className="text-sm text-zinc-600 mt-1">No scripts have been rejected yet.</p>
        </div>
      ) : (
        <ScriptTable 
          scripts={scripts} 
          onRestore={handleRestore}
          onView={setSelectedScript}
        />
      )}

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
            <div className="flex-1 overflow-y-auto p-6 md:p-12 font-mono text-sm leading-relaxed text-zinc-300">
              <div className="max-w-3xl mx-auto space-y-8 whitespace-pre-wrap">
                {selectedScript.content}
              </div>
            </div>
            <div className="p-6 border-t border-white/10 bg-zinc-900/80 flex flex-col md:flex-row justify-end gap-4">
              <button 
                onClick={() => setSelectedScript(null)} 
                className="px-8 py-3 rounded-md bg-white/5 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-white/10 border border-white/10"
              >
                Close Reader
              </button>
              <button 
                onClick={() => { handleRestore(selectedScript.id); setSelectedScript(null); }}
                className="px-12 py-3 rounded-md bg-blue-600 text-white font-bold uppercase tracking-widest text-[10px] hover:bg-blue-700 shadow-[0_0_20px_rgba(0,0,255,0.3)]"
              >
                Restore to Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
