"use client";

import Overview from "@/components/overview/overview";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { SectionHeader } from "@/components/ui/section-header";
import { activityService } from "@/services/activity.service";
import { activityOutputType } from "@/types/activity.type";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  const [activities, setActivities] = useState<activityOutputType[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(true);

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await activityService.getAgencyActivity({ page: "1", limit: "5" });
        setActivities(response?.data || []);
      } catch (error) {
        console.error("Failed to fetch activities", error);
      } finally {
        setLoadingActivities(false);
      }
    };
    if (user) {
      fetchActivities();
    }
  }, [user]);

  return (
    <AppShell role="admin">
      <DashboardLayout title="System Overview" subtitle="Realtime aggregate operations">
        <Overview />

        <div className="mt-8">
          <SectionHeader title="System Activity" description="Recent structural events" />
          <Card className="p-6 mt-4 bg-black border-border shadow-2xl">
            {loadingActivities ? (
              <div className="py-8 text-center text-[12px] font-mono text-muted-foreground uppercase tracking-widest">
                Loading activity...
              </div>
            ) : activities.length > 0 ? (
              <ActivityTimeline 
                events={activities.map((a) => ({
                  id: a.id,
                  actor: a.name || 'SYSTEM',
                  action: a.action,
                  target: a.entity_type,
                  timestamp: new Date(a.created_at).toLocaleDateString(),
                  isImportant: a.action === 'CREATE' || a.action === 'DELETE'
                }))}
              />
            ) : (
              <div className="py-8 text-center">
                <p className="text-[12px] font-mono text-muted-foreground uppercase tracking-widest">NO_ACTIVITY_FOUND</p>
                <p className="text-[11px] text-muted-foreground mt-2 opacity-60">System operational ledger is empty.</p>
              </div>
            )}
          </Card>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
