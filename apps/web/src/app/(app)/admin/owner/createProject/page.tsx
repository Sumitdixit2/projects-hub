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
import { toast } from "sonner";

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
  const [admins, setAdmins] = useState([]);
  const [clientName, setClientName] = useState("");
  const [adminsName, setAdminsName] = useState("");

  const form = useForm<FormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      clientId: "",
      assignedTo: "",
      status: "draft",
      deadline: "",
    },
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients();
        console.log("clients are: ", response.data);
        setClients(response.data);
      } catch (error) {
        setClients([]);
      }
    };

    const fetchAdmins = async () => {
      try {
        const response = await adminService.getAllAdmins();
        console.log("admins are: ", response.data);
        setAdmins(response.data);
      } catch (error: any) {
        setAdmins([]);
      }
    }
    fetchClients();
    fetchAdmins();
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      console.log("error is: ", form.formState.errors);
      setLoading(true);
      await projectService.createProject(data);
      form.reset();
      setClientName("");
      toast.success("Project created successfully 🚀");
    } catch (error: any) {
      toast.error(error?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const inputStyles =
    "h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm outline-none focus:border-[#1980e6] focus:ring-2 focus:ring-[#1980e6]/20";

  return (
    <div className="flex min-h-screen w-full bg-slate-100 font-sans">
      <Sidebar role="admin" />

      <div className="flex flex-1 justify-center px-6 py-10">
        <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
          <h1 className="mb-8 text-3xl font-bold text-slate-900">
            Add New Project
          </h1>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Project Name
              </label>
              <input
                {...form.register("name")}
                className={inputStyles}
              />
              {form.formState.errors.name && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.name.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Description
              </label>
              <textarea
                {...form.register("description")}
                className="min-h-[120px] w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-[#1980e6] focus:ring-2 focus:ring-[#1980e6]/20"
              />
              {form.formState.errors.description && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.description.message}
                </p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Select Client
              </label>

              <Combobox
                items={clients.map((client) => client.name)}
                value={clientName}
                onValueChange={(selectedName: string) => {
                  setClientName(selectedName);
                  const selectedClient = clients.find(
                    (client) => client.name === selectedName
                  );

                  if (selectedClient) {
                    form.setValue("clientId", selectedClient.id, {
                      shouldValidate: true,
                    });

                    form.clearErrors("clientId");
                  }
                }}
              >
                <ComboboxInput
                  placeholder="Search clients..."
                  className={inputStyles}
                />
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

              <input type="hidden" {...form.register("clientId")} />

              {form.formState.errors.clientId && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.clientId.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Select Admins
              </label>

              <Combobox
                items={admins.map((admin) => admin.fullname)}
                value={adminsName}
                onValueChange={(selectedName: string) => {
                  setAdminsName(selectedName);
                  const selectedAdmin = admins.find(
                    (admin) => admin.fullname === selectedName
                  );

                  if (selectedAdmin) {
                    form.setValue("assignedTo", selectedAdmin.id, {
                      shouldValidate: true,
                    });

                    form.clearErrors("assignedTo");
                  }
                }}
              >
                <ComboboxInput
                  placeholder="Search admins..."
                  className={inputStyles}
                />
                <ComboboxContent>
                  <ComboboxEmpty>No admins found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: string) => (
                      <ComboboxItem key={item} value={item}>
                        {item}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>

              <input type="hidden" {...form.register("assignedTo")} />

              {form.formState.errors.assignedTo && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.assignedTo.message}
                </p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Initial Status
              </label>
              <select
                {...form.register("status")}
                className={inputStyles}
              >
                {statusValues.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">
                Deadline
              </label>
              <input
                type="date"
                {...form.register("deadline")}
                className={inputStyles}
              />
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="h-11 rounded-xl bg-[#1980e6] px-6 text-sm font-semibold text-white transition hover:bg-[#166fd1] disabled:cursor-not-allowed disabled:opacity-50"
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
