"use client";

import { adminService } from "@/services/admin.service";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";
import { DenseStatsGrid } from "@/components/ui/dense-stats-grid";
import { TelemetryCard } from "@/components/ui/telemetry-card";
import { Card } from "@/components/ui/card";

interface StatsData {
  projects: {
    draft_projects: number;
    pending_projects: number;
    active_projects: number;
    on_hold_projects: number;
    completed_projects: number;
    cancelled_projects: number;
  };
  clients: number;
}

export type projectStatus =
  | "draft"
  | "pending"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

const STATUS_COLORS: Record<projectStatus, string> = {
  draft: "bg-zinc-600",
  pending: "bg-yellow-500",
  active: "bg-blue-500",
  on_hold: "bg-orange-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

const STATUS_MAP: { key: keyof StatsData["projects"]; label: string; status: projectStatus }[] = [
  { key: "draft_projects", label: "Draft", status: "draft" },
  { key: "pending_projects", label: "Pending", status: "pending" },
  { key: "active_projects", label: "Active", status: "active" },
  { key: "on_hold_projects", label: "On Hold", status: "on_hold" },
  { key: "completed_projects", label: "Completed", status: "completed" },
  { key: "cancelled_projects", label: "Cancelled", status: "cancelled" },
];

export default function Overview() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response.data);
      } catch (error: any) {
        console.error("Failed to fetch stats", error);
        toast.error(error?.message || "Failed to fetch overview stats");
      } finally {
        setLoading(false);
      }
    };
    getStats();
  }, []);

  const projectStatsList = useMemo(() => {
    if (!stats) return [];
    
    const totalProjects = Object.values(stats.projects).reduce((a, b) => a + b, 0);
    
    return STATUS_MAP.map((item) => ({
      label: item.label,
      status: item.status,
      count: stats.projects[item.key],
      percentage: totalProjects > 0 ? (stats.projects[item.key] / totalProjects) * 100 : 0
    }));
  }, [stats]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48 border border-border bg-black rounded-lg">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <span className="text-[13px] font-mono text-muted-foreground uppercase tracking-widest">Loading Telemetry...</span>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <DenseStatsGrid columns={3}>
        <TelemetryCard title="Active Projects" value={stats.projects.active_projects.toString()} className="bg-black" />
        <TelemetryCard title="Completed Projects" value={stats.projects.completed_projects.toString()} className="bg-black" />
        <TelemetryCard title="Total Clients" value={stats.clients.toString()} className="bg-black" />
      </DenseStatsGrid>

      <Card className="p-6 bg-black border-border shadow-2xl">
        <h3 className="text-sm font-semibold text-foreground tracking-tight mb-6">Project Distribution</h3>
        <div className="space-y-5">
          {projectStatsList.map((item) => (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-2 text-[13px]">
                <span className="text-muted-foreground font-medium">{item.label}</span>
                <span className="font-mono text-foreground">{item.count}</span>
              </div>
              <div className="w-full bg-[#111] rounded-full h-1.5 overflow-hidden border border-border/50">
                <div
                  className={`${STATUS_COLORS[item.status]} h-full transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
