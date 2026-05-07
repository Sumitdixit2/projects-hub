"use client";

import { adminService } from "@/services/admin.service";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { DataLedgerTable } from "@/components/ui/data-ledger-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { Plus, Users } from "lucide-react";
import { MetricStrip } from "@/components/ui/metric-strip";
import { SkeletonMetricStrip, SkeletonTable } from "@/components/ui/skeletons";

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
        const response = await adminService.getAllClients();
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

  const columns = [
    {
      header: "Client Name",
      cell: (item: Client) => (
        <span className="font-medium text-foreground text-[13px]">
          {item.name || "Unnamed Client"}
        </span>
      )
    },
    { 
      header: "Email", 
      accessorKey: "email" as keyof Client,
      isMono: true,
      className: "w-[40%]"
    },
    {
      header: "Status",
      cell: () => (
        <StatusBadge status="success" label="ACTIVE" />
      )
    },
    {
      header: "",
      className: "text-right",
      cell: (item: Client) => (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/admin/owner/client/${item.id}`)}
            className="h-7 text-[11px] px-3 bg-transparent hover:bg-white/5"
          >
            View
          </Button>
        </div>
      )
    }
  ];

  return (
    <AppShell role="admin">
      <DashboardLayout 
        title="Client Management" 
        subtitle="Directory of active client profiles and access."
        actions={
          <Button onClick={() => router.push('/admin/owner/generateClientKey')} size="sm" className="gap-2">
            <Plus size={14} /> Add Client
          </Button>
        }
      >
        {loading ? (
          <div className="space-y-4">
            <SkeletonMetricStrip count={1} />
            <SkeletonTable rows={5} cols={4} />
          </div>
        ) : (
          <>
            <MetricStrip 
              metrics={[
                { label: "Total Clients", value: clients.length.toString(), icon: <Users className="w-3.5 h-3.5" /> }
              ]} 
            />
            <div className="mt-4">
              <DataLedgerTable 
                data={clients}
                columns={columns}
                keyExtractor={(item) => item.id}
                emptyStateMessage="No clients found."
              />
            </div>
          </>
        )}
      </DashboardLayout>
    </AppShell>
  );
}
