"use client";

import DevOverview from "@/components/overview/dev-overview.component";
import Sidebar from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DevDashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden md:flex w-64 bg-white border-r">
        <Sidebar role="admin" />
      </aside>

      <main className="flex-1 p-4 md:p-6">
        {/* Customized Overview for Developer metrics */}
        <DevOverview />

        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">My Recent Project Updates</h2>
          <div className="space-y-4 text-sm">
            <ActivityItem
              title="Updated 'API Integration' milestone to 100%"
              time="1 hour ago"
            />
            <ActivityItem
              title="Changed status of 'Auth System' to Review"
              time="3 hours ago"
            />
            <ActivityItem
              title="Started work on 'Database Schema'"
              time="5 hours ago"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function ActivityItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="border-l-2 border-blue-500 pl-4">
      <p className="font-medium">{title}</p>
      <p className="text-gray-500 text-xs">{time}</p>
    </div>
  );
}
