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
  UserPlus 
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  role: "admin" | "client";
}

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user);
  console.log("user is: ",user);
  
  const adminRole = user?.role; 

  const navItems = [
    {
      title: "Dashboard",
      href: `/admin/${adminRole}/dashboard`,
      icon: LayoutDashboard,
      roles: ["owner", "staff", "developer"],
    },
    {
      title: "Settings",
      href: `/admin/settings`,
      icon: Settings,
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
  ];

  const filteredItems = navItems.filter((item) => 
    item.roles.includes(adminRole || "")
  );

  return (
    <div className="flex flex-col h-full w-full py-6">
      <div className="px-6 mb-8">
        <h1 className="text-xl font-bold text-blue-600 uppercase tracking-wider">
          Projects Hub
        </h1>
        <p className="text-[10px] text-gray-400 font-medium">
          Role: <span className="text-gray-600">{adminRole?.toUpperCase()}</span>
        </p>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 group",
                isActive 
                  ? "bg-blue-50 text-blue-600" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <item.icon className={cn(
                "w-5 h-5",
                isActive ? "text-blue-600" : "text-gray-400 group-hover:text-gray-900"
              )} />
              <span className="text-sm font-medium">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
