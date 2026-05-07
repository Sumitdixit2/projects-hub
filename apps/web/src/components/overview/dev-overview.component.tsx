"use client";

import { projectService } from "@/services/project.service";
import { useAuthStore } from "@/store/auth.store";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DenseStatsGrid } from "@/components/ui/dense-stats-grid";
import { TelemetryCard } from "@/components/ui/telemetry-card";
import { StatusBadge } from "@/components/ui/status-badge";
import { Card } from "@/components/ui/card";
import { Clock, AlertTriangle, Briefcase, Flag } from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type projectStatus = "draft" | "pending" | "active" | "on_hold" | "completed" | "cancelled";

const STATUS_BADGE: Record<projectStatus, "info" | "warning" | "success" | "error" | "neutral" | "draft"> = {
  draft:     "draft",
  pending:   "warning",
  active:    "info",
  on_hold:   "warning",
  completed: "success",
  cancelled: "error",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DevOverview() {
  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const router = useRouter();

  // ── Fetch (PRESERVED EXACTLY — filters by user.fullname) ──────────────────
  useEffect(() => {
    const fetchMyWork = async () => {
      try {
        const response = await projectService.getAllProjects();
        const data = Array.isArray(response?.data) ? response.data : [];

        // Filtering projects assigned to this specific developer
        const filtered = data.filter((p: any) => p.assignedto === user?.fullname);
        setMyProjects(filtered);
      } catch (error: any) {
        toast.error("Failed to fetch your projects");
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchMyWork();
  }, [user]);

  // ── Derived State (PRESERVED EXACTLY) ─────────────────────────────────────
  const activeCount = myProjects.filter((p) => p.project_status === "active").length;
  const nearDeadline = myProjects.filter((p) => {
    const daysLeft = (new Date(p.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
    return daysLeft > 0 && daysLeft < 7;
  }).length;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-white/5 rounded-sm border border-border" />
        <div className="grid grid-cols-3 gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-white/5 rounded-sm border border-border" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ── Telemetry Strip ── */}
      <DenseStatsGrid columns={3}>
        <TelemetryCard
          title="Assigned"
          value={String(myProjects.length)}
          trend="neutral"
          trendValue="total"
          className="bg-black"
        />
        <TelemetryCard
          title="Active"
          value={String(activeCount)}
          trend={activeCount > 0 ? "up" : "neutral"}
          trendValue="in progress"
          className="bg-black"
        />
        <TelemetryCard
          title="Due This Week"
          value={String(nearDeadline)}
          trend={nearDeadline > 0 ? "down" : "neutral"}
          trendValue={nearDeadline > 0 ? "urgent" : "clear"}
          className="bg-black"
        />
      </DenseStatsGrid>

      {/* ── Deadline Alert ── */}
      {nearDeadline > 0 && (
        <div className="flex items-start gap-3 p-3 rounded-md border border-amber-500/20 bg-amber-500/5">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-muted-foreground">
            <span className="text-amber-400 font-medium">{nearDeadline} project{nearDeadline > 1 ? "s" : ""}</span>{" "}
            require delivery within the next 7 days. Prioritize active milestones.
          </p>
        </div>
      )}

      {/* ── Workload Ledger ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground uppercase tracking-widest border-b border-border/50 pb-2">
          <div className="flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5" />
            <span>Active Workload</span>
          </div>
          <span>{myProjects.slice(0, 5).length} of {myProjects.length}</span>
        </div>

        {myProjects.length === 0 ? (
          <div className="py-10 text-center">
            <Flag className="w-6 h-6 text-muted-foreground/30 mx-auto mb-2" />
            <p className="text-[12px] font-mono text-muted-foreground">NO_ASSIGNMENTS_FOUND</p>
          </div>
        ) : (
          <div className="space-y-px">
            {myProjects.slice(0, 5).map((project) => {
              const daysLeft = project.deadline
                ? Math.ceil((new Date(project.deadline).getTime() - Date.now()) / 86400000)
                : null;

              return (
                <div
                  key={project.id}
                  onClick={() => router.push(`/admin/owner/project/${project.id}`)}
                  className="group flex items-center justify-between px-4 py-3 rounded-sm border border-transparent hover:border-border/50 hover:bg-white/[0.02] cursor-pointer transition-all duration-100"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-1 h-6 rounded-full bg-primary/40 flex-shrink-0 group-hover:bg-primary transition-colors" />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-foreground truncate">
                        {project.name}
                      </p>
                      {daysLeft !== null && (
                        <p className={`text-[10px] font-mono mt-0.5 ${daysLeft < 7 ? "text-amber-400" : "text-muted-foreground/60"}`}>
                          {daysLeft > 0 ? `${daysLeft}d remaining` : "OVERDUE"}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                    {daysLeft !== null && daysLeft < 7 && daysLeft > 0 && (
                      <div className="flex items-center gap-1 text-amber-400/80">
                        <Clock className="w-3 h-3" />
                      </div>
                    )}
                    <StatusBadge
                      status={STATUS_BADGE[project.project_status as projectStatus] ?? "neutral"}
                      label={project.project_status.replace("_", " ").toUpperCase()}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
