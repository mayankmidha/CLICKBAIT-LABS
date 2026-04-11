"use client";

import { useState, useEffect } from "react";
import { Script, ShootDate, Expense } from "@/lib/types";
import { ObsidianCard, VortexButton, StatusBadge } from "@/components/ui/Kit";
import { 
  Play, 
  Check, 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Video, 
  Clock, 
  Maximize2,
  Calendar,
  PlusCircle,
  TrendingDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRole } from "@/lib/store/RoleContext";
import { getShootDates, getShootDetails, createShootDate, addShootExpense } from "@/app/actions/production";

export default function ShootModePage() {
  const { user } = useRole();
  const [shootDates, setShootDates] = useState<ShootDate[]>([]);
  const [selectedDateId, setSelectedDateId] = useState<string>("");
  const [activeBatch, setActiveBatch] = useState<Script[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTeleprompter, setIsTeleprompter] = useState(false);
  const [showCosts, setShowCosts] = useState(false);
  const [completedIds, setCompletedIds] = useState<string[]>([]);

  // For New Date Modal
  const [showNewDateModal, setShowNewDateModal] = useState(false);
  const [newDateStr, setNewDateStr] = useState("");

  useEffect(() => {
    loadDates();
  }, []);

  async function loadDates() {
    const dates = await getShootDates();
    setShootDates(dates as any);
    if (dates.length > 0 && !selectedDateId) {
      handleSelectDate(dates[0].id);
    }
    setIsLoading(false);
  }

  async function handleSelectDate(id: string) {
    setSelectedDateId(id);
    const details = await getShootDetails(id);
    if (details) {
      setActiveBatch(details.scripts as any);
      setExpenses(details.expenses as any);
      setCurrentIndex(0);
      setCompletedIds([]);
    }
  }

  async function handleCreateDate() {
    if (!newDateStr) return;
    const date = new Date(newDateStr);
    await createShootDate(date);
    setShowNewDateModal(false);
    loadDates();
  }

  const currentScript = activeBatch[currentIndex];
  const progress = activeBatch.length > 0 ? (completedIds.length / activeBatch.length) * 100 : 0;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (isLoading) return <div className="p-20 text-center font-black uppercase tracking-[0.3em] text-zinc-800">Synchronizing Shoot Pipeline...</div>;

  return (
    <div className={cn(
      "min-h-screen transition-all duration-500",
      isTeleprompter ? "bg-black fixed inset-0 z-[200] p-4 md:p-12" : "space-y-8 max-w-7xl mx-auto pb-24"
    )}>
      {/* Date Selector Header */}
      {!isTeleprompter && (
        <div className="flex flex-wrap items-center gap-4 bg-zinc-950/80 p-4 rounded-2xl border border-white/5 backdrop-blur-md">
          <div className="flex items-center gap-2 mr-4">
            <Calendar className="text-red-600" size={20} />
            <span className="text-xs font-black uppercase tracking-widest text-zinc-400">Select Shoot Date</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {shootDates.map((sd) => (
              <button
                key={sd.id}
                onClick={() => handleSelectDate(sd.id)}
                className={cn(
                  "px-4 py-2 rounded-lg text-xs font-bold transition-all border",
                  selectedDateId === sd.id 
                    ? "bg-red-600 text-white border-red-600 shadow-[0_0_15px_rgba(255,0,0,0.3)]" 
                    : "bg-zinc-900 text-zinc-500 border-white/5 hover:border-white/10"
                )}
              >
                {new Date(sd.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
              </button>
            ))}
            <button 
              onClick={() => setShowNewDateModal(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-zinc-900 text-red-500 border border-red-500/20 hover:bg-red-500/5"
            >
              <PlusCircle size={14} className="inline mr-2" /> New Date
            </button>
          </div>
        </div>
      )}

      {/* Main Shoot Interface */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-red-500 mb-2">
            <Video size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Live Production Flow</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white">
            Shoot <span className="text-red-600">Mode</span>
          </h1>
        </div>

        <div className="flex items-center gap-4 bg-zinc-900/50 p-2 rounded-xl border border-white/5">
          <div className="flex items-center gap-2 px-4 border-r border-white/10">
            <VortexButton 
              onClick={() => setShowCosts(!showCosts)}
              variant={showCosts ? "primary" : "secondary"}
              className="h-8 px-4 text-[10px]"
            >
              Costs: ₹{totalExpenses}
            </VortexButton>
          </div>
          <div className="px-4 border-r border-white/10">
            <p className="text-[8px] font-black text-zinc-500 uppercase">Daily Progress</p>
            <p className="text-xl font-black text-white">{completedIds.length} / {activeBatch.length}</p>
          </div>
          <VortexButton 
            onClick={() => setIsTeleprompter(!isTeleprompter)}
            variant="secondary" 
            className="flex items-center gap-2 h-10 px-4"
          >
            <Maximize2 size={14} />
            {isTeleprompter ? "Exit Pro" : "Prompter"}
          </VortexButton>
        </div>
      </div>

      {!activeBatch.length && !isLoading && (
        <ObsidianCard className="p-20 text-center space-y-4 border-dashed border-white/10">
          <Video size={48} className="mx-auto text-zinc-800" />
          <h2 className="text-xl font-bold text-zinc-500">No Scripts Assigned to this Date</h2>
          <p className="text-zinc-600 max-w-md mx-auto">Push scripts from the Tech or Finance nodes to this specific shoot date to begin production.</p>
        </ObsidianCard>
      )}

      {activeBatch.length > 0 && (
        <>
          <div className="w-full bg-zinc-900 h-1 rounded-full overflow-hidden mb-12">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="bg-red-600 h-full shadow-[0_0_10px_rgba(255,0,0,0.5)]"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left: Queue Sidebar */}
            <div className={cn("lg:col-span-1 space-y-4", isTeleprompter && "hidden")}>
              <h3 className="text-[10px] font-black uppercase text-zinc-600 tracking-widest px-2">Production Queue</h3>
              <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2 scrollbar-hide">
                {activeBatch.map((script, i) => (
                  <button
                    key={script.id}
                    onClick={() => setCurrentIndex(i)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all relative group overflow-hidden",
                      currentIndex === i 
                        ? "bg-red-600/10 border-red-600/40" 
                        : "bg-zinc-950/50 border-white/5 hover:border-white/10"
                    )}
                  >
                    {completedIds.includes(script.id) && (
                      <div className="absolute top-0 right-0 p-1 bg-green-500 rounded-bl-lg">
                        <Check size={10} className="text-black" />
                      </div>
                    )}
                    <p className="text-[8px] font-mono text-zinc-600 mb-1">SCRIPT {i + 1}</p>
                    <h4 className={cn(
                      "text-xs font-bold truncate",
                      currentIndex === i ? "text-white" : "text-zinc-400 group-hover:text-zinc-200"
                    )}>
                      {script.title}
                    </h4>
                  </button>
                ))}
              </div>
            </div>

            {/* Center: Active Script Reader */}
            <div className={cn(
              "lg:col-span-3",
              isTeleprompter ? "lg:col-span-4 max-w-4xl mx-auto w-full" : ""
            )}>
              <AnimatePresence mode="wait">
                {currentScript && (
                  <motion.div
                    key={currentScript.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full flex flex-col"
                  >
                    <ObsidianCard className="flex-1 flex flex-col border-white/10 overflow-hidden bg-zinc-950">
                      <div className="p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/30">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <StatusBadge status={currentScript.channel as any} />
                            <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{currentScript.channel} Pipeline</span>
                          </div>
                          <h2 className={cn(
                            "font-black tracking-tight leading-none",
                            isTeleprompter ? "text-4xl text-red-600" : "text-2xl text-white"
                          )}>
                            {currentScript.title}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} className="text-zinc-600" />
                          <span className="text-sm font-bold text-zinc-400">{currentScript.duration}</span>
                        </div>
                      </div>

                      <div className={cn(
                        "flex-1 overflow-y-auto p-8 md:p-12 leading-relaxed text-zinc-300 transition-all",
                        isTeleprompter ? "text-3xl font-bold bg-black" : "text-lg font-medium bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] bg-fixed"
                      )}>
                        <div className="max-w-3xl mx-auto space-y-12">
                          {currentScript.content.split('\n').map((line, i) => (
                            <p key={i} className={cn(
                              line.startsWith('[VISUAL') && !isTeleprompter && "text-red-500 italic text-sm border-l-2 border-red-600/30 pl-6 py-2 bg-red-600/5",
                              line.startsWith('[VISUAL') && isTeleprompter && "hidden",
                              line.startsWith('HOST:') && "text-white",
                              isTeleprompter && line.startsWith('HOST:') && "text-white text-5xl",
                              line.startsWith('#') && "text-4xl font-black text-white border-b-2 border-red-600 pb-6 mb-12"
                            )}>
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="p-8 border-t border-white/5 bg-zinc-900/50 flex flex-col md:flex-row gap-4">
                        <div className="flex-1 flex gap-4">
                          <VortexButton 
                            variant="secondary" 
                            onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                            className="px-8 flex items-center gap-2"
                          >
                            <ChevronLeft size={18} /> Prev
                          </VortexButton>
                          <VortexButton 
                            variant="secondary" 
                            onClick={() => setCurrentIndex(Math.min(activeBatch.length - 1, currentIndex + 1))}
                            className="px-8 flex items-center gap-2"
                          >
                            Next <ChevronRight size={18} />
                          </VortexButton>
                        </div>
                        
                        <VortexButton 
                          onClick={() => setCompletedIds(prev => [...prev, currentScript.id])}
                          className="px-16 py-4 text-sm font-black shadow-[0_0_30px_rgba(255,0,0,0.3)]"
                        >
                          {completedIds.includes(currentScript.id) ? "RERUN SCRIPT" : "MARK AS SHOT"}
                        </VortexButton>
                      </div>
                    </ObsidianCard>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}

      {/* New Date Modal */}
      {showNewDateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[300] flex items-center justify-center p-4">
          <ObsidianCard className="p-8 max-w-md w-full border-red-600/20">
            <h2 className="text-2xl font-black text-white mb-6">Create Shoot Date</h2>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Select Date</label>
                <input 
                  type="date" 
                  value={newDateStr}
                  onChange={(e) => setNewDateStr(e.target.value)}
                  className="w-full bg-zinc-900 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-600"
                />
              </div>
              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowNewDateModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg bg-zinc-800 text-zinc-400 font-bold text-xs uppercase"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateDate}
                  className="flex-1 px-6 py-3 rounded-lg bg-red-600 text-white font-bold text-xs uppercase shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                >
                  Confirm Date
                </button>
              </div>
            </div>
          </ObsidianCard>
        </div>
      )}
    </div>
  );
}
