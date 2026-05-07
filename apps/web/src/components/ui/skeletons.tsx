import * as React from "react";
import { cn } from "@/lib/utils";

// ─── Base Skeleton Block ──────────────────────────────────────────────────────

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Width as tailwind class or inline */
  w?: string;
  /** Height as tailwind class or inline */
  h?: string;
}

export function Skeleton({ className, w, h, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-white/[0.04] skeleton-shimmer rounded-sm",
        w,
        h,
        className
      )}
      {...props}
    />
  );
}

// ─── Skeleton Row (single table/list item) ────────────────────────────────────

export function SkeletonRow({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-4 px-4 py-3 border-b border-border/20", className)}>
      <Skeleton className="w-8 h-8 rounded-md flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-2 w-1/3" />
      </div>
      <Skeleton className="h-5 w-16 rounded-full" />
    </div>
  );
}

// ─── Skeleton Table ───────────────────────────────────────────────────────────

export function SkeletonTable({
  rows = 5,
  cols = 4,
  className,
}: {
  rows?: number;
  cols?: number;
  className?: string;
}) {
  return (
    <div className={cn("rounded-sm border border-border bg-black overflow-hidden", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-border bg-[#0a0a0a]">
        {Array.from({ length: cols }).map((_, i) => (
          <Skeleton key={i} className="h-2.5 flex-1" style={{ maxWidth: i === 0 ? "30%" : "15%" }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-3.5 border-b border-border/20 last:border-0">
          {Array.from({ length: cols }).map((_, j) => (
            <Skeleton
              key={j}
              className="h-3 flex-1"
              style={{
                maxWidth: j === 0 ? "40%" : j === cols - 1 ? "8%" : "18%",
                opacity: 1 - i * 0.08,
              }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

// ─── Skeleton Metric Card ─────────────────────────────────────────────────────

export function SkeletonMetric({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-sm border border-border bg-[#050505] space-y-3", className)}>
      <Skeleton className="h-2 w-16" />
      <Skeleton className="h-6 w-12" />
      <Skeleton className="h-2 w-20" />
    </div>
  );
}

// ─── Skeleton Metric Strip (3-across) ─────────────────────────────────────────

export function SkeletonMetricStrip({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${count}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonMetric key={i} />
      ))}
    </div>
  );
}

// ─── Skeleton Card (generic panel) ────────────────────────────────────────────

export function SkeletonCard({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cn("p-5 rounded-sm border border-border bg-[#050505] space-y-3", className)}>
      <Skeleton className="h-3 w-24" />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className="h-2.5"
          style={{ width: `${70 - i * 15}%` }}
        />
      ))}
    </div>
  );
}

// ─── Skeleton Detail Page ─────────────────────────────────────────────────────

export function SkeletonDetailPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Metadata strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonMetric key={i} />
        ))}
      </div>
      {/* Description panel */}
      <SkeletonCard lines={4} className="border-l-2 border-l-white/5" />
      {/* Table */}
      <div className="space-y-2">
        <Skeleton className="h-2.5 w-28" />
        <SkeletonTable rows={3} cols={3} />
      </div>
    </div>
  );
}

// ─── Skeleton Form Page ───────────────────────────────────────────────────────

export function SkeletonFormPage() {
  return (
    <div className="max-w-3xl space-y-8 animate-in fade-in duration-200">
      {/* Section header */}
      <Skeleton className="h-2.5 w-40" />
      {/* Form card */}
      <div className="p-6 rounded-sm border border-border bg-[#050505] border-l-2 border-l-white/5 space-y-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-24" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
      {/* Parameters */}
      <Skeleton className="h-2.5 w-36" />
      <div className="p-6 rounded-sm border border-border bg-[#050505] border-l-2 border-l-white/5 grid grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-2.5 w-20" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Skeleton Timeline (activity feed) ────────────────────────────────────────

export function SkeletonTimeline({ rows = 6 }: { rows?: number }) {
  return (
    <div className="relative animate-in fade-in duration-200">
      <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border/20 z-0" />
      <div className="space-y-px relative z-10">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-start gap-4 px-4 py-3" style={{ opacity: 1 - i * 0.1 }}>
            <Skeleton className="w-9 h-9 rounded-md flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <Skeleton className="h-2 w-12" />
              <Skeleton className="h-3 w-3/4" />
              <Skeleton className="h-2 w-1/3" />
            </div>
            <div className="space-y-1 flex-shrink-0">
              <Skeleton className="h-2.5 w-14" />
              <Skeleton className="h-2 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Inline Spinner (for buttons/actions) ─────────────────────────────────────

export function Spinner({
  size = 14,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className={cn("animate-spin", className)}
      style={{ animation: "spinner-rotate 0.6s linear infinite" }}
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="31.4 31.4"
        className="opacity-30"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
