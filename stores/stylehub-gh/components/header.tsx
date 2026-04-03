"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

const NAV_LINKS = [
  { href: "/products?category=mens-wear", label: "Men" },
  { href: "/products?category=womens-wear", label: "Women" },
  { href: "/products?category=accessories", label: "Accessories" },
  { href: "/products", label: "All" },
];

export function StyleHubHeader({ storeName, logoUrl }: HeaderProps) {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-zinc-950 text-white">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={32} height={32} className="object-cover" />
          ) : (
            <div className="flex h-8 w-8 items-center justify-center bg-white">
              <span className="text-[10px] font-black uppercase tracking-tighter text-zinc-900">SH</span>
            </div>
          )}
          <span className="text-base font-black uppercase tracking-[0.15em]">{storeName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-xs font-semibold uppercase tracking-[0.15em] text-zinc-400 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-4">
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingBag className="h-5 w-5 text-white" />
            {itemCount > 0 && (
              <span
                className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full text-[9px] font-black text-white"
                style={{ backgroundColor: "var(--store-accent, #f59e0b)" }}
              >
                {itemCount}
              </span>
            )}
          </Link>
          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-zinc-800 bg-zinc-950 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm font-semibold uppercase tracking-wider text-zinc-400 transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
