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
    <div
      className="relative flex min-h-screen w-full flex-col bg-white overflow-x-hidden"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-col h-full grow">
        {/* Header */}
        <header className="flex items-center justify-between border-b px-10 py-3">
          <div className="flex items-center gap-4 text-[#111417]">
            <div className="size-4">
              <svg viewBox="0 0 48 48" fill="none">
                <path d="M24 18.4L42 11.4V34.3L24 42V18.4Z" fill="currentColor" />
                <path d="M24 8.18L33.4 11.57L24 15.2L14.5 11.57L24 8.18Z" fill="currentColor" />
              </svg>
            </div>
            <h2 className="text-lg font-bold">Projects-Hub</h2>
          </div>
        </header>

        {/* Form */}
        <div className="flex justify-center px-4 py-10">
          <div className="w-full max-w-[512px]">
            <h2 className="text-2xl font-bold text-center mb-6">
              Create your agency account
            </h2>

            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              {/* Name */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Agency Name</span>
                <input
                  {...form.register("name")}
                  placeholder="Enter your agency name"
                  className="input"
                />
                {form.formState.errors.name && (
                  <p className="error">{form.formState.errors.name.message}</p>
                )}
              </label>

              {/* Email */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Email</span>
                <input
                  {...form.register("email")}
                  placeholder="Enter your email"
                  className="input"
                />
                {form.formState.errors.email && (
                  <p className="error">{form.formState.errors.email.message}</p>
                )}
              </label>

              {/* Phone */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Phone (Optional)</span>
                <input
                  {...form.register("phone")}
                  placeholder="Enter phone number"
                  className="input"
                />
              </label>

              {/* Password */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Password</span>
                <input
                  type="password"
                  {...form.register("password")}
                  placeholder="Enter your password"
                  className="input"
                />
                {form.formState.errors.password && (
                  <p className="error">
                    {form.formState.errors.password.message}
                  </p>
                )}
              </label>

              {/* Website */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Website</span>
                <input
                  {...form.register("website")}
                  placeholder="Enter website URL"
                  className="input"
                />
                {form.formState.errors.website && (
                  <p className="error">
                    {form.formState.errors.website.message}
                  </p>
                )}
              </label>

              {/* Description */}
              <label className="flex flex-col">
                <span className="font-medium mb-1">Description</span>
                <input
                  {...form.register("description")}
                  placeholder="Enter description"
                  className="input"
                />
              </label>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2080df] text-white py-3 rounded-lg font-semibold disabled:opacity-50"
              >
                {loading ? "Creating..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-sm mt-4 underline cursor-pointer">
              Already have an account? Sign In
            </p>

            {loading && (
              <p className="text-center mt-3 text-sm text-gray-500">
                Processing...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Tailwind reusable classes */}
      <style jsx>{`
        .input {
          height: 50px;
          border: 1px solid #dce0e5;
          border-radius: 8px;
          padding: 12px;
          font-size: 14px;
        }
        .error {
          font-size: 12px;
          color: red;
          margin-top: 4px;
        }
      `}</style>
    </div>
  );
}

export default SignUpAgency;
