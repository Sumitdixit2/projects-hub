"use client";

import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

const verifyCodeSchema = z.object({
  Code: z.string().length(6, "Code must be 6 digits"),
});

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
    defaultValues: {
      Code: "",
    },
  });

  useEffect(() => {
    if (!email) {
      router.push("/agency/signup");
    }
  }, [email, router]);

  // Handle typing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const value = e.target.value.replace(/\D/g, ""); // only numbers
    e.target.value = value;

    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }

    updateCode();
  };

  // Handle backspace & arrows
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  // Combine OTP values
  const updateCode = () => {
    const code = inputs.current.map((input) => input?.value || "").join("");
    form.setValue("Code", code);
  };

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    if (!email) return;

    setIsLoading(true);

    try {
      await authService.verifyAgency({
        email,
        Code: data.Code,
      });

      toast.success("Successfully verified agency!");
      router.push("/agency/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Verification failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) return null;

  return (
    <div
      className="flex min-h-screen flex-col bg-white"
      style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
    >
      <div className="flex flex-1 justify-center items-center">
        <div className="w-[400px] space-y-6">
          <h2 className="text-2xl font-bold text-center">
            Enter Verification Code
          </h2>

          <p className="text-center text-gray-500">
            Enter the 6-digit code sent to your email.
          </p>

          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex justify-center gap-3 mb-4">
              {[...Array(6)].map((_, index) => (
                <input
                  key={index}
                  ref={(el) => (inputs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  className="h-14 w-12 text-center border-b border-gray-300 focus:outline-none focus:border-blue-500 text-lg"
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>

            {form.formState.errors.Code && (
              <p className="text-red-500 text-sm text-center mb-2">
                {form.formState.errors.Code.message}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-10 rounded-lg bg-blue-600 text-white font-semibold"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500">
            Didn’t receive the code?{" "}
            <span className="underline cursor-pointer">Resend</span>
          </p>
        </div>
      </div>
    </div>
  );
}
