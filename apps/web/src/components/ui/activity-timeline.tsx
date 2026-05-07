import * as React from "react"
import { cn } from "@/lib/utils"

export interface TimelineEvent {
  id: string;
  actor: string;
  action: string;
  target?: string;
  timestamp: string;
  isImportant?: boolean;
}

interface ActivityTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  events: TimelineEvent[];
}

export function ActivityTimeline({ events, className, ...props }: ActivityTimelineProps) {
  return (
    <div className={cn("space-y-0", className)} {...props}>
      {events.map((event, index) => (
        <div key={event.id} className="relative flex gap-4 py-3 group">
          {/* Vertical Line */}
          {index !== events.length - 1 && (
            <div className="absolute left-[7px] top-8 bottom-[-12px] w-[1px] bg-border group-hover:bg-primary/20 transition-colors" />
          )}
          
          {/* Node */}
          <div className="relative mt-1.5 flex-shrink-0">
            <div className={cn(
              "w-4 h-4 rounded-full border-2 flex items-center justify-center bg-black",
              event.isImportant ? "border-primary" : "border-border"
            )}>
              {event.isImportant && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col sm:flex-row sm:items-baseline gap-1 sm:justify-between min-w-0">
            <div className="text-[13px] text-foreground leading-tight">
              <span className="font-medium text-foreground">{event.actor}</span>{" "}
              <span className="text-muted-foreground">{event.action}</span>{" "}
              {event.target && <span className="font-medium text-foreground">{event.target}</span>}
            </div>
            <div className="text-[11px] font-mono text-muted-foreground whitespace-nowrap flex-shrink-0">
              {event.timestamp}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
