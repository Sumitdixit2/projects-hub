import * as React from "react"
import { cn } from "@/lib/utils"

interface OperationalPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  accentColor?: "primary" | "destructive" | "warning" | "success" | "neutral";
}

export function OperationalPanel({ 
  children, 
  accentColor = "neutral", 
  className, 
  ...props 
}: OperationalPanelProps) {
  
  const accentMap = {
    primary: "border-l-primary",
    destructive: "border-l-destructive",
    warning: "border-l-amber-500",
    success: "border-l-green-500",
    neutral: "border-l-transparent",
  };

  return (
    <div 
      className={cn(
        "bg-[#111111] border border-border rounded-sm p-5 border-l-[3px]",
        accentMap[accentColor],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
