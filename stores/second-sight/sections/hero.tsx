import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <>
      <style>{`
        @keyframes ssImageReveal {
          from { opacity: 0; transform: scale(1.05); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes ssFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ssLineGrow {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
        .ss-image   { animation: ssImageReveal 1.6s cubic-bezier(0.16,1,0.3,1) both; }
        .ss-line    { animation: ssLineGrow   0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both; }
        .ss-a1      { animation: ssFadeUp     0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .ss-a2      { animation: ssFadeUp     0.8s cubic-bezier(0.16,1,0.3,1) 0.52s both; }
        .ss-a3      { animation: ssFadeUp     0.8s cubic-bezier(0.16,1,0.3,1) 0.68s both; }
        .ss-a4      { animation: ssFadeUp     0.8s cubic-bezier(0.16,1,0.3,1) 0.84s both; }
        .ss-a5      { animation: ssFadeUp     0.8s cubic-bezier(0.16,1,0.3,1) 1.00s both; }
      `}</style>

      <section className="flex min-h-svh flex-col overflow-hidden bg-[#f0ede8] lg:flex-row">

        {/* ── Image panel ─────────────────────────────────────────── */}
        <div className="relative h-[62vw] min-h-[300px] max-h-[72vh] flex-none lg:h-auto lg:max-h-none lg:w-[56%]">
          <div className="ss-image relative h-full w-full">
            <Image
              src="/stores/second-sight/hero.png"
              alt="Second Sight premium eyewear — new season frames"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
          </div>
          {/* Mobile fade into cream content panel */}
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#f0ede8] to-transparent lg:hidden" />
          {/* Subtle right edge vignette on desktop */}
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#f0ede8]/30 to-transparent lg:block" />
        </div>

        {/* ── Editorial content panel ─────────────────────────────── */}
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-8 pb-16 pt-4 lg:px-14 xl:px-20 lg:py-28">

          {/* Ghost Roman numeral — "II" = "Second" in Second Sight */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute -right-4 top-1/2 -translate-y-1/2 select-none font-bold leading-none text-[#1a1c1b]/[0.04] lg:-right-8"
            style={{
              fontFamily: "var(--font-noto-serif)",
              fontSize: "clamp(14rem, 28vw, 26rem)",
            }}
          >
            II
          </span>

          <div className="relative">

            {/* Eyebrow */}
            <div className="ss-a1 flex items-center gap-3">
              <span
                className="ss-line block h-px w-8 bg-[#6c5e06]"
                style={{ transformOrigin: "left" }}
              />
              <span
                className="text-[9px] font-bold uppercase tracking-[0.38em] text-[#6c5e06]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Accra&nbsp;·&nbsp;New Season
              </span>
            </div>

            {/* Headline — three-weight typographic rhythm */}
            <h1
              className="ss-a2 mt-6 leading-[0.9] tracking-tight text-[#1a1c1b]"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              <span
                className="block font-normal italic text-[#1a1c1b]/45"
                style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}
              >
                The
              </span>
              <span
                className="block font-bold"
                style={{ fontSize: "clamp(3.4rem, 7vw, 6.4rem)" }}
              >
                Clarity
              </span>
              <span
                className="block font-normal"
                style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
              >
                Collection
              </span>
            </h1>

            {/* Divider */}
            <div className="ss-a3 mt-8 h-px w-full bg-[#cdc6b3]/60" />

            {/* Body */}
            <p
              className="ss-a3 mt-6 max-w-[28rem] text-sm leading-[1.75] text-[#5f5e5e]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Prescription frames, statement sunglasses, and blue-light protection
              — all crafted for Accra&apos;s eye.
            </p>

            {/* CTAs */}
            <div className="ss-a4 mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-[#6c5e06] px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-white transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Shop Collection
                <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
              </Link>
              <Link
                href="/products?category=prescription-frames"
                className="inline-flex items-center border border-[#1a1c1b]/25 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a1c1b] transition-colors hover:border-[#1a1c1b] hover:bg-[#1a1c1b] hover:text-white"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Optical Frames
              </Link>
            </div>

            {/* Trust pillars */}
            <div
              className="ss-a5 mt-12 flex items-center gap-6 border-t border-[#cdc6b3]/50 pt-6"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              {[
                { head: "Prescription", sub: "Ready" },
                { head: "Free", sub: "Accra Delivery" },
                { head: "30-Day", sub: "Returns" },
              ].map((item, i) => (
                <div key={item.sub} className="flex items-center gap-6">
                  <div>
                    <p
                      className="text-[13px] font-bold text-[#1a1c1b]"
                      style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                      {item.head}
                    </p>
                    <p className="mt-0.5 text-[9px] uppercase tracking-[0.2em] text-[#5f5e5e]">
                      {item.sub}
                    </p>
                  </div>
                  {i < 2 && <div className="h-7 w-px bg-[#cdc6b3]/60" />}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
