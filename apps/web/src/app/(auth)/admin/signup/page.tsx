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
  admin_role: z.enum(["staff", "developer"]),
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

  useEffect(() => {
    if (role === "owner") {
      form.unregister("inviteKey");
    } else {
      form.unregister("agency_email");
      form.unregister("agency_password");
    }
  }, [role, form]);

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
        error?.error || 
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);
    } finally {
      setLoading(false);
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
            Initialize Account
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 text-center">
            Register a new authorization profile.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Authorization Role</label>
            <select
              {...form.register("admin_role")}
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary appearance-none"
            >
              <option value="staff">Staff</option>
              <option value="developer">Developer</option>
              <option value="owner">Owner</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Full Name</label>
            <input 
              {...form.register("fullname")} 
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
              placeholder="John Doe"
            />
            {form.formState.errors.fullname && (
              <p className="text-[11px] font-mono text-destructive">{form.formState.errors.fullname.message}</p>
            )}
          </div>

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

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Tenant Target</label>

            <Combobox
              items={agencies.map((a) => a.name)}
              value={selectedAgencyName}
              onValueChange={(name: string | null) => {
                if (!name) return;
                setSelectedAgencyName(name);
                const agency = agencies.find((a) => a.name === name);
                if (agency) {
                  form.setValue("agency_id", agency.id, {
                    shouldValidate: true,
                  });
                }
              }}
            >
              <ComboboxInput placeholder="Search system tenants..." className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary" />
              <ComboboxContent className="bg-[#111] border border-border text-foreground">
                <ComboboxEmpty className="py-4 text-center text-[13px] text-muted-foreground">No tenants found.</ComboboxEmpty>
                <ComboboxList>
                  {agencies.map((agency) => (
                    <ComboboxItem key={agency.id} value={agency.name} className="text-[13px] hover:bg-black cursor-pointer">
                      {agency.name}
                    </ComboboxItem>
                  ))}
                </ComboboxList>
              </ComboboxContent>
            </Combobox>

            <input type="hidden" {...form.register("agency_id")} />

            {form.formState.errors.agency_id && (
              <p className="text-[11px] font-mono text-destructive">
                {form.formState.errors.agency_id.message}
              </p>
            )}
          </div>

          {/* Owner Fields */}
          {role === "owner" && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Agency Root Email</label>
                <input 
                  {...form.register("agency_email")} 
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
                  placeholder="admin@agency.com"
                />
                {(form.formState.errors as any).agency_email && (
                  <p className="text-[11px] font-mono text-destructive">
                    {(form.formState.errors as any).agency_email.message}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[13px] font-medium text-foreground">Agency Root Password</label>
                <input 
                  type="password" 
                  {...form.register("agency_password")} 
                  className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
                />
                {(form.formState.errors as any).agency_password && (
                  <p className="text-[11px] font-mono text-destructive">
                    {(form.formState.errors as any).agency_password.message}
                  </p>
                )}
              </div>
            </>
          )}

          {/* Member Fields */}
          {(role === "staff" || role === "developer") && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-foreground">Invitation Key</label>
              <input 
                {...form.register("inviteKey")} 
                className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground" 
                placeholder="XXXX-XXXX-XXXX"
              />
              {(form.formState.errors as any).inviteKey && (
                <p className="text-[11px] font-mono text-destructive">
                  {(form.formState.errors as any).inviteKey.message}
                </p>
              )}
            </div>
          )}

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Secure Passphrase</label>
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

          {/* Submit */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 rounded-md transition-colors disabled:opacity-50 text-[13px] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Registering...</span>
                </>
              ) : (
                "Initialize Account"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
