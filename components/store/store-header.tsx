"use client";

import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";

interface StoreHeaderProps {
  storeName: string;
  logoUrl?: string | null;
}

export function StoreHeader({ storeName, logoUrl }: StoreHeaderProps) {
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            {logoUrl ? (
              <Image
                src={logoUrl}
                alt={storeName}
                width={40}
                height={40}
                className="h-10 w-10 rounded-md object-cover"
              />
            ) : null}
            {storeName}
          </Link>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          <Link
            href="/"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Home
          </Link>
          <Link
            href="/products"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            Products
          </Link>
        </nav>

        <Link href="/cart" className="relative">
          <ShoppingBag className="h-5 w-5" />
          {itemCount > 0 && (
            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--store-primary)] text-[10px] font-bold text-white">
              {itemCount}
            </span>
          )}
        </Link>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="border-t px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-2">
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Home
            </Link>
            <Link
              href="/products"
              onClick={() => setMobileOpen(false)}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Products
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
