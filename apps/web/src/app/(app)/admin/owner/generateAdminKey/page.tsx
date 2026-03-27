"use client";

import { adminService } from "@/services/admin.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Sidebar from "@/components/layout/sidebar";
import { Copy, Key, Check, ShieldCheck } from "lucide-react";

const AdminKeySchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.enum(["staff", "developer"], {
    required_error: "Please select a role",
  }),
});

type AdminKeyFormType = z.infer<typeof AdminKeySchema>;

export default function GenerateAdminKeyPage() {
  const [loading, setLoading] = useState<boolean>(false);
  const [adminKey, setAdminKey] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const form = useForm<AdminKeyFormType>({
    resolver: zodResolver(AdminKeySchema),
    defaultValues: {
      email: "",
      role: "staff"
    }
  });

  const onSubmit = async (data: AdminKeyFormType) => {
    setLoading(true);
    try {
      const response = await adminService.generateAdminKey(data);
      setAdminKey(response.data.key_hash);
      toast.success("Admin invite key generated successfully!");
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

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar role="admin" />

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-[#d0dbe7]">
          <h2 className="text-lg font-semibold text-[#0e141b]">System Administration</h2>
        </header>

        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-[#0e141b]">
                Generate Admin Key
              </h2>
              <p className="text-[#4e7397]">
                Create a secure access key to invite new administrative staff to the platform.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#d0dbe7] p-8 shadow-sm">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0e141b]">
                      Admin Email Address *
                    </label>
                    <input
                      {...form.register("email")}
                      type="email"
                      placeholder="admin@agency.com"
                      className="w-full px-4 py-3 rounded-lg border border-[#d0dbe7] bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    />
                    {form.formState.errors.email && (
                      <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#0e141b]">
                      System Role *
                    </label>
                    <select
                      {...form.register("role")}
                      className="w-full px-4 py-3 rounded-lg border border-[#d0dbe7] bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                    >
                      <option value="staff">staff</option>
                      <option value="developer">developer</option>
                    </select>
                    {form.formState.errors.role && (
                      <p className="text-xs text-red-500">{form.formState.errors.role.message}</p>
                    )}
                  </div>
                </div>

                <p className="text-[12px] text-[#4e7397] italic">
                  The generated key will be unique to this email and assigned role.
                </p>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[#0e141b] hover:bg-[#0e141b]/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <ShieldCheck size={18} />
                  {loading ? "Generating..." : "Generate Admin Access Key"}
                </button>
              </form>
            </div>

            {adminKey && (
              <div className="bg-emerald-50 rounded-xl border border-dashed border-emerald-200 p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
                  Generated Admin Access Key
                </h3>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    readOnly
                    value={adminKey}
                    className="flex-1 px-4 py-3 rounded-lg border border-emerald-100 bg-white font-mono text-sm tracking-widest text-[#0e141b]"
                  />

                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-emerald-200 text-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors font-medium"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied" : "Copy Key"}
                  </button>
                </div>

                <p className="text-[12px] text-emerald-600/80">
                  ⚠️ This administrative key is sensitive. It will expire in 10 minutes.
                </p>
              </div>
            )}
          </div>
        </div>

        <footer className="p-6 text-center text-[#4e7397] text-xs">
          © 2024 Agency Co. Admin Management Console.
        </footer>
      </main>
    </div>
  );
}
