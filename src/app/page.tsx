import { Cpu, TrendingUp, Calendar, CheckCircle2, Clock } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      <header>
        <h1 className="text-5xl font-extrabold tracking-tighter mb-4">
          Production <span className="text-red-600 italic">Console</span>
        </h1>
        <p className="text-zinc-400 text-lg max-w-2xl">
          Welcome back, founder. The 2026 content engine is operational. 
          150 scripts are being processed through the neural pipeline.
        </p>
      </header>

      <div className="grid grid-cols-4 gap-6">
        {[
          { label: "Total Scripts", val: "150", icon: Clock, color: "text-zinc-400" },
          { label: "Approved", val: "12", icon: CheckCircle2, color: "text-green-500" },
          { label: "Pending", val: "138", icon: Clock, color: "text-amber-500" },
          { label: "Shoot Days Left", val: "4", icon: Calendar, color: "text-red-500" },
        ].map((stat) => (
          <div key={stat.label} className="vercel-card p-6">
            <div className="flex items-center gap-3 mb-4 text-zinc-500">
              <stat.icon size={18} />
              <span className="text-xs font-bold uppercase tracking-widest">{stat.label}</span>
            </div>
            <p className={`text-4xl font-black ${stat.color}`}>{stat.val}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-8 mt-12">
        <div className="vercel-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Cpu size={120} />
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Cpu className="text-red-600" /> Tech Channel
          </h2>
          <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
            High-tech investigations, humanoid robot testing, and the 2026 silicon war reports.
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600 mb-8">
            <span>PIPELINE: ACTIVE</span>
            <span>CAPACITY: 85%</span>
          </div>
          <button className="btn-primary w-full py-3">Enter Control Room</button>
        </div>

        <div className="vercel-card p-8 group overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={120} />
          </div>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <TrendingUp className="text-red-600" /> Finance Channel
          </h2>
          <p className="text-zinc-500 mb-6 text-sm leading-relaxed">
            Macro-economic exposes, the great Indian wealth gap, and 0% tax playbooks.
          </p>
          <div className="flex items-center justify-between text-xs font-mono text-zinc-600 mb-8">
            <span>PIPELINE: ACTIVE</span>
            <span>CAPACITY: 92%</span>
          </div>
          <button className="btn-primary w-full py-3">Enter Control Room</button>
        </div>
      </div>
    </div>
  );
}
