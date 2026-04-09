"use client";

import { Script } from "@/lib/types";
import { Check, X, Eye, FileText, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptTableProps {
  scripts: Script[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onView?: (script: Script) => void;
}

export function ScriptTable({ scripts, onApprove, onReject, onView }: ScriptTableProps) {
  if (scripts.length === 0) {
    return (
      <div className="vercel-card p-20 flex flex-col items-center justify-center text-center">
        <FileText size={40} className="text-zinc-800 mb-4" />
        <h3 className="text-xl font-bold text-zinc-500">No scripts found</h3>
        <p className="text-sm text-zinc-600 mt-1">Try adjusting your filters or checking another channel.</p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 md:space-y-0 overflow-hidden md:vercel-card">
      {/* Desktop Table View */}
      <table className="w-full text-left border-collapse hidden md:table">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Script Title</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">The Hook</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-center">Duration</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">Status</th>
            <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {scripts.map((script) => (
            <tr key={script.id} className="hover:bg-white/[0.02] transition-colors group">
              <td className="px-6 py-4">
                <button 
                  onClick={() => onView?.(script)}
                  className="flex items-center gap-3 font-medium text-zinc-200 group-hover:text-white transition-colors text-left"
                >
                  <FileText size={16} className="text-zinc-500 group-hover:text-red-500" />
                  {script.title}
                </button>
              </td>
              <td className="px-6 py-4 text-sm text-zinc-500 max-w-xs truncate italic">
                &ldquo;{script.hook}&rdquo;
              </td>
              <td className="px-6 py-4 text-center">
                <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full bg-zinc-900 text-[10px] font-mono text-zinc-400 border border-white/5">
                  <Clock size={10} />
                  {script.duration}
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={cn(
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border shadow-sm",
                  script.status === 'approved' && "bg-green-500/10 text-green-500 border-green-500/20",
                  script.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                  script.status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
                )}>
                  {script.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {script.status === 'pending' && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onApprove?.(script.id); }}
                        className="p-2 rounded-md bg-green-500/5 hover:bg-green-500/20 text-zinc-500 hover:text-green-500 transition-all border border-white/5 hover:border-green-500/30"
                        title="Approve Script"
                      >
                        <Check size={16} strokeWidth={3} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); onReject?.(script.id); }}
                        className="p-2 rounded-md bg-red-500/5 hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/30"
                        title="Reject to Bin"
                      >
                        <X size={16} strokeWidth={3} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => onView?.(script)}
                    className="p-2 rounded-md hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-white/5 hover:border-white/10"
                    title="View Full Script"
                  >
                    <Eye size={16} />
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
          <div key={script.id} className="vercel-card p-5 space-y-4 active:scale-[0.99] transition-transform">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-red-600" />
                <h3 className="font-bold text-zinc-100 leading-tight">{script.title}</h3>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border shrink-0",
                script.status === 'approved' && "bg-green-500/10 text-green-500 border-green-500/20",
                script.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                script.status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
              )}>
                {script.status}
              </span>
            </div>
            
            <p className="text-xs text-zinc-500 italic line-clamp-2">
              &ldquo;{script.hook}&rdquo;
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                <Clock size={10} />
                {script.duration}
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => onView?.(script)}
                  className="h-8 px-3 rounded-md bg-zinc-900 text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white border border-white/5"
                >
                  View
                </button>
                {script.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onReject?.(script.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-red-500/10 text-red-500 border border-red-500/20"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                    <button 
                      onClick={() => onApprove?.(script.id)}
                      className="h-8 w-8 flex items-center justify-center rounded-md bg-green-500/10 text-green-500 border border-green-500/20"
                    >
                      <Check size={14} strokeWidth={3} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
