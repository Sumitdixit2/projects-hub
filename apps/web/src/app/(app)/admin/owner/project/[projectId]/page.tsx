"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service";
import { projectType, projectStatus } from "@/types/project.types";
import { MilestoneType, MilestoneStatus } from "@/types/milestone.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function ProjectDetailsPage() {
  const { projectId } = useParams() as { projectId: string };
  const [project, setProject] = useState<projectType | null>(null);
  const [milestones, setMilestones] = useState<MilestoneType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectData, milestonesData] = await Promise.all([
          projectService.getMyProject(projectId),
          milestoneService.getMilestones(projectId),
        ]);
        setProject(projectData);
        setMilestones(milestonesData);
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
      setProject((prev) => (prev ? { ...prev, project_status: newStatus } : null));
      toast.success("Project status updated");
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    }
  };

  const handleMilestoneStatusChange = async (milestoneId: string, currentStatus: MilestoneStatus) => {
    const newStatus: MilestoneStatus = currentStatus === "completed" ? "pending" : "completed";
    try {
      await milestoneService.changeMilestoneStatus(milestoneId, newStatus);
      setMilestones((prev) =>
        prev.map((m) => (m.id === milestoneId ? { ...m, status: newStatus } : m))
      );
      toast.success(`Milestone marked as ${newStatus}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone");
    }
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading project details...</div>;
  }

  if (!project) {
    return <div className="flex h-screen items-center justify-center">Project not found.</div>;
  }

  const statusOptions: projectStatus[] = ["draft", "pending", "active", "on_hold", "completed", "cancelled"];

  return (
    <div className="relative flex h-full min-h-screen w-full bg-slate-50 overflow-x-hidden font-inter">
      <div className="layout-container flex h-full grow">
        <Sidebar role="admin" />

        <main className="flex-1 flex flex-col max-w-[960px] mx-auto py-5 px-6">
          {/* Breadcrumbs */}
          <div className="flex flex-wrap gap-2 p-4">
            <a className="text-[#4e7397] text-base font-medium hover:underline" href="/admin/owner/projects">
              Projects
            </a>
            <span className="text-[#4e7397] text-base font-medium">/</span>
            <span className="text-[#0e141b] text-base font-medium">{project.name}</span>
          </div>

          {/* Header */}
          <div className="flex flex-wrap justify-between gap-3 p-4">
            <div className="flex min-w-72 flex-col gap-3">
              <h1 className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight">
                {project.name} Details
              </h1>
              <p className="text-[#4e7397] text-sm font-normal">
                Manage all aspects of {project.name}, including milestones, status, and communication.
              </p>
            </div>
          </div>

          {/* Project Information */}
          <h3 className="text-[#0e141b] text-lg font-bold px-4 pb-2 pt-4">Project Information</h3>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <div className="col-span-2 grid grid-cols-subgrid border-t border-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm">Client</p>
              <p className="text-[#0e141b] text-sm font-medium">{project.client}</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm">Deadline</p>
              <p className="text-[#0e141b] text-sm font-medium">
                {new Date(project.deadline).toLocaleDateString()}
              </p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm">Assigned To</p>
              <p className="text-[#0e141b] text-sm font-medium">{project.assignedto}</p>
            </div>
          </div>

          {/* Project Status Selection */}
          <h3 className="text-[#0e141b] text-lg font-bold px-4 pb-2 pt-4">Project Status</h3>
          <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
            <label className="flex flex-col min-w-40 flex-1">
              <p className="text-[#0e141b] text-base font-medium pb-2">Status</p>
              <select
                value={project.project_status}
                onChange={(e) => handleProjectStatusChange(e.target.value as projectStatus)}
                className="form-input flex w-full rounded-lg text-[#0e141b] border-[#d0dbe7] bg-slate-50 h-14 p-[15px] text-base focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.replace("_", " ").toUpperCase()}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Milestones Table */}
          <h3 className="text-[#0e141b] text-lg font-bold px-4 pb-2 pt-4">Milestones</h3>
          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-lg border border-[#d0dbe7] bg-slate-50">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#d0dbe7]">
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium w-1/2">Milestone</th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium">Due Date</th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium text-center">Status</th>
                    <th className="px-4 py-3 text-[#4e7397] text-sm font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {milestones.length > 0 ? (
                    milestones.map((milestone) => (
                      <tr key={milestone.id} className="border-t border-[#d0dbe7] hover:bg-slate-100">
                        <td className="px-4 py-4 text-[#0e141b] text-sm">{milestone.title}</td>
                        <td className="px-4 py-4 text-[#4e7397] text-sm">
                          {new Date(milestone.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4 text-center">
                          <button
                            onClick={() => handleMilestoneStatusChange(milestone.id, milestone.status)}
                            className={cn(
                              "inline-flex items-center justify-center rounded-lg h-8 px-4 text-sm font-medium transition-colors w-full max-w-[120px]",
                              milestone.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-[#e7edf3] text-[#0e141b] hover:bg-[#d0dbe7]"
                            )}
                          >
                            {milestone.status === "completed" ? "Completed" : "Mark Done"}
                          </button>
                        </td>
                        <td className="px-4 py-4 text-right">
                          <button className="text-[#4e7397] text-sm font-bold hover:text-blue-600">
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-[#4e7397]">
                        No milestones added yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex px-4 py-3">
            <button className="flex items-center justify-center rounded-lg h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold hover:bg-[#d0dbe7]">
              Add Milestone
            </button>
          </div>

          <h3 className="text-[#0e141b] text-lg font-bold px-4 pb-2 pt-4">Quick Actions</h3>
          <div className="flex gap-3 px-4 py-3">
            <button className="flex-1 rounded-lg h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold hover:bg-[#d0dbe7]">
              View Messages
            </button>
            <button className="flex-1 rounded-lg h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-bold hover:bg-[#d0dbe7]">
              View Activity Log
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
