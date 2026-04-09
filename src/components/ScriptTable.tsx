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
                  className="flex items-center gap-3 font-medium text-zinc-200 group-hover:text-white transition-colors"
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
                  "px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-tight border",
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
                        onClick={() => onApprove?.(script.id)}
                        className="p-1.5 rounded-md hover:bg-green-500/20 text-zinc-500 hover:text-green-500 transition-all border border-transparent hover:border-green-500/30"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => onReject?.(script.id)}
                        className="p-1.5 rounded-md hover:bg-red-500/20 text-zinc-500 hover:text-red-500 transition-all border border-transparent hover:border-red-500/30"
                      >
                        <X size={16} />
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => onView?.(script)}
                    className="p-1.5 rounded-md hover:bg-white/10 text-zinc-500 hover:text-white transition-all border border-transparent hover:border-white/10"
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
      <div className="grid grid-cols-1 gap-4 md:hidden pb-20">
        {scripts.map((script) => (
          <div key={script.id} className="vercel-card p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <FileText size={16} className="text-red-600" />
                <h3 className="font-bold text-zinc-100">{script.title}</h3>
              </div>
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase border",
                script.status === 'approved' && "bg-green-500/10 text-green-500 border-green-500/20",
                script.status === 'pending' && "bg-amber-500/10 text-amber-500 border-amber-500/20",
                script.status === 'rejected' && "bg-red-500/10 text-red-500 border-red-500/20",
              )}>
                {script.status}
              </span>
            </div>
            
            <p className="text-xs text-zinc-500 italic">
              &ldquo;{script.hook}&rdquo;
            </p>
            
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div className="flex items-center gap-1 text-[10px] font-mono text-zinc-500">
                <Clock size={10} />
                {script.duration}
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onView?.(script)}
                  className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white"
                >
                  View
                </button>
                {script.status === 'pending' && (
                  <>
                    <button 
                      onClick={() => onReject?.(script.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-red-500"
                    >
                      Reject
                    </button>
                    <button 
                      onClick={() => onApprove?.(script.id)}
                      className="text-[10px] font-bold uppercase tracking-widest text-green-500"
                    >
                      Approve
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
