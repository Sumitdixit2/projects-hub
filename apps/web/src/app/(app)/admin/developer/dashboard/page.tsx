"use client";

import DevOverview from "@/components/overview/dev-overview.component";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { StatusBadge } from "@/components/ui/status-badge";

export default function DevDashboardPage() {
  // ── Auth Guard (PRESERVED EXACTLY) ────────────────────────────────────────
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
      <DashboardLayout
        title="My Workspace"
        subtitle={
          user ? (
            <span className="flex items-center gap-2 text-muted-foreground text-[12px] font-mono">
              {user.fullname?.toUpperCase() ?? "OPERATOR"}
              <StatusBadge status="info" label="DEVELOPER" className="text-[10px]" />
            </span>
          ) : (
            "Developer operational workspace."
          )
        }
      >
        <div className="mt-4 max-w-3xl">
          {/* DevOverview handles its own data fetch — preserving internal state */}
          <DevOverview />
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
