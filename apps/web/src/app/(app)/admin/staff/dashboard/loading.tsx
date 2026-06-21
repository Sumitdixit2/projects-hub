import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { SkeletonMetricStrip, SkeletonTable } from "@/components/ui/skeletons";

export default function StaffDashboardLoading() {
  return (
    <AppShell role="admin">
      <DashboardLayout title="Operational Command Center" subtitle="Staff operations and registry preview.">
        
        <div className="animate-pulse space-y-8">
          <SkeletonMetricStrip count={2} />
          
          <div className="space-y-4">
            <div className="h-6 w-48 bg-white/5 rounded" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-24 bg-white/5 rounded-lg border border-white/10" />
              <div className="h-24 bg-white/5 rounded-lg border border-white/10" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="h-6 w-48 bg-white/5 rounded" />
              <div className="h-[400px] bg-white/5 rounded-lg border border-white/10" />
            </div>
            <div className="space-y-4">
              <div className="h-6 w-48 bg-white/5 rounded" />
              <div className="h-[400px] bg-white/5 rounded-lg border border-white/10" />
            </div>
          </div>
        </div>

      </DashboardLayout>
    </AppShell>
  );
}
