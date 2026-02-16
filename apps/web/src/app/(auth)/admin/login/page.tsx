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
        setAgencies(Array.isArray(response.data) ? response.data : []);
      } catch {
        setAgencies([]);
      }
    };
    fetchAgencies();
  }, []);

  const onSubmit = async (data: RegisterFormType) => {
    setLoading(true);

    try {
      const response = await authService.adminLogin(data);
      console.log("response is: ", response);
      toast.success(response?.message || "Admin successfully logged In!");
      login({
        id: response.id,
        email: data.email,
        role: data.admin_role as UserRole,
        agency_id: data.agencyId
      });
    } catch (error: any) {
      toast.error(
        error?.message || "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800 p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          login to your account
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <select
              {...form.register("admin_role")}
              className="w-full px-4 py-2 rounded border bg-white dark:bg-slate-800"
            >
              <option value="staff">Staff</option>
              <option value="dev">Developer</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Email</label>
            <input
              type="email"
              {...form.register("email")}
              className="w-full px-4 py-2 rounded border bg-white dark:bg-slate-800"
            />
            <p className="text-xs text-red-500">
              {form.formState.errors.email?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Select Agency</label>

            <Combobox
              items={agencies.map((agency) => agency.name)}
              value={selectedAgencyName}
              onValueChange={(selectedName: string) => {
                setSelectedAgencyName(selectedName);
                const selectedAgency = agencies.find(
                  (agency) => agency.name === selectedName
                );
                if (selectedAgency) {
                  form.setValue("agencyId", selectedAgency.id, {
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

            <input type="hidden" {...form.register("agencyId")} />

            <p className="text-xs text-red-500">
              {form.formState.errors.agencyId?.message}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label>Password</label>
            <input
              type="password"
              {...form.register("password")}
              className="w-full px-4 py-2 rounded border bg-white dark:bg-slate-800"
            />
            <p className="text-xs text-red-500">
              {form.formState.errors.password?.message}
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded disabled:opacity-50"
          >
            {loading ? "Creating..." : "Sign Up"}
          </button>

        </form>
      </div>
    </div>
  );
}
