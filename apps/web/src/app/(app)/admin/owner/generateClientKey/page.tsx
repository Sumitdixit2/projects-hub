"use client";

import { adminService } from "@/services/admin.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Sidebar from "@/components/layout/sidebar";
import { Copy, Key, Check } from "lucide-react";

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
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Replaced manual sidebar with shared Sidebar component for consistency */}

      <aside className="hidden md:flex w-64 bg-white border-r">
      <Sidebar role="admin" />
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 bg-white border-b border-[#d0dbe7]">
          <h2 className="text-lg font-semibold text-[#0e141b]">Security Settings</h2>
        </header>

        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Title Section */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-[#0e141b]">
                Generate Client Key
              </h2>
              <p className="text-[#4e7397]">
                Create a unique access key for your client to securely join the portal.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white rounded-xl border border-[#d0dbe7] p-8 shadow-sm">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#0e141b]">
                    Client Email Address *
                  </label>
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-[#d0dbe7] bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                  <p className="text-[12px] text-[#4e7397] italic">
                    The generated key will be unique to this email address.
                  </p>
                  {form.formState.errors.email && (
                    <p className="text-xs text-red-500">{form.formState.errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-3 bg-[#0e141b] hover:bg-[#0e141b]/90 text-white font-bold rounded-lg transition-all disabled:opacity-50"
                >
                  <Key size={18} />
                  {loading ? "Generating..." : "Generate Access Key"}
                </button>
              </form>
            </div>

            {/* Result Section (Visible only after generation) */}
            {clientKey && (
              <div className="bg-blue-50 rounded-xl border border-dashed border-blue-200 p-8 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Generated Access Key
                </h3>

                <div className="flex flex-col md:flex-row gap-3">
                  <input
                    readOnly
                    value={clientKey}
                    className="flex-1 px-4 py-3 rounded-lg border border-blue-100 bg-white font-mono text-sm tracking-widest text-[#0e141b]"
                  />

                  <button
                    onClick={copyToClipboard}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-blue-200 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
                  >
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                    {copied ? "Copied" : "Copy Key"}
                  </button>
                </div>

                <p className="text-[12px] text-blue-600/80">
                  ⚠️ This key will expire in 10 minutes. Please share it with the client immediately.
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
