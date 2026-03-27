"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { projectType, projectStatus } from "@/types/project.types";
import Sidebar from "@/components/layout/sidebar";
import { Plus, LayoutGrid, FileText } from "lucide-react";

const STATUS_STYLES: Record<projectStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
  on_hold: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<projectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        setProjects([]);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar Integration */}
      <Sidebar role="admin" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full mx-auto">

          {/* Header Section */}
          <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
            <div className="flex flex-col gap-1">
              <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">
                Project Pipeline
              </p>
              <p className="text-[#4e7397] text-sm font-normal">
                Manage and track all ongoing agency initiatives.
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/owner/createProject')}
              className="flex items-center gap-2 min-w-[84px] cursor-pointer justify-center rounded-lg h-10 px-4 bg-[#0e141b] text-white text-sm font-medium hover:bg-[#0e141b]/90 transition-all"
            >
              <Plus size={18} />
              <span className="truncate">Create Project</span>
            </button>
          </div>

          {/* Stats Bar (Optional, matches Overview logic) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="bg-white p-4 rounded-xl border border-[#d0dbe7] flex items-center gap-3">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                <LayoutGrid size={20} />
              </div>
              <div>
                <p className="text-xs text-[#4e7397] font-medium uppercase">Total Projects</p>
                <p className="text-xl font-bold">{projects.length}</p>
              </div>
            </div>
            {/* You can add more mini-stats here */}
          </div>

          {/* Projects Table */}
          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-xl border border-[#d0dbe7] bg-white shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#d0dbe7]">
                    <th className="p-4 text-[#0e141b] text-sm font-semibold">Project Details</th>
                    <th className="p-4 text-[#0e141b] text-sm font-semibold">Client</th>
                    <th className="p-4 text-[#0e141b] text-sm font-semibold">Team</th>
                    <th className="p-4 text-[#0e141b] text-sm font-semibold">Status</th>
                    <th className="p-4 text-[#0e141b] text-sm font-semibold">Deadline</th>
                    <th className="p-4 text-[#4e7397] text-sm font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-[#0e141b] text-sm">
                  {loading ? (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-400">Loading projects...</td></tr>
                  ) : projects.length === 0 ? (
                    <tr><td colSpan={6} className="p-10 text-center text-gray-400">No projects found.</td></tr>
                  ) : (
                    projects.map((project) => (
                      <tr key={project.id} className="border-t border-[#d0dbe7] hover:bg-slate-50 transition-colors group">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-[#0e141b]">{project.name}</span>
                            <span className="text-xs text-[#4e7397] line-clamp-1">{project.description}</span>
                          </div>
                        </td>
                        <td className="p-4 text-[#4e7397] font-medium">{project.client}</td>
                        <td className="p-4 text-[#4e7397]">{project.assignedto}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[project.project_status as projectStatus] || "bg-gray-100 text-gray-700"
                            }`}>
                            {project.project_status.replace("_", " ")}
                          </span>
                        </td>
                        <td className="p-4 text-[#4e7397]">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => router.push(`/admin/owner/project/${project.id}`)}
                            className="text-[#4e7397] hover:text-[#0e141b] font-bold text-xs uppercase tracking-wide transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
