"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createScript } from "@/app/actions/scripts";
import { VortexButton, ObsidianCard } from "@/components/ui/Kit";
import { Zap, ArrowLeft, Save, Loader2 } from "lucide-react";
import { ScriptChannel } from "@/lib/types";

export default function NewScriptPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    channel: "tech" as ScriptChannel,
    duration: "10:00",
    hook: "",
    content: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createScript(formData);
      router.push(`/${formData.channel}`);
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 text-zinc-400 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">Neural <span className="text-red-600">Forge</span></h1>
            <p className="text-zinc-500 text-sm font-medium uppercase tracking-widest mt-1">Script Creation Node</p>
          </div>
        </div>
        
        <VortexButton 
          onClick={handleSubmit} 
          disabled={isSubmitting || !formData.title || !formData.content}
          className="flex items-center gap-2 px-8"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Initialize Upload
        </VortexButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <ObsidianCard className="p-0 overflow-hidden border-white/10">
            <div className="bg-zinc-900/50 p-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Main Script Content (Markdown)</span>
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-zinc-700" />
              </div>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="# [0:00 - 0:45] THE BEAST HOOK\n\nHOST: 'Welcome to the future...'"
              className="w-full h-[600px] bg-transparent p-8 text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none resize-none"
            />
          </ObsidianCard>
        </div>

        <div className="space-y-6">
          <ObsidianCard className="p-6 border-white/10 bg-zinc-950/50">
            <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-6">Metadata</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mb-1.5 block">Video Title</label>
                <input 
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all"
                  placeholder="The Death of the Smartphone..."
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mb-1.5 block">Channel Node</label>
                <select 
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all appearance-none"
                >
                  <option value="tech">Tech Channel</option>
                  <option value="finance">Finance Channel</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mb-1.5 block">Estimated Duration</label>
                <input 
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all"
                  placeholder="10:00"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter mb-1.5 block">The Hook (Brief)</label>
                <textarea 
                  value={formData.hook}
                  onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all h-24 resize-none"
                  placeholder="Explain why the phone is dying in 2 sentences..."
                />
              </div>
            </div>
          </ObsidianCard>

          <ObsidianCard className="p-6 border-red-600/10 bg-red-600/[0.02]">
            <div className="flex items-center gap-2 mb-3">
              <Zap size={14} className="text-red-600" />
              <h4 className="text-[10px] font-black uppercase text-white">Pro Tip</h4>
            </div>
            <p className="text-[11px] text-zinc-500 leading-relaxed">
              Ensure your script follows the 2026 High-Retention Framework: [Hook] &rarr; [Context] &rarr; [Escalation] &rarr; [Investigation] &rarr; [Synthesis].
            </p>
          </ObsidianCard>
        </div>
      </div>
    </div>
  );
}
