import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { SkeletonMetricStrip, SkeletonTable } from "@/components/ui/skeletons";

export default function StaffSettingsLoading() {
  return (
    <AppShell role="admin">
      <DashboardLayout title="Settings" subtitle="System configuration and identity management.">
        
        <div className="animate-pulse space-y-10 mt-4 pb-12 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <div className="h-4 w-32 bg-white/5 rounded" />
              <div className="h-48 bg-white/5 rounded-lg border border-white/10" />
            </div>
            <div className="h-48 bg-white/5 rounded-lg border border-white/10" />
          </div>

          <div className="space-y-4">
             <div className="h-4 w-48 bg-white/5 rounded" />
             <div className="h-32 bg-white/5 rounded-lg border border-white/10" />
          </div>
          
          <div className="space-y-4">
             <div className="h-4 w-40 bg-white/5 rounded" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
               <div className="h-20 bg-white/5 rounded-lg border border-white/10" />
             </div>
          </div>
        </div>

      </DashboardLayout>
    </AppShell>
  );
}
