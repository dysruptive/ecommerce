import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-900 py-24 text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950" />
      <div className="relative mx-auto max-w-5xl px-4">
        <div className="max-w-2xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.3em] text-zinc-400">
            New Season — 2026 Collection
          </p>
          <h1 className="text-5xl font-black leading-none tracking-tight sm:text-7xl">
            STYLE<br />
            <span style={{ color: "var(--store-accent)" }}>STARTS</span><br />
            HERE.
          </h1>
          <p className="mt-6 max-w-md text-base text-zinc-300">
            Curated fashion for the modern Ghanaian. Men&apos;s wear, women&apos;s wear, and accessories —
            all in one place.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-none bg-white px-8 py-3 text-sm font-bold uppercase tracking-wider text-zinc-900 transition-opacity hover:opacity-90"
            >
              Shop Collection
            </Link>
            <Link
              href="/products?category=new-arrivals"
              className="rounded-none border border-white/30 px-8 py-3 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-white/10"
            >
              New Arrivals
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
