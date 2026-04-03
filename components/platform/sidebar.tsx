"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Store, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/platform", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/platform/stores", label: "Stores", icon: Store, exact: false },
];

interface PlatformSidebarProps {
  userName: string;
  userEmail: string;
}

export function PlatformSidebar({ userName, userEmail }: PlatformSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-zinc-900">
      {/* Brand */}
      <div className="flex h-14 items-center gap-2 border-b border-zinc-800 px-5">
        <div className="flex h-6 w-6 items-center justify-center rounded bg-white">
          <Store className="h-3.5 w-3.5 text-zinc-900" />
        </div>
        <span className="text-sm font-semibold text-white">Platform Console</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
          Management
        </p>
        <div className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-zinc-800 text-white"
                    : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-100",
                )}
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* User footer */}
      <div className="border-t border-zinc-800 px-3 py-3">
        <div className="flex items-center justify-between gap-2 rounded-md px-2 py-2">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-zinc-200">{userName}</p>
            <p className="truncate text-[11px] text-zinc-500">{userEmail}</p>
          </div>
          <form action="/api/auth/signout" method="POST">
            <button
              type="submit"
              className="flex h-7 w-7 items-center justify-center rounded text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-zinc-200"
              title="Sign out"
            >
              <LogOut className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
