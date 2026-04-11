"use client";

import { CreatorManager } from "@/components/founder/CreatorManager";
import { Users } from "lucide-react";

export default function TeamPage() {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <header>
        <div className="flex items-center gap-2 text-red-500 mb-2">
          <Users size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Team</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Creators</h1>
        <p className="text-zinc-500 mt-2">Manage creator accounts. Each creator gets assigned scripts for shoot days.</p>
      </header>

      <CreatorManager />
    </div>
  );
}
