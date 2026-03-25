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
import { useAuthStore } from "@/store/auth.store";
import { UserRole } from "@/types/auth.types";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agencyId: z.string().uuid("Valid agency selection is required"),
  admin_role: z.enum(["staff", "dev", "owner"]),
});

type RegisterFormType = z.infer<typeof registerSchema>;

type Agency = {
  id: string;
  name: string;
};

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [selectedAgencyName, setSelectedAgencyName] = useState("");
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      admin_role: "staff",
      email: "",
      password: "",
      agencyId: "",
    },
  });

  useEffect(() => {
    const fetchAgencies = async () => {
      try {
        const response = await authService.getAgency();
        setAgencies(Array.isArray(response?.data) ? response.data : []);
      } catch (error) {
        console.error("Failed to fetch agencies", error);
        setAgencies([]);
      }
    };
    fetchAgencies();
  }, []);

  const onSubmit = async (data: RegisterFormType) => {
    setLoading(true);

    try {
      const cleanedData = {
        ...data,
        email: data.email.trim(),
      };

      const response = await authService.adminLogin(cleanedData);

      toast.success(response?.message || "Login successful!");

      login({
        id: response?.id,
        email: cleanedData.email,
        role: data.admin_role as UserRole,
        agency_id: data.agencyId,
      });

      router.push(`/admin/${data.admin_role}/dashboard`);
    } catch (error: any) {
      console.error(
        "Login failed",
        error?.response?.data?.message || error.message
      );

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Login to your account
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <select {...form.register("admin_role")} className="input">
              <option value="staff">Staff</option>
              <option value="dev">Developer</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Email</label>
            <input type="email" {...form.register("email")} className="input" />
            {form.formState.errors.email && (
              <p className="error">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Select Agency</label>

            <Combobox
              items={agencies.map((a) => a.name)}
              value={selectedAgencyName}
              onValueChange={(name: string) => {
                setSelectedAgencyName(name);
                const agency = agencies.find((a) => a.name === name);
                if (agency) {
                  form.setValue("agencyId", agency.id, {
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

            <input type="hidden" {...form.register("agencyId")} />

            {form.formState.errors.agencyId && (
              <p className="error">
                {form.formState.errors.agencyId.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label>Password</label>
            <input
              type="password"
              {...form.register("password")}
              className="input"
            />
            {form.formState.errors.password && (
              <p className="error">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
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
