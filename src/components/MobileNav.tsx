"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Cpu, 
  TrendingUp, 
  Video, 
  Menu,
  Users
} from "lucide-react";
import { useRole } from "@/lib/store/RoleContext";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useRole();

  if (!user) return null;

  const items = user.role === 'founder' ? [
    { name: "Home", icon: LayoutDashboard, href: "/" },
    { name: "Tech", icon: Cpu, href: "/tech" },
    { name: "Finance", icon: TrendingUp, href: "/finance" },
    { name: "Forge", icon: Menu, href: "/creator/new" },
  ] : [
    { name: "Home", icon: LayoutDashboard, href: "/" },
    { name: "Forge", icon: Menu, href: "/creator/new" },
    { name: "Tech", icon: Cpu, href: "/tech" },
    { name: "Finance", icon: TrendingUp, href: "/finance" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-6 md:hidden z-[100]">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-all",
              isActive ? "text-red-500 scale-110" : "text-zinc-500"
            )}
          >
            <item.icon size={20} className={isActive ? "fill-red-500/20" : ""} />
            <span className="text-[8px] font-black uppercase tracking-widest">{item.name}</span>
          </Link>
        );
      })}
    </div>
  );
}
