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
  agency_id: z.string().uuid("Valid agency selection is required"),
  inviteKey: z.string().min(1, "Invite key is required"),
});

type Agency = {
  id: string;
  name: string;
};

export default function SignupPage() {
  const [loading, setIsLoading] = useState<boolean>(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyName, setSelectedAgencyName] = useState("");
  const router = useRouter();

  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      agency_id: "",
      inviteKey: "",
    },
  });

  // Fetch agencies
  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await authService.getAgency();
        setAgencies(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("agencies failed to fetch", error);
        setAgencies([]);
      }
    };

    fetchAgencies();
  }, []);

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);

    try {
      const cleanedData = {
        ...data,
        name: data.name.trim(),
        email: data.email.trim(),
      };

      const response = await authService.registerClient(cleanedData);

      toast.success(response?.message || "Client successfully registered!");
      router.push("/client/login");
    } catch (error: any) {
      console.error(
        "Client registration failed",
        error?.response?.data?.message || error.message
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border">

        {/* Header */}
        <div className="flex justify-center mt-5 items-center">
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

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <input
              placeholder="John Doe"
              className="input"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="error">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="input"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="error">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Agency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Select Agency</label>

            <Combobox
              items={agencies.map((a) => a.name)}
              value={selectedAgencyName}
              onValueChange={(name: string) => {
                setSelectedAgencyName(name);
                const agency = agencies.find((a) => a.name === name);
                if (agency) {
                  form.setValue("agency_id", agency.id, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <ComboboxInput placeholder="Search agency..." />

              <ComboboxContent>
                <ComboboxEmpty>No agencies found.</ComboboxEmpty>

                <ComboboxList>
                  {agencies.map((agency) => (
                    <ComboboxItem key={agency.id} value={agency.name}>
                      {agency.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <input type="hidden" {...form.register("agency_id")} />

            {form.formState.errors.agency_id && (
              <p className="error">
                {form.formState.errors.agency_id.message}
              </p>
            )}
          </div>

          {/* Invite Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Invite Key</label>
            <input
              placeholder="Enter your invite key"
              className="input"
              {...form.register("inviteKey")}
            />
            {form.formState.errors.inviteKey && (
              <p className="error">
                {form.formState.errors.inviteKey.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              className="input"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="error">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-medium py-2.5 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>
        </form>

        {loading && (
          <p className="text-center text-sm mt-3 text-gray-500">
            Processing...
          </p>
        )}
      </div>

      {/* Reusable styles */}
      <style jsx>{`
        .input {
          width: 100%;
          padding: 10px;
          border-radius: 6px;
          border: 1px solid #ccc;
        }
        .error {
          font-size: 12px;
          color: red;
        }
      `}</style>
    </div>
  );
}
