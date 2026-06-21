"use client";

import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { SectionHeader } from "@/components/ui/section-header";
import { MetricStrip } from "@/components/ui/metric-strip";
import { TelemetryCard } from "@/components/ui/telemetry-card";
import { DenseStatsGrid } from "@/components/ui/dense-stats-grid";
import { StatusBadge } from "@/components/ui/status-badge";
import { adminService } from "@/services/admin.service";
import { activityService } from "@/services/activity.service";
import { projectService } from "@/services/project.service";
import { Database, FolderKanban, Users } from "lucide-react";

export default function StaffDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  const [activityError, setActivityError] = useState(false);
  const [projectError, setProjectError] = useState(false);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user, router]);

  useEffect(() => {
    if (!user) return;

    const fetchStats = async () => {
      try {
        const response = await adminService.getStats();
        setStats(response?.data || { projects: 0, clients: 0 });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoadingStats(false);
      }
    };

    const fetchActivities = async () => {
      try {
        const response = await activityService.getMyActivity({ page: "1", limit: "5" });
        setActivities(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch personal activity", error);
        setActivityError(true);
      } finally {
        setLoadingActivities(false);
      }
    };

    const fetchProjects = async () => {
      try {
        const response = await projectService.getAllProjects();
        const allProjects = Array.isArray(response?.data) ? response.data : [];
        setProjects(allProjects.slice(0, 5)); // Preview only
      } catch (error) {
        console.error("Failed to fetch projects", error);
        setProjectError(true);
      } finally {
        setLoadingProjects(false);
      }
    };

    fetchStats();
    fetchActivities();
    fetchProjects();
  }, [user]);

  return (
    <AppShell role="admin">
      <DashboardLayout title="Operational Command Center" subtitle="Staff operations and registry preview.">
        
        {/* 1. Metadata Strip */}
        <MetricStrip 
          metrics={[
            { label: "WORKSPACE_ID", value: user?.agency_id || "UNKNOWN", icon: <Database className="w-3.5 h-3.5" /> },
            { label: "OPERATOR", value: user?.fullname || "UNAVAILABLE", icon: <Users className="w-3.5 h-3.5" /> }
          ]} 
        />

        {/* 2. Global Operational Metrics */}
        <div className="mt-8">
          <SectionHeader title="Global Operational Metrics" description="Agency-wide registry totals" />
          <DenseStatsGrid className="mt-4">
            <TelemetryCard 
              title="TOTAL PROJECTS" 
              value={loadingStats ? "..." : stats?.projects ? (Object.values(stats.projects) as number[]).reduce((a, b) => a + b, 0).toString() : "0"} 
              trend="neutral" 
            />
            <TelemetryCard 
              title="TOTAL CLIENTS" 
              value={loadingStats ? "..." : stats?.clients?.toString() || "0"} 
              trend="neutral" 
            />
          </DenseStatsGrid>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {/* 3. Personal Activity Ledger */}
          <div>
            <SectionHeader title="Personal Activity Ledger" description="Your recent operational events" />
            <Card className="p-6 mt-4 bg-black border-border shadow-2xl h-[400px] overflow-y-auto">
              {loadingActivities ? (
                <div className="py-8 text-center text-[12px] font-mono text-muted-foreground uppercase tracking-widest">
                  LOADING_ACTIVITY...
                </div>
              ) : activityError ? (
                <div className="py-8 text-center">
                  <p className="text-[12px] font-mono text-destructive uppercase tracking-widest">ACTIVITY_STREAM_UNAVAILABLE</p>
                  <p className="text-[11px] text-muted-foreground mt-2 opacity-60">Unable to load personal operational ledger.</p>
                </div>
              ) : activities.length > 0 ? (
                <ActivityTimeline 
                  events={activities.map((a) => ({
                    id: a.id,
                    actor: a.name || user?.fullname || 'SYSTEM',
                    action: a.action,
                    target: a.entity_type,
                    timestamp: new Date(a.created_at).toLocaleDateString(),
                    isImportant: a.action === 'CREATE' || a.action === 'DELETE'
                  }))}
                />
              ) : (
                <div className="py-8 text-center">
                  <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">NO_ACTIVITY_FOUND</p>
                  <p className="text-[11px] text-muted-foreground mt-2 opacity-60">Your personal operational ledger is empty.</p>
                </div>
              )}
            </Card>
          </div>

          {/* 4. Project Registry Preview */}
          <div>
            <SectionHeader title="Project Registry Preview" description="Recent agency initiatives" />
            <Card className="p-0 mt-4 bg-black border-border shadow-2xl h-[400px] overflow-hidden flex flex-col">
              {loadingProjects ? (
                <div className="p-6 text-center text-[12px] font-mono text-muted-foreground uppercase tracking-widest mt-8">
                  LOADING_REGISTRY...
                </div>
              ) : projectError ? (
                <div className="p-6 text-center mt-8">
                  <p className="text-[12px] font-mono text-destructive uppercase tracking-widest">PROJECT_ACCESS_DENIED</p>
                  <p className="text-[11px] text-muted-foreground mt-2 opacity-60">Registry query rejected by authorization layer.</p>
                </div>
              ) : projects.length > 0 ? (
                <div className="divide-y divide-border overflow-y-auto">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                      <div className="flex flex-col gap-1">
                        <span className="text-[13px] font-medium text-foreground">{project.name}</span>
                        <span className="text-[11px] font-mono text-muted-foreground">Client: {project.client}</span>
                      </div>
                      <StatusBadge 
                        status={project.project_status === 'active' ? 'info' : 'neutral'} 
                        label={project.project_status.replace("_", " ")} 
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-6 text-center mt-8">
                  <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">NO_PROJECTS_FOUND</p>
                  <p className="text-[11px] text-muted-foreground mt-2 opacity-60">Agency project registry is empty.</p>
                </div>
              )}
            </Card>
          </div>
        </div>

      </DashboardLayout>
    </AppShell>
  );
}
