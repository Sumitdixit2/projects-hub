"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const resetPasswordSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  // Silently extract the token for API usage without rendering it in the DOM
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: ResetPasswordFormType) => {
    setLoading(true);

    try {
      // Simulate secure API dispatch mapping the token + new credentials
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Password updated.");
      
      // Brief delay to let the toast be read before navigation
      setTimeout(() => {
        router.push("/loginAs");
      }, 500);
    } catch (error: any) {
      console.error("Password reset failed", error);

      const message =
        error?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Password reset failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-border rounded-xl p-8 relative z-10 shadow-2xl">
      <div className="mb-8 flex flex-col items-center">
        <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mb-6">
          <div className="w-2 h-2 bg-black" />
        </div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground uppercase">
          PASSWORD_RESET
        </h1>
        <p className="text-[13px] text-muted-foreground mt-1 text-center">
          Provide replacement credentials.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">New Password</label>
          <input 
            type="password" 
            {...form.register("password")} 
            className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
            placeholder="••••••••"
          />
          {form.formState.errors.password && (
            <p className="text-[11px] font-mono text-destructive">{form.formState.errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-[13px] font-medium text-foreground">Confirm Password</label>
          <input 
            type="password" 
            {...form.register("confirmPassword")} 
            className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
            placeholder="••••••••"
          />
          {form.formState.errors.confirmPassword && (
            <p className="text-[11px] font-mono text-destructive">{form.formState.errors.confirmPassword.message}</p>
          )}
        </div>

        <div className="pt-4 flex flex-col gap-3">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                <span>UPDATING_CREDENTIALS...</span>
              </>
            ) : (
              "RESET_PASSWORD"
            )}
          </button>
          <Link
            href="/loginAs"
            className="text-[13px] text-muted-foreground hover:text-foreground text-center transition-colors font-medium mt-2"
          >
            Return to Login
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-foreground selection:bg-primary/30 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <Suspense fallback={
        <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-border rounded-xl p-8 relative z-10 shadow-2xl flex items-center justify-center min-h-[400px]">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        </div>
      }>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
