"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cpu, TrendingUp, Calendar, LayoutDashboard, Menu } from "lucide-react";
import { cn } from "@/lib/utils";

const mobileItems = [
  { name: "Feed", icon: LayoutDashboard, href: "/" },
  { name: "Tech", icon: Cpu, href: "/tech" },
  { name: "Finance", icon: TrendingUp, href: "/finance" },
  { name: "Shoot", icon: Calendar, href: "/schedule" },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-zinc-950 border-t border-white/10 flex md:hidden items-center justify-around px-2 z-50 safe-area-bottom">
      {mobileItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 p-2 transition-all",
              isActive ? "text-red-600" : "text-zinc-500"
            )}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.name}</span>
          </Link>
        );
      })}
      <button className="flex flex-col items-center gap-1 p-2 text-zinc-500">
        <Menu size={20} />
        <span className="text-[10px] font-bold uppercase tracking-tighter">More</span>
      </button>
    </div>
  );
}
