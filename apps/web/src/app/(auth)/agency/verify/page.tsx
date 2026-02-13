"use client";
import { authService } from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Code } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const verifyCodeSchema = z.object({
  Code: z.string().min(6, "Code must be at least 6 characters")
});

export default function VerifyPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const form = useForm<z.infer<typeof verifyCodeSchema>>({
    resolver: zodResolver(verifyCodeSchema),
  });

  useEffect(() => {
    if (!email) {
      router.push('agency/signup');
    }
  }, [email, router]);

  const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
    if (!email) return;

    setIsLoading(true);

    try {
      await authService.verifyAgency({ email, Code: data.Code });
      toast.success("successfully verified agency!");
    } catch (error) {

    }

  }
}
