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
import { Copy, Key, Check, AlertCircle } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";

const ClientEmailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type RegisterFormType = z.infer<typeof ClientEmailSchema>;

export default function GenerateClientKeyPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [clientKey, setClientKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(ClientEmailSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: RegisterFormType) => {
    setLoading(true);
    try {
      const response = await adminService.generateClientKey(data);
      setClientKey(response.data.key_hash);
      toast.success("Client invite key generated successfully!");
      setCopied(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to generate key");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!clientKey) return;
    navigator.clipboard.writeText(clientKey);
    setCopied(true);
    toast.success("Key copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AppShell role="admin">
      <DashboardLayout title="Security Settings" subtitle="Identity and access management">
        
        <div className="max-w-2xl mx-auto space-y-8 mt-4">
          <SectionHeader 
            title="Generate Client Key" 
            description="Create a unique cryptographic access key for your client to securely join the portal." 
          />

          <Card className="p-8 bg-black border-border shadow-2xl">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-medium text-foreground tracking-tight">
                  Client Email Address *
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 rounded-md border border-border bg-[#0a0a0a] text-sm text-foreground focus:ring-1 focus:ring-primary focus:border-primary outline-none transition-all placeholder:text-muted-foreground/50"
                />
                <p className="text-[11px] text-muted-foreground tracking-wide mt-1">
                  The generated key will be uniquely bound to this email address.
                </p>
                {form.formState.errors.email && (
                  <p className="text-xs text-red-500 mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full gap-2 mt-2 h-10"
              >
                <Key size={14} />
                {loading ? "Generating cryptographic key..." : "Generate Access Key"}
              </Button>
            </form>
          </Card>

          {clientKey && (
            <Card className="p-6 bg-[#0a0a0a] border border-primary/20 space-y-4 shadow-[0_0_15px_rgba(255,255,255,0.03)] animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-primary/80">
                Generated Access Key
              </h3>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  readOnly
                  value={clientKey}
                  className="flex-1 px-4 py-2.5 rounded-md border border-border bg-black font-mono text-[13px] tracking-widest text-foreground outline-none"
                />

                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="gap-2 border-primary/20 text-foreground hover:bg-primary/10 transition-colors h-10 px-6"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  {copied ? "Copied" : "Copy Key"}
                </Button>
              </div>

              <div className="flex items-start gap-2 pt-2">
                <AlertCircle size={14} className="text-amber-500/80 mt-0.5" />
                <p className="text-[11px] text-muted-foreground tracking-wide">
                  This cryptographic key will expire in exactly 10 minutes. Please transmit it to the client immediately via a secure channel.
                </p>
              </div>
            </Card>
          )}
        </div>

      </DashboardLayout>
    </AppShell>
  );
}
