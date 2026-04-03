import Link from "next/link";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-stone-900 text-stone-50">
      {/* Subtle dot-grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid min-h-screen grid-cols-1 items-center gap-12 py-24 lg:grid-cols-2 lg:py-0">
          {/* Text side */}
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
              Eyewear for every story
            </p>
            <h1 className="mt-6 text-6xl font-bold leading-[1.05] tracking-tight lg:text-7xl">
              See
              <br />
              beyond.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-stone-400">
              Premium frames at prices that make sense. Whether you need
              prescription lenses or a new look — we have a pair with your name
              on it.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="inline-flex items-center bg-amber-600 px-8 py-4 text-sm font-semibold text-white transition-colors hover:bg-amber-500"
              >
                Browse Collections
              </Link>
              <Link
                href="/products"
                className="inline-flex items-center border border-stone-600 px-8 py-4 text-sm font-semibold text-stone-300 transition-colors hover:border-stone-400 hover:text-stone-50"
              >
                Find Your Frame
              </Link>
            </div>
          </div>

          {/* Visual side */}
          <div className="flex items-center justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-8 rounded-full border border-stone-700/50" />
              <div className="relative flex h-80 w-80 items-center justify-center overflow-hidden rounded-full bg-stone-800 lg:h-96 lg:w-96">
                {/* Glasses outline — replaced by real product photo when available */}
                <svg
                  viewBox="0 0 240 96"
                  className="w-52 opacity-25"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="3"
                    y="3"
                    width="96"
                    height="64"
                    rx="24"
                    stroke="white"
                    strokeWidth="5"
                  />
                  <rect
                    x="141"
                    y="3"
                    width="96"
                    height="64"
                    rx="24"
                    stroke="white"
                    strokeWidth="5"
                  />
                  <path d="M99 35 L141 35" stroke="white" strokeWidth="5" />
                  <path d="M3 35 L-14 22" stroke="white" strokeWidth="5" />
                  <path d="M237 35 L254 22" stroke="white" strokeWidth="5" />
                </svg>
              </div>
              <div className="absolute -bottom-4 -right-4 bg-amber-600 px-4 py-2 text-xs font-bold text-white">
                From ₵299
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-stone-600">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="h-8 w-px bg-stone-700" />
      </div>
    </section>
  );
}
