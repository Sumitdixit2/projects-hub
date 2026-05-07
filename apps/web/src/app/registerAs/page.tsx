'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Briefcase, Shield, User } from "lucide-react";

export default function RegisterFor() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col bg-black text-foreground selection:bg-primary/30 relative">
      {/* Decorative Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#333_1px,transparent_1px),linear-gradient(to_bottom,#333_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      {/* Header */}
      <nav className="w-full h-14 border-b border-border flex justify-center items-center relative z-10 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-black" />
          </div>
          <span className="text-[13px] font-semibold tracking-tight uppercase">
            Project Hub
          </span>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 relative z-10">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-3">
              Initialize Context
            </h1>
            <p className="text-[15px] text-muted-foreground">
              Select the organizational role to configure your workspace.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Agency Owner */}
            <Card className="group border-border bg-[#0a0a0a] hover:bg-[#111] transition-colors p-8 flex flex-col min-h-[300px]">
              <div className="mb-6">
                <div className="w-10 h-10 border border-border bg-black rounded-md flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Briefcase className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h2 className="text-[17px] font-medium text-foreground mb-2">Agency Registration</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed flex-grow">
                Initialize a root workspace. Manage billing, configure branding, and invite internal staff.
              </p>
              <div className="mt-8">
                <Button 
                  onClick={() => router.push('/agency/signup')} 
                  className="w-full rounded-md"
                >
                  Initialize Workspace
                </Button>
              </div>
            </Card>

            {/* Admin/Staff */}
            <Card className="group border-border bg-[#0a0a0a] hover:bg-[#111] transition-colors p-8 flex flex-col min-h-[300px]">
              <div className="mb-6">
                <div className="w-10 h-10 border border-border bg-black rounded-md flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h2 className="text-[17px] font-medium text-foreground mb-2">Internal Staff</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed flex-grow">
                Join an existing workspace. Manage project assignments and internal telemetry. Requires invitation key.
              </p>
              <div className="mt-8">
                <Button 
                  onClick={() => router.push('/admin/signup')} 
                  variant="outline"
                  className="w-full rounded-md border-border bg-black"
                >
                  Join Workspace
                </Button>
              </div>
            </Card>

            {/* Client */}
            <Card className="group border-border bg-[#0a0a0a] hover:bg-[#111] transition-colors p-8 flex flex-col min-h-[300px]">
              <div className="mb-6">
                <div className="w-10 h-10 border border-border bg-black rounded-md flex items-center justify-center group-hover:border-primary/50 transition-colors">
                  <User className="w-5 h-5 text-primary" />
                </div>
              </div>
              <h2 className="text-[17px] font-medium text-foreground mb-2">Client Access</h2>
              <p className="text-[13px] text-muted-foreground leading-relaxed flex-grow">
                Register for a tenant portal to review milestones and securely communicate. Requires client key.
              </p>
              <div className="mt-8">
                <Button 
                  onClick={() => router.push('/client/signup')} 
                  variant="outline"
                  className="w-full rounded-md border-border bg-black"
                >
                  Setup Portal
                </Button>
              </div>
            </Card>

          </div>

          {/* Footer Navigation */}
          <div className="mt-16 text-center">
            <nav className="flex justify-center space-x-4 text-[12px] font-mono text-muted-foreground uppercase tracking-wider">
              <a className="hover:text-foreground transition-colors" href="/">Cancel Setup</a>
            </nav>
            <p className="mt-6 text-[11px] font-mono text-muted-foreground">
              © {new Date().getFullYear()} Project Hub. Identity Protocol.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
