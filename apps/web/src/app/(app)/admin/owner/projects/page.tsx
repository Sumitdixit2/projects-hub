"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { projectService } from "@/services/project.service";
import { toast } from "sonner";
import { projectType, projectStatus } from "@/types/project.types";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Plus, LayoutGrid } from "lucide-react";
import { DataLedgerTable } from "@/components/ui/data-ledger-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/button";
import { MetricStrip } from "@/components/ui/metric-strip";

const mapStatusToType = (status: projectStatus): "success" | "warning" | "error" | "info" | "neutral" => {
  switch(status) {
    case 'active': return 'info';
    case 'completed': return 'success';
    case 'cancelled': return 'error';
    case 'on_hold': return 'warning';
    case 'pending': return 'warning';
    default: return 'neutral';
  }
};

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<projectType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        setProjects(Array.isArray(response.data) ? response.data : []);
      } catch (error: any) {
        setProjects([]);
        toast.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const columns = [
    {
      header: "Project Details",
      cell: (item: projectType) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-foreground text-[13px]">{item.name}</span>
          <span className="text-[11px] text-muted-foreground line-clamp-1 max-w-[250px]">{item.description}</span>
        </div>
      )
    },
    { header: "Client", accessorKey: "client" as keyof projectType },
    { header: "Team", accessorKey: "assignedto" as keyof projectType },
    {
      header: "Status",
      cell: (item: projectType) => (
        <StatusBadge 
          status={mapStatusToType(item.project_status)} 
          label={item.project_status.replace("_", " ")} 
        />
      )
    },
    {
      header: "Deadline",
      isMono: true,
      cell: (item: projectType) => item.deadline ? new Date(item.deadline).toLocaleDateString() : 'N/A'
    },
    {
      header: "",
      className: "text-right",
      cell: (item: projectType) => (
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.push(`/admin/owner/project/${item.id}`)}
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
        title="Project Pipeline" 
        subtitle="Manage and track all ongoing agency initiatives."
        actions={
          <Button onClick={() => router.push('/admin/owner/createProject')} size="sm" className="gap-2">
            <Plus size={14} /> Create Project
          </Button>
        }
      >
        <MetricStrip 
          metrics={[
            { label: "Total Projects", value: loading ? "-" : projects.length.toString(), icon: <LayoutGrid className="w-3.5 h-3.5" /> }
          ]} 
        />

        <div className="mt-4">
          <DataLedgerTable 
            data={projects}
            columns={columns}
            keyExtractor={(item) => item.id}
            emptyStateMessage={loading ? "Synchronizing pipeline data..." : "No projects found."}
          />
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
