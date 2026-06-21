import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { SkeletonMetricStrip, SkeletonTable } from "@/components/ui/skeletons";

export default function StaffProjectsLoading() {
  return (
    <AppShell role="admin">
      <DashboardLayout title="Project Registry" subtitle="Agency-wide initiative tracking and execution.">
        
        <div className="animate-pulse space-y-4">
          <SkeletonMetricStrip count={1} />
          <SkeletonTable rows={6} cols={5} />
        </div>

      </DashboardLayout>
    </AppShell>
  );
}
