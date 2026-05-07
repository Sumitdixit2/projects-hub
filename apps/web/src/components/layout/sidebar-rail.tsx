"use client";

import { useAuthStore } from "@/store/auth.store";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Users,
  Key,
  Activity,
  Settings,
  FileCode,
  UserPlus,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarRailProps {
  role?: "admin" | "client";
}

export default function SidebarRail({ role }: SidebarRailProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  const adminRole = user?.role || "guest";

  const navItems = [
    {
      title: "Dashboard",
      href: `/admin/${adminRole}/dashboard`,
      icon: LayoutDashboard,
      roles: ["owner", "staff", "developer"],
    },
    {
      title: "Activity",
      href: `/admin/${adminRole}/activity`,
      icon: Activity,
      roles: ["owner", "staff", "developer"],
    },
    {
      title: "Projects",
      href: `/admin/${adminRole}/projects`,
      icon: Briefcase,
      roles: ["owner", "staff"],
    },
    {
      title: "My Clients",
      href: `/admin/${adminRole}/myclients`,
      icon: Users,
      roles: ["owner", "staff"],
    },
    {
      title: "Client Keys",
      href: `/admin/${adminRole}/generateClientKey`,
      icon: Key,
      roles: ["owner", "staff"],
    },
    {
      title: "Admin Keys",
      href: `/admin/owner/generateAdminKey`,
      icon: UserPlus,
      roles: ["owner"],
    },
    {
      title: "My Work",
      href: `/admin/developer/projects`,
      icon: FileCode,
      roles: ["developer"],
    },
    {
      title: "Settings",
      href: `/admin/settings`,
      icon: Settings,
      roles: ["owner", "staff", "developer"],
    },
  ];

  const filteredItems = navItems.filter((item) =>
    item.roles.includes(adminRole)
  );

  return (
    <aside className="h-screen w-[240px] flex-shrink-0 border-r border-border bg-black flex flex-col selection:bg-primary/30">
      
      {/* LOGO / HEADER */}
      <div className="h-14 px-5 flex flex-col justify-center border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-primary rounded-sm flex items-center justify-center">
            <div className="w-2 h-2 bg-black" />
          </div>
          <h1 className="text-[13px] font-semibold text-foreground tracking-tight">
            Projects Hub
          </h1>
        </div>
      </div>

      {/* USER CONTEXT */}
      <div className="px-3 py-3 border-b border-border">
        <div className="bg-card border border-border rounded-md px-3 py-2 flex flex-col gap-0.5">
          <span className="text-[10px] uppercase font-mono text-muted-foreground tracking-wider">
            Active Role
          </span>
          <span className="text-xs font-medium text-foreground">
            {adminRole.charAt(0).toUpperCase() + adminRole.slice(1)}
          </span>
        </div>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2 rounded-md text-[13px] transition-colors",
                isActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-card hover:text-foreground"
              )}
            >
              <item.icon
                className={cn(
                  "w-4 h-4 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              <span className="truncate">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-[11px] font-mono">System Online</span>
        </div>
      </div>
    </aside>
  );
}
