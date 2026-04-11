"use client";

import { useState, useEffect } from "react";
import { addShootExpense, getShootDetails } from "@/app/actions/production";
import { ObsidianCard, VortexButton } from "../ui/Kit";
import { Plus, Trash2, IndianRupee, PieChart, Info } from "lucide-react";

export function CostCalculator({ addedBy, shootDateId }: { addedBy: string, shootDateId: string }) {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "misc",
    notes: ""
  });

  useEffect(() => {
    async function load() {
      if (!shootDateId) return;
      const data = await getShootDetails(shootDateId);
      if (data) {
        setExpenses(data.expenses);
      }
      setIsLoading(false);
    }
    load();
  }, [shootDateId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newExp = await addShootExpense({
      ...form,
      amount: parseFloat(form.amount),
      addedBy,
      shootDateId
    });
    if (newExp) {
      setExpenses([newExp, ...expenses]);
      setForm({ title: "", amount: "", category: "misc", notes: "" });
      setIsAdding(false);
    }
  };

  const total = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  if (isLoading) return <div className="text-zinc-700 animate-pulse">Syncing cost ledger...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2 text-white">
            <PieChart className="text-red-600" size={20} />
            Shoot Day Ledger
          </h2>
          <p className="text-[10px] text-zinc-500 font-mono">LIVE PRODUCTION CALCULATION</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 font-black uppercase tracking-widest">Total Burn</p>
          <p className="text-2xl font-black text-white flex items-center gap-1 justify-end">
            <IndianRupee size={16} className="text-red-600" />
            {total.toLocaleString()}
          </p>
        </div>
      </div>

      <VortexButton 
        onClick={() => setIsAdding(!isAdding)} 
        variant="secondary" 
        className="w-full flex items-center justify-center gap-2 h-12"
      >
        <Plus size={16} />
        {isAdding ? "Close Ledger Entry" : "Add Production Expense"}
      </VortexButton>

      {isAdding && (
        <ObsidianCard className="p-6 border-red-600/20 bg-red-600/[0.02]">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Expense Item</label>
                <input 
                  required
                  value={form.title}
                  onChange={e => setForm({...form, title: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-red-600/50"
                  placeholder="e.g. Arri Alexa Rental"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Amount (₹)</label>
                <input 
                  required
                  type="number"
                  value={form.amount}
                  onChange={e => setForm({...form, amount: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-red-600/50"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Category</label>
                <select 
                  value={form.category}
                  onChange={e => setForm({...form, category: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-red-600/50"
                >
                  <option value="equipment">Equipment</option>
                  <option value="location">Location</option>
                  <option value="food">Food & Catering</option>
                  <option value="talent">Talent Fees</option>
                  <option value="misc">Miscellaneous</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Notes (Optional)</label>
                <input 
                  value={form.notes}
                  onChange={e => setForm({...form, notes: e.target.value})}
                  className="w-full bg-zinc-900 border border-white/10 rounded-md px-3 py-2 text-sm text-white focus:border-red-600/50"
                  placeholder="Reference invoice..."
                />
              </div>
            </div>
            <VortexButton type="submit" className="w-full h-12">Commit Expense</VortexButton>
          </form>
        </ObsidianCard>
      )}

      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {expenses.map((exp) => (
          <div key={exp.id} className="flex items-center justify-between p-4 rounded-xl bg-zinc-950/50 border border-white/5 hover:border-white/10 transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 group-hover:text-red-500 transition-colors">
                <IndianRupee size={16} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-zinc-200">{exp.title}</h4>
                <div className="flex items-center gap-2 text-[9px] font-black uppercase text-zinc-600">
                  <span className="text-zinc-500">{exp.category}</span>
                  <span>&bull;</span>
                  <span>By {exp.addedBy}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <p className="font-mono text-sm font-bold text-zinc-300">₹{exp.amount.toLocaleString()}</p>
            </div>
          </div>
        ))}

        {expenses.length === 0 && !isAdding && (
          <div className="p-12 text-center border-2 border-dashed border-white/5 rounded-3xl">
            <Info className="mx-auto text-zinc-800 mb-2" size={24} />
            <p className="text-xs text-zinc-600 font-medium">No expenses logged for this shoot date.</p>
          </div>
        )}
      </div>
    </div>
  );
}
