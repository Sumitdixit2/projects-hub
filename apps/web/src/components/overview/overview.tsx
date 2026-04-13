"use client";

import { adminService } from "@/services/admin.service";
import { projectService } from "@/services/project.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export type projectStatus =
  | "draft"
  | "pending"
  | "active"
  | "on_hold"
  | "completed"
  | "cancelled";

type Project = {
  id: string;
  project_status: projectStatus;
  clientId?: string;
};

const ALL_STATUSES: projectStatus[] = [
  "draft",
  "pending",
  "active",
  "on_hold",
  "completed",
  "cancelled",
];

const STATUS_COLORS: Record<projectStatus, string> = {
  draft: "bg-gray-400",
  pending: "bg-yellow-400",
  active: "bg-blue-500",
  on_hold: "bg-orange-400",
  completed: "bg-green-500",
  cancelled: "bg-red-500",
};

export default function Overview() {
  const [projects, setProjects] = useState({});
  const [clients , setClients] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStats = async () => {
      try {
        const response = await adminService.getStats();

       const data = response.data; 
       console.log("data is: ",data);

        setProjects(data.projects);
        setClients(data.clients);
      } catch (error: any) {
        console.error(
          "Failed to fetch projects",
          error?.response?.data?.message || error.message
        );

        toast.error(
          error?.response?.data?.message || "Failed to fetch projects"
        );

        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    getStats();
  }, []);

   
  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        Loading overview...
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between p-4">
        <p className="text-[32px] font-bold">Overview</p>
      </div>

      <div className="flex flex-wrap gap-4 p-4">
        <StatCard title="Active Projects" value={activeProjects} />
        <StatCard title="Completed Projects" value={completedProjects} />
        <StatCard title="Total Clients" value={totalClients} />
      </div>

      <section className="mt-6 p-4">
        <h2 className="text-xl font-bold mb-4">
          Projects by Status
        </h2>

        <div className="space-y-4">
          {projectStats.map((item) => (
            <div key={item.status}>
              <p className="text-sm font-medium mb-1">
                {item.label} ({item.count})
              </p>
              <div className="w-full bg-gray-200 rounded h-3">
                <div
                  className={`${STATUS_COLORS[item.status]} h-3 rounded transition-all duration-500`}
                  style={{ width: `${item.value}%` }}
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
