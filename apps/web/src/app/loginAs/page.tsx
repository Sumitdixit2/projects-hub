'use client';

export default function loginAs () {
  return(
<div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col justify-center">
<div className="max-w-4xl mx-auto w-full px-6 py-12">
<div className="text-center mb-12">
<div className="flex justify-center mb-6">
<div className="w-12 h-12 bg-primary flex items-center justify-center rounded-lg shadow-sm">
<span className="text-white text-3xl">Projects hub</span>
</div>
</div>
<h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">
                Welcome back.
            </h1>
<p className="mt-3 text-lg text-slate-600 dark:text-slate-400">
                Please select your account type to continue to your dashboard.
            </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
<div className="group relative bg-white dark:bg-slate-800 border border-neutral-border dark:border-slate-700 rounded-xl p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200">
<div className="flex flex-col h-full">
<div className="mb-6">
<div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
<span className="material-icons text-primary text-3xl">admin_panel_settings</span>
</div>
</div>
<h2 className="text-xl font-bold mb-3">Agency Admin</h2>
<p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Full access to manage projects, handle client accounts, track team billable hours, and oversee agency-wide analytics.
                    </p>
<div className="mt-auto">
<a className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all text-sm uppercase tracking-wide" href="#">
                            Login as Admin
                        </a>
</div>
</div>
</div>
<div className="group relative bg-white dark:bg-slate-800 border border-neutral-border dark:border-slate-700 rounded-xl p-8 hover:border-primary/50 dark:hover:border-primary/50 transition-colors duration-200">
<div className="flex flex-col h-full">
<div className="mb-6">
<div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-full flex items-center justify-center">
<span className="material-icons text-primary text-3xl">person_outline</span>
</div>
</div>
<h2 className="text-xl font-bold mb-3">Client Portal</h2>
<p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                        Access your active project milestones, approve deliverables, view invoices, and communicate with your project manager.
                    </p>
<div className="mt-auto">
<a className="inline-flex items-center justify-center w-full px-6 py-3.5 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 focus:ring-4 focus:ring-primary/20 transition-all text-sm uppercase tracking-wide" href="#">
                            Login as Client
                        </a>
</div>
</div>
</div>
</div>
<div className="mt-16 text-center">
<nav className="flex justify-center space-x-6 text-sm font-medium text-slate-500 dark:text-slate-400">
<a className="hover:text-primary transition-colors" href="#">Return to main site</a>
<span className="text-slate-300 dark:text-slate-700">|</span>
<a className="hover:text-primary transition-colors" href="#">Help Center</a>
<span className="text-slate-300 dark:text-slate-700">|</span>
<a className="hover:text-primary transition-colors" href="#">Security</a>
</nav>
<p className="mt-8 text-xs text-slate-400 dark:text-slate-500">
                © 2024 AgencyConnect Professional. All rights reserved.
            </p>
</div>
</div>
<div className="fixed top-0 left-0 w-full h-1 bg-primary/10">
<div className="w-1/3 h-full bg-primary"></div>
</div>
</div>
  );
}
