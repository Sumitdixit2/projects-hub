"use client";

import { useState } from "react";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    agency: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (e.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-950">
      <div className="w-full max-w-[480px] bg-white dark:bg-slate-900 rounded-lg shadow-sm border border-slate-200 dark:border-slate-800">
        <div className="flex justify-center mt-5 items-center gap-4 text-[#111417]">
          <div className="size-4">
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_6_319)">
                <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z" fill="currentColor"></path>
              </g>
              <defs>
                <clipPath id="clip0_6_319"><rect fill="white" height="48" width="48"></rect></clipPath>
              </defs>
            </svg>
          </div>
          <h2 className="text-[#111417] text-lg font-bold leading-tight tracking-[-0.015em]">Project Hub</h2>
        </div>

        {/* Header */}
        <div className="px-8 pt-8 pb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Create your account
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Join your project management dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Full Name</label>
            <input
              name="fullName"
              type="text"
              placeholder="John Doe"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Email Address</label>
            <input
              name="email"
              type="email"
              placeholder="name@company.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Select Agency</label>
            <select
              name="agency"
              required
              value={formData.agency}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            >
              <option value="">Search and select your agency</option>
              <option value="creative-minds">Creative Minds Agency</option>
              <option value="digital-pulse">Digital Pulse Solutions</option>
              <option value="nexus-marketing">Nexus Marketing Group</option>
              <option value="stellar-dev">Stellar Development Co.</option>
              <option value="velocity-creative">Velocity Creative Lab</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Password</label>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
              />
            </div>

          </div>

          <div className="flex items-start gap-3 py-1">
            <input
              type="checkbox"
              name="terms"
              checked={formData.terms}
              onChange={handleChange}
              className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-600"
            />
            <label className="text-sm">
              By signing up, you agree to our{" "}
              <a className="text-blue-600 hover:underline font-medium">
                Terms of Service
              </a>{" "}
              and{" "}
              <a className="text-blue-600 hover:underline font-medium">
                Privacy Policy
              </a>.
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded transition-colors"
          >
            Sign Up
          </button>

          <div className="pt-4 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Already have an account?{" "}
              <a className="text-blue-600 font-semibold hover:underline">
                Sign In
              </a>
            </p>
          </div>

        </form>
      </div>
    </div>
  );
}



