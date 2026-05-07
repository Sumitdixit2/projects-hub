"use client";

import React from "react";
import SidebarRail from "./sidebar-rail";
import { BackgroundGrid } from "../ui/background-grid";

interface AppShellProps {
  children: React.ReactNode;
  role?: "admin" | "client";
}

export default function AppShell({ children, role = "admin" }: AppShellProps) {
  return (
    <div className="flex min-h-screen w-full bg-background text-foreground selection:bg-primary/30 relative">
      <BackgroundGrid />
      <div className="flex min-h-screen w-full relative z-10">
        <SidebarRail role={role} />
        <main className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-auto h-screen relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
