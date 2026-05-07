"use client";

import Overview from "@/components/overview/overview";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { SectionHeader } from "@/components/ui/section-header";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user]);

  return (
    <AppShell role="admin">
      <DashboardLayout title="System Overview" subtitle="Realtime aggregate operations">
        <Overview />

        <div className="mt-8">
          <SectionHeader title="System Activity" description="Recent structural events" />
          <Card className="p-6 mt-4 bg-black border-border shadow-2xl">
            <ActivityTimeline 
              events={[
                { id: '1', actor: 'System', action: "started", target: "Project 'Website Redesign'", timestamp: "2 hours ago" },
                { id: '2', actor: 'Admin', action: "added", target: "Client 'Tech Solutions Inc.'", timestamp: "4 hours ago", isImportant: true },
                { id: '3', actor: 'System', action: "completed", target: "Project 'Mobile App'", timestamp: "1 day ago" },
                { id: '4', actor: 'Admin', action: "sent message", target: "to 'Global Corp'", timestamp: "2 days ago" },
                { id: '5', actor: 'System', action: "joined", target: "User 'Sarah'", timestamp: "3 days ago" },
              ]}
            />
          </Card>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
