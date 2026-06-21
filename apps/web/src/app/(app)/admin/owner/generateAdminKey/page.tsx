"use client";

import { adminService } from "@/services/admin.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import AppShell from "@/components/layout/app-shell";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ShieldCheck, Check, AlertTriangle, Lock, Users } from "lucide-react";

// ─── Schema (PRESERVED EXACTLY) ───────────────────────────────────────────────

const AdminKeySchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["staff", "developer"], {
    error: "Please select a role",
  }),
});

type AdminKeyFormType = z.infer<typeof AdminKeySchema>;

// ─── Role Privilege Map ───────────────────────────────────────────────────────

const ROLE_INFO = {
  staff: {
    label: "STAFF",
    description: "Operational access — project visibility, client management, reporting.",
    color: "text-amber-400 border-amber-400/20 bg-amber-400/5",
  },
  developer: {
    label: "DEVELOPER",
    description: "Engineering access — assigned project execution, milestone management.",
    color: "text-cyan-400 border-cyan-400/20 bg-cyan-400/5",
  },
} as const;

// ─── Component ────────────────────────────────────────────────────────────────

export default function GenerateAdminKeyPage() {
  // ── State (PRESERVED EXACTLY) ──────────────────────────────────────────────
  const [loading, setLoading] = useState<boolean>(false);
  const [adminKey, setAdminKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<AdminKeyFormType>({
    resolver: zodResolver(AdminKeySchema),
    defaultValues: {
      email: "",
      role: "staff",
    },
  });

  const selectedRole = form.watch("role");

  // ── Handlers (PRESERVED EXACTLY) ──────────────────────────────────────────
  const onSubmit = async (data: AdminKeyFormType) => {
    setLoading(true);
    try {
      const response = await adminService.generateAdminKey(data);
      setAdminKey(response.data.key_hash);
      toast.success("Admin access key generated successfully.");
      setCopied(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!adminKey) return;
    navigator.clipboard.writeText(adminKey);
    setCopied(true);
    toast.success("Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const inputStyles =
    "flex h-10 w-full rounded-md border border-border bg-[#0a0a0a] px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-muted-foreground/50";

  return (
    <AppShell role="admin">
      <DashboardLayout
        title="System Administration"
        subtitle="Credential provisioning and role assignment."
        actions={
          <Button
            type="submit"
            form="admin-key-form"
            size="sm"
            disabled={loading}
            className="gap-2"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            {loading ? "Generating..." : "Provision Credential"}
          </Button>
        }
      >
        <div className="max-w-2xl mx-auto space-y-8 mt-4 pb-12">

          {/* ── Security Warning Panel ── */}
          <div className="flex items-start gap-3 p-4 rounded-md border border-amber-500/20 bg-amber-500/5">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[12px] font-medium text-amber-400">Privileged Operation</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                Admin credentials grant elevated system access. Keys are single-use, role-scoped, and expire after 10 minutes. Only provision credentials for verified team members.
              </p>
            </div>
          </div>

          {/* ── Credential Form ── */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary border-b border-border/50 pb-2">
              <Lock className="w-4 h-4" />
              <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                Credential Provisioning
              </h3>
            </div>

            <Card className="p-6 bg-[#050505] border-l-2 border-l-primary/50 border-y-border border-r-border">
              <form id="admin-key-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {/* Email */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground">
                      Target Email Address *
                    </label>
                    <input
                      {...form.register("email")}
                      type="email"
                      placeholder="admin@agency.com"
                      className={inputStyles}
                    />
                    {form.formState.errors.email && (
                      <p className="text-[11px] text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  {/* Role */}
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-foreground flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-muted-foreground" />
                      System Role *
                    </label>
                    <select
                      {...form.register("role")}
                      className={inputStyles + " appearance-none cursor-pointer"}
                    >
                      <option value="staff" className="bg-[#0a0a0a]">STAFF</option>
                      <option value="developer" className="bg-[#0a0a0a]">DEVELOPER</option>
                    </select>
                    {form.formState.errors.role && (
                      <p className="text-[11px] text-red-500">{form.formState.errors.role.message}</p>
                    )}
                  </div>
                </div>

                {/* Role privilege display */}
                {selectedRole && (
                  <div className={`flex items-start gap-2.5 p-3 rounded-md border text-[11px] leading-relaxed ${ROLE_INFO[selectedRole].color}`}>
                    <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-mono font-bold text-[10px] tracking-widest">
                        {ROLE_INFO[selectedRole].label}
                      </span>
                      <p className="mt-0.5 text-muted-foreground">
                        {ROLE_INFO[selectedRole].description}
                      </p>
                    </div>
                  </div>
                )}
              </form>
            </Card>
          </div>

          {/* ── Generated Key Output ── */}
          {adminKey && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
              <div className="flex items-center gap-2 text-green-400 border-b border-border/50 pb-2">
                <ShieldCheck className="w-4 h-4" />
                <h3 className="text-[13px] font-mono uppercase tracking-widest font-semibold">
                  Credential Issued
                </h3>
              </div>

              <Card className="p-5 bg-[#050505] border-l-2 border-l-green-500/40 border-y-border border-r-border space-y-4">
                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    readOnly
                    value={adminKey}
                    className="flex-1 px-3 py-2.5 rounded-md border border-border bg-black font-mono text-[12px] tracking-widest text-foreground outline-none"
                  />
                  <Button
                    onClick={copyToClipboard}
                    variant="outline"
                    className="gap-2 bg-transparent hover:bg-white/5 h-10 px-5 text-[12px]"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>

                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400/80 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Transmit this credential via a secure, encrypted channel. Key expires in{" "}
                    <span className="text-amber-400 font-mono">10:00</span> minutes.
                    Do not store or log this value.
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </DashboardLayout>
    </AppShell>
  );
}
