import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "error" | "info" | "neutral";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType;
  label: string;
  dot?: boolean;
}

const statusConfig: Record<StatusType, { bg: string, text: string, dot: string }> = {
  success: { bg: "bg-green-500/10", text: "text-green-500", dot: "bg-green-500" },
  warning: { bg: "bg-amber-500/10", text: "text-amber-500", dot: "bg-amber-500" },
  error: { bg: "bg-red-500/10", text: "text-red-500", dot: "bg-red-500" },
  info: { bg: "bg-blue-500/10", text: "text-blue-500", dot: "bg-blue-500" },
  neutral: { bg: "bg-zinc-800", text: "text-zinc-300", dot: "bg-zinc-400" },
}

export function StatusBadge({ status, label, dot = true, className, ...props }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <div 
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] uppercase font-mono font-medium tracking-wider",
        config.bg,
        config.text,
        className
      )}
      {...props}
    >
      {dot && <span className={cn("w-1 h-1 rounded-full", config.dot)} />}
      {label}
    </div>
  )
}
