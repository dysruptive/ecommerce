"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

const NAV = [
  { label: "Collections", href: "/products" },
];

export function SecondSightHeader({ storeName, logoUrl }: HeaderProps) {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header
      className="fixed top-0 z-50 w-full backdrop-blur-xl"
      style={{ backgroundColor: "rgba(249,249,247,0.85)", borderBottom: "1px solid rgba(205,198,179,0.3)" }}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div className="flex items-center gap-10">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-[#1a1c1b]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            {logoUrl ? (
              <Image src={logoUrl} alt={storeName} width={120} height={32} className="object-contain" />
            ) : (
              storeName.toUpperCase()
            )}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 md:flex">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm text-[#1a1c1b]/70 transition-colors hover:text-[#1a1c1b]"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right icons */}
        <div className="flex items-center gap-5">
          <Link href="/products" aria-label="Search" className="text-[#1a1c1b]/70 transition-colors hover:text-[#1a1c1b]">
            <Search className="h-5 w-5" />
          </Link>
          <Link href="/cart" aria-label="Cart" className="relative text-[#1a1c1b]/70 transition-colors hover:text-[#1a1c1b]">
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#6c5e06] text-[9px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden text-[#1a1c1b]" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-[#cdc6b3]/30 bg-[#f9f9f7] px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="py-2.5 text-sm text-[#1a1c1b]/70 transition-colors hover:text-[#1a1c1b]"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
