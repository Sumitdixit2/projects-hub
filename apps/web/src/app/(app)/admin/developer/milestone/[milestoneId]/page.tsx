"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { milestoneService } from "@/services/milestone.service";
import { MilestoneStatus } from "@/types/milestone.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ChevronDown,
  CheckCircle2,
  Clock,
  PlayCircle,
  StopCircle,
  XCircle,
  FileText,
  Calendar,
  AlignLeft,
  ArrowLeft,
  Flag,
  AlertCircle,
  Hash,
} from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { SkeletonDetailPage } from "@/components/ui/skeletons";

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: {
  label: string;
  value: MilestoneStatus;
  icon: any;
  badge: "info" | "warning" | "success" | "error" | "neutral" | "draft";
}[] = [
  { label: "Draft",     value: MilestoneStatus.draft,     icon: FileText,    badge: "draft"   },
  { label: "Pending",   value: MilestoneStatus.pending,   icon: Clock,       badge: "warning" },
  { label: "Active",    value: MilestoneStatus.active,    icon: PlayCircle,  badge: "info"    },
  { label: "On Hold",   value: MilestoneStatus.on_hold,   icon: StopCircle,  badge: "warning" },
  { label: "Completed", value: MilestoneStatus.completed, icon: CheckCircle2,badge: "success" },
  { label: "Cancelled", value: MilestoneStatus.cancelled, icon: XCircle,     badge: "error"   },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DeveloperMilestoneDetailsPage() {
  const { milestoneId } = useParams() as { milestoneId: string };
  const router = useRouter();

  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [milestone, setMilestone] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  // ── Fetch (PRESERVED EXACTLY) ─────────────────────────────────────────────
  useEffect(() => {
    const fetchMilestoneData = async () => {
      try {
        const response = await milestoneService.getMilestone(milestoneId);
        setMilestone(response.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch milestone details");
      } finally {
        setLoading(false);
      }
    };
    fetchMilestoneData();
  }, [milestoneId]);

  // ── Mutation (PRESERVED EXACTLY + optimistic update) ──────────────────────
  const handleStatusChange = async (newStatus: MilestoneStatus) => {
    try {
      await milestoneService.changeMilestoneStatus(milestoneId, newStatus);
      setMilestone((prev: any) =>
        prev ? { ...prev, milestone_status: newStatus } : null
      );
      setIsStatusMenuOpen(false);
      toast.success(`Status → ${newStatus.replace("_", " ")}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone status");
    }
  };

  // ── Loading / Not Found ───────────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell role="admin">
        <DashboardLayout title="" subtitle="">
          <SkeletonDetailPage />
        </DashboardLayout>
      </AppShell>
    );
  }

  if (!milestone) {
    return (
      <AppShell role="admin">
        <div className="flex h-full items-center justify-center text-muted-foreground text-[13px] font-mono">
          MILESTONE_NOT_FOUND
        </div>
      </AppShell>
    );
  }

  // ── Derived State ─────────────────────────────────────────────────────────
  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === milestone.milestone_status) ||
    STATUS_OPTIONS[0];

  const dueDate = milestone.due_date
    ? new Date(milestone.due_date)
    : null;

  const createdAt = milestone.created_at
    ? new Date(milestone.created_at)
    : null;

  const isOverdue =
    dueDate && dueDate < new Date() &&
    milestone.milestone_status !== MilestoneStatus.completed &&
    milestone.milestone_status !== MilestoneStatus.cancelled;

  const formatDate = (d: Date) =>
    d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AppShell role="admin">
      <DashboardLayout
        title={milestone.name}
        subtitle={
          <span className="flex items-center gap-1.5 text-muted-foreground text-[12px] font-mono">
            <Hash className="w-3 h-3" />
            {milestoneId.slice(0, 8).toUpperCase()}
            <span className="opacity-30">·</span>
            <button
              onClick={() => router.push(`/admin/developer/project/${milestone.project_id}`)}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Execution Project
            </button>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            {/* Inline Status Changer — preserves mutation logic exactly */}
            <div className="relative">
              <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={cn(
                  "flex items-center gap-1.5 h-8 px-3 rounded-md border text-[12px] font-medium transition-all",
                  "bg-[#0a0a0a] border-border text-foreground hover:bg-white/5"
                )}
              >
                <currentStatus.icon className="w-3.5 h-3.5" />
                <span>{currentStatus.label}</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 transition-transform text-muted-foreground",
                    isStatusMenuOpen && "rotate-180"
                  )}
                />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-44 bg-[#0a0a0a] rounded-md shadow-2xl border border-border z-50 overflow-hidden py-1">
                  {STATUS_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleStatusChange(option.value)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2 text-[12px] transition-colors hover:bg-white/5",
                        milestone.milestone_status === option.value
                          ? "text-primary bg-primary/5"
                          : "text-muted-foreground"
                      )}
                    >
                      <option.icon className="w-3.5 h-3.5" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push(`/admin/developer/project/${milestone.project_id}`)}
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Back to Project
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-4">

          {/* ── Main Content Column ── */}
          <div className="lg:col-span-2 space-y-6">

            {/* Overdue Alert */}
            {isOverdue && (
              <div className="flex items-start gap-2.5 p-3 rounded-md border border-red-500/20 bg-red-500/5">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-[12px] font-medium text-red-400">Execution Overdue</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    This step passed its delivery target on {dueDate ? formatDate(dueDate) : "—"}.
                  </p>
                </div>
              </div>
            )}

            {/* Timeline Metadata Strip */}
            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  icon: Calendar,
                  label: "DUE DATE",
                  value: dueDate ? formatDate(dueDate) : "—",
                  highlight: isOverdue,
                },
                {
                  icon: Clock,
                  label: "CREATED",
                  value: createdAt ? formatDate(createdAt) : "—",
                  highlight: false,
                },
              ].map(({ icon: Icon, label, value, highlight }) => (
                <Card
                  key={label}
                  className={cn(
                    "p-4 bg-[#050505] border-border space-y-1.5",
                    highlight && "border-red-500/30"
                  )}
                >
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Icon className={cn("w-3.5 h-3.5", highlight && "text-red-400")} />
                    <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
                  </div>
                  <p className={cn("text-[13px] font-medium font-mono", highlight ? "text-red-400" : "text-foreground")}>
                    {value}
                  </p>
                </Card>
              ))}
            </div>

            {/* Scope Description */}
            <Card className="p-5 bg-[#050505] border-l-2 border-l-primary/30 border-y-border border-r-border">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                <AlignLeft className="w-4 h-4" />
                <h3 className="text-[10px] font-mono uppercase tracking-widest">Scope Definition</h3>
              </div>
              <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
                {milestone.description || "No execution scope defined for this step."}
              </p>
            </Card>

            {/* Schedule Panel */}
            <Card className="p-5 bg-[#050505] border-l-2 border-l-amber-500/30 border-y-border border-r-border">
              <div className="flex items-center gap-2 mb-3 text-amber-500/80">
                <Calendar className="w-4 h-4" />
                <h3 className="text-[10px] font-mono uppercase tracking-widest">Schedule Integrity</h3>
              </div>
              <div className="space-y-2">
                {/* Timeline bar */}
                <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground mb-1">
                  <span>CREATED</span>
                  <span>DUE</span>
                </div>
                <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full transition-all duration-500",
                      isOverdue ? "bg-red-500" :
                      milestone.milestone_status === MilestoneStatus.completed ? "bg-green-500" :
                      "bg-primary"
                    )}
                    style={{
                      width: (() => {
                        if (!createdAt || !dueDate) return "0%";
                        const total = dueDate.getTime() - createdAt.getTime();
                        const elapsed = Date.now() - createdAt.getTime();
                        const pct = Math.min(100, Math.max(0, (elapsed / total) * 100));
                        return `${pct}%`;
                      })()
                    }}
                  />
                </div>
                <p className="text-[10px] text-muted-foreground/60 font-mono mt-1">
                  {milestone.milestone_status === MilestoneStatus.completed
                    ? "RESOLVED"
                    : isOverdue
                    ? `OVERDUE — exceeded target by ${Math.floor((Date.now() - (dueDate?.getTime() ?? 0)) / 86400000)}d`
                    : dueDate
                    ? `${Math.max(0, Math.ceil((dueDate.getTime() - Date.now()) / 86400000))}d remaining`
                    : "—"}
                </p>
              </div>
            </Card>
          </div>

          {/* ── Sidebar: Status + Navigation ── */}
          <div className="space-y-5">

            {/* Current Status Display */}
            <Card className="p-5 bg-[#050505] border-border">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Execution State
              </h3>
              <StatusBadge
                status={currentStatus.badge}
                label={currentStatus.label.toUpperCase()}
                className="text-[11px]"
              />
              <div className="mt-4 flex items-start gap-2 p-3 rounded-md border border-border/50 bg-black/40">
                <AlertCircle className="w-3.5 h-3.5 text-muted-foreground/60 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  Status changes are propagated in realtime. Updates immediately impact delivery pipeline completion metrics.
                </p>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-5 bg-[#050505] border-border">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-4">
                Telemetry
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Entity Type", value: "MILESTONE" },
                  { label: "Ref ID", value: milestoneId.slice(0, 12).toUpperCase() },
                  {
                    label: "State",
                    value: milestone.milestone_status.replace("_", " ").toUpperCase(),
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="text-[11px] text-muted-foreground">{label}</span>
                    <span className="text-[11px] font-mono text-foreground">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <Card className="p-5 bg-[#050505] border-border">
              <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                <Flag className="w-4 h-4" />
                <h3 className="text-[10px] font-mono uppercase tracking-widest">Delivery Context</h3>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full gap-2 bg-transparent hover:bg-white/5"
                onClick={() => router.push(`/admin/developer/project/${milestone.project_id}`)}
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Return to Project
              </Button>
            </Card>

          </div>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
