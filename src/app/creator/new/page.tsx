"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createScript } from "@/app/actions/scripts";
import { VortexButton, ObsidianCard } from "@/components/ui/Kit";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
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
            <h1 className="text-3xl font-bold tracking-tight text-white">Write Script</h1>
            <p className="text-zinc-500 text-sm mt-1">Create a new script for review</p>
          </div>
        </div>

        <VortexButton
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.title || !formData.content}
          className="flex items-center gap-2 px-8"
        >
          {isSubmitting ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Submit for Review
        </VortexButton>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <ObsidianCard className="p-0 overflow-hidden border-white/10">
            <div className="bg-zinc-900/50 p-4 border-b border-white/5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Script Content (Markdown)</span>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder={"# [0:00 - 0:45] Opening Hook\n\nHOST: \"Welcome...\""}
              className="w-full h-[600px] bg-transparent p-8 text-zinc-300 font-mono text-sm leading-relaxed focus:outline-none resize-none"
            />
          </ObsidianCard>
        </div>

        <div className="space-y-6">
          <ObsidianCard className="p-6 border-white/10 bg-zinc-950/50">
            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">Details</h3>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all"
                  placeholder="e.g. The Death of the Smartphone"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">Channel</label>
                <select
                  value={formData.channel}
                  onChange={(e) => setFormData({ ...formData, channel: e.target.value as any })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all appearance-none"
                >
                  <option value="tech">Tech</option>
                  <option value="finance">Finance</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">Duration</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all"
                  placeholder="10:00"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-zinc-600 uppercase mb-1.5 block">Hook (one-liner)</label>
                <textarea
                  value={formData.hook}
                  onChange={(e) => setFormData({ ...formData, hook: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/5 rounded p-3 text-sm text-white focus:border-red-600/50 outline-none transition-all h-24 resize-none"
                  placeholder="The opening line that grabs attention..."
                />
              </div>
            </div>
          </ObsidianCard>
        </div>
      </div>
    </div>
  );
}
