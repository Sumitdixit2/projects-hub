import * as React from "react"
import { cn } from "@/lib/utils"

interface CommandBarProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  isVisible: boolean;
}

export function CommandBar({ children, isVisible, className, ...props }: CommandBarProps) {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-10 fade-in duration-200">
      <div 
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 bg-[#111111] border border-border rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.4)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>
  )
}
