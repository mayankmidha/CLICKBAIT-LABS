"use client";

import { useState } from "react";
import { useRole } from "@/lib/store/RoleContext";
import { ObsidianCard, VortexButton } from "@/components/ui/Kit";
import { Shield, Lock, Mail, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoginPage() {
  const { login } = useRole();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email, pass);
    if (!success) {
      setError(true);
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-[100] flex items-center justify-center p-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
      <div className="absolute inset-0 bg-gradient-to-b from-red-600/5 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative"
      >
        <div className="flex flex-col items-center mb-8">
          <motion.div 
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 rounded-2xl bg-red-600 flex items-center justify-center mb-4 shadow-[0_0_40px_rgba(255,0,0,0.4)]"
          >
            <Shield size={32} className="text-white" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tighter text-white">CLICKBAIT <span className="text-red-600 italic underline decoration-red-600/30 underline-offset-8">LABS</span></h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.4em] mt-4 opacity-60">Production Intelligence OS</p>
        </div>

        <ObsidianCard className="p-8 border-white/10 bg-zinc-950/50 backdrop-blur-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="email"
                  required
                  placeholder="mayank@clickbait.labs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-1">Security Key</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" size={16} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-sm focus:outline-none focus:border-red-600/50 transition-all text-white placeholder:text-zinc-700"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-500 text-xs font-bold"
                >
                  <AlertCircle size={14} />
                  Access Denied: Invalid Credentials
                </motion.div>
              )}
            </AnimatePresence>

            <VortexButton type="submit" className="w-full py-4 flex items-center justify-center gap-2 group mt-2">
              Initialize Session
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </VortexButton>
          </form>
        </ObsidianCard>

        <p className="text-center mt-8 text-zinc-600 text-[10px] font-bold tracking-widest uppercase opacity-40 leading-relaxed">
          Secure Production Gateway <br/>
          &copy; 2026 Clickbait Labs &bull; v2.4.0
        </p>
      </motion.div>
    </div>
  );
}
