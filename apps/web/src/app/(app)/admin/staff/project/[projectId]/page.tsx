"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service";
import { projectStatus } from "@/types/project.types";
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
  User,
  Briefcase,
  AlignLeft,
  Plus,
  ArrowLeft,
  Flag,
} from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataLedgerTable } from "@/components/ui/data-ledger-table";
import { Card } from "@/components/ui/card";
import { SkeletonDetailPage } from "@/components/ui/skeletons";

// ─── Types ────────────────────────────────────────────────────────────────────

export enum MilestoneStatus {
  draft = "draft",
  pending = "pending",
  active = "active",
  on_hold = "on_hold",
  completed = "completed",
  cancelled = "cancelled",
}

// ─── Status Config ────────────────────────────────────────────────────────────

const STATUS_OPTIONS: {
  label: string;
  value: projectStatus;
  icon: any;
  badge: "info" | "warning" | "success" | "error" | "neutral" | "draft";
}[] = [
  { label: "Draft",     value: "draft",     icon: FileText,    badge: "draft"   },
  { label: "Pending",   value: "pending",   icon: Clock,       badge: "warning" },
  { label: "Active",    value: "active",    icon: PlayCircle,  badge: "info"    },
  { label: "On Hold",   value: "on_hold",   icon: StopCircle,  badge: "warning" },
  { label: "Completed", value: "completed", icon: CheckCircle2,badge: "success" },
  { label: "Cancelled", value: "cancelled", icon: XCircle,     badge: "error"   },
];

