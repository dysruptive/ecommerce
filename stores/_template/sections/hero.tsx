import Link from "next/link";
import type { Tenant } from "@/types";

interface HeroProps {
  tenant: Tenant;
}

export function Hero({ tenant }: HeroProps) {
  return (
    <section
      className="py-16 text-center"
      style={{ backgroundColor: "var(--store-primary)", color: "white" }}
    >
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          {tenant.name}
        </h1>
        {tenant.description && (
          <p className="mt-4 text-lg opacity-90">{tenant.description}</p>
        )}
        <Link
          href="/products"
          className="mt-8 inline-block rounded-md bg-white px-8 py-3 text-sm font-semibold transition-opacity hover:opacity-90"
          style={{ color: "var(--store-primary)" }}
        >
          Shop Now
        </Link>
      </div>
    </section>
  );
}
