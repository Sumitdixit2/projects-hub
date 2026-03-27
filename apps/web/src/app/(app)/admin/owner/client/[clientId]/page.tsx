"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import Sidebar from "@/components/layout/sidebar";
import { toast } from "sonner";
import Link from "next/link";
import { projectType } from "@/types/project.types";
import { projectService } from "@/services/project.service";

type Project = {
  id: string;
  name: string;
  project_status: string;
  deadline: string;
};

type ClientDetails = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  project: Project[];
};

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const router = useRouter();
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<projectType[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        setProjects([]);
        toast.error("Failed to fetch projects");
      }
    };
    fetchProjects();
  }, []);



  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await adminService.getClientById(clientId as string);
        setClient(response.data);
      } catch (error: any) {
        console.error("Error fetching client:", error);
        toast.error("Failed to load client details");
      } finally {
        setLoading(false);
      }
    };

    if (clientId) fetchClientData();
  }, [clientId]);

  if (loading) return <div className="p-8 text-center">Loading client details...</div>;
  if (!client) return <div className="p-8 text-center">Client not found.</div>;

  return (
    <div className="relative flex h-screen w-full bg-slate-50 group/design-root overflow-hidden">
      <Sidebar role="admin" />

      <div className="flex flex-1 flex-col overflow-y-auto">
        <div className="layout-content-container flex flex-col max-w-[960px] flex-1 mx-auto w-full">

          <div className="flex flex-wrap gap-2 p-4">
            <Link className="text-[#4e7397] text-base font-medium leading-normal hover:underline" href="/admin/owner/projects">
              Projects
            </Link>
            <span className="text-[#4e7397] text-base font-medium leading-normal">/</span>
            <span className="text-[#0e141b] text-base font-medium leading-normal">Client Details</span>
          </div>

          <div className="flex flex-wrap justify-between gap-3 p-4">
            <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">
              Client: {client.name}
            </p>
            <button
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-medium leading-normal hover:bg-[#d0dbe7] transition-colors"
            >
              <span className="truncate">Edit</span>
            </button>
          </div>

          <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Contact Information
          </h3>
          <div className="p-4 grid grid-cols-[20%_1fr] gap-x-6">
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm font-normal leading-normal">Email</p>
              <p className="text-[#0e141b] text-sm font-normal leading-normal">{client.email}</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm font-normal leading-normal">Phone</p>
              <p className="text-[#0e141b] text-sm font-normal leading-normal">{client.phone || "Not provided"}</p>
            </div>
            <div className="col-span-2 grid grid-cols-subgrid border-t border-t-[#d0dbe7] py-5">
              <p className="text-[#4e7397] text-sm font-normal leading-normal">Address</p>
              <p className="text-[#0e141b] text-sm font-normal leading-normal">{client.address || "Not provided"}</p>
            </div>
          </div>

          <h3 className="text-[#0e141b] text-lg font-bold leading-tight tracking-[-0.015em] px-4 pb-2 pt-4">
            Associated Projects
          </h3>
          <div className="px-4 py-3">
            <div className="flex overflow-hidden rounded-lg border border-[#d0dbe7] bg-white">
              <table className="flex-1 w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#d0dbe7]">
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal w-[400px]">
                      Project Name
                    </th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal w-60">Status</th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal w-[400px]">
                      Due Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {client.project && client.project.length > 0 ? (
                    client.project.map((project) => (
                      <tr key={project.id} className="border-t border-[#d0dbe7] hover:bg-slate-50 transition-colors">
                        <td className="h-[72px] px-4 py-2 text-[#0e141b] text-sm font-normal">
                          {project.name}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-normal">
                          <button
                            className="flex min-w-[84px] max-w-[120px] items-center justify-center rounded-lg h-8 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-medium leading-normal"
                          >
                            <span className="truncate capitalize">{project.project_status.replace("_", " ")}</span>
                          </button>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7397] text-sm font-normal">
                          {project.deadline ? new Date(project.deadline).toLocaleDateString() : "N/A"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="p-8 text-center text-gray-500">No projects associated with this client.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
