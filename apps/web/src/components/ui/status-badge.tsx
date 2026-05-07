import * as React from "react"
import { cn } from "@/lib/utils"

export type StatusType = "success" | "warning" | "error" | "info" | "neutral" | "draft";

interface StatusBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: StatusType | string;
  label: string;
  dot?: boolean;
}

const statusConfig: Record<string, { bg: string; text: string; dot: string }> = {
  success:   { bg: "bg-green-500/10",  text: "text-green-500",  dot: "bg-green-500"  },
  warning:   { bg: "bg-amber-500/10",  text: "text-amber-500",  dot: "bg-amber-500"  },
  error:     { bg: "bg-red-500/10",    text: "text-red-500",    dot: "bg-red-500"    },
  info:      { bg: "bg-blue-500/10",   text: "text-blue-500",   dot: "bg-blue-500"   },
  neutral:   { bg: "bg-zinc-800",      text: "text-zinc-300",   dot: "bg-zinc-400"   },
  draft:     { bg: "bg-zinc-500/10",   text: "text-zinc-400",   dot: "bg-zinc-500"   },
}

const FALLBACK_CONFIG = {
  bg: "bg-zinc-800/60",
  text: "text-zinc-400",
  dot: "bg-zinc-500",
}

function resolveConfig(status: string | undefined | null) {
  if (!status) return FALLBACK_CONFIG;

  const normalized = String(status).trim().toLowerCase();
  const config = statusConfig[normalized];

  if (!config) {
    if (process.env.NODE_ENV === "development") {
      console.warn(`[StatusBadge] Unknown status: "${status}" — using fallback.`);
    }
    return FALLBACK_CONFIG;
  }

  return config;
}

export function StatusBadge({ status, label, dot = true, className, ...props }: StatusBadgeProps) {
  const config = resolveConfig(status);

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
      {label || "UNKNOWN"}
    </div>
  )
}
