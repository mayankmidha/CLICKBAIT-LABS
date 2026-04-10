"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Cpu, 
  TrendingUp, 
  Calendar, 
  Trash2, 
  Users, 
  User, 
  LogOut,
  Zap
} from "lucide-react";
import { useRole } from "@/lib/store/RoleContext";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useRole();

  const founderItems = [
    { name: "Command Center", icon: LayoutDashboard, href: "/" },
    { name: "Founder Control", icon: User, href: "/founder" },
    { name: "Tech Channel", icon: Cpu, href: "/tech" },
    { name: "Finance Channel", icon: TrendingUp, href: "/finance" },
    { name: "Neural Forge", icon: Zap, href: "/creator/new" },
    { name: "Production Team", icon: Users, href: "/team" },
    { name: "The Bin", icon: Trash2, href: "/bin" },
  ];

  const creatorItems = [
    { name: "My Schedule", icon: Calendar, href: "/schedule" },
    { name: "Neural Forge", icon: Zap, href: "/creator/new" },
    { name: "Tech Pipeline", icon: Cpu, href: "/tech" },
    { name: "Finance Pipeline", icon: TrendingUp, href: "/finance" },
  ];

  const items = user?.role === "founder" ? founderItems : creatorItems;

  return (
    <div className="w-64 h-screen bg-[#050505] border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center shadow-[0_0_15px_rgba(255,0,0,0.3)]">
          <Zap size={18} className="text-white fill-white" />
        </div>
        <span className="font-black tracking-tighter text-xl">CLICKBAIT</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-4 px-2">Navigation</p>
        {items.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all group",
                isActive 
                  ? "bg-red-600/10 text-red-500 border border-red-600/20 shadow-[0_0_20px_rgba(255,0,0,0.05)]" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5 border border-transparent"
              )}
            >
              <item.icon size={18} className={isActive ? "text-red-500" : "text-zinc-600 group-hover:text-zinc-300"} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3 px-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User size={20} className="text-zinc-600" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.name}</p>
            <p className="text-[10px] font-black uppercase text-red-600 tracking-tight">{user?.role} Access</p>
          </div>
        </div>
        
        <button 
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-zinc-500 hover:text-red-500 hover:bg-red-500/5 transition-all group border border-transparent hover:border-red-500/20"
        >
          <LogOut size={18} className="group-hover:translate-x-0.5 transition-transform" />
          Terminate Session
        </button>
      </div>
    </div>
  );
}
