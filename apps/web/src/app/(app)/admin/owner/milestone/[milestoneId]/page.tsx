"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/layout/sidebar";
import { milestoneService } from "@/services/milestone.service";
import { MilestoneStatus } from "@/types/milestone.types";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronDown,
  CheckCircle2,
  Clock,
  PlayCircle,
  StopCircle,
  XCircle,
  FileText,
  Calendar,
  AlignLeft,
  Layout,
  Info
} from "lucide-react";

export default function MilestoneDetailsPage() {
  const { milestoneId } = useParams() as { milestoneId: string };
  const router = useRouter();
  const [milestone, setMilestone] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  useEffect(() => {
    const fetchMilestoneData = async () => {
      try {
        const response = await milestoneService.getMilestone(milestoneId);
        setMilestone(response.data);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch milestone details");
      } finally {
        setLoading(false);
      }
    };
    fetchMilestoneData();
  }, [milestoneId]);

  const handleStatusChange = async (newStatus: MilestoneStatus) => {
    try {
      await milestoneService.changeMilestoneStatus(milestoneId, newStatus);
      setMilestone((prev: any) => (prev ? { ...prev, milestone_status: newStatus } : null));
      setIsStatusMenuOpen(false);
      toast.success(`Milestone status updated to ${newStatus.replace("_", " ")}`);
    } catch (error: any) {
      toast.error(error.message || "Failed to update milestone status");
    }
  };

  const statusOptions: { label: string; value: MilestoneStatus; icon: any; color: string }[] = [
    { label: "Draft", value: MilestoneStatus.draft, icon: FileText, color: "text-slate-600 bg-slate-100" },
    { label: "Pending", value: MilestoneStatus.pending, icon: Clock, color: "text-amber-600 bg-amber-100" },
    { label: "Active", value: MilestoneStatus.active, icon: PlayCircle, color: "text-blue-600 bg-blue-100" },
    { label: "On Hold", value: MilestoneStatus.on_hold, icon: StopCircle, color: "text-orange-600 bg-orange-100" },
    { label: "Completed", value: MilestoneStatus.completed, icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    { label: "Cancelled", value: MilestoneStatus.cancelled, icon: XCircle, color: "text-red-600 bg-red-100" },
  ];

  const currentStatus = statusOptions.find(s => s.value === milestone?.milestone_status) || statusOptions[0];

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!milestone) return <div className="flex h-screen items-center justify-center">Milestone not found.</div>;

  return (
    <div className="relative flex h-full min-h-screen w-full bg-slate-50 overflow-x-hidden font-inter">
      <Sidebar role="admin" />

      <main className="flex-1 flex flex-col max-w-[960px] mx-auto py-5 px-6 ml-80">
        {/* Navigation / Header */}
        <div className="flex items-center gap-4 mb-6">
          <button 
            onClick={() => router.back()}
            className="p-2 hover:bg-slate-200 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-slate-600" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-[#0e141b] text-2xl font-bold">{milestone.name}</h1>
            <p className="text-slate-500 text-sm">Milestone ID: {milestoneId.slice(0, 8)}...</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#0e141b]">
                <AlignLeft className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold">Milestone Description</h3>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm whitespace-pre-wrap">
                {milestone.description || "No description provided."}
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#0e141b]">
                <Calendar className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold">Schedule & Deadlines</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Due Date</p>
                  <p className="text-[#0e141b] font-medium">
                    {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString() : "Not set"}
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Created At</p>
                  <p className="text-[#0e141b] font-medium">
                    {milestone.created_at ? new Date(milestone.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
              <h3 className="text-sm font-bold text-[#0e141b] mb-4 uppercase tracking-wider">Current Status</h3>
              
              <div className="relative">
                <button
                  onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
                  className={cn(
                    "flex items-center justify-between w-full px-4 py-3 rounded-lg border transition-all font-semibold text-sm",
                    currentStatus.color,
                    "border-transparent hover:brightness-95 shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <currentStatus.icon className="w-4 h-4" />
                    <span>{currentStatus.label}</span>
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isStatusMenuOpen && "rotate-180")} />
                </button>

                {isStatusMenuOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-200 z-50 overflow-hidden py-1">
                    {statusOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => handleStatusChange(option.value)}
                        className={cn(
                          "flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors hover:bg-slate-50",
                          milestone.milestone_status === option.value ? "text-blue-600 bg-blue-50 font-medium" : "text-slate-600"
                        )}
                      >
                        <option.icon className="w-4 h-4" />
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 flex gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-blue-700 leading-tight">
                  Status changes are live. Clients will be notified of major status updates.
                </p>
              </div>
            </div>

            {/* Quick Navigation back to Project */}
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <div className="flex items-center gap-2 mb-4 text-[#0e141b]">
                <Layout className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider">Project Timeline</span>
              </div>
              <button 
                onClick={() => router.push(`/admin/owner/project/${milestone.project_id}`)}
                className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-md"
              >
                Back to Project
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
