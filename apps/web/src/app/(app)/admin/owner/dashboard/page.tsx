"use client";

import Overview from "@/components/overview/overview";
import Sidebar from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user]); const projectStats = [
    { label: "In Progress", value: 60 },
    { label: "Completed", value: 20 },
    { label: "On Hold", value: 40 },
    { label: "Planning", value: 80 },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">

      <aside className="hidden md:flex w-64 bg-white border-r">
        <Sidebar role="admin" />
      </aside>

      <main className="flex-1 p-4 md:p-6">

        <Overview />

        <section className="mt-6">
          <h2 className="text-xl font-bold mb-4">
            Projects by Status
          </h2>

          <div className="space-y-4">
            {projectStats.map((item) => (
              <div key={item.label}>
                <p className="text-sm font-medium mb-1">
                  {item.label}
                </p>
                <div className="w-full bg-gray-200 rounded h-3">
                  <div
                    className="bg-blue-500 h-3 rounded"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity Section */}
        <section className="mt-8">
          <h2 className="text-xl font-bold mb-4">
            Recent Activity
          </h2>

          <div className="space-y-4 text-sm">
            <ActivityItem
              title="Project 'Website Redesign' started"
              time="2 hours ago"
            />
            <ActivityItem
              title="Client 'Tech Solutions Inc.' added"
              time="4 hours ago"
            />
            <ActivityItem
              title="Project 'Mobile App Development' completed"
              time="1 day ago"
            />
            <ActivityItem
              title="Message sent to client 'Global Corp'"
              time="2 days ago"
            />
            <ActivityItem
              title="New user 'Sarah' joined"
              time="3 days ago"
            />
          </div>
        </section>

      </main>
    </div>
  );
}

function ActivityItem({ title, time }: { title: string; time: string }) {
  return (
    <div className="border-l-2 border-gray-300 pl-4">
      <p className="font-medium">{title}</p>
      <p className="text-gray-500 text-xs">{time}</p>
    </div>
  );
}
