"use client";
import { adminService } from "@/services/admin.service";
import { projectService } from "@/services/project.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { register } from "module";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const ClientEmail = z.object({
  email: z.string().email("Invalid email address"),
});

type RegisterFormType = z.infer<typeof ClientEmail>;

export default function GenerateClientKeyPage() {
  const [loading, setLoading] = useState<boolean>(false);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(ClientEmail),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = async (data: RegisterFormType) => {
    setLoading(true);

    try {
      console.log("email i am sending is: ", data.email);
      const response = await adminService.generateClientKey(data);
      console.log("response is: ", response);
      toast.success(response?.message || "Admin successfully logged In!");
    } catch (error: any) {
      toast.error(
        error?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-white dark:bg-slate-900 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-white">
            <span className="material-symbols-outlined">key</span>
          </div>
          <div>
            <h1 className="text-base font-bold leading-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Management Console
            </p>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              dashboard
            </span>
            Dashboard
          </a>

          <a className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg active-nav transition-colors">
            <span className="material-symbols-outlined text-[20px]">
              group
            </span>
            Clients
          </a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 flex items-center justify-between px-8 bg-white dark:bg-slate-900 border-b border-primary/10">
          <h2 className="text-lg font-semibold">Generate Client Key</h2>
        </header>

        <div className="flex-1 p-8 md:p-12">
          <div className="max-w-2xl mx-auto space-y-8">

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tight">
                Generate Client Key
              </h2>
              <p className="text-slate-600 dark:text-slate-400">
                Create a unique access key for your client to securely access the portal.
              </p>
            </div>

            {/* Form Card */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-primary/10 p-8 shadow-sm">
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold">
                    Client Email Address *
                  </label>
                  <input
                    {...form.register("email")}
                    type="email"
                    placeholder="name@company.com"
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary outline-none"
                  />
                  <p className="text-[12px] text-slate-500 italic">
                    The generated key will be unique to this email.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-all"
                >
                  {loading ? "Generating Key" : "Generate Key"}
                </button>
              </form>
            </div>

            {/* Result Section */}
            <div className="bg-primary/5 rounded-xl border border-dashed border-primary/30 p-8 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
                Generated Access Key
              </h3>

              <div className="flex flex-col md:flex-row gap-3">
                <input
                  readOnly
                  value="CLT-4921-X92-JPR-2024"
                  className="flex-1 px-4 py-3 rounded-lg border border-primary/20 bg-white dark:bg-slate-900 font-mono text-sm tracking-widest"
                />

                <button className="px-6 py-3 bg-white dark:bg-slate-800 border border-primary/20 text-primary rounded-lg">
                  Copy Key
                </button>
              </div>

              <p className="text-[12px] text-primary/70">
                This key will expire in 24 hours.
              </p>
            </div>
          </div>
        </div>

        <footer className="p-6 text-center text-slate-400 text-xs">
          © 2024 Admin Management Console.
        </footer>
      </main>
    </div>
  );
}
