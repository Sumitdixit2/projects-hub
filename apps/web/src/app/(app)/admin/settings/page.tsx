"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  User,
  Mail,
  Shield,
  Building2,
  Globe,
  Hash,
  Lock,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  // ── Auth Guard (PRESERVED EXACTLY) ────────────────────────────────────────
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  return (
    <AppShell role="admin">
      <DashboardLayout
        title="Settings"
        subtitle="System configuration and identity management."
      >
        <div className="max-w-4xl space-y-10 mt-4 pb-12">

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── Section 1: Personal Information ── */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
                <User className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                  Operator Identity
                </h3>
              </div>

              <Card className="bg-[#050505] border-border divide-y divide-border/50">
                {[
                  {
                    icon: User,
                    label: "Full Name",
                    value: user.fullname,
                  },
                  {
                    icon: Shield,
                    label: "System Role",
                    value: (
                      <StatusBadge
                        status="info"
                        label={user.role || "Admin"}
                        className="text-[10px]"
                      />
                    ),
                    isComponent: true,
                  },
                  {
                    icon: Mail,
                    label: "Email",
                    value: user.email,
                    mono: true,
                  },
                ].map(({ icon: Icon, label, value, mono, isComponent }) => (
                  <div key={label} className="flex items-center gap-4 px-5 py-4">
                    <div className="w-28 flex items-center gap-2 text-muted-foreground flex-shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-mono uppercase tracking-widest">{label}</span>
                    </div>
                    {isComponent ? (
                      value
                    ) : (
                      <span className={`text-[13px] text-foreground ${mono ? "font-mono" : "font-medium"}`}>
                        {value as string}
                      </span>
                    )}
                  </div>
                ))}
              </Card>
            </div>

            {/* ── Sidebar: Security Status ── */}
            <Card className="p-6 bg-[#050505] border-l-2 border-l-green-500/30 border-y-border border-r-border h-fit space-y-4">
              <div className="flex items-center gap-2 text-green-400/80">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="text-[13px] font-semibold">Verified</h3>
              </div>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                Security credentials are current and active. Session integrity is maintained.
              </p>
              <div className="flex items-center gap-2 text-[10px] font-mono text-muted-foreground/60">
                <StatusBadge status="success" label="ACTIVE" className="text-[9px]" />
              </div>
            </Card>
          </div>

          {/* ── Section 2: Agency Profile ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-violet-400 border-b border-border/50 pb-2">
              <Building2 className="w-4 h-4" />
              <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                Workspace Configuration
              </h3>
            </div>

            <Card className="bg-[#050505] border-border grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border/50">
              {/* Left: Identity */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-md border border-border bg-white/5 flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-violet-400" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-foreground">Azure Logic Creative</p>
                    <p className="text-[11px] text-muted-foreground font-mono">Enterprise Workspace</p>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {[
                    { icon: Globe, label: "Website", value: "azurelogic.io" },
                    { icon: Mail,  label: "Contact", value: "billing@azurelogic.io" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="flex items-center gap-3">
                      <Icon className="w-3.5 h-3.5 text-muted-foreground/60" />
                      <div>
                        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">{label}</span>
                        <span className="text-[12px] text-foreground">{value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Metadata */}
              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Hash className="w-3.5 h-3.5 text-muted-foreground/60" />
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">Workspace ID</span>
                      <span className="text-[12px] font-mono text-foreground">ALC-9928-XF-2024</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <StatusBadge status="info" label="GROWTH PLAN" />
                    <StatusBadge status="success" label="ACTIVE" />
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* ── Section 3: Critical Actions ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-muted-foreground border-b border-border/50 pb-2">
              <Lock className="w-4 h-4" />
              <h3 className="text-[10px] font-mono uppercase tracking-widest">Critical Operations</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="group flex items-center justify-between p-5 rounded-md border border-border bg-[#050505] hover:bg-white/[0.02] hover:border-border/80 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md border border-border bg-white/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                    <Lock className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-foreground">Change Password</p>
                    <p className="text-[11px] text-muted-foreground">Update security credentials</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground/30 group-hover:text-muted-foreground transition-colors" />
              </button>

              <button
                onClick={() => {
                  /* Add logout logic here */
                }}
                className="group flex items-center justify-between p-5 rounded-md border border-red-500/10 bg-[#050505] hover:bg-red-500/5 hover:border-red-500/20 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-md border border-red-500/20 bg-red-500/5 flex items-center justify-center group-hover:bg-red-500/10 transition-colors">
                    <LogOut className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-[13px] font-medium text-red-400">Logout</p>
                    <p className="text-[11px] text-red-400/60">Terminate current session</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-red-500/20 group-hover:text-red-400/50 transition-colors" />
              </button>
            </div>
          </div>

        </div>
      </DashboardLayout>
    </AppShell>
  );
}
