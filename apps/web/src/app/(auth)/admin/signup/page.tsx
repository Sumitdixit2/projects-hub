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

const baseSchema = z.object({
  fullname: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  agency_id: z.string().uuid("Valid agency selection is required"),
});

const ownerSchema = baseSchema.extend({
  admin_role: z.literal("owner"),
  agency_email: z.string().email("Agency email is required"),
  agency_password: z.string().min(6, "Agency password must be at least 6 characters"),
});

const memberSchema = baseSchema.extend({
  admin_role: z.enum(["staff", "dev"]),
  inviteKey: z.string().min(1, "Invite key is required"),
});

const registerSchema = z.discriminatedUnion("admin_role", [
  ownerSchema,
  memberSchema,
]);

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

  const form = useForm<RegisterFormType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      admin_role: "staff",
      fullname: "",
      email: "",
      password: "",
      agency_id: "",
    },
  });

  const role = form.watch("admin_role");

  // Cleanup unused fields
  useEffect(() => {
    if (role === "owner") {
      form.unregister("inviteKey");
    } else {
      form.unregister("agency_email");
      form.unregister("agency_password");
    }
  }, [role, form]);

  // Fetch agencies
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
        fullname: data.fullname.trim(),
        email: data.email.trim(),
      };

      const response = await authService.registerAdmin(cleanedData);

      toast.success(response?.message || "Admin successfully registered!");
      router.push("/admin/login");
    } catch (error: any) {
      console.error("Registration failed", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create your account
        </h1>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

          {/* Role */}
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Role</label>
            <select
              {...form.register("admin_role")}
              className="input"
            >
              <option value="staff">Staff</option>
              <option value="dev">Developer</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label>Full Name</label>
            <input {...form.register("fullname")} className="input" />
            {form.formState.errors.fullname && (
              <p className="error">{form.formState.errors.fullname.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label>Email</label>
            <input type="email" {...form.register("email")} className="input" />
            {form.formState.errors.email && (
              <p className="error">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Agency Combobox */}
          <div className="flex flex-col gap-1.5">
            <label>Select Agency</label>

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

          {/* Owner Fields */}
          {role === "owner" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label>Agency Email</label>
                <input {...form.register("agency_email")} className="input" />
                {form.formState.errors.agency_email && (
                  <p className="error">
                    {form.formState.errors.agency_email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label>Agency Password</label>
                <input type="password" {...form.register("agency_password")} className="input" />
                {form.formState.errors.agency_password && (
                  <p className="error">
                    {form.formState.errors.agency_password.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Member Fields */}
          {(role === "staff" || role === "dev") && (
            <div className="flex flex-col gap-1.5">
              <label>Invite Key</label>
              <input {...form.register("inviteKey")} className="input" />
              {form.formState.errors.inviteKey && (
                <p className="error">
                  {form.formState.errors.inviteKey.message}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label>Password</label>
            <input type="password" {...form.register("password")} className="input" />
            {form.formState.errors.password && (
              <p className="error">{form.formState.errors.password.message}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded disabled:opacity-50"
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
