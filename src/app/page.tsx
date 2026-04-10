"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useRole } from "@/lib/store/RoleContext";
import { getScripts } from "@/app/actions/scripts";
import { Script } from "@/lib/types";
import { ObsidianCard, VortexButton, StatusBadge } from "@/components/ui/Kit";
import { 
  Zap, 
  Cpu, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight,
  Video,
  Layers,
  BarChart3
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { user } = useRole();
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    async function loadData() {
      const data = await getScripts();
      setScripts(data as any);
      setIsLoading(false);
    }
    loadData();
  }, [user, router]);

  const stats = useMemo(() => {
    const tech = scripts.filter((s: any) => s.channel === 'tech');
    const finance = scripts.filter((s: any) => s.channel === 'finance');

    return {
      total: scripts.length,
      approved: scripts.filter((s: any) => s.status === 'approved').length,
      pending: scripts.filter((s: any) => s.status === 'pending').length,
      techCount: tech.length,
      financeCount: finance.length,
      shootQueue: scripts.filter((s: any) => s.status === 'approved').slice(0, 5)
    };
  }, [scripts]);

  if (!user || isLoading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-zinc-800">Synchronizing Command Center...</div>;

  return (
    <div className="space-y-10 max-w-7xl mx-auto pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-red-500 mb-2"
          >
            <Zap size={16} className="fill-red-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">System Operational</span>
          </motion.div>
          <h1 className="text-5xl font-black tracking-tighter text-white">
            Command <span className="text-red-600">Center</span>
          </h1>
          <p className="text-zinc-500 mt-2 text-lg font-medium">
            Production intelligence for <span className="text-zinc-300">Clickbait Labs</span>. 2026 roadmap active.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <VortexButton onClick={() => router.push('/shoot')} variant="secondary" className="flex items-center gap-2 px-6">
            <Video size={16} />
            Initialize Shoot
          </VortexButton>
          <VortexButton 
            onClick={() => router.push('/creator/new')}
            className="flex items-center gap-2 px-6 shadow-red-600/20"
          >
            <Zap size={16} />
            Neural Generate
          </VortexButton>
        </div>
      </header>

      {/* Primary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Pipeline Depth", val: stats.total, sub: "Total Scripts", icon: Layers, color: "text-white" },
          { label: "Ready to Shoot", val: stats.approved, sub: "Approved Assets", icon: CheckCircle2, color: "text-green-500" },
          { label: "In Review", val: stats.pending, sub: "Neural Processing", icon: Clock, color: "text-amber-500" },
          { label: "Production Load", val: "92%", sub: "System Capacity", icon: BarChart3, color: "text-red-500" },
        ].map((stat, i) => (
          <ObsidianCard key={stat.label} className="p-6 relative group border-white/5 bg-zinc-950/30">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5 text-zinc-400 group-hover:text-white transition-colors">
                <stat.icon size={20} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-600">0{i+1}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-4xl font-black tracking-tighter ${stat.color}`}>{stat.val}</p>
              <span className="text-[10px] font-medium text-zinc-600">{stat.sub}</span>
            </div>
          </ObsidianCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Channel Control Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/5" />
            Channel Nodes
            <div className="h-px flex-1 bg-white/5" />
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ObsidianCard className="p-8 group cursor-pointer border-white/10 hover:border-red-600/40 bg-gradient-to-br from-zinc-900/50 to-transparent" onClick={() => router.push('/tech')}>
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center shadow-[0_0_20px_rgba(255,0,0,0.2)]">
                  <Cpu size={24} className="text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{stats.techCount}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Tech Scripts</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Tech Channel</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Investigations into silicon wars, humanoid robotics, and the 2026 AI singularity.
              </p>
              <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
                Access Node <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </ObsidianCard>

            <ObsidianCard className="p-8 group cursor-pointer border-white/10 hover:border-red-600/40 bg-gradient-to-br from-zinc-900/50 to-transparent" onClick={() => router.push('/finance')}>
              <div className="flex justify-between items-start mb-12">
                <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-white/10 flex items-center justify-center group-hover:bg-red-600 transition-all">
                  <TrendingUp size={24} className="text-zinc-400 group-hover:text-white" />
                </div>
                <div className="text-right">
                  <p className="text-3xl font-black text-white">{stats.financeCount}</p>
                  <p className="text-[10px] font-bold text-zinc-500 uppercase">Finance Scripts</p>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Finance Channel</h3>
              <p className="text-zinc-500 text-sm leading-relaxed mb-8">
                Macro-economic exposes, 0% tax playbooks, and the 2026 Indian wealth gap.
              </p>
              <div className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest">
                Access Node <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </ObsidianCard>
          </div>
        </div>

        {/* Live Shoot Queue */}
        <div className="space-y-6">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600 flex items-center gap-2">
            <div className="h-px flex-1 bg-white/5" />
            Shoot Queue
            <div className="h-px flex-1 bg-white/5" />
          </h2>

          <ObsidianCard className="p-6 bg-zinc-950/50 border-red-600/10">
            <div className="space-y-4">
              {stats.shootQueue.map((script, i) => (
                <div key={script.id} className="flex gap-4 group cursor-pointer border-b border-white/5 pb-4 last:border-0 last:pb-0">
                  <div className="text-xs font-mono text-zinc-700 mt-1">{i + 1}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-zinc-200 truncate group-hover:text-red-500 transition-colors">
                      {script.title}
                    </h4>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-tighter mt-1">
                      {script.channel} &bull; {script.duration}
                    </p>
                  </div>
                  <StatusBadge status="approved" />
                </div>
              ))}
              
              <VortexButton 
                onClick={() => router.push('/shoot')}
                variant="secondary" 
                className="w-full mt-4 text-[10px] py-3"
              >
                Launch 25-Script Workflow
              </VortexButton>
            </div>
          </ObsidianCard>

          <ObsidianCard className="p-6 bg-red-600/[0.03] border-red-600/20">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-red-600" size={20} />
              <h3 className="font-bold text-sm text-white">System Alert</h3>
            </div>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Batch 12 processing complete. All 150 scripts are now available in the control nodes. Verify assignments before April 12 shoot.
            </p>
          </ObsidianCard>
        </div>
      </div>
    </div>
  );
}
