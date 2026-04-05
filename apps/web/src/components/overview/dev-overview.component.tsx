"use client";

import { projectService } from "@/services/project.service";
import { useAuthStore } from "@/store/auth.store";
import { useState, useEffect } from "react";
import { toast } from "sonner";

// Reusing existing status and color configurations
type projectStatus = "draft" | "pending" | "active" | "on_hold" | "completed" | "cancelled";

const STATUS_COLORS: Record<projectStatus, string> = {
  draft: "bg-gray-400",
  pending: "bg-yellow-400",
  active: "bg-blue-500",
  on_hold: "bg-orange-400",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function DevOverview() {
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);

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

  const activeCount = myProjects.filter(p => p.project_status === "active").length;
  const nearDeadline = myProjects.filter(p => {
    const daysLeft = (new Date(p.deadline).getTime() - Date.now()) / (1000 * 3600 * 24);
    return daysLeft > 0 && daysLeft < 7;
  }).length;

  if (loading) return <div className="p-4 text-center text-gray-500">Loading your workspace...</div>;

  return (
    <>
      <div className="flex justify-between p-4">
        <p className="text-[32px] font-bold">My Workspace</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        <StatCard title="Assigned Projects" value={myProjects.length} />
        <StatCard title="Active Now" value={activeCount} />
        <StatCard title="Due This Week" value={nearDeadline} />
      </div>

      <section className="mt-6 p-4">
        <h2 className="text-xl font-bold mb-4">Project Workload</h2>
        <div className="space-y-4">
          {myProjects.slice(0, 5).map((project) => (
            <div key={project.id} className="p-3 border rounded-lg bg-white">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-bold">{project.name}</p>
                <span className={`text-[10px] px-2 py-1 rounded text-white ${STATUS_COLORS[project.project_status as projectStatus]}`}>
                  {project.project_status.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-gray-500">Deadline: {new Date(project.deadline).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="flex min-w-[158px] flex-1 flex-col gap-2 rounded-lg p-6 border border-[#d0dbe7] bg-white">
      <p className="text-base font-medium">{title}</p>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
    </div>
  );
}
