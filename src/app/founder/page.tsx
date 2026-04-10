"use client";

import { useState, useEffect } from "react";
import { getScripts } from "@/app/actions/scripts";
import { Script } from "@/lib/types";
import { ObsidianCard, VortexButton } from "@/components/ui/Kit";
import { Users, LayoutGrid, BarChart3, TrendingUp, Cpu, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function FounderDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    tech: 0,
    finance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      const allScripts = await getScripts();
      setStats({
        total: allScripts.length,
        approved: allScripts.filter(s => s.status === 'approved').length,
        pending: allScripts.filter(s => s.status === 'pending').length,
        tech: allScripts.filter(s => s.channel === 'tech').length,
        finance: allScripts.filter(s => s.channel === 'finance').length,
      });
      setIsLoading(false);
    }
    loadStats();
  }, []);

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-zinc-800">Neural Sync in Progress...</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Founder <span className="text-red-600">Control</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">
            Global production metrics for <span className="text-zinc-300">Clickbait Labs</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VortexButton variant="secondary" className="flex items-center gap-2 px-6">
            <Users size={16} />
            Manage Team
          </VortexButton>
        </div>
      </header>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scripts", val: stats.total, icon: LayoutGrid, color: "text-white" },
          { label: "Ready to Shoot", val: stats.approved, icon: CheckCircle2, color: "text-green-500" },
          { label: "In Review", val: stats.pending, icon: Clock, color: "text-amber-500" },
          { label: "Avg. Engagement", val: "4.2%", icon: TrendingUp, color: "text-red-500" },
        ].map((stat, i) => (
          <ObsidianCard key={stat.label} className="p-6 border-white/5 bg-zinc-950/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
            </div>
          </ObsidianCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ObsidianCard className="lg:col-span-2 p-8 border-white/10 bg-zinc-900/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-red-600" />
            Channel Distribution
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-300">Tech Channel</span>
                </div>
                <span className="text-xs font-black text-zinc-500">{stats.tech} Scripts</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.tech / stats.total) * 100}%` }}
                  className="h-full bg-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-300">Finance Channel</span>
                </div>
                <span className="text-xs font-black text-zinc-500">{stats.finance} Scripts</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(stats.finance / stats.total) * 100}%` }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>
        </ObsidianCard>

        <div className="space-y-6">
          <ObsidianCard className="p-6 border-white/10 bg-zinc-950/50">
            <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Active Creators</h3>
            <div className="space-y-4">
              {[
                { name: "Valkyrie", niche: "Tech", count: 42 },
                { name: "Kira", niche: "Finance", count: 18 },
              ].map(creator => (
                <div key={creator.name} className="flex items-center justify-between p-3 rounded bg-white/5 border border-white/5">
                  <div>
                    <p className="text-sm font-bold text-white">{creator.name}</p>
                    <p className="text-[10px] text-zinc-500 uppercase font-black tracking-tighter">{creator.niche}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-black text-zinc-400">{creator.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </ObsidianCard>
        </div>
      </div>
    </div>
  );
}
