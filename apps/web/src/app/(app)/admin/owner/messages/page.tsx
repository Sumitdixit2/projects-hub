"use client";

import Sidebar from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function MessagesPage() {
  const user = useAuthStore((state) => state.user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user]);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden md:flex w-64 bg-white border-r">
        <Sidebar role="admin" />
      </aside>

      <main className="flex-1 flex items-center justify-center p-4 md:p-6">
        <div className="text-center bg-white p-10 rounded-xl shadow-sm border">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Messages</h1>
          <p className="text-slate-500">
            This feature will be added soon. Stay tuned!
          </p>
        </div>
      </main>
    </div>
  );
}
