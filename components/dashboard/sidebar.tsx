"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MapPin,
  Tags,
  Settings,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/delivery-zones", label: "Delivery", icon: MapPin },
  { href: "/admin/discounts", label: "Discounts", icon: Tags },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

interface AdminSidebarProps {
  storeName: string;
  primaryColor: string;
}

export function AdminSidebar({ storeName, primaryColor }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className="flex h-full flex-col border-r border-[#E5E2DB] bg-[#EFEDE8]"
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
    >
      {/* Brand */}
      <div className="flex h-14 items-center gap-3 border-b border-[#E5E2DB] px-5">
        <div
          className="h-6 w-6 shrink-0 rounded"
          style={{ backgroundColor: primaryColor }}
        />
        <span className="truncate text-sm font-semibold text-[#1C1917]">
          {storeName}
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-widest text-[#A8A29E]">
          Store
        </p>
        <div className="space-y-0.5">
          {navItems.map((item) => {
            const isActive = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#FEF3C7] text-[#92400E]"
                    : "text-[#78716C] hover:bg-[#E5E0D8] hover:text-[#1C1917]",
                )}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    isActive ? "text-[#B45309]" : "",
                  )}
                />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

// Backward-compat alias (used by mobile sheet in header)
export { AdminSidebar as Sidebar };
