'use client';


export default function RegisterFor() {
  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">

      <nav className="w-full py-8 flex justify-center items-center">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded flex items-center justify-center text-white" />
          <span className="text-xl font-bold text-slate-800 dark:text-white uppercase tracking-widest">
            Projects-hub
          </span>
        </div>
      </nav>

      <main className="flex-grow flex items-center justify-center px-4 pb-12">
        <div className="max-w-6xl w-full">

          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-white mb-4">
              Choose Your Role
            </h1>
            <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
              Select the registration type that best describes your relationship with the agency to get started.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Agency */}
            <div className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary rounded-xl p-8 flex flex-col transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <span className="material-icons text-primary text-3xl">
                  corporate_fare
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                Register as Agency
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
                Main account for agency owners and founders. Manage workspace, branding, billing, and operations.
              </p>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2">
                <span>Get Started</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Admin */}
            <div className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary rounded-xl p-8 flex flex-col transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <span className="material-icons text-primary text-3xl">
                  admin_panel_settings
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                Register as Admin
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
                Internal staff members. Manage projects, assign tasks, and handle communications.
              </p>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2">
                <span>Join Team</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

            {/* Client */}
            <div className="group bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 hover:border-primary rounded-xl p-8 flex flex-col transition-all duration-200 shadow-sm hover:shadow-md">
              <div className="w-14 h-14 bg-primary/10 dark:bg-primary/20 rounded-lg flex items-center justify-center mb-6">
                <span className="material-icons text-primary text-3xl">
                  person_outline
                </span>
              </div>

              <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-3">
                Register as Client
              </h2>

              <p className="text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
                View progress, approve deliverables, communicate with the team.
              </p>

              <button className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 px-4 rounded transition-colors flex items-center justify-center space-x-2">
                <span>Access Portal</span>
                <span className="material-icons text-sm">arrow_forward</span>
              </button>
            </div>

          </div>

        </div>
      </main>

      <footer className="py-6 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-background-dark/50 text-center text-sm text-slate-500">
        © 2024 xus Agency Operations. All rights reserved.
      </footer>

    </div>
  );
}

