"use client";

import { initialScripts } from "@/lib/data";
import { ObsidianCard, StatusBadge, VortexButton } from "@/components/ui/Kit";
import { 
  Calendar, 
  MapPin, 
  Users,
  Camera,
  Layers
} from "lucide-react";

const shootSchedule = [
  {
    id: "s1",
    scriptId: "t2",
    date: "April 12, 2026",
    time: "09:00 AM",
    location: "Studio A - Cyberpunk Set",
    status: "confirmed",
    crew: ["Mayank", "Rahul (Camera)"],
  },
  {
    id: "s2",
    scriptId: "f1",
    date: "April 15, 2026",
    time: "02:00 PM",
    location: "Outdoor - Mumbai Metro",
    status: "pending",
    crew: ["Tathagat", "Suresh (Drone)"],
  }
];

export default function SchedulePage() {
  return (
    <div className="space-y-10 max-w-5xl mx-auto pb-24">
      <header className="space-y-2">
        <div className="flex items-center gap-2 text-red-500">
          <Calendar size={20} />
          <span className="text-xs font-bold uppercase tracking-widest">Global Call Sheet</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-white">Production Schedule</h1>
        <p className="text-zinc-500 text-lg">Timeline for upcoming shoots, equipment checks, and location scouting.</p>
      </header>

      <div className="grid grid-cols-1 gap-6">
        <h2 className="text-sm font-black uppercase tracking-widest text-zinc-600 px-1 border-b border-white/5 pb-2">Active Production Timeline</h2>
        {shootSchedule.map((shoot) => {
          const script = initialScripts.find(s => s.id === shoot.scriptId);
          return (
            <ObsidianCard key={shoot.id} className="p-0 flex flex-col md:flex-row group">
              <div className="w-full md:w-48 bg-zinc-900/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-white/10 text-center">
                <p className="text-red-500 font-black text-2xl leading-none">{shoot.date.split(' ')[1].replace(',', '')}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mt-1">{shoot.date.split(' ')[0]}</p>
                <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[9px] font-mono text-zinc-400 uppercase tracking-tighter">
                  {shoot.time}
                </div>
              </div>
              
              <div className="flex-1 p-8 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white group-hover:text-red-500 transition-colors">
                      {script?.title}
                    </h3>
                    <p className="text-zinc-500 text-sm italic mt-1 font-mono">
                      &ldquo;{script?.hook}&rdquo;
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <MapPin size={14} className="text-red-600" />
                      {shoot.location}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400">
                      <Users size={14} className="text-red-600" />
                      Crew: {shoot.crew.join(', ')}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-4 min-w-[140px]">
                  <StatusBadge status={shoot.status} />
                  <VortexButton className="w-full text-[10px] py-2">
                    Open Call Sheet
                  </VortexButton>
                </div>
              </div>
            </ObsidianCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <ObsidianCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Camera className="text-red-600" size={20} />
            <h3 className="font-bold text-lg text-white">Equipment Status</h3>
          </div>
          <div className="space-y-4">
            {[
              { name: "RED V-Raptor XL", status: "Ready", color: "text-green-500" },
              { name: "DJI Inspire 3", status: "Charging", color: "text-amber-500" },
              { name: "Lighting Rig B", status: "On Location", color: "text-blue-500" },
            ].map(eq => (
              <div key={eq.name} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-zinc-300 font-medium">{eq.name}</span>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${eq.color}`}>
                  {eq.status}
                </span>
              </div>
            ))}
          </div>
        </ObsidianCard>

        <ObsidianCard className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <Layers className="text-red-600" size={20} />
            <h3 className="font-bold text-lg text-white">Approved Backlog</h3>
          </div>
          <div className="space-y-3">
            {initialScripts.filter(s => s.status === 'approved').slice(0, 3).map(script => (
              <div key={script.id} className="p-3 rounded bg-white/5 border border-white/5 hover:border-red-600/20 transition-all cursor-pointer">
                <p className="text-xs font-bold text-zinc-200 truncate">{script.title}</p>
                <p className="text-[9px] text-zinc-600 mt-1 uppercase tracking-tighter">CHANNEL: {script.channel}</p>
              </div>
            ))}
          </div>
        </ObsidianCard>
      </div>
    </div>
  );
}
