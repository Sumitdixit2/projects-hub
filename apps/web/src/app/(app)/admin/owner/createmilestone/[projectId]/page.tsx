"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service";
import { Flag, AlignLeft, Calendar, CheckSquare, AlarmClock, Network, ArrowLeft, Play } from "lucide-react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// ─── Schema (PRESERVED EXACTLY) ───────────────────────────────────────────────

const milestoneSchema = z.object({
  name: z.string().min(2, "Milestone name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  due_date: z.string().min(1, "Deadline is required"),
  initialStatus: z.enum(["draft", "pending", "active", "on_hold", "completed", "cancelled"]),
});

type MilestoneFormData = z.infer<typeof milestoneSchema>;

// ─── Component ────────────────────────────────────────────────────────────────

export default function CreateMilestonePage() {
  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const { projectId } = useParams() as { projectId: string };
  const router = useRouter();
  const [projectName, setProjectName] = useState<string>("Loading...");
  const [loading, setLoading] = useState(false);

  // ── Form (PRESERVED EXACTLY) ───────────────────────────────────────────────
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MilestoneFormData>({
    resolver: zodResolver(milestoneSchema),
    defaultValues: {
      initialStatus: "draft",
    },
  });

  // ── Project Name Fetch (PRESERVED EXACTLY) ─────────────────────────────────
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const project = await projectService.getMyProject(projectId);
        setProjectName(project.data?.name || "Project");
      } catch (error) {
        setProjectName("Project");
      }
    };
    fetchProject();
  }, [projectId]);

  // ── Submission Handler (PRESERVED EXACTLY) ─────────────────────────────────
  const onSubmit = async (data: MilestoneFormData) => {
    try {
      setLoading(true);
      await milestoneService.createMilestone(projectId, {
        ...data,
        dueDate: new Date(data.due_date),
      } as any);

      toast.success("Milestone provisioned successfully");
      router.push(`/admin/owner/project/${projectId}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to create milestone");
    } finally {
      setLoading(false);
    }
  };

  // ─── Shared input style ────────────────────────────────────────────────────
  const inputStyles =
    "flex h-10 w-full rounded-md border border-border bg-[#0a0a0a] px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50";

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AppShell role="admin">
      <DashboardLayout
        title="Provision Milestone"
        subtitle={
          <span className="flex items-center gap-1.5 text-muted-foreground text-[12px] font-mono">
            <button
              onClick={() => router.push("/admin/owner/projects")}
              className="hover:text-foreground transition-colors"
            >
              Projects
            </button>
            <span className="opacity-30">/</span>
            <button
              onClick={() => router.push(`/admin/owner/project/${projectId}`)}
              className="hover:text-foreground transition-colors"
            >
              {projectName}
            </button>
            <span className="opacity-30">/</span>
            <span className="text-foreground">New Milestone</span>
          </span>
        }
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
              Cancel
            </Button>
            <Button
              type="submit"
              form="milestone-provisioning-form"
              size="sm"
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              {loading ? "Provisioning..." : "Save Milestone"}
            </Button>
          </div>
        }
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-4 pb-12 max-w-5xl">

          {/* ── Main Form Column ── */}
          <div className="lg:col-span-2 space-y-8">

            {/* Section 1: Identification */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                <Flag className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                  1. Milestone Identification
                </h3>
              </div>

              <Card className="p-6 bg-[#050505] border-l-2 border-l-primary/50 border-y-border border-r-border shadow-sm space-y-5">
                <form id="milestone-provisioning-form" onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">Milestone Name</label>
                    <input
                      {...register("name")}
                      placeholder="e.g. Beta API Integration"
                      className={inputStyles}
                    />
                    {errors.name && (
                      <p className="text-[11px] text-red-500">{errors.name.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">
                      <span className="flex items-center gap-1.5">
                        <AlignLeft className="w-3.5 h-3.5 text-muted-foreground" />
                        Scope Description
                      </span>
                    </label>
                    <textarea
                      {...register("description")}
                      placeholder="Detail the scope, deliverables, and success criteria..."
                      rows={4}
                      className="flex w-full rounded-md border border-border bg-[#0a0a0a] px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-y"
                    />
                    {errors.description && (
                      <p className="text-[11px] text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                </form>
              </Card>
            </div>

            {/* Section 2: Operational Parameters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 border-b border-border/50 pb-2">
                <Calendar className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                  2. Operational Parameters
                </h3>
              </div>

              <Card className="p-6 bg-[#050505] border-l-2 border-l-amber-500/50 border-y-border border-r-border shadow-sm">
                {/* These inputs share the form ID defined above */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">Delivery Target</label>
                    <input
                      {...register("due_date")}
                      type="date"
                      className={inputStyles + " [color-scheme:dark]"}
                    />
                    {errors.due_date && (
                      <p className="text-[11px] text-red-500">{errors.due_date.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">Initial State</label>
                    <select
                      {...register("initialStatus")}
                      className={inputStyles + " appearance-none cursor-pointer"}
                    >
                      {["draft", "pending", "active", "on_hold", "completed", "cancelled"].map((s) => (
                        <option key={s} value={s} className="bg-[#0a0a0a]">
                          {s.replace("_", " ").toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </Card>
            </div>

          </div>

          {/* ── Sidebar: Contextual Intelligence ── */}
          <div className="space-y-5">
            <Card className="p-5 bg-[#050505] border-border">
              <h3 className="text-[10px] font-mono uppercase tracking-widest text-primary mb-4">
                Provisioning Guidelines
              </h3>
              <ul className="space-y-4">
                {[
                  {
                    icon: CheckSquare,
                    title: "Atomic Objectives",
                    body: "Milestones should be singular, verifiable deliverables.",
                  },
                  {
                    icon: AlarmClock,
                    title: "Realistic Timing",
                    body: "Factor existing resource allocation before setting deadline.",
                  },
                  {
                    icon: Network,
                    title: "Dependency Mapping",
                    body: "Identify downstream tasks blocked by this milestone.",
                  },
                ].map(({ icon: Icon, title, body }) => (
                  <li key={title} className="flex gap-3">
                    <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[12px] font-medium text-foreground">{title}</p>
                      <p className="text-[11px] text-muted-foreground leading-relaxed mt-0.5">{body}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </Card>

            <Card className="p-5 bg-[#050505] border-l-2 border-l-amber-500/30 border-y-border border-r-border">
              <p className="text-[10px] font-mono uppercase tracking-widest text-amber-500/80 mb-2">
                System Notification
              </p>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Saving will notify team members assigned to{" "}
                <span className="text-foreground font-medium">{projectName}</span>.
              </p>
            </Card>
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
