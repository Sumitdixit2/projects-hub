"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { MessageSquare, Clock } from "lucide-react";

export default function MessagesPage() {
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
        title="Messages"
        subtitle="Secure operational communication channel."
      >
        <div className="flex items-center justify-center min-h-[50vh]">
          <Card className="p-10 bg-[#050505] border-border max-w-md text-center space-y-4">
            <div className="w-12 h-12 rounded-md border border-border bg-white/5 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6 text-muted-foreground/40" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[15px] font-semibold text-foreground">
                Messaging System
              </h2>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Encrypted team communication infrastructure is currently being provisioned. This module will enable secure, realtime messaging across all operational roles.
              </p>
            </div>
            <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest pt-2">
              <Clock className="w-3 h-3" />
              <span>Module pending deployment</span>
            </div>
          </Card>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
