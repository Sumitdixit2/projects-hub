"use client";

import React, { useEffect, useState } from "react";
import {
  Briefcase,
  Key,
  User2,
  Milestone,
  ListTodo,
  Users,
  ChevronLeft,
  ChevronRight,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  activityInputType,
  activityOutputType,
  entityType,
} from "@/types/activity.type";
import { activityService } from "@/services/activity.service";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";

// ─── Entity Icon + Accent Map ─────────────────────────────────────────────────

const ENTITY_CONFIG: Record<
  entityType,
  { icon: React.ElementType; color: string; label: string }
> = {
  [entityType.Project]: {
    icon: Briefcase,
    color: "text-primary bg-primary/10 border-primary/20",
    label: "PROJECT",
  },
  [entityType.Key]: {
    icon: Key,
    color: "text-amber-400 bg-amber-400/10 border-amber-400/20",
    label: "ACCESS",
  },
  [entityType.Admin]: {
    icon: Users,
    color: "text-violet-400 bg-violet-400/10 border-violet-400/20",
    label: "ADMIN",
  },
  [entityType.Client]: {
    icon: User2,
    color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    label: "CLIENT",
  },
  [entityType.Milestone]: {
    icon: Milestone,
    color: "text-green-400 bg-green-400/10 border-green-400/20",
    label: "MILESTONE",
  },
};

const FALLBACK_CONFIG = {
  icon: ListTodo,
  color: "text-zinc-400 bg-zinc-400/10 border-zinc-400/20",
  label: "SYSTEM",
};

// ─── Timestamp formatter ──────────────────────────────────────────────────────

function formatTimestamp(iso: string): { date: string; time: string } {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    time: d.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityPage() {
  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [activities, setActivities] = useState<activityOutputType[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // ── Fetch (PRESERVED EXACTLY — currentPage dependency preserved) ───────────
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);

        const input: activityInputType = {
          limit: "10",
          page: String(currentPage),
        };

        const response = await activityService.getAgencyActivity(input);
        setActivities(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [currentPage]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AppShell role="admin">
      <DashboardLayout
        title="Audit Stream"
        subtitle="Chronological system event ledger — all agency activity."
        actions={
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-[11px] font-mono text-green-400/80">
              <Radio className="w-3 h-3 animate-pulse" />
              LIVE
            </span>
          </div>
        }
      >
        <div className="mt-4 max-w-3xl space-y-2">

          {/* ── Stream Header ── */}
          <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2 mb-4">
            <span>Event Log · Page {currentPage}</span>
            <span>{activities.length} entries</span>
          </div>

          {/* ── Loading State ── */}
          {loading && (
            <div className="space-y-2">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-3 border border-border/30 rounded-sm animate-pulse"
                >
                  <div className="w-7 h-7 rounded-md bg-white/5 flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-2.5 bg-white/5 rounded w-2/3" />
                    <div className="h-2 bg-white/5 rounded w-1/3" />
                  </div>
                  <div className="h-2 bg-white/5 rounded w-20" />
                </div>
              ))}
            </div>
          )}

          {/* ── Empty State ── */}
          {!loading && activities.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
              <ListTodo className="w-8 h-8 mb-3 opacity-30" />
              <p className="text-[13px] font-mono">NO_EVENTS_RECORDED</p>
              <p className="text-[11px] mt-1 opacity-60">No activity found for this page.</p>
            </div>
          )}

          {/* ── Activity Stream ── */}
          {!loading && activities.length > 0 && (
            <div className="relative">
              {/* Vertical rail line */}
              <div className="absolute left-[17px] top-0 bottom-0 w-px bg-border/40 z-0" />

              <div className="space-y-px relative z-10">
                {activities.map((activity, index) => {
                  const config =
                    ENTITY_CONFIG[activity.entity_type] ?? FALLBACK_CONFIG;
                  const Icon = config.icon;
                  const ts = activity.created_at
                    ? formatTimestamp(activity.created_at)
                    : null;

                  return (
                    <div
                      key={activity.id}
                      className={`
                        group flex items-start gap-4 px-4 py-3 rounded-sm
                        border border-transparent hover:border-border/50 hover:bg-white/[0.02]
                        transition-all duration-100
                      `}
                    >
                      {/* Entity icon node */}
                      <div
                        className={`
                          w-9 h-9 rounded-md border flex items-center justify-center
                          flex-shrink-0 relative z-10
                          ${config.color}
                        `}
                      >
                        <Icon className="w-4 h-4" />
                      </div>

                      {/* Event content */}
                      <div className="flex-1 min-w-0 pt-0.5">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            {/* Entity type pill */}
                            <span
                              className={`
                                inline-block text-[9px] font-mono font-bold tracking-widest
                                px-1.5 py-0.5 rounded border mb-1
                                ${config.color}
                              `}
                            >
                              {config.label}
                            </span>

                            {/* Action */}
                            <p className="text-[13px] text-foreground leading-snug">
                              {activity.action}
                            </p>

                            {/* Actor */}
                            <p className="text-[11px] text-muted-foreground mt-0.5 font-mono">
                              {activity.name || "SYSTEM"}
                            </p>
                          </div>

                          {/* Timestamp */}
                          {ts && (
                            <div className="text-right flex-shrink-0">
                              <p className="text-[11px] font-mono text-muted-foreground">
                                {ts.time}
                              </p>
                              <p className="text-[10px] font-mono text-muted-foreground/50">
                                {ts.date}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Pagination (PRESERVED EXACTLY — state drives refetch) ── */}
          <div className="flex items-center justify-between pt-6 mt-4 border-t border-border/50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="gap-2 bg-transparent hover:bg-white/5 text-[12px]"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              Previous
            </Button>

            <div className="flex items-center gap-1">
              {[1, 2, 3].map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`
                    w-8 h-8 rounded text-[12px] font-mono transition-all
                    ${currentPage === num
                      ? "bg-primary text-black font-bold"
                      : "bg-[#111] text-muted-foreground hover:bg-white/10 border border-border"
                    }
                  `}
                >
                  {num}
                </button>
              ))}
              <span className="px-2 text-[11px] font-mono text-muted-foreground">···</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="gap-2 bg-transparent hover:bg-white/5 text-[12px]"
            >
              Next
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
