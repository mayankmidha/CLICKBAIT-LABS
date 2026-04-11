"use client";

import { useState, useEffect } from "react";
import { getScripts } from "@/app/actions/scripts";
import { Script } from "@/lib/types";
import { ObsidianCard, VortexButton } from "@/components/ui/Kit";
import { Users, LayoutGrid, BarChart3, TrendingUp, Cpu, Clock, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function FounderDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    tech: 0,
    finance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const allScripts = await getScripts();
        if (allScripts && allScripts.length > 0) {
          setStats({
            total: allScripts.length,
            approved: allScripts.filter((s: any) => s.status === 'approved').length,
            pending: allScripts.filter((s: any) => s.status === 'pending').length,
            rejected: allScripts.filter((s: any) => s.status === 'rejected').length,
            tech: allScripts.filter((s: any) => s.channel === 'tech').length,
            finance: allScripts.filter((s: any) => s.channel === 'finance').length,
          });
        }
      } catch (e) {
        console.error('Stats Error:', e);
      } finally {
        setIsLoading(false);
      }
    }
    loadStats();
  }, []);

  if (isLoading) return <div className="p-20 text-center font-bold uppercase tracking-widest text-zinc-700">Loading...</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-white">
            Overview
          </h1>
          <p className="text-zinc-500 mt-2 text-lg">
            Production metrics for <span className="text-zinc-300">Clickbait Labs</span>.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VortexButton onClick={() => router.push('/team')} variant="secondary" className="flex items-center gap-2 px-6">
            <Users size={16} />
            Manage Creators
          </VortexButton>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Scripts", val: stats.total, icon: LayoutGrid, color: "text-white" },
          { label: "Approved", val: stats.approved, icon: CheckCircle2, color: "text-green-500" },
          { label: "Pending Review", val: stats.pending, icon: Clock, color: "text-amber-500" },
          { label: "Rejected", val: stats.rejected, icon: TrendingUp, color: "text-red-500" },
        ].map((stat) => (
          <ObsidianCard key={stat.label} className="p-6 border-white/5 bg-zinc-950/30">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
            <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
          </ObsidianCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <ObsidianCard className="lg:col-span-2 p-8 border-white/10 bg-zinc-900/50">
          <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <BarChart3 size={20} className="text-red-600" />
            Channel Breakdown
          </h3>
          <div className="space-y-8">
            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <Cpu size={14} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-300">Tech</span>
                </div>
                <span className="text-xs font-bold text-zinc-500">{stats.tech} scripts</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total ? (stats.tech / stats.total) * 100 : 0}%` }}
                  className="h-full bg-red-600"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={14} className="text-zinc-400" />
                  <span className="text-sm font-bold text-zinc-300">Finance</span>
                </div>
                <span className="text-xs font-bold text-zinc-500">{stats.finance} scripts</span>
              </div>
              <div className="h-2 w-full bg-zinc-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total ? (stats.finance / stats.total) * 100 : 0}%` }}
                  className="h-full bg-white"
                />
              </div>
            </div>
          </div>
        </ObsidianCard>

        <ObsidianCard className="p-6 border-white/10 bg-zinc-950/50">
          <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Quick Actions</h3>
          <div className="space-y-3">
            <VortexButton onClick={() => router.push('/tech')} variant="secondary" className="w-full justify-start gap-2">
              <Cpu size={14} /> Review Tech Scripts
            </VortexButton>
            <VortexButton onClick={() => router.push('/finance')} variant="secondary" className="w-full justify-start gap-2">
              <TrendingUp size={14} /> Review Finance Scripts
            </VortexButton>
            <VortexButton onClick={() => router.push('/shoot')} className="w-full justify-start gap-2">
              Shoot Day
            </VortexButton>
          </div>
        </ObsidianCard>
      </div>
    </div>
  );
}
