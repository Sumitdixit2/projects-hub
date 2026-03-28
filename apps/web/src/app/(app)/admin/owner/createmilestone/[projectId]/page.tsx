"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import Sidebar from "@/components/layout/sidebar";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service";
import { MilestoneStatus } from "@/types/milestone.types";
import { ChevronRight, Task, AlarmClock, NetworkTree, Info, Search, Bell, HelpCircle } from "lucide-react";

const milestoneSchema = z.object({
  title: z.string().min(2, "Milestone name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  dueDate: z.string().min(1, "Deadline is required"),
  status: z.enum(["planning", "in-progress", "review", "completed"]),
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

export default function CreateMilestonePage() {
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [projectName, setProjectName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      status: "planning",
    },
  });

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectService.getMyProject(projectId);
        console.log("project is:", project);
        setProjectName(project.name);
      } catch (error) {
        setProjectName("Project");
      }
    };
    fetchProject();
  }, [projectId]);

  const onSubmit = async (data: MilestoneFormData) => {
    try {
      setLoading(true);
      await milestoneService.createMilestone(projectId, {
        ...data,
        dueDate: new Date(data.dueDate),
      } as any);

      toast.success("Milestone created successfully");
      router.push(`/admin/owner/project/${projectId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create milestone");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f6f7f8] text-[#0f172a] font-inter">
      <Sidebar role="admin" />

      <div className="flex-1 flex flex-col min-h-screen ml-80">
        <header className="sticky top-0 h-16 bg-white/80 backdrop-blur-md border-b border-blue-600/10 z-40">
          <div className="flex items-center justify-between px-8 h-full">
            <div className="flex items-center gap-4">
              <span className="text-lg font-black text-[#197fe6]">Milestone Manager</span>
            </div>
            <div className="flex items-center gap-6">
              <div className="relative hidden lg:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-lg text-sm focus:ring-2 focus:ring-[#197fe6] w-64 transition-all"
                  placeholder="Search milestones..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-4 text-slate-500">
                <button className="hover:text-[#197fe6] transition-colors"><Bell className="w-5 h-5" /></button>
                <button className="hover:text-[#197fe6] transition-colors"><HelpCircle className="w-5 h-5" /></button>
                <div className="w-8 h-8 rounded-full overflow-hidden border border-blue-600/20 bg-slate-200" />
              </div>
            </div>
          </div>
        </header>

        <main className="p-8 max-w-5xl mx-auto w-full">
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-6 uppercase tracking-wider">
            <a className="hover:text-[#197fe6] transition-colors" href="/admin/owner/projects">Projects</a>
            <ChevronRight className="w-3 h-3" />
            <a className="hover:text-[#197fe6] transition-colors" href={`/admin/owner/project/${projectId}`}>{projectName}</a>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[#197fe6]">Add Milestone</span>
          </nav>

          <div className="mb-10">
            <h2 className="text-[1.875rem] font-black text-[#0f172a] tracking-tight leading-none mb-2">
              Create New Milestone
            </h2>
            <p className="text-slate-500 max-w-2xl">
              Define key objectives and deadlines for the current phase of development. Ensure all stakeholder requirements are mapped before saving.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-xl shadow-sm border border-[#197fe6]/10 p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Milestone Name</label>
                    <input
                      {...register("title")}
                      className="w-full bg-slate-50 border-none rounded-lg py-3 px-4 text-[#0f172a] focus:ring-2 focus:ring-[#197fe6] transition-all"
                      placeholder="e.g. Beta API Integration"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                    <textarea
                      {...register("description")}
                      className="w-full bg-slate-50 border-none rounded-lg py-3 px-4 text-[#0f172a] focus:ring-2 focus:ring-[#197fe6] transition-all"
                      placeholder="Detail the scope and deliverables of this milestone..."
                      rows={5}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Deadline</label>
                      <input
                        {...register("dueDate")}
                        type="date"
                        className="w-full bg-slate-50 border-none rounded-lg py-3 px-4 text-[#0f172a] focus:ring-2 focus:ring-[#197fe6] transition-all"
                      />
                      {errors.dueDate && <p className="text-red-500 text-xs mt-1">{errors.dueDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Milestone Status</label>
                      <select
                        {...register("status")}
                        className="w-full bg-slate-50 border-none rounded-lg py-3 px-4 text-[#0f172a] focus:ring-2 focus:ring-[#197fe6] transition-all"
                      >
                        <option value="planning">Planning</option>
                        <option value="in-progress">In-Progress</option>
                        <option value="review">Review</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => router.back()}
                      className="px-8 py-3 rounded-lg font-bold text-sm text-slate-500 hover:text-[#0f172a] hover:bg-slate-100 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-8 py-3 rounded-lg font-bold text-sm bg-[#197fe6] text-white shadow-md shadow-[#197fe6]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Milestone"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white border border-[#197fe6]/10 rounded-xl p-6 shadow-sm">
                <h3 className="text-xs font-black text-[#197fe6] uppercase tracking-widest mb-4">Quick Guidelines</h3>
                <ul className="space-y-4">
                  <li className="flex gap-3">
                    <Task className="text-[#197fe6] w-5 h-5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#0f172a] block">Specific Goals</strong>
                      Milestones should be atomic and verifiable upon completion.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <AlarmClock className="text-[#197fe6] w-5 h-5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#0f172a] block">Realistic Timing</strong>
                      Ensure the deadline accounts for existing resource allocation.
                    </p>
                  </li>
                  <li className="flex gap-3">
                    <NetworkTree className="text-[#197fe6] w-5 h-5 flex-shrink-0" />
                    <p className="text-xs text-slate-600 leading-relaxed">
                      <strong className="text-[#0f172a] block">Dependency Check</strong>
                      Identify any blocked tasks that rely on this milestone.
                    </p>
                  </li>
                </ul>
              </div>

              <div className="bg-[#197fe6]/5 border border-[#197fe6]/10 rounded-xl p-6">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="text-[#197fe6] w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#197fe6]">System Notification</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Saving this milestone will notify team members currently assigned to the {projectName} project.
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
