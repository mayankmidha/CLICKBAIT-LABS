"use client";

import { ReactNode, HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { motion, HTMLMotionProps } from "framer-motion";

interface ObsidianCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export function ObsidianCard({ 
  children, 
  className,
  animate = true,
  ...props
}: ObsidianCardProps) {
  const baseClasses = cn(
    "bg-[#0a0a0a] border border-white/10 rounded-lg overflow-hidden transition-all duration-300 hover:border-red-600/40 hover:shadow-[0_0_30px_rgba(255,0,0,0.05)]",
    className
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={baseClasses}
        {...(props as HTMLMotionProps<"div">)}
      >
        {children}
      </motion.div>
    );
  }
  
  return (
    <div className={baseClasses} {...props}>
      {children}
    </div>
  );
}

export function VortexButton({
  children,
  variant = "primary",
  className,
  ...props
}: any) {
  return (
    <button
      className={cn(
        "px-4 py-2 rounded-md text-sm font-semibold tracking-tight transition-all active:scale-[0.98]",
        variant === "primary" && "bg-red-600 text-white hover:bg-red-700 shadow-[0_0_15px_rgba(255,0,0,0.2)]",
        variant === "secondary" && "bg-white/5 text-zinc-300 border border-white/10 hover:bg-white/10 hover:text-white",
        variant === "ghost" && "bg-transparent text-zinc-500 hover:text-red-500 hover:bg-red-500/5",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const styles: any = {
    approved: "bg-green-500/10 text-green-500 border-green-500/20",
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    rejected: "bg-red-500/10 text-red-500 border-red-500/20",
    deleted: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    shoot: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    tech: "bg-red-500/10 text-red-500 border-red-500/20",
    finance: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
    confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  };

  return (
    <span className={cn(
      "px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest border",
      styles[status] || styles.pending
    )}>
      {status}
    </span>
  );
}
