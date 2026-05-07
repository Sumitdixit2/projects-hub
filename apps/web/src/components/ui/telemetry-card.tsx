import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./card"
import { cn } from "@/lib/utils"

interface TelemetryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function TelemetryCard({
  title,
  value,
  description,
  trend,
  trendValue,
  className,
  ...props
}: TelemetryCardProps) {
  return (
    <Card className={cn("flex flex-col justify-between overflow-hidden relative", className)} {...props}>
      <CardHeader className="pb-2">
        <CardTitle className="text-[11px] uppercase tracking-wider text-muted-foreground font-sans">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <div className="text-3xl font-mono font-medium tracking-tight text-foreground">
            {value}
          </div>
          {trendValue && (
            <div className={cn(
              "text-[11px] font-mono",
              trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-muted-foreground"
            )}>
              {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
            </div>
          )}
        </div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">
            {description}
          </p>
        )}
      </CardContent>
      {/* Decorative top border highlight */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-primary/50 to-transparent" />
    </Card>
  )
}
