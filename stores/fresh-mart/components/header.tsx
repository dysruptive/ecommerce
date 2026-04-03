"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X, Leaf } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";

interface HeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Shop" },
  { href: "/products?category=fresh-produce", label: "Fresh Produce" },
  { href: "/products?category=pantry", label: "Pantry" },
  { href: "/products?category=beverages", label: "Beverages" },
];

export function FreshMartHeader({ storeName, logoUrl }: HeaderProps) {
  const { itemCount } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-green-700 text-white shadow-md">
      {/* Top bar */}
      <div className="border-b border-green-600/60 bg-green-800 px-4 py-1.5 text-center text-[11px] font-medium text-green-200">
        Free delivery on orders over ₵100 within Accra Metro
      </div>

      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          {logoUrl ? (
            <Image src={logoUrl} alt={storeName} width={36} height={36} className="rounded-full object-cover" />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400">
              <Leaf className="h-5 w-5 text-green-900" />
            </div>
          )}
          <span className="text-lg font-extrabold tracking-tight">{storeName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-5 lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="text-sm font-medium text-green-100 transition-colors hover:text-white">
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative flex items-center gap-1.5 rounded-full bg-yellow-400 px-3 py-1.5 text-sm font-bold text-green-900 transition-opacity hover:opacity-90">
            <ShoppingBag className="h-4 w-4" />
            <span>Cart</span>
            {itemCount > 0 && (
              <span className="ml-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-green-800 text-[10px] font-bold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-green-600 bg-green-800 px-4 py-3 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-sm font-medium text-green-100 hover:bg-green-700">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
