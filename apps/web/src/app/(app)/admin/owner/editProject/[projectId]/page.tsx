"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { projectService } from "@/services/project.service";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { toast } from "sonner";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Terminal, Shield, Calendar, Play } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { SkeletonDetailPage } from "@/components/ui/skeletons";

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
  clientId: z.string(),
  assignedTo: z.string(),
  project_status: z.enum(statusValues),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormData = z.infer<typeof projectSchema>;

type Client = {
  id: string;
  name: string;
};

export default function EditProjectPage() {
  const { projectId } = useParams() as { projectId: string };
  const [isFetchingData, setIsFetchingData] = useState(true);
  const [fetchError, setFetchError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [admins, setAdmins] = useState<any[]>([]);
  const [clientName, setClientName] = useState("");
  const [adminsName, setAdminsName] = useState("");
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      assignedTo: "",
      project_status: "draft",
      deadline: "",
    },
  });

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsFetchingData(true);
        const [projectRes, clientsRes, adminsRes] = await Promise.all([
          projectService.getMyProject(projectId),
          adminService.getAllClients().catch(() => ({ data: [] })),
          adminService.getAllAdmins().catch(() => ({ data: [] })),
        ]);

        const fetchedProject = projectRes.data;
        if (!fetchedProject) {
          setFetchError(true);
          return;
        }

        const fetchedClients = clientsRes.data || [];
        const fetchedAdmins = adminsRes.data || [];

        setClients(fetchedClients);
        setAdmins(fetchedAdmins);

        // Data Normalization
        const normalizedDeadline = fetchedProject.deadline
          ? new Date(fetchedProject.deadline).toISOString().split("T")[0]
          : "";

        const selectedClient = fetchedClients.find((c: any) => c.name === fetchedProject.client);
        const selectedAdmin = fetchedAdmins.find((a: any) => a.fullname === fetchedProject.assignedto);

        form.reset({
          name: fetchedProject.name || "",
          description: fetchedProject.description || "",
          project_status: fetchedProject.project_status || "draft",
          deadline: normalizedDeadline,
          clientId: selectedClient?.id || "",
          assignedTo: selectedAdmin?.id || "",
        });

        setClientName(fetchedProject.client || "");
        setAdminsName(fetchedProject.assignedto || "");

      } catch (error) {
        setFetchError(true);
      } finally {
        setIsFetchingData(false);
      }
    };

    loadInitialData();
  }, [projectId, form]);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      await projectService.updateProject(projectId, data);
      toast.success("Project configuration updated successfully");
      router.push(`/admin/owner/project/${projectId}`);
    } catch (error: any) {
      toast.error(error?.message || "Failed to update project configuration");
    } finally {
      setLoading(false);
    }
  };

  if (isFetchingData) {
    return (
      <AppShell role="admin">
        <DashboardLayout title="" subtitle="">
          <SkeletonDetailPage />
        </DashboardLayout>
      </AppShell>
    );
  }

  if (fetchError) {
    return (
      <AppShell role="admin">
        <div className="flex h-full items-center justify-center text-muted-foreground text-[13px] font-mono">
          PROJECT_NOT_FOUND
        </div>
      </AppShell>
    );
  }

  const inputStyles = "flex h-10 w-full rounded-md border border-border bg-[#0a0a0a] px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50";

  return (
    <AppShell role="admin">
      <DashboardLayout 
        title="Configure Workspace" 
        subtitle="Manage and update the existing operational environment."
        actions={
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => router.push(`/admin/owner/project/${projectId}`)}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              form="project-initialization-form" 
              size="sm" 
              disabled={loading}
              className="gap-2"
            >
              <Play className="w-3.5 h-3.5" />
              {loading ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        }
      >
        <div className="max-w-3xl space-y-8 mt-4 pb-12">
          
          <form id="project-initialization-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Section 1: Workspace Configuration */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                <Terminal className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">1. Workspace Configuration</h3>
              </div>
              
              <Card className="p-6 bg-[#050505] border-l-2 border-l-primary/50 border-y-border border-r-border shadow-sm space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Project Name</label>
                  <input
                    {...form.register("name")}
                    placeholder="e.g. Acme Corp Migration"
                    className={inputStyles}
                  />
                  {form.formState.errors.name && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Operational Description</label>
                  <textarea
                    {...form.register("description")}
                    placeholder="Define the scope and objectives for this deployment..."
                    className="flex min-h-[100px] w-full rounded-md border border-border bg-[#0a0a0a] px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50 resize-y"
                  />
                  {form.formState.errors.description && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.description.message}</p>
                  )}
                </div>
              </Card>
            </div>

            {/* Section 2: Access Control */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-violet-500 border-b border-border/50 pb-2">
                <Shield className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">2. Access Control & Routing</h3>
              </div>

              <Card className="p-6 bg-[#050505] border-l-2 border-l-violet-500/50 border-y-border border-r-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Client Routing */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Target Client</label>
                  <div className="relative">
                    <Combobox
                      items={clients.map((client) => client.name)}
                      value={clientName}
                      onValueChange={(selectedName: string | null) => { if(!selectedName) return;
                        setClientName(selectedName);
                        const selectedClient = clients.find((client) => client.name === selectedName);
                        if (selectedClient) {
                          form.setValue("clientId", selectedClient.id, { shouldValidate: true });
                          form.clearErrors("clientId");
                        }
                      }}
                    >
                      <ComboboxInput placeholder="Select client tenant..." className={inputStyles} />
                      <ComboboxContent className="bg-[#0a0a0a] border border-border">
                        <ComboboxEmpty className="text-[12px] text-muted-foreground py-2">No active clients found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: string) => (
                            <ComboboxItem key={item} value={item} className="text-[13px] text-foreground hover:bg-white/5 cursor-pointer">
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <input type="hidden" {...form.register("clientId")} />
                  {form.formState.errors.clientId && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.clientId.message}</p>
                  )}
                </div>

                {/* Admin Assignment */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Lead Operator (Admin)</label>
                  <div className="relative">
                    <Combobox
                      items={admins.map((admin) => admin.fullname)}
                      value={adminsName}
                      onValueChange={(selectedName: string | null) => { if(!selectedName) return;
                        setAdminsName(selectedName);
                        const selectedAdmin = admins.find((admin) => admin.fullname === selectedName);
                        if (selectedAdmin) {
                          form.setValue("assignedTo", selectedAdmin.id, { shouldValidate: true });
                          form.clearErrors("assignedTo");
                        }
                      }}
                    >
                      <ComboboxInput placeholder="Assign to system admin..." className={inputStyles} />
                      <ComboboxContent className="bg-[#0a0a0a] border border-border">
                        <ComboboxEmpty className="text-[12px] text-muted-foreground py-2">No admins found.</ComboboxEmpty>
                        <ComboboxList>
                          {(item: string) => (
                            <ComboboxItem key={item} value={item} className="text-[13px] text-foreground hover:bg-white/5 cursor-pointer">
                              {item}
                            </ComboboxItem>
                          )}
                        </ComboboxList>
                      </ComboboxContent>
                    </Combobox>
                  </div>
                  <input type="hidden" {...form.register("assignedTo")} />
                  {form.formState.errors.assignedTo && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.assignedTo.message}</p>
                  )}
                </div>

              </Card>
            </div>

            {/* Section 3: Operational Parameters */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-amber-500 border-b border-border/50 pb-2">
                <Calendar className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">3. Operational Parameters</h3>
              </div>

              <Card className="p-6 bg-[#050505] border-l-2 border-l-amber-500/50 border-y-border border-r-border shadow-sm grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Initial Status */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Initial Pipeline State</label>
                  <select
                    {...form.register("project_status")}
                    className={inputStyles + " appearance-none cursor-pointer"}
                  >
                    {statusValues.map((status) => (
                      <option key={status} value={status} className="bg-[#0a0a0a]">
                        {status.toUpperCase().replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-medium text-foreground">Delivery Target</label>
                  <input
                    type="date"
                    {...form.register("deadline")}
                    className={inputStyles + " [color-scheme:dark]"}
                  />
                  {form.formState.errors.deadline && (
                    <p className="text-[11px] text-red-500">{form.formState.errors.deadline.message}</p>
                  )}
                </div>

              </Card>
            </div>

          </form>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
