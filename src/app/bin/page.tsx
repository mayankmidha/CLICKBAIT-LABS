"use client";

import { initialScripts } from "@/lib/data";
import { ScriptTable } from "@/components/ScriptTable";
import { Trash2 } from "lucide-react";

export default function BinPage() {
  const scripts = initialScripts.filter((script) => script.status === "rejected");

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
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
        <ScriptTable scripts={scripts} />
      )}
    </div>
  );
}
