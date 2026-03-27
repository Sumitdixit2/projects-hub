"use client";

import { adminService } from "@/services/admin.service"; //
import { useState, useEffect } from "react";
import { toast } from "sonner";
import Sidebar from "@/components/layout/sidebar";
import { useRouter } from "next/navigation";

type Client = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await adminService.getAllClients(); //
        setClients(Array.isArray(response?.data) ? response.data : []);
      } catch (error: any) {
        console.error("Failed to fetch clients", error);
        toast.error(error?.message || "Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="admin" />

      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="layout-content-container flex flex-col max-w-[960px] w-full mx-auto">
          <div className="flex flex-wrap justify-between gap-3 p-4 items-center">
            <p className="text-[#0e141b] tracking-light text-[32px] font-bold leading-tight min-w-72">
              Client Management
            </p>
            <button
              onClick={() => router.push('/admin/owner/generateClientKey')}
              className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-[#e7edf3] text-[#0e141b] text-sm font-medium leading-normal hover:bg-[#d0dbe7] transition-colors"
            >
              <span className="truncate">Add Client</span>
            </button>
          </div>

          <div className="px-4 py-3">
            <div className="overflow-hidden rounded-lg border border-[#d0dbe7] bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-[#d0dbe7]">
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal">
                      Client Name
                    </th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal">
                      Email
                    </th>
                    <th className="px-4 py-3 text-[#0e141b] text-sm font-medium leading-normal">
                      Status
                    </th>
                    <th className="px-4 py-3 text-[#4e7397] text-sm font-medium leading-normal text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={4} className="h-32 text-center text-gray-500 text-sm">
                        Loading clients...
                      </td>
                    </tr>
                  ) : clients.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="h-32 text-center text-gray-500 text-sm">
                        No clients found.
                      </td>
                    </tr>
                  ) : (
                    clients.map((client) => (
                      <tr key={client.id} className="border-t border-[#d0dbe7] hover:bg-slate-50 transition-colors">
                        <td className="h-[72px] px-4 py-2 text-[#0e141b] text-sm font-normal">
                          {client.name || "Unnamed Client"}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-[#4e7397] text-sm font-normal">
                          {client.email}
                        </td>
                        <td className="h-[72px] px-4 py-2 text-sm font-normal">
                          <span className="inline-flex items-center justify-center rounded-lg h-8 px-3 bg-[#e7edf3] text-[#0e141b] text-xs font-medium">
                            Active
                          </span>
                        </td>
                        <td className="h-[72px] px-4 py-2 text-right">
                          {/* Updated Button with Router Push */}
                          <button
                            onClick={() => router.push(`/admin/owner/client/${client.id}`)}
                            className="text-[#4e7397] hover:text-[#0e141b] text-sm font-bold tracking-[0.015em] transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
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
