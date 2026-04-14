"use client";

import { adminService } from "@/services/admin.service";
import { useState, useEffect, useMemo } from "react";
import { toast } from "sonner";

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
  draft: "bg-gray-400",
  pending: "bg-yellow-400",
  active: "bg-blue-500",
  on_hold: "bg-orange-400",
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
    return <div className="p-4 text-center text-gray-500">Loading overview...</div>;
  }

  if (!stats) return null;

  return (
    <>
      <div className="flex justify-between p-4">
        <p className="text-[32px] font-bold">Overview</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        <StatCard title="Active Projects" value={stats.projects.active_projects} />
        <StatCard title="Completed Projects" value={stats.projects.completed_projects} />
        <StatCard title="Total Clients" value={stats.clients} />
      </div>

      <section className="mt-6 p-4">
        <h2 className="text-xl font-bold mb-4">Projects by Status</h2>

        <div className="space-y-4">
          {projectStatsList.map((item) => (
            <div key={item.status}>
              <p className="text-sm font-medium mb-1">
                {item.label} ({item.count})
              </p>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className={`${STATUS_COLORS[item.status]} h-3 rounded transition-all duration-500`}
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0dbe7]">
      <p className="text-base font-medium">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}
