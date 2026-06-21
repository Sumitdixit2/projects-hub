"use client";

import React from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
  title: string | React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function DashboardLayout({
  children,
  title,
  subtitle,
  actions,
}: DashboardLayoutProps) {
  return (
    <div className="flex-1 flex flex-col min-h-screen bg-transparent">
      {/* SECTION HEADER */}
      <div className="h-14 px-6 border-b border-border bg-black/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-10">
        <div className="flex flex-col justify-center">
          <h2 className="text-[14px] font-semibold text-foreground tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <span className="text-[11px] font-mono text-muted-foreground mt-0.5">
              {subtitle}
            </span>
          )}
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>

      {/* DASHBOARD CONTENT */}
      <div className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {children}
        </div>
      </div>
    </div>
  );
}
