'use client';

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DenseStatsGrid } from "@/components/ui/dense-stats-grid";
import { TelemetryCard } from "@/components/ui/telemetry-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { ActivityTimeline } from "@/components/ui/activity-timeline";
import { ArrowRight, Terminal, Workflow, Users, Shield, Cpu, Layers } from "lucide-react";
import Link from "next/link";
import { BackgroundGrid } from "@/components/ui/background-grid";
import { CollaborativeCursors } from "@/components/ui/collaborative-cursors";

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-black text-foreground selection:bg-primary/30">
      {/* NAVIGATION */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
              <div className="w-2 h-2 bg-black" />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">Project Hub</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/loginAs" className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </Link>
            <Button onClick={() => router.push('/registerAs')} variant="default" size="sm" className="rounded-full">
              Get Started
            </Button>
          </div>
        </div>
      </header>

      <main className="pt-24 pb-32 overflow-hidden relative">
        {/* Stronger grid mask for the landing page hero */}
        <BackgroundGrid className="[mask-image:radial-gradient(ellipse_120%_80%_at_50%_0%,#000_60%,transparent_100%)] opacity-90" />
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 lg:pt-24 relative z-10">
          <div className="flex flex-col items-start max-w-3xl">
            <StatusBadge status="success" label="Platform Online v2.4.0" className="mb-6" />
            <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-[1.1] mb-6">
              Operational intelligence for technical agencies.
            </h1>
            <p className="text-[17px] text-muted-foreground leading-relaxed max-w-2xl mb-8">
              Orchestrate client projects, engineering workflows, and realtime telemetry 
              in a single, high-density environment. Built for speed, precision, and scale.
            </p>
            <div className="flex items-center gap-4">
              <Button onClick={() => router.push('/registerAs')} size="lg" className="rounded-full gap-2">
                Start Building <ArrowRight className="w-4 h-4" />
              </Button>
              <Button onClick={() => router.push('/loginAs')} variant="outline" size="lg" className="rounded-full border-border bg-black">
                View Documentation
              </Button>
            </div>
          </div>
          
          {/* Dashboard Preview */}
          <div className="mt-20 relative w-full border border-border/80 rounded-xl overflow-hidden bg-[#0a0a0a] shadow-2xl ring-1 ring-white/5">
            <CollaborativeCursors />
            
            {/* Window Controls - Restrained Technical Chrome */}
            <div className="h-9 border-b border-border/80 bg-[#0e0e0e] flex items-center px-4 gap-2.5 relative">
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
                <div className="w-2 h-2 rounded-full bg-zinc-800" />
              </div>
              <div className="absolute left-1/2 -translate-x-1/2 flex justify-center">
                <div className="w-72 h-5 bg-black/50 border border-border/50 rounded flex items-center justify-center backdrop-blur-md">
                  <span className="text-[9px] text-muted-foreground/80 font-mono tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                    dashboard.projecthub.dev
                  </span>
                </div>
              </div>
            </div>
            {/* Interface Mock */}
            <div className="p-6 flex flex-col md:flex-row gap-6 relative z-10">
              <div className="w-full md:w-64 flex-shrink-0 space-y-4 hidden md:block">
                <div className="h-8 bg-[#111] rounded-md border border-border" />
                <div className="h-4 bg-[#111] rounded border border-border w-3/4" />
                <div className="h-4 bg-[#111] rounded border border-border w-5/6" />
                <div className="h-4 bg-[#111] rounded border border-border w-2/3" />
              </div>
              <div className="flex-1 space-y-6">
                <DenseStatsGrid columns={3}>
                  <TelemetryCard title="Active Projects" value="24" trend="up" trendValue="12%" className="bg-black" />
                  <TelemetryCard title="System Load" value="48ms" trend="neutral" trendValue="stable" className="bg-black" />
                  <TelemetryCard title="Client Requests" value="14" trend="down" trendValue="2" className="bg-black" />
                </DenseStatsGrid>
                <div className="h-64 border border-border bg-black rounded-sm flex items-center justify-center">
                  <span className="text-muted-foreground text-xs font-mono">[ REALTIME LEDGER SIMULATION ]</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PLATFORM CAPABILITIES (BENTO GRID) */}
        <section className="max-w-7xl mx-auto px-6 mt-32">
          <div className="mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">System Capabilities</h2>
            <p className="text-[15px] text-muted-foreground mt-2 max-w-xl">
              Architected to remove friction from complex agency-client workflows.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="col-span-1 md:col-span-2 p-8 flex flex-col justify-between min-h-[300px] border-border bg-[#0a0a0a]">
              <div>
                <Workflow className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium text-foreground">Project Orchestration</h3>
                <p className="text-sm text-muted-foreground mt-2 max-w-md">
                  Deploy milestones, assign developers, and track delivery pipelines with absolute precision. 
                  Zero ambiguity in operational handoffs.
                </p>
              </div>
              {/* Mock UI Element */}
              <div className="mt-8 border border-border bg-black rounded-sm p-4">
                <div className="h-2 w-full bg-[#111] rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-2/3" />
                </div>
                <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
                  <span>PHASE 2 DEPLOYMENT</span>
                  <span className="text-foreground">66%</span>
                </div>
              </div>
            </Card>

            <Card className="col-span-1 p-8 flex flex-col justify-between min-h-[300px] border-border bg-[#0a0a0a]">
              <div>
                <Layers className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium text-foreground">Multi-Tenant</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Isolated workspaces for every client.
                </p>
              </div>
              <div className="space-y-2 mt-8">
                <div className="flex items-center justify-between p-2 border border-border bg-black rounded-sm">
                  <span className="text-xs">Acme Corp</span>
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                </div>
                <div className="flex items-center justify-between p-2 border border-border bg-black rounded-sm">
                  <span className="text-xs">Globex Inc</span>
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
              </div>
            </Card>

            <Card className="col-span-1 p-8 border-border bg-[#0a0a0a]">
              <Terminal className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-medium text-foreground">Realtime Telemetry</h3>
              <p className="text-sm text-muted-foreground mt-2">
                Live websocket connections push updates instantly. No polling required.
              </p>
            </Card>

            <Card className="col-span-1 md:col-span-2 p-8 border-border bg-[#0a0a0a] flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <Users className="w-6 h-6 text-primary mb-4" />
                <h3 className="text-lg font-medium text-foreground">Role-Based Access</h3>
                <p className="text-sm text-muted-foreground mt-2">
                  Strict boundaries between Agency Owners, Developers, and Clients. 
                  Each role receives a tailored, high-density interface optimized for their specific workflow.
                </p>
              </div>
              <div className="w-full md:w-64 border border-border bg-black rounded-sm p-4">
                <ActivityTimeline 
                  events={[
                    { id: '1', actor: 'Admin', action: 'generated', target: 'Client Key', timestamp: '12:01:04' },
                    { id: '2', actor: 'Dev', action: 'committed', target: 'API Route', timestamp: '11:45:22', isImportant: true },
                    { id: '3', actor: 'System', action: 'synced', timestamp: '11:45:00' },
                  ]}
                />
              </div>
            </Card>
          </div>
        </section>

        {/* TECHNICAL CREDIBILITY */}
        <section className="max-w-7xl mx-auto px-6 mt-32 border-t border-border pt-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold tracking-tight mb-4">Engineered for scale.</h2>
              <p className="text-[15px] text-muted-foreground leading-relaxed max-w-md">
                We replaced decorative consumer UI with a highly disciplined, 
                developer-first technical aesthetic. 1px borders, rigid typography scales, 
                and uncompromising density ensure that operational teams never lose context.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <Cpu className="w-5 h-5 text-zinc-500 mb-3" />
                <h4 className="text-[13px] font-medium text-foreground mb-1">State Management</h4>
                <p className="text-[12px] text-muted-foreground leading-normal">Optimized Zustand stores prevent unnecessary renders across complex project boards.</p>
              </div>
              <div>
                <Shield className="w-5 h-5 text-zinc-500 mb-3" />
                <h4 className="text-[13px] font-medium text-foreground mb-1">Data Integrity</h4>
                <p className="text-[12px] text-muted-foreground leading-normal">End-to-end type safety from the Postgres layer to the React Hook Forms.</p>
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="max-w-4xl mx-auto px-6 mt-32 text-center">
          <div className="p-12 border border-border rounded-xl bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,112,243,0.1)_0%,transparent_70%)] pointer-events-none" />
            <h2 className="text-3xl font-semibold tracking-tight relative z-10 mb-4">Initialize your workspace.</h2>
            <p className="text-[15px] text-muted-foreground mb-8 relative z-10">
              Join the platform that technical agencies use to execute with precision.
            </p>
            <div className="flex items-center justify-center gap-4 relative z-10">
              <Button onClick={() => router.push('/registerAs')} size="lg" className="rounded-full">
                Create Agency Account
              </Button>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-black py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-sm flex items-center justify-center">
              <div className="w-1 h-1 bg-black" />
            </div>
            <span className="text-[12px] font-semibold tracking-tight text-foreground">Project Hub</span>
          </div>
          <p className="text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
            © {new Date().getFullYear()} Project Hub OS. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
