"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { projectType, projectStatus } from "@/types/project.types";
import Sidebar from "@/components/layout/sidebar";
import { LayoutGrid, Clock, CheckCircle2 } from "lucide-react";

const STATUS_STYLES: Record<projectStatus, string> = {
  draft: "bg-gray-100 text-gray-700",
  pending: "bg-yellow-100 text-yellow-700",
  active: "bg-blue-100 text-blue-700",
  on_hold: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function DevProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<projectType[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <aside className="hidden md:flex w-64 bg-white border-r">
        <Sidebar role="admin" />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full mx-auto p-4 md:p-6">
          
          <header className="mb-8">
            <h1 className="text-[#0e141b] text-[32px] font-bold leading-tight">My Projects</h1>
            <p className="text-[#4e7397] text-sm">Track and manage your assigned development tasks.</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard 
              icon={<LayoutGrid size={20} />} 
              label="Assigned" 
              value={projects.length} 
              color="text-blue-600" 
              bgColor="bg-blue-50"
            />
            <StatCard 
              icon={<Clock size={20} />} 
              label="In Progress" 
              value={projects.filter(p => p.project_status === 'active').length} 
              color="text-orange-600" 
              bgColor="bg-orange-50"
            />
            <StatCard 
              icon={<CheckCircle2 size={20} />} 
              label="Completed" 
              value={projects.filter(p => p.project_status === 'completed').length} 
              color="text-green-600" 
              bgColor="bg-green-50"
            />
          </div>

          <div className="bg-white rounded-xl border border-[#d0dbe7] shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-[#d0dbe7]">
                  <th className="p-4 text-sm font-semibold">Project</th>
                  <th className="p-4 text-sm font-semibold">Status</th>
                  <th className="p-4 text-sm font-semibold">Deadline</th>
                  <th className="p-4 text-sm font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">Loading your projects...</td></tr>
                ) : projects.length === 0 ? (
                  <tr><td colSpan={4} className="p-10 text-center text-gray-400">No projects assigned yet.</td></tr>
                ) : (
                  projects.map((project) => (
                    <tr key={project.id} className="border-t border-[#d0dbe7] hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-bold text-[#0e141b]">{project.name}</span>
                          <span className="text-xs text-[#4e7397] line-clamp-1">{project.description}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${STATUS_STYLES[project.project_status] || "bg-gray-100"}`}>
                          {project.project_status.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-4 text-[#4e7397]">
                        {project.deadline ? new Date(project.deadline).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => router.push(`/admin/owner/project/${project.id}`)}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCard({ icon, label, value, color, bgColor }: { icon: any, label: string, value: number, color: string, bgColor: string }) {
  return (
    <div className="bg-white p-4 rounded-xl border border-[#d0dbe7] flex items-center gap-3 shadow-sm">
      <div className={`p-2 ${bgColor} ${color} rounded-lg`}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-[#4e7397] font-medium uppercase">{label}</p>
        <p className="text-xl font-bold text-[#0e141b]">{value}</p>
      </div>
    </div>
  );
}
