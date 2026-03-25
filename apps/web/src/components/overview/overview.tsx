"use client";

import { projectService } from "@/services/project.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";

type Project = {
  id: string;
  status: "active" | "completed" | "pending";
  clientId?: string;
};

export default function Overview() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();

        const data = Array.isArray(response?.data)
          ? response.data
          : [];

        setProjects(data);
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

    fetchProjects();
  }, []);

  const activeProjects = projects.filter(p => p.status === "active").length;
  const completedProjects = projects.filter(p => p.status === "completed").length;

  const totalClients = new Set(projects.map(p => p.clientId)).size;

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
