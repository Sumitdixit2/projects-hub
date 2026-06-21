"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormType = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);

  const form = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordFormType) => {
    setLoading(true);

    try {
      // Emulating a secure API dispatch
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Recovery instructions have been dispatched.");
      form.reset();
    } catch (error: any) {
      console.error("Recovery request failed", error);

      const message =
        error?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Recovery request failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black text-foreground selection:bg-primary/30 relative">
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />
      
      <div className="w-full max-w-[420px] bg-[#0a0a0a] border border-border rounded-xl p-8 relative z-10 shadow-2xl">
        <div className="mb-8 flex flex-col items-center">
          <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center mb-6">
            <div className="w-2 h-2 bg-black" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground uppercase">
            PASSWORD_RECOVERY
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 text-center">
            Provide your account email to initiate recovery.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Email Address</label>
            <input 
              type="email" 
              {...form.register("email")} 
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
              placeholder="operator@agency.com"
            />
            {form.formState.errors.email && (
              <p className="text-[11px] font-mono text-destructive">{form.formState.errors.email.message}</p>
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
                  <span>DISPATCHING...</span>
                </>
              ) : (
                "SEND_RESET_LINK"
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
    </div>
  );
}
