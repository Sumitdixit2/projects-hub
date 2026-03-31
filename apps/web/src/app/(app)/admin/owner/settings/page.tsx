"use client";

import Sidebar from "@/components/layout/sidebar";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  console.log("user is : ",user);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const router = useRouter();

  useEffect(() => {
    if (hasHydrated && !user) {
      router.push("/admin/login");
    }
  }, [hasHydrated, user, router]);

  if (!hasHydrated || !user) return null;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <aside className="hidden md:flex w-64 bg-white border-r sticky top-0 h-screen">
        <Sidebar role="admin" />
      </aside>

      <main className="flex-1 min-h-screen">
        <header className="flex items-center justify-between px-8 w-full sticky top-0 z-50 bg-white dark:bg-slate-900 h-16 border-b border-blue-600/10 shadow-sm font-inter text-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-black tracking-tight text-slate-900 dark:text-slate-50">Settings</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative flex items-center">
              <span className="material-symbols-outlined absolute left-3 text-slate-400 text-lg">search</span>
              <input 
                className="pl-10 pr-4 py-1.5 bg-slate-50 dark:bg-slate-800 border-none rounded-full focus:ring-2 focus:ring-blue-500 w-64 text-xs transition-all" 
                placeholder="Search settings..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-4 text-slate-500">
              <button className="material-symbols-outlined hover:text-blue-600 transition-colors">notifications</button>
              <button className="material-symbols-outlined hover:text-blue-600 transition-colors">help</button>
              <div className="h-8 w-8 rounded-full overflow-hidden border border-blue-600/10 bg-slate-200 flex items-center justify-center">
                <span className="text-xs font-bold text-slate-600">{user.name?.charAt(0) || 'U'}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="p-12 max-w-5xl mx-auto space-y-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-blue-600/10 p-8 space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Personal Information</h3>
                  <p className="text-xs text-slate-500">Manage your individual account details and role.</p>
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-white border border-blue-600/10 text-blue-600 text-xs font-semibold rounded-lg hover:bg-blue-50 transition-colors active:scale-95">
                  <span className="material-symbols-outlined text-sm">edit</span>
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Full Name</label>
                  <div className="py-2 px-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700">{user.fullname}</div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Current Role</label>
                  <div className="inline-flex items-center px-2.5 py-1 bg-blue-600/10 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                    {user.role || 'Admin'}
                  </div>
                </div>
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email Address</label>
                  <div className="py-2 px-3 bg-slate-50 rounded-lg text-sm font-medium text-slate-700">{user.email}</div>
                </div>
              </div>
            </section>

            <section className="bg-blue-600 rounded-xl shadow-md shadow-blue-600/20 p-8 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="relative z-10">
                <span className="material-symbols-outlined text-4xl mb-4 opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                <h3 className="text-xl font-black leading-tight tracking-tight">Account Verified</h3>
                <p className="text-sm opacity-80 mt-2">Your security credentials are up to date and active.</p>
              </div>
              <div className="relative z-10 pt-6">
                <button className="text-xs font-bold underline underline-offset-4 hover:opacity-80 transition-opacity">View Security Audit</button>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            </section>

            {/* Agency Profile */}
            <section className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-blue-600/10 overflow-hidden flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-slate-50 p-8 flex flex-col items-center justify-center text-center border-r border-blue-600/10">
                <div className="w-24 h-24 bg-white rounded-xl shadow-sm border border-blue-600/10 p-4 mb-4 flex items-center justify-center">
                  <span className="material-symbols-outlined text-5xl text-blue-600">corporate_fare</span>
                </div>
                <h4 className="text-lg font-black text-slate-900 tracking-tight">Azure Logic Creative</h4>
                <p className="text-xs text-slate-500 mt-1">Enterprise Workspace</p>
              </div>
              <div className="flex-1 p-8">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Agency Profile</h3>
                  <button className="text-xs font-semibold text-blue-600 hover:underline">Manage Brand Assets</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Website</label>
                      <p className="text-sm font-medium text-slate-700 mt-1">azurelogic.io</p>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Primary Contact</label>
                      <p className="text-sm font-medium text-slate-700 mt-1">billing@azurelogic.io</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Workspace ID</label>
                      <p className="text-sm font-mono text-slate-500 mt-1">ALC-9928-XF-2024</p>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <span className="px-2 py-1 bg-blue-50 text-[10px] font-bold text-blue-600 rounded border border-blue-100 uppercase tracking-widest">Growth Plan</span>
                      <span className="px-2 py-1 bg-slate-50 text-[10px] font-bold text-slate-500 rounded border border-slate-200 uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* Critical Actions */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="h-px flex-1 bg-blue-600/10"></div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Critical Actions</h3>
              <div className="h-px flex-1 bg-blue-600/10"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button className="flex items-center justify-between p-6 bg-white border border-blue-600/10 rounded-xl hover:bg-slate-50 transition-all group active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">lock_reset</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-slate-900">Change Password</p>
                    <p className="text-xs text-slate-500">Update your security credentials</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-slate-300 group-hover:text-blue-600 transition-colors">chevron_right</span>
              </button>
              <button 
                onClick={() => { /* Add logout logic here */ }}
                className="flex items-center justify-between p-6 bg-white border border-red-100 rounded-xl hover:bg-red-50 transition-all group active:scale-[0.98]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-500 group-hover:text-white transition-colors">
                    <span className="material-symbols-outlined">logout</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-red-500">Logout</p>
                    <p className="text-xs text-red-400">Terminate current session</p>
                  </div>
                </div>
                <span className="material-symbols-outlined text-red-200 group-hover:text-red-500 transition-colors">logout</span>
              </button>
            </div>
          </section>
        </div>
      </main>

      <link 
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" 
        rel="stylesheet" 
      />
    </div>
  );
}
