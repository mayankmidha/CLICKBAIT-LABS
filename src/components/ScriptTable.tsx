"use client";

import { Script } from "@/lib/types";
import { Check, X, Eye, FileText, Clock, RotateCcw, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/store/RoleContext";
import { ObsidianCard } from "./ui/Kit";

interface ScriptTableProps {
  scripts: Script[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onRestore?: (id: string) => void;
  onAssignToShoot?: (id: string) => void;
  onView?: (script: Script) => void;
}

export function ScriptTable({ scripts, onApprove, onReject, onRestore, onAssignToShoot, onView }: ScriptTableProps) {
  const { canApprove } = useRole();

  if (scripts.length === 0) {
    return (
      <div className="vercel-card p-20 flex flex-col items-center justify-center text-center border-white/5 bg-zinc-950/20">
        <FileText size={40} className="text-zinc-800 mb-4" />
        <h3 className="text-xl font-bold text-zinc-500 tracking-tight">Zero scripts in this sector</h3>
        <p className="text-xs text-zinc-600 mt-2 font-medium">The pipeline is clear. Awaiting new research data.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-0 overflow-hidden md:vercel-card border-white/5">
      {/* Desktop Table View */}
      <table className="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr className="border-b border-white/5 bg-white/[0.02]">
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Asset Title</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">The Hook</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-center">Duration</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Status</th>
            <th className="px-6 py-5 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 bg-zinc-950/10">
          {scripts.map((script) => (
            <tr key={script.id} className="hover:bg-white/[0.03] transition-colors group">
              <td className="px-6 py-4">
                <button 
                  onClick={() => onView?.(script)}
                  className="flex items-center gap-3 font-bold text-zinc-200 group-hover:text-white transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center group-hover:border-red-600/30 transition-all shadow-inner">
                    <FileText size={14} className="text-zinc-600 group-hover:text-red-500" />
                  </div>
                  <span>{script.title}</span>
                </button>
              </td>
              <td className="px-6 py-4 text-xs text-zinc-500 max-w-xs truncate italic font-medium">
                "{script.hook}"
              </td>
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-zinc-900 text-[10px] font-black text-zinc-400 border border-white/5 shadow-sm">
                  <Clock size={10} className="text-red-600" />
                  {script.duration}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2.5 py-0.5 rounded text-[9px] font-black uppercase tracking-widest border shadow-[0_0_15px_rgba(0,0,0,0.2)]",
                  script.status === 'approved' && "bg-green-500/10 text-green-500 border-green-500/20",
                  script.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  script.status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
                )}>
                  {script.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {canApprove && (
                    <>
                      {script.status === 'pending' && (
                        <>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onApprove?.(script.id); }}
                            className="p-2 rounded bg-green-500/5 hover:bg-green-500 text-zinc-500 hover:text-white transition-all border border-white/5 hover:border-green-500/50 shadow-sm"
                            title="Approve Asset"
                          >
                            <Check size={14} strokeWidth={3} />
                          </button>
                          <button 
                            onClick={(e) => { e.stopPropagation(); onReject?.(script.id); }}
                            className="p-2 rounded bg-red-500/5 hover:bg-red-600 text-zinc-500 hover:text-white transition-all border border-white/5 hover:border-red-600/50 shadow-sm"
                            title="Move to Bin"
                          >
                            <X size={14} strokeWidth={3} />
                          </button>
                        </>
                      )}
                      {script.status === 'approved' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onAssignToShoot?.(script.id); }}
                          className="p-2 rounded bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white transition-all border border-red-600/20 hover:border-red-600/50 shadow-sm"
                          title="Assign to Shoot Date"
                        >
                          <Calendar size={14} strokeWidth={2.5} />
                        </button>
                      )}
                      {script.status === 'rejected' && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRestore?.(script.id); }}
                          className="p-2 rounded bg-blue-500/5 hover:bg-blue-600 text-zinc-500 hover:text-white transition-all border border-white/5 hover:border-blue-600/50 shadow-sm"
                          title="Restore Asset"
                        >
                          <RotateCcw size={14} strokeWidth={3} />
                        </button>
                      )}
                    </>
                  )}
                  <button 
                    onClick={() => onView?.(script)}
                    className="p-2 rounded bg-white/5 hover:bg-white text-zinc-500 hover:text-black transition-all border border-white/5 shadow-sm"
                    title="Reader"
                  >
                    <Eye size={14} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {scripts.map((script) => (
          <ObsidianCard key={script.id} className="p-5 space-y-4 border-white/5 bg-zinc-950/40">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-900 border border-white/5 flex items-center justify-center">
                  <FileText size={14} className="text-red-600" />
                </div>
                <h3 className="font-bold text-sm text-zinc-100 leading-tight">{script.title}</h3>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border shrink-0 shadow-lg",
                script.status === 'approved' && "bg-green-500/10 text-green-500 border-green-500/20",
                script.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                script.status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
              )}>
                {script.status}
              </span>
            </div>
            
            <p className="text-[11px] text-zinc-500 italic line-clamp-2 font-medium">"{script.hook}"</p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase text-zinc-500">
                <Clock size={10} className="text-red-600" />
                {script.duration}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onView?.(script)}
                  className="h-8 px-4 rounded bg-zinc-900 text-[9px] font-black uppercase tracking-widest text-zinc-400 hover:text-white border border-white/5 shadow-inner"
                >
                  Read
                </button>
                {canApprove && (
                  <>
                    {script.status === 'pending' && (
                      <>
                        <button 
                          onClick={() => onReject?.(script.id)}
                          className="h-8 w-8 flex items-center justify-center rounded bg-red-600/10 text-red-500 border border-red-600/20"
                        >
                          <X size={14} strokeWidth={3} />
                        </button>
                        <button 
                          onClick={() => onApprove?.(script.id)}
                          className="h-8 w-8 flex items-center justify-center rounded bg-green-500/10 text-green-500 border border-green-500/20"
                        >
                          <Check size={14} strokeWidth={3} />
                        </button>
                      </>
                    )}
                    {script.status === 'approved' && (
                      <button 
                        onClick={() => onAssignToShoot?.(script.id)}
                        className="h-8 w-8 flex items-center justify-center rounded bg-red-600/10 text-red-500 border border-red-600/20"
                      >
                        <Calendar size={14} />
                      </button>
                    )}
                    {script.status === 'rejected' && (
                      <button 
                        onClick={() => onRestore?.(script.id)}
                        className="h-8 w-8 flex items-center justify-center rounded bg-blue-500/10 text-blue-500 border border-blue-500/20"
                      >
                        <RotateCcw size={14} strokeWidth={3} />
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </ObsidianCard>
        ))}
      </div>
    </div>
  );
}
