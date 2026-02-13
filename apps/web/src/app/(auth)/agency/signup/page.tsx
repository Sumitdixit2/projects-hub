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
  website: z.string().url().optional().or(z.literal('')),
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
    }
  });

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    setIsLoading(true);
    try {
      console.log(data);
      console.log("lol")
      await authService.registerAgency(data);
      toast.success("Agency successfully registered!");
      router.push(`/agency/verify?email=${encodeURIComponent(data.email)}`);
    } catch (error: any) {
      console.error("agency not created", error.response?.date?.message);
      toast.error(error.response?.data?.message || 'Registeration failed');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      {loading && (<p> loading.... </p>)}
      < div className="relative flex h-auto min-h-screen w-full flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }
      }>
        <div className="layout-container flex h-full grow flex-col">
          <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f0f2f4] px-10 py-3">
            <div className="flex items-center gap-4 text-[#111417]">
              <div className="size-4">
                <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 18.4228L42 11.475V34.3663C42 34.7796 41.7457 35.1504 41.3601 35.2992L24 42V18.4228Z"
                    fill="currentColor"
                  ></path>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M24 8.18819L33.4123 11.574L24 15.2071L14.5877 11.574L24 8.18819ZM9 15.8487L21 20.4805V37.6263L9 32.9945V15.8487ZM27 37.6263V20.4805L39 15.8487V32.9945L27 37.6263ZM25.354 2.29885C24.4788 1.98402 23.5212 1.98402 22.646 2.29885L4.98454 8.65208C3.7939 9.08038 3 10.2097 3 11.475V34.3663C3 36.0196 4.01719 37.5026 5.55962 38.098L22.9197 44.7987C23.6149 45.0671 24.3851 45.0671 25.0803 44.7987L42.4404 38.098C43.9828 37.5026 45 36.0196 45 34.3663V11.475C45 10.2097 44.2061 9.08038 43.0155 8.65208L25.354 2.29885Z"
                    fill="currentColor"
                  ></path>
                </svg>
              </div>
              <h2 className="text-[#111417] text-lg font-bold leading-tight tracking-[-0.015em]">Projects-Hub</h2>
            </div>
          </header>
          <div className="px-40 flex flex-1 justify-center py-5">
            <div className="layout-content-container flex flex-col w-[512px] max-w-[512px] py-5 max-w-[960px] flex-1">
              <h2 className="text-[#111417] tracking-light text-[28px] font-bold leading-tight px-4 text-center pb-3 pt-5">Create your agency account</h2>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="name" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">Agency Name</p>
                  </label>
                  <input
                    id="name"
                    placeholder="Enter your agency name"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                    {...form.register('name')}
                  />
                  {form.formState.errors.name && <p className="text-xs text-red-500" > {form.formState.errors.name.message} </p>}
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="email" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">email</p>
                  </label>
                  <input
                    id="email"
                    {...form.register('email')}
                    placeholder="Enter your email"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                  />
                  {form.formState.errors.email && <p className="text-xs text-red-500" > {form.formState.errors.email.message} </p>}
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="phone" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">Phone (Optional)</p>
                  </label>
                  <input
                    id="phone"
                    {...form.register('phone')}
                    placeholder="Enter your Phone Number"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                  />
                  {form.formState.errors.phone && <p className="text-xs text-red-500" > {form.formState.errors.phone.message} </p>}
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="password" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">Password</p>
                  </label>
                  <input
                    id="password"
                    type="password"
                    {...form.register('password')}
                    placeholder="Enter your password"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                  />
                  {form.formState.errors.phone && <p className="text-xs text-red-500" > {form.formState.errors.phone.message} </p>}
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="website" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">Website</p>
                  </label>
                  <input
                    id="website"
                    {...form.register('website')}
                    placeholder="Enter website URL"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                  />
                  {form.formState.errors.website && <p className="text-xs text-red-500" > {form.formState.errors.website.message} </p>}
                </div>
                <div className="flex max-w-[480px] flex-wrap items-end gap-4 px-4 py-3">
                  <label htmlFor="description" className="flex flex-col min-w-40 flex-1">
                    <p className="text-[#111417] text-base font-medium leading-normal pb-2">Agency Description</p>
                  </label>
                  <input
                    id="description"
                    {...form.register('description')}
                    placeholder="Enter Agency description"
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-[#111417] focus:outline-0 focus:ring-0 border border-[#dce0e5] bg-white focus:border-[#dce0e5] h-14 placeholder:text-[#647587] p-[15px] text-base font-normal leading-normal"
                  />
                  {form.formState.errors.description && <p className="text-xs text-red-500" > {form.formState.errors.description.message} </p>}
                </div>

                <button
                  type="submit"
                  className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 flex-1 bg-[#2080df] text-white text-sm font-bold leading-normal tracking-[0.015em]"
                >
                  Sign Up
                </button>
              </form>
              <button>
                <p className="text-[#647587] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center underline">Already have an account? Sign In</p>
              </button>
            </div>
          </div>
        </div>
      </div >
    </>
  )
}

export default SignUpAgency;

