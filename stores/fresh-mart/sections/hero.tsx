import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-green-700 py-20 text-white">
      {/* decorative blobs */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-green-600/40" />
      <div className="absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-yellow-400/20" />

      <div className="relative mx-auto max-w-4xl px-4 text-center">
        <span className="mb-4 inline-block rounded-full bg-yellow-400 px-4 py-1 text-sm font-bold text-green-900">
          🌾 Fresh. Local. Delivered.
        </span>
        <h1 className="mt-3 text-4xl font-extrabold leading-tight sm:text-6xl">
          Ghana&apos;s Freshest<br />Groceries, At Your Door
        </h1>
        <p className="mt-5 text-lg text-green-100">
          Farm-to-table produce, pantry staples, and beverages — delivered same day across Accra.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/products"
            className="rounded-md bg-yellow-400 px-8 py-3 text-base font-bold text-green-900 transition-opacity hover:opacity-90"
          >
            Shop Now
          </Link>
          <Link
            href="/products"
            className="rounded-md border-2 border-white/60 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-white/10"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
