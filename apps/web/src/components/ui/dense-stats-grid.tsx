import * as React from "react"
import { cn } from "@/lib/utils"

interface DenseStatsGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  columns?: 2 | 3 | 4 | 5;
}

export function DenseStatsGrid({ children, columns = 3, className, ...props }: DenseStatsGridProps) {
  return (
    <div 
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
        columns === 5 && "grid-cols-1 sm:grid-cols-3 lg:grid-cols-5",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