const MILESTONE_STATUS_BADGE: Record<MilestoneStatus, "info" | "warning" | "success" | "error" | "neutral" | "draft"> = {
  [MilestoneStatus.completed]: "success",
  [MilestoneStatus.active]:    "info",
  [MilestoneStatus.pending]:   "warning",
  [MilestoneStatus.on_hold]:   "warning",
  [MilestoneStatus.cancelled]: "error",
  [MilestoneStatus.draft]:     "draft",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function StaffProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [project, setProject] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  // ── Data Fetching ──────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse, milestonesResponse] = await Promise.all([
          projectService.getMyProject(projectId),
          milestoneService.getMilestones(projectId),
        ]);

        setProject(projectResponse.data);
        const data = milestonesResponse.data;
        if (data) {
          setMilestones(Array.isArray(data) ? data : [data]);
        } else {
          setMilestones([]);
        }
      } catch (error: any) {
        if (error?.status === 403) {
          setErrorStatus(403);
        } else if (error?.status === 404) {
          setErrorStatus(404);
        } else {
          toast.error(error.message || "Failed to fetch project details");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  // ── Mutation ──────────────────────────────────────────────────────────────
  const handleProjectStatusChange = async (newStatus: projectStatus) => {
    try {
      await projectService.changeStatus(projectId, newStatus);
      setProject((prev: any) =>
        prev ? { ...prev, project_status: newStatus } : null
      );
      setIsStatusMenuOpen(false);
      toast.success(`Status → ${newStatus.replace("_", " ")}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  // ── Loading / Error States ─────────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell role="admin">
        <DashboardLayout title="" subtitle="">
          <SkeletonDetailPage />
        </DashboardLayout>
      </AppShell>
    );
  }

  if (errorStatus === 403) {
    return (
      <AppShell role="admin">
        <div className="flex h-[80vh] flex-col items-center justify-center text-center">
          <p className="text-[13px] font-mono text-destructive uppercase tracking-widest mb-2">PROJECT_ACCESS_DENIED</p>
          <p className="text-[12px] text-muted-foreground opacity-70">You are not authorized to access this project space.</p>
          <Button variant="outline" size="sm" className="mt-6" onClick={() => router.push("/admin/staff/projects")}>
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Registry
          </Button>
        </div>
      </AppShell>
    );
  }

  if (!project || errorStatus === 404) {
    return (
      <AppShell role="admin">
        <div className="flex h-[80vh] flex-col items-center justify-center text-center">
          <p className="text-[13px] font-mono text-muted-foreground uppercase tracking-widest mb-2">PROJECT_NOT_FOUND</p>
          <p className="text-[12px] text-muted-foreground opacity-70">The requested project ID could not be located in the system.</p>
          <Button variant="outline" size="sm" className="mt-6" onClick={() => router.push("/admin/staff/projects")}>
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> Return to Registry
          </Button>
        </div>
      </AppShell>
    );
  }

  // ── Derived State ─────────────────────────────────────────────────────────
  const currentStatus =
    STATUS_OPTIONS.find((s) => s.value === project.project_status) ||
    STATUS_OPTIONS[0];

  const milestonesCompleted = milestones.filter(
    (m) => m.milestone_status === MilestoneStatus.completed
  ).length;

  const completionPct =
    milestones.length > 0
      ? Math.round((milestonesCompleted / milestones.length) * 100)
      : 0;

  // ── Milestone Table Columns ────────────────────────────────────────────────
  const milestoneColumns = [
    {
      header: "Milestone",
      cell: (m: any) => (
        <div className="flex items-center gap-2">
          <Flag className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />
          <span className="text-[13px] font-medium text-foreground">{m.name}</span>
        </div>
      ),
    },
    {
      header: "Due Date",
      cell: (m: any) => (
        <span className="text-[12px] font-mono text-muted-foreground">
          {m.due_date ? new Date(m.due_date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (m: any) => (
        <StatusBadge
          status={MILESTONE_STATUS_BADGE[m.milestone_status as MilestoneStatus] ?? "neutral"}
          label={m.milestone_status.replace("_", " ").toUpperCase()}
        />
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (m: any) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/staff/milestone/${m.id}`)}
            className="h-7 text-[11px] px-3 bg-transparent hover:bg-white/5"
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <AppShell role="admin">
      <DashboardLayout
        title={project.name}
        subtitle={
          <span className="flex items-center gap-2 text-muted-foreground text-[12px] font-mono">
            <Briefcase className="w-3.5 h-3.5" />
            {projectId.slice(0, 8).toUpperCase()}
            <span className="opacity-30">·</span>
            <button
              onClick={() => router.push("/admin/staff/projects")}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Projects
            </button>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            {/* Status Changer */}
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
                      onClick={() => handleProjectStatusChange(option.value)}
                      className={cn(
                        "flex items-center gap-2.5 w-full px-3 py-2 text-[12px] transition-colors hover:bg-white/5",
                        project.project_status === option.value
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
              size="sm"
              className="gap-2"
              onClick={() => router.push(`/admin/staff/createmilestone/${projectId}`)}
            >
              <Plus className="w-3.5 h-3.5" />
              Add Milestone
            </Button>
          </div>
        }
      >
        <div className="space-y-8 mt-4">

          {/* ── Section 1: Operational Metadata Strip ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: User,        label: "CLIENT",    value: project.client    || "—" },
              { icon: CheckCircle2,label: "OPERATOR",  value: project.assignedto|| "—" },
              { icon: Calendar,    label: "STARTED",   value: project.started_at ? new Date(project.started_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—" },
              { icon: Clock,       label: "DEADLINE",  value: new Date(project.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) },
            ].map(({ icon: Icon, label, value }) => (
              <Card key={label} className="p-4 bg-[#050505] border-border space-y-2">
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Icon className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
                </div>
                <p className="text-[13px] font-medium text-foreground truncate">{value}</p>
              </Card>
            ))}
          </div>

          {/* ── Section 2: Milestone Progress Bar ── */}
          {milestones.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span className="uppercase tracking-widest">Pipeline Completion</span>
                <span className="text-foreground">{completionPct}%</span>
              </div>
              <div className="h-1 w-full bg-[#111] rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500 ease-out"
                  style={{ width: `${completionPct}%` }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-mono">
                {milestonesCompleted} / {milestones.length} milestones resolved
              </p>
            </div>
          )}

          {/* ── Section 3: Description Panel ── */}
          <Card className="p-5 bg-[#050505] border-l-2 border-l-primary/30 border-y-border border-r-border">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground">
              <AlignLeft className="w-4 h-4" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest">Scope Definition</h3>
            </div>
            <p className="text-[13px] text-foreground/80 leading-relaxed whitespace-pre-wrap">
              {project.description || "No operational description provided."}
            </p>
          </Card>

          {/* ── Section 4: Milestone Ledger ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-2">
              <Flag className="w-4 h-4" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest">
                Milestone Ledger
              </h3>
              <span className="ml-auto text-[10px] font-mono bg-[#111] border border-border px-2 py-0.5 rounded">
                {milestones.length} entries
              </span>
            </div>

            <DataLedgerTable
              data={milestones}
              columns={milestoneColumns}
              keyExtractor={(m) => m.id}
              onRowClick={(m) => router.push(`/admin/staff/milestone/${m.id}`)}
              emptyStateMessage="No milestones provisioned for this project."
            />
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
