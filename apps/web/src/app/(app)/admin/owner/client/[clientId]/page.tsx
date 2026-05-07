"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { projectType } from "@/types/project.types";
import { projectService } from "@/services/project.service";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { DataLedgerTable } from "@/components/ui/data-ledger-table";
import { Mail, Phone, MapPin, ArrowLeft, Briefcase, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonCard, SkeletonTable } from "@/components/ui/skeletons";

// ─── Types (PRESERVED EXACTLY) ───────────────────────────────────────────────

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

// ─── Status Badge Map ─────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, "info" | "warning" | "success" | "error" | "neutral" | "draft"> = {
  draft:     "draft",
  pending:   "warning",
  active:    "info",
  on_hold:   "warning",
  completed: "success",
  cancelled: "error",
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const { clientId } = useParams();
  const router = useRouter();

  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [client, setClient] = useState<ClientDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<projectType[]>([]);

  // ── Fetch (PRESERVED EXACTLY — two independent effects) ───────────────────
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

  // ── Loading / Not Found ───────────────────────────────────────────────────
  if (loading) {
    return (
      <AppShell role="admin">
        <DashboardLayout title="" subtitle="">
          <div className="space-y-8 mt-4 max-w-3xl">
            <SkeletonCard lines={3} />
            <SkeletonTable rows={3} cols={3} />
          </div>
        </DashboardLayout>
      </AppShell>
    );
  }

  if (!client) {
    return (
      <AppShell role="admin">
        <div className="flex h-full items-center justify-center text-muted-foreground text-[13px] font-mono">
          CLIENT_NOT_FOUND
        </div>
      </AppShell>
    );
  }

  // ── Project Table Columns ─────────────────────────────────────────────────
  const projectColumns = [
    {
      header: "Project",
      cell: (p: Project) => (
        <span className="text-[13px] font-medium text-foreground">{p.name}</span>
      ),
    },
    {
      header: "Status",
      cell: (p: Project) => (
        <StatusBadge
          status={STATUS_BADGE[p.project_status] ?? "neutral"}
          label={p.project_status.replace("_", " ").toUpperCase()}
        />
      ),
    },
    {
      header: "Deadline",
      cell: (p: Project) => (
        <span className="text-[12px] font-mono text-muted-foreground">
          {p.deadline
            ? new Date(p.deadline).toLocaleDateString("en-GB", {
                day: "2-digit", month: "short", year: "numeric",
              })
            : "—"}
        </span>
      ),
    },
    {
      header: "",
      className: "text-right",
      cell: (p: Project) => (
        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/owner/project/${p.id}`)}
            className="h-7 text-[11px] px-3 bg-transparent hover:bg-white/5"
          >
            Open
          </Button>
        </div>
      ),
    },
  ];

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <AppShell role="admin">
      <DashboardLayout
        title={client.name}
        subtitle={
          <span className="flex items-center gap-1.5 text-muted-foreground text-[12px] font-mono">
            <User className="w-3 h-3" />
            CLIENT PROFILE
            <span className="opacity-30">·</span>
            <button
              onClick={() => router.push("/admin/owner/myclients")}
              className="hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ArrowLeft className="w-3 h-3" /> All Clients
            </button>
          </span>
        }
      >
        <div className="space-y-8 mt-4 max-w-3xl">

          {/* ── Contact Information Panel ── */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-2">
              <User className="w-4 h-4" />
              <h3 className="text-[11px] font-mono uppercase tracking-widest">Contact Information</h3>
            </div>

            <Card className="divide-y divide-border/50 bg-[#050505] border-border overflow-hidden">
              {[
                { icon: Mail,   label: "Email",   value: client.email,           mono: true  },
                { icon: Phone,  label: "Phone",   value: client.phone  || "—",   mono: false },
                { icon: MapPin, label: "Address", value: client.address || "—",  mono: false },
              ].map(({ icon: Icon, label, value, mono }) => (
                <div key={label} className="flex items-center gap-4 px-5 py-3.5">
                  <div className="w-28 flex items-center gap-2 text-muted-foreground flex-shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-mono uppercase tracking-widest">{label}</span>
                  </div>
                  <span className={`text-[13px] text-foreground ${mono ? "font-mono" : ""}`}>
                    {value}
                  </span>
                </div>
              ))}
            </Card>
          </div>

          {/* ── Associated Projects Ledger ── */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-border/50 pb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Briefcase className="w-4 h-4" />
                <h3 className="text-[11px] font-mono uppercase tracking-widest">Associated Projects</h3>
              </div>
              <span className="text-[10px] font-mono bg-[#111] border border-border px-2 py-0.5 rounded text-muted-foreground">
                {client.project?.length ?? 0} entries
              </span>
            </div>

            <DataLedgerTable
              data={client.project ?? []}
              columns={projectColumns}
              keyExtractor={(p) => p.id}
              onRowClick={(p) => router.push(`/admin/owner/project/${p.id}`)}
              emptyStateMessage="No projects associated with this client."
            />
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
