"use client";
import Sidebar from "@/components/layout/sidebar";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";

const projectSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().min(10, "description must be atleast 10 characters"),
  client_id: z.string().min(1, "Selecting a client is required"),
  admin_id: z.string().min(1, "Selecting an agency is required"),
  deadline: z.coerce.date();
});

type Client = {
  id: string;
  name: string;
}

export default function AddProjectPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [clients, setClients] = useState([]);

  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema)
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients();
        setClients(response.data);
      } catch (error: any) {
        console.error("agencies failed to fetch", error);
        setClients([]);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="relative flex min-h-screen w-full flex-col bg-slate-50 overflow-x-hidden font-sans">
      <div className="flex flex-1 justify-center px-6 py-5 gap-1">

        <Sidebar role="admin" />
        <div className="flex flex-1 max-w-[960px] flex-col">

          <div className="p-4">
            <h1 className="text-[32px] font-bold text-[#0e141b]">
              Add New Project
            </h1>
          </div>

          <div className="space-y-4 px-4">

            <InputField label="Project Name" placeholder="Enter project name" />

            <SelectField label="Client">
              <option>Select client</option>
              <option>Client One</option>
              <option>Client Two</option>
            </SelectField>

            <SelectField label="Initial Status">
              <option>Select status</option>
              <option>Not Started</option>
              <option>In Progress</option>
              <option>Completed</option>
            </SelectField>

            <h3 className="text-lg font-bold pt-6">
              Initial Milestones
            </h3>

            <InputField label="Milestone 1" placeholder="Enter milestone name" />
            <InputField label="Milestone 2" placeholder="Enter milestone name" />
            <InputField label="Milestone 3" placeholder="Enter milestone name" />

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                {...form.register("password")}
              />
              {form.formState.errors.password && (
                <p className="text-xs text-red-500">
                  {form.formState.errors.password.message}
                </p>
              )}
            </div>

            <div className="flex justify-end pt-4">
              <button className="h-10 rounded-lg bg-[#1980e6] px-4 text-sm font-bold text-white">
                Add Project
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

function NavItem({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <div
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${active ? "bg-[#e7edf3]" : ""
        }`}
    >
      <span className="text-[#0e141b]">{label}</span>
    </div>
  );
}

function InputField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <label className="flex flex-col max-w-[480px]">
      <p className="pb-2 text-base font-medium text-[#0e141b]">
        {label}
      </p>
      <input
        placeholder={placeholder}
        className="h-14 rounded-lg border border-[#d0dbe7] bg-slate-50 p-[15px] text-base text-[#0e141b] placeholder:text-[#4e7397] focus:outline-none"
      />
    </label>
  );
}

function SelectField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col max-w-[480px]">
      <p className="pb-2 text-base font-medium text-[#0e141b]">
        {label}
      </p>
      <select
        className="h-14 rounded-lg border border-[#d0dbe7] bg-slate-50 p-[15px] text-base text-[#0e141b] focus:outline-none"
      >
        {children}
      </select>
    </label>
  );
}
