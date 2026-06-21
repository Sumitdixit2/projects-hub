import * as React from "react"
import { cn } from "@/lib/utils"

interface MetricItem {
  label: string;
  value: string | number;
  isMono?: boolean;
  icon?: React.ReactNode;
}

interface MetricStripProps extends React.HTMLAttributes<HTMLDivElement> {
  metrics: MetricItem[];
}

export function MetricStrip({ metrics, className, ...props }: MetricStripProps) {
  return (
    <div 
      className={cn(
        "flex flex-wrap items-center gap-x-8 gap-y-4 py-3 px-4 border border-border bg-card rounded-sm",
        className
      )}
      {...props}
    >
      {metrics.map((metric, i) => (
        <div key={i} className="flex flex-col gap-1">
          <span className="text-[10px] uppercase font-mono tracking-wider text-muted-foreground">
            {metric.label}
          </span>
          <span className={cn(
            "text-[14px] font-medium text-foreground",
            metric.isMono && "font-mono"
          )}>
            {metric.value}
          </span>
        </div>
      ))}
    </div>
  )
}
