"use client";

import { initialScripts } from "@/lib/data";
import { Calendar, Clock, MapPin, Video, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock shoot data for the Influencer view
const shootSchedule = [
  {
    id: "s1",
    scriptId: "t2", // AI Job Massacre
    date: "2026-04-12",
    time: "09:00 AM",
    location: "Studio A - Cyberpunk Set",
    status: "confirmed",
  },
  {
    id: "s2",
    scriptId: "f1", // Middle Class Trap
    date: "2026-04-15",
    time: "02:00 PM",
    location: "Outdoor - Mumbai Metro",
    status: "pending",
  }
];

export default function SchedulePage() {
  const approvedScripts = initialScripts.filter(s => s.status === 'approved');

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-red-500">
          <Calendar size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Call Sheet</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight">Shoot Schedule</h1>
        <p className="text-zinc-500 text-sm md:text-base">
          Upcoming productions for Mayank & Tathagat. Review your scripts and arrival times.
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-zinc-300 px-1">Upcoming Shoots</h2>
        <div className="grid gap-4">
          {shootSchedule.map((shoot) => {
            const script = initialScripts.find(s => s.id === shoot.scriptId);
            return (
              <div key={shoot.id} className="vercel-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-600/10 border border-red-600/20 flex items-center justify-center shrink-0">
                    <Video size={24} className="text-red-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-red-500 transition-colors">
                      {script?.title || "Untitled Production"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Calendar size={14} className="text-zinc-400" />
                        {shoot.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <Clock size={14} className="text-zinc-400" />
                        {shoot.time}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                        <MapPin size={14} className="text-zinc-400" />
                        {shoot.location}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border",
                    shoot.status === 'confirmed' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                  )}>
                    {shoot.status}
                  </span>
                  <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                    Read Script <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="space-y-4 pt-8">
        <h2 className="text-lg font-semibold text-zinc-300 px-1">Script Library (Approved)</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
          {approvedScripts.map((script) => (
            <div key={script.id} className="vercel-card p-5 hover:bg-white/[0.02] transition-all cursor-pointer border-l-4 border-l-red-600">
              <h3 className="font-bold text-sm mb-2">{script.title}</h3>
              <p className="text-xs text-zinc-500 line-clamp-2 italic mb-4">
                &ldquo;{script.hook}&rdquo;
              </p>
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span>EST. DUR: {script.duration}</span>
                <span className="text-red-600 font-bold uppercase tracking-tighter">Ready to Filming</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
