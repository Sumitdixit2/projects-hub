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

interface SidebarProps {
  role: "admin" | "client";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);

  const adminRole = user?.role || "guest"; // prevent crash

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
    <aside className="h-screen w-[260px] border-r bg-white flex flex-col">
      
      {/* LOGO / HEADER */}
      <div className="px-6 py-5 border-b">
        <h1 className="text-lg font-bold tracking-wide text-[#0e141b]">
          Projects Hub
        </h1>
        <p className="text-xs text-gray-500 mt-1">
          Role:{" "}
          <span className="font-semibold text-gray-700">
            {adminRole.toUpperCase()}
          </span>
        </p>
      </div>

      {/* NAV ITEMS */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {filteredItems.map((item) => {
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all",
                isActive
                  ? "bg-[#0e141b] text-white shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-black"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5",
                  isActive ? "text-white" : "text-gray-400"
                )}
              />
              <span className="font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER */}
      <div className="p-4 border-t text-xs text-gray-400">
        © {new Date().getFullYear()} Projects Hub
      </div>
    </aside>
  );
}
