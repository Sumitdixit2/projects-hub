"use client";

import Sidebar from "@/components/layout/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { projectService } from "@/services/project.service";
import { milestoneService } from "@/services/milestone.service"; // Added for milestone creation if needed
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const statusValues = [
  "draft",
  "pending",
  "active",
  "on_hold",
  "completed",
  "cancelled",
] as const;

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  clientId: z.string().min(1, "Please select a client"),
  assignedTo: z.string().min(1, "Please assign to an admin"),
  project_status: z.enum(statusValues),
  deadline: z.string().min(1, "Deadline is required"),
  // Added milestones schema
  milestones: z.array(z.string()).optional(),
});

type FormData = z.infer<typeof projectSchema>;

type Client = {
  id: string;
  name: string;
};

export default function AddProjectPage() {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");
  const [adminsName, setAdminsName] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      assignedTo: "",
      project_status: "draft",
      deadline: "",
      milestones: ["", "", ""], // Initializing with 3 empty milestones
    },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients();
        setClients(response.data);
      } catch (error) {
        setClients([]);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await adminService.getAllAdmins();
        setAdmins(response.data);
      } catch (error: any) {
        setAdmins([]);
      }
    };
    fetchClients();
    fetchAdmins();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      // Create the project
      const projectResponse = await projectService.createProject(data as any);

      // If milestones were provided, create them linked to the new project
      if (data.milestones && projectResponse.data?.id) {
        const activeMilestones = data.milestones.filter(m => m.trim() !== "");
        await Promise.all(
          activeMilestones.map(title =>
            milestoneService.createMilestone(projectResponse.data.id, {
              title,
              status: "pending",
              dueDate: new Date(data.deadline) // Defaulting to project deadline
            } as any)
          )
        );
      }

      form.reset();
      setClientName("");
      setAdminsName("");
      toast.success("Project and milestones created successfully 🚀");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#1980e6] focus:ring-2 focus:ring-[#1980e6]/20";

  // Shared styles from the provided UI snippet
  const legacyInputStyles = "form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#0e141b] focus:outline-0 focus:ring-0 border border-[#d0dbe7] bg-slate-50 focus:border-[#d0dbe7] h-14 placeholder:text-[#4e7397] p-[15px] text-base font-normal leading-normal";
  const selectStyles = cn(legacyInputStyles, "bg-[image:--select-button-svg]");

  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-sans">
      <Sidebar role="admin" />

      <div className="flex flex-1 justify-center px-6 py-10">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">
            Add New Project
          </h1>

          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Details */}
            <div className="flex flex-col gap-2 px-4">
              <label className="text-sm font-medium text-slate-700">Project Name</label>
              <input {...form.register("name")} className={inputStyles} />
              {form.formState.errors.name && <p className="text-xs text-red-500">{form.formState.errors.name.message}</p>}
            </div>

            <div className="flex flex-col gap-2 px-4">
              <label className="text-sm font-medium text-slate-700">Description</label>
              <textarea
                {...form.register("description")}
                className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1980e6] focus:ring-2 focus:ring-[#1980e6]/20"
              />
              {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
            </div>

            {/* Selection Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Select Client</label>
                <Combobox
                  items={clients.map((client) => client.name)}
                  value={clientName}
                  onValueChange={(selectedName: string) => {
                    setClientName(selectedName);
                    const selectedClient = clients.find((c) => c.name === selectedName);
                    if (selectedClient) form.setValue("clientId", selectedClient.id, { shouldValidate: true });
                  }}
                >
                  <ComboboxInput placeholder="Search clients..." className={inputStyles} />
                  <ComboboxContent>
                    <ComboboxEmpty>No clients found.</ComboboxEmpty>
                    <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700">Select Admins</label>
                <Combobox
                  items={admins.map((admin) => admin.fullname)}
                  value={adminsName}
                  onValueChange={(selectedName: string) => {
                    setAdminsName(selectedName);
                    const selectedAdmin = admins.find((a) => a.fullname === selectedName);
                    if (selectedAdmin) form.setValue("assignedTo", selectedAdmin.id, { shouldValidate: true });
                  }}
                >
                  <ComboboxInput placeholder="Search admins..." className={inputStyles} />
                  <ComboboxContent>
                    <ComboboxEmpty>No admins found.</ComboboxEmpty>
                    <ComboboxList>{(item: string) => <ComboboxItem key={item} value={item}>{item}</ComboboxItem>}</ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </div>
            </div>

            <div className="flex flex-col gap-2 px-4">
              <label className="text-sm font-medium text-slate-700">Deadline</label>
              <input type="date" {...form.register("deadline")} className={inputStyles} />
            </div>

            {/* Initial Status Section (Using provided CSS/HTML) */}
            <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">Initial Status</p>
                <select
                  {...form.register("project_status")}
                  className={selectStyles}
                >
                  <option value="">Select status</option>
                  {statusValues.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            {/* Initial Milestones Section (Using provided CSS/HTML) */}
            <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
              Initial Milestones
            </h3>

            {[0, 1, 2].map((index) => (
              <div key={index} className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                <label className="flex flex-col min-w-40 flex-1">
                  <p className="text-[#0e141b] text-base font-medium leading-normal pb-2">
                    Milestone {index + 1}
                  </p>
                  <input
                    {...form.register(`milestones.${index}`)}
                    placeholder="Enter milestone name"
                    className={legacyInputStyles}
                  />
                </label>
              </div>
            ))}

            {/* Form Actions */}
            <div className="flex px-4 py-3 justify-end">
              <button
                type="submit"
                disabled={loading}
                className="flex min-w-[120px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-[#1980e6] text-slate-50 text-sm font-bold transition hover:bg-[#166fd1] disabled:opacity-50"
              >
                <span className="truncate">{loading ? "Creating..." : "Add Project"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
