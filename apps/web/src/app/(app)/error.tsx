"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const pathname = usePathname();
  const role = pathname?.startsWith("/client") ? "client" : "admin";

  useEffect(() => {
    console.error("Operational segment error:", error);
  }, [error]);

  return (
    <AppShell role={role}>
      <DashboardLayout
        title="SYSTEM FAULT"
        subtitle="The operational view encountered a rendering or data fault."
      >
        <div className="flex flex-col items-center justify-center h-[60vh] max-w-md mx-auto text-center space-y-6">
          <div className="w-12 h-12 rounded-full bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <XCircle className="w-5 h-5 text-destructive" />
          </div>

          <div className="space-y-2">
            <h2 className="text-[14px] font-mono font-medium tracking-widest text-foreground uppercase">
              COMPONENT_CRASH
            </h2>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              The requested view could not be rendered due to an unexpected client exception.
            </p>
          </div>

          {error.digest && (
            <div className="w-full bg-[#050505] border border-border rounded-md p-3 text-left">
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
                Telemetry Digest
              </p>
              <p className="text-[12px] font-mono text-destructive break-all">
                {error.digest}
              </p>
            </div>
          )}

          <div className="w-full pt-4 border-t border-border/50">
            <Button
              onClick={() => reset()}
              variant="outline"
              className="w-full font-mono text-[12px] h-10 tracking-wider hover:bg-white/5 bg-[#0a0a0a] border-border text-foreground"
            >
              [ REBOOT COMPONENT ]
            </Button>
          </div>
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
