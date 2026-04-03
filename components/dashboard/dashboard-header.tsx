"use client";

import { Menu, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "@/components/dashboard/sidebar";

interface DashboardHeaderProps {
  storeName: string;
  userName: string;
  userEmail: string;
  primaryColor: string;
}

export function DashboardHeader({
  storeName,
  userName,
  userEmail,
  primaryColor,
}: DashboardHeaderProps) {
  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "?";

  return (
    <header
      className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[#E5E2DB] bg-white px-5"
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
    >
      {/* Mobile menu */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden h-9 w-9 text-[#78716C] hover:bg-[#F5F3EE] hover:text-[#1C1917]"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-56 p-0 border-r-0">
          <AdminSidebar storeName={storeName} primaryColor={primaryColor} />
        </SheetContent>
      </Sheet>

      <div className="flex-1" />

      {/* User menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors hover:bg-[#F5F3EE]">
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
              style={{ backgroundColor: primaryColor }}
            >
              {initials}
            </div>
            <span className="hidden font-medium text-[#1C1917] sm:block">
              {userName}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-52 border-[#E5E2DB] shadow-sm"
        >
          <DropdownMenuLabel className="font-normal py-2">
            <p className="text-xs text-[#78716C] truncate">{userEmail}</p>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#E5E2DB]" />
          <form action="/api/auth/signout" method="POST">
            <DropdownMenuItem asChild>
              <button
                type="submit"
                className="w-full cursor-pointer text-sm text-[#78716C] hover:text-[#1C1917]"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </button>
            </DropdownMenuItem>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
