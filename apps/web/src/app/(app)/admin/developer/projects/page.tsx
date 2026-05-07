"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { projectType, projectStatus } from "@/types/project.types";
import { LayoutGrid, Clock, CheckCircle2 } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DataLedgerTable } from "@/components/ui/data-ledger-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { MetricStrip } from "@/components/ui/metric-strip";
import { Button } from "@/components/ui/button";
import { SkeletonMetricStrip, SkeletonTable } from "@/components/ui/skeletons";

// ─── Status Badge Map (PRESERVED — same logic, new visual tokens) ─────────────

const STATUS_BADGE: Record<projectStatus, "info" | "warning" | "success" | "error" | "neutral" | "draft"> = {
  draft:     "draft",
  pending:   "warning",
  active:    "info",
  on_hold:   "warning",
  completed: "success",
  cancelled: "error",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function DevProjectsPage() {
  const router = useRouter();

  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [projects, setProjects] = useState<projectType[]>([]);
  const [loading, setLoading] = useState(true);

  // ── Fetch (PRESERVED EXACTLY) ─────────────────────────────────────────────
  useEffect(() => {
    const fetchMyProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        setProjects([]);
        toast.error("Failed to fetch assigned projects");
      } finally {
        setLoading(false);
      }
    };
    fetchMyProjects();
  }, []);

  // ── Derived State (PRESERVED EXACTLY) ─────────────────────────────────────
  const activeCount    = projects.filter((p) => p.project_status === "active").length;
  const completedCount = projects.filter((p) => p.project_status === "completed").length;

  // ── Table Columns ─────────────────────────────────────────────────────────
  const columns = [
    {
      header: "Project",
      cell: (p: projectType) => (
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-foreground truncate">{p.name}</p>
          {p.description && (
            <p className="text-[11px] text-muted-foreground truncate mt-0.5 max-w-xs">{p.description}</p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (p: projectType) => (
        <StatusBadge
          status={STATUS_BADGE[p.project_status] ?? "neutral"}
          label={p.project_status.replace("_", " ").toUpperCase()}
        />
      ),
    },
    {
      header: "Deadline",
      cell: (p: projectType) => {
        if (!p.deadline) return <span className="text-[12px] font-mono text-muted-foreground">—</span>;
        const daysLeft = Math.ceil((new Date(p.deadline).getTime() - Date.now()) / 86400000);
        const isUrgent = daysLeft >= 0 && daysLeft < 7;
        return (
          <div>
            <span className="text-[12px] font-mono text-muted-foreground">
              {new Date(p.deadline).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
            {isUrgent && (
              <p className="text-[10px] font-mono text-amber-400 mt-0.5">
                {daysLeft === 0 ? "TODAY" : `${daysLeft}d left`}
              </p>
            )}
          </div>
        );
      },
    },
    {
      header: "",
      className: "text-right",
      cell: (p: projectType) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/owner/project/${p.id}`)}
            className="h-7 text-[11px] px-3 bg-transparent hover:bg-white/5"
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AppShell role="admin">
      <DashboardLayout
        title="My Projects"
        subtitle="Assigned development workload and execution pipeline."
      >
        {loading ? (
          <div className="space-y-4">
            <SkeletonMetricStrip count={3} />
            <SkeletonTable rows={5} cols={4} />
          </div>
        ) : (
          <>
            <MetricStrip
              metrics={[
                {
                  label: "Assigned",
                  value: String(projects.length),
                  icon: <LayoutGrid className="w-3.5 h-3.5" />,
                },
                {
                  label: "Active",
                  value: String(activeCount),
                  icon: <Clock className="w-3.5 h-3.5" />,
                },
                {
                  label: "Completed",
                  value: String(completedCount),
                  icon: <CheckCircle2 className="w-3.5 h-3.5" />,
                },
              ]}
            />
            <div className="mt-4">
              <DataLedgerTable
                data={projects}
                columns={columns}
                keyExtractor={(p) => p.id}
                onRowClick={(p) => router.push(`/admin/owner/project/${p.id}`)}
                emptyStateMessage="No projects assigned."
              />
            </div>
          </>
        )}
      </DashboardLayout>
    </AppShell>
  );
}
