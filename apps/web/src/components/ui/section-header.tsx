import * as React from "react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export function SectionHeader({ title, description, actions, className, ...props }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-border", className)} {...props}>
      <div className="space-y-1">
        <h3 className="text-[15px] font-semibold tracking-tight text-foreground">{title}</h3>
        {description && (
          <p className="text-[13px] text-muted-foreground max-w-[500px]">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          {actions}
        </div>
      )}
    </div>
  )
}
