'use client';

import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
  description: z.string().optional(),
});

function SignUpAgency() {
  const [loading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      website: "",
      description: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      const cleanedData = {
        ...data,
        name: data.name.trim(),
        email: data.email.trim(),
      };

      await authService.registerAgency(cleanedData);

      toast.success("Agency successfully registered!");
      router.push(`/agency/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error(
        "agency not created",
        error?.response?.data?.message || error.message
      );
      toast.error(error?.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-foreground selection:bg-primary/30 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-border rounded-xl p-8 relative z-10 shadow-2xl my-12">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-black" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground">
            Initialize Root Workspace
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 text-center">
            Register a new agency account.
          </p>
        </div>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Agency Name</label>
                <input
                  {...form.register("name")}
                  placeholder="Acme Corp"
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
                {form.formState.errors.name && (
                  <p className="text-[11px] font-mono text-destructive">{form.formState.errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Email Address</label>
                <input
                  {...form.register("email")}
                  placeholder="admin@agency.com"
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
                {form.formState.errors.email && (
                  <p className="text-[11px] font-mono text-destructive">{form.formState.errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Phone Number (Optional)</label>
                <input
                  {...form.register("phone")}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Secure Passphrase</label>
                <input
                  type="password"
                  {...form.register("password")}
                  placeholder="••••••••"
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
                {form.formState.errors.password && (
                  <p className="text-[11px] font-mono text-destructive">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </div>

              {/* Website */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Website (Optional)</label>
                <input
                  {...form.register("website")}
                  placeholder="https://agency.com"
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
                {form.formState.errors.website && (
                  <p className="text-[11px] font-mono text-destructive">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Description (Optional)</label>
                <input
                  {...form.register("description")}
                  placeholder="Digital product agency..."
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
                />
              </div>

              {/* Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      <span>Registering Workspace...</span>
                    </>
                  ) : (
                    "Initialize Workspace"
                  )}
                </button>
              </div>
            </form>

            <p className="text-center text-[12px] text-muted-foreground mt-6 cursor-pointer hover:text-foreground transition-colors" onClick={() => router.push('/admin/login')}>
              Already have a workspace? Authenticate Session
            </p>
      </div>
    </div>
  );
}

export default SignUpAgency;
