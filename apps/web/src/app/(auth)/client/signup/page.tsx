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
        error?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Registration failed";

      toast.error(message);
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
            Initialize Client Profile
          </h1>
          <p className="text-[13px] text-muted-foreground mt-1 text-center">
            Register for tenant portal access.
          </p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >

          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Full Name</label>
            <input
              placeholder="John Doe"
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              {...form.register("name")}
            />
            {form.formState.errors.name && (
              <p className="text-[11px] font-mono text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Email Address</label>
            <input
              type="email"
              placeholder="name@company.com"
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-[11px] font-mono text-destructive">{form.formState.errors.email.message}</p>
            )}
          </div>

          {/* Agency */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Tenant Target</label>

            <Combobox
              items={agencies.map((a) => a.name)}
              value={selectedAgencyName}
              onValueChange={(name: string | null) => { if(!name) return;
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

          {/* Invite Key */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Invitation Key</label>
            <input
              placeholder="XXXX-XXXX-XXXX"
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              {...form.register("inviteKey")}
            />
            {form.formState.errors.inviteKey && (
              <p className="text-[11px] font-mono text-destructive">
                {form.formState.errors.inviteKey.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-foreground">Secure Passphrase</label>
            <input
              type="password"
              className="w-full bg-black border border-border rounded-md px-3 py-2 text-[13px] text-foreground focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
              placeholder="••••••••"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-[11px] font-mono text-destructive">
                {form.formState.errors.password.message}
              </p>
            )}
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
