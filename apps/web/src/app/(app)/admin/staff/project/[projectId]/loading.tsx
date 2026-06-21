import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { SkeletonDetailPage } from "@/components/ui/skeletons";

export default function StaffProjectLoading() {
  return (
    <AppShell role="admin">
      <DashboardLayout title="" subtitle="">
        <SkeletonDetailPage />
      </DashboardLayout>
    </AppShell>
  );
}
