"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
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
} from "lucide-react";

export enum MilestoneStatus {
  draft = "draft",
  pending = "pending",
  active = "active",
  on_hold = "on_hold",
  completed = "completed",
  cancelled = "cancelled"
}

export default function ProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [project, setProject] = useState<any | null>(null);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectResponse, milestonesResponse] = await Promise.all([
          projectService.getMyProject(projectId),
          milestoneService.getMilestones(projectId),
        ]);

        console.log("milestones are: ", milestonesResponse);
        console.log("type is: ", typeof milestonesResponse);
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

  const handleProjectStatusChange = async (newStatus: projectStatus) => {
    try {
      await projectService.changeStatus(projectId, newStatus);
      setProject((prev: any) => (prev ? { ...prev, project_status: newStatus } : null));
      setIsStatusMenuOpen(false);
      toast.success(`Project status changed to ${newStatus.replace("_", " ")}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const getMilestoneStatusStyles = (status: MilestoneStatus) => {
    switch (status) {
      case MilestoneStatus.completed:
        return "bg-green-50 text-green-700 border-green-200";
      case MilestoneStatus.active:
        return "bg-blue-50 text-blue-700 border-blue-200";
      case MilestoneStatus.pending:
        return "bg-amber-50 text-amber-700 border-amber-200";
      case MilestoneStatus.on_hold:
        return "bg-orange-50 text-orange-700 border-orange-200";
      case MilestoneStatus.cancelled:
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-slate-50 text-slate-600 border-slate-200";
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!project) return <div className="flex h-screen items-center justify-center">Project not found.</div>;

  const statusOptions: { label: string; value: projectStatus; icon: any; color: string }[] = [
    { label: "Draft", value: "draft", icon: FileText, color: "text-slate-600 bg-slate-100" },
    { label: "Pending", value: "pending", icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Active", value: "active", icon: PlayCircle, color: "text-blue-600 bg-blue-100" },
    { label: "On Hold", value: "on_hold", icon: StopCircle, color: "text-orange-600 bg-orange-100" },
    { label: "Completed", value: "completed", icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    { label: "Cancelled", value: "cancelled", icon: XCircle, color: "text-red-600 bg-red-100" },
  ];

  const currentStatus = statusOptions.find(s => s.value === project.project_status) || statusOptions[0];

  return (
    <div className="relative flex h-full min-h-screen w-full bg-slate-50 overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow">
     <aside className="hidden md:flex w-64 bg-white border-r sticky top-0 h-screen">
        <Sidebar role="admin" />
      </aside>

        <main className="flex-1 flex flex-col max-w-[960px] mx-auto py-5 px-6 ml-80">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 p-4">
            <a className="text-[#4e7397] text-base font-medium hover:underline" href="/admin/owner/projects">Projects</a>
            <span className="text-[#4e7397] text-base font-medium">/</span>
            <span className="text-[#0e141b] text-base font-medium">{project.name}</span>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-3 p-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-[#0e141b] text-[32px] font-bold leading-tight">{project.name}</h1>
              <div className="flex items-center gap-2 text-[#4e7397] text-sm">
                <Briefcase className="w-4 h-4" />
                <span>Project ID: {projectId.slice(0, 8)}...</span>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-full border transition-all shadow-sm font-semibold text-sm",
                  currentStatus.color,
                  "border-transparent hover:brightness-95"
                )}
              >
                <currentStatus.icon className="w-4 h-4" />
                <span>{currentStatus.label}</span>
                <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusMenuOpen && "rotate-180")} />
              </button>

              {isStatusMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleProjectStatusChange(option.value)}
                      className={cn(
                        "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors hover:bg-slate-50",
                        project.project_status === option.value ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-600"
                      )}
                    >
                      <option.icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="px-4 mt-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-3 text-[#0e141b]">
                <AlignLeft className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold">Project Description</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {project.description || "No description provided for this project."}
              </p>
            </div>
          </div>

          <h3 className="text-[#0e141b] text-lg font-bold px-4 pb-2 pt-8">Quick Stats</h3>
          <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#4e7397] mb-1">
                <User className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Client</p>
              </div>
              <p className="text-[#0e141b] font-medium">{project.client}</p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#4e7397] mb-1">
                <Calendar className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Started At</p>
              </div>
              <p className="text-[#0e141b] font-medium">
                {project.started_at ? new Date(project.started_at).toLocaleDateString() : "Not set"}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#4e7397] mb-1">
                <Clock className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Deadline</p>
              </div>
              <p className="text-[#0e141b] font-medium">
                {new Date(project.deadline).toLocaleDateString()}
              </p>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 text-[#4e7397] mb-1">
                <CheckCircle2 className="w-4 h-4" />
                <p className="text-xs font-bold uppercase tracking-wider">Admin</p>
              </div>
              <p className="text-[#0e141b] font-medium">{project.assignedto}</p>
            </div>
          </div>

          <div className="flex items-center justify-between px-4 mt-8">
            <h3 className="text-[#0e141b] text-lg font-bold">Milestones</h3>
            <button
              onClick={() => router.push(`/admin/owner/createmilestone/${projectId}`)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors shadow-md shadow-blue-200"
            >
              + Add Milestone
            </button>
          </div>

          <div className="px-4 py-4">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Milestone</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {milestones.length > 0 ? (
                    milestones.map((m) => (
                      <tr key={m.id} onClick={() => router.push(`/admin/owner/milestone/${m.id}`)} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-[#0e141b] font-medium">{m.name}</td>
                        <td className="px-6 py-4 text-sm text-[#4e7397]">
                          {m.due_date ? new Date(m.due_date).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span
                            className={cn(
                              "px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wider",
                              getMilestoneStatusStyles(m.milestone_status)
                            )}
                          >
                            {m.milestone_status.replace("_", " ")}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 italic">No milestones yet.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
