"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agency_id: z.string().min(1, "Selecting an agency is required"),
  inviteKey: z.string().min(1, "inviteKey is required")
});

type Agency = {
  id: string;
  name: string;
};

export default function SignupPage() {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agency_id: "",
    },
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await authService.getAgency();
        setAgencies(response.data);
      } catch (error: any) {
        console.error("agencies failed to fetch", error);
        setAgencies([]); // safety
      }
    };

    fetchAgencies();
  }, []);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      await authService.registerClient(data);
      toast.success("client successfully registered!");
    } catch (error: any) {
      console.error(
        "agency not created",
        error.response?.data?.message
      );
      toast.error(
        error.response?.data?.message || "Registration failed"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">

        <div className="flex justify-center mt-5 items-center gap-4 text-[#111417]">
          <h2 className="text-lg font-bold">Project Hub</h2>
        </div>

        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            Create your account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Join your project management dashboard
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="px-8 pb-8 space-y-5"
        >

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <input
              type="text"
              placeholder="John Doe"
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-red-500">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-xs text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">
              Select Agency
            </label>

            <Combobox
              items={agencies.map((agency) => agency.name)}
              onValueChange={(selectedName: string) => {
                const selectedAgency = agencies.find(
                  (agency) => agency.name === selectedName
                );

                if (selectedAgency) {
                  form.setValue("agency_id", selectedAgency.id, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <ComboboxInput placeholder="Search agency..." />

              <ComboboxContent>
                <ComboboxEmpty>No agencies found.</ComboboxEmpty>

                <ComboboxList>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            {/* 👇 IMPORTANT */}
            <input type="hidden" {...form.register("agency_id")} />

            {form.formState.errors.agency_id && (
              <p className="text-xs text-red-500">
                {form.formState.errors.agency_id.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">invite key</label>
            <input
              type="text"
              placeholder="Enter your one time invite key"
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              {...form.register("inviteKey")}
            />
            {form.formState.errors.inviteKey && (
              <p className="text-xs text-red-500">
                {form.formState.errors.inviteKey.message}
              </p>
            )}
          </div>


          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-xs text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition-colors disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
}
