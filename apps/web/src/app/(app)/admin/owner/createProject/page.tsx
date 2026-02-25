"use client";

import Sidebar from "@/components/layout/sidebar";
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
  client_id: z.string().min(1, "Selecting a client is required"),
  status: z.enum(statusValues),
  deadline: z.string().min(1, "Deadline is required"),
});

type FormData = z.infer<typeof projectSchema>;

type Client = {
  id: string;
  name: string;
};

export default function AddProjectPage() {
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientName , setClientName] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema)
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients();
        console.log("response is : ",response);
        console.log("response DATA is: ",response.data);
        setClients([response.data]);
      } catch (error) {
        console.error("Clients failed to fetch", error);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  console.log("clients are: ",clients);

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);

      await projectService.createProject(
        data
      );

      form.reset();
      alert("Project created successfully 🚀");
    } catch (error: any) {
      console.error("Project creation failed", error);
      alert(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 font-sans">
      <div className="flex flex-1 justify-center px-6 py-5 gap-1">
        <Sidebar role="admin" />

        <div className="flex flex-1 max-w-[960px] flex-col">
          <div className="p-4">
            <h1 className="text-[32px] font-bold text-[#0e141b]">
              Add New Project
            </h1>
          </div>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 px-4"
          >
            {/* Project Name */}
            <div className="flex flex-col max-w-[480px]">
              <label className="pb-2 font-medium">Project Name</label>
              <input
                {...form.register("name")}
                className="h-12 rounded-lg border px-4"
              />
              {form.formState.errors.name && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="flex flex-col max-w-[480px]">
              <label className="pb-2 font-medium">Description</label>
              <textarea
                {...form.register("description")}
                className="rounded-lg border px-4 py-2"
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
            <label>Select client</label>

            <Combobox
              items={clients.map((client) => client.name)}
              value={clientName}
              onValueChange={(selectedName: string) => {
                setClientName(selectedName);
                const selectedClient = clients.find(
                  (client) => client.name === selectedName
                );
                if (selectedClient) {
                  form.setValue("client_id", selectedClient.id, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <ComboboxInput placeholder="Search clients..." />
              <ComboboxContent>
                <ComboboxEmpty>No clients found.</ComboboxEmpty>
                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <input type="hidden" {...form.register("client_id")} />

            <p className="text-xs text-red-500">
              {form.formState.errors.client_id?.message}
            </p>
          </div>

            {/* Status */}
            <div className="flex flex-col max-w-[480px]">
              <label className="pb-2 font-medium">Initial Status</label>
              <select
                {...form.register("status")}
                className="h-12 rounded-lg border px-4"
              >
                {Object.values(statusValues).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {/* Deadline */}
            <div className="flex flex-col max-w-[480px]">
              <label className="pb-2 font-medium">Deadline</label>
              <input
                type="date"
                {...form.register("deadline")}
                className="h-12 rounded-lg border px-4"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="h-10 rounded-lg bg-[#1980e6] px-6 text-sm font-bold text-white disabled:opacity-50"
              >
                {loading ? "Creating..." : "Add Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
