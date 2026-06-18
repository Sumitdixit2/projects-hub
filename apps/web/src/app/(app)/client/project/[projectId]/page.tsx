"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service";
import { projectStatus } from "@/types/project.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
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

const MILESTONE_STATUS_BADGE: Record<MilestoneStatus, "info" | "warning" | "success" | "error" | "neutral" | "draft"> = {
  [MilestoneStatus.completed]: "success",
  [MilestoneStatus.active]:    "info",
  [MilestoneStatus.pending]:   "warning",
  [MilestoneStatus.on_hold]:   "warning",
  [MilestoneStatus.cancelled]: "error",
  [MilestoneStatus.draft]:     "draft",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();

  // ── State ──────────────────────────────────────────────────────────────────
  const [project, setProject] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        toast.error(error.message || "Failed to fetch project details");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [projectId]);

  // ── Loading / Not Found States ─────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell role="client">
        <DashboardLayout title="" subtitle="">
          <SkeletonDetailPage />
        </DashboardLayout>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell role="client">
        <div className="flex h-full items-center justify-center text-muted-foreground text-[13px] font-mono">
          PROJECT_NOT_FOUND
        </div>
      </AppShell>
    );
  }

  // ── Derived State ─────────────────────────────────────────────────────────
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
            onClick={() => router.push(`/client/milestone/${m.id}`)}
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
    <AppShell role="client">
      <DashboardLayout
        title={project.name}
        subtitle={
          <span className="flex items-center gap-2 text-muted-foreground text-[12px] font-mono">
            <Briefcase className="w-3.5 h-3.5" />
            {projectId.slice(0, 8).toUpperCase()}
            <span className="opacity-30">·</span>
            <button
              onClick={() => router.push("/client/dashboard")}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> Projects
            </button>
          </span>
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
              onRowClick={(m) => router.push(`/client/milestone/${m.id}`)}
              emptyStateMessage="No milestones provisioned for this project."
            />
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
