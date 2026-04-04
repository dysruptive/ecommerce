import Image from "next/image"
import Link from "next/link"

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
        .ss-image { animation: ssImageReveal 1.6s cubic-bezier(0.16,1,0.3,1) both; }
        .ss-a1    { animation: ssFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s both; }
        .ss-a2    { animation: ssFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.52s both; }
        .ss-a3    { animation: ssFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.68s both; }
        .ss-a4    { animation: ssFadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.84s both; }
      `}</style>

      <section className="flex min-h-svh flex-col overflow-hidden bg-[#f0ede8] lg:flex-row">
        {/* ── Image panel ───────────────────────────────────── */}
        <div className="relative h-[62vw] max-h-[72vh] min-h-[300px] flex-none lg:h-auto lg:max-h-none lg:w-[56%]">
          <div className="ss-image relative h-full w-full">
            <Image
              src="/stores/second-sight/hero.png"
              alt="Second Sight premium eyewear"
              fill
              className="object-cover object-center"
              priority
              sizes="(max-width: 1024px) 100vw, 56vw"
            />
          </div>
          {/* Mobile fade into cream panel */}
          <div className="absolute right-0 bottom-0 left-0 h-20 bg-gradient-to-t from-[#f0ede8] to-transparent lg:hidden" />
          {/* Desktop right-edge vignette */}
          <div className="absolute inset-y-0 right-0 hidden w-24 bg-gradient-to-l from-[#f0ede8]/30 to-transparent lg:block" />
        </div>

        {/* ── Editorial content panel ───────────────────────── */}
        <div className="relative flex flex-1 flex-col justify-center overflow-hidden px-8 pt-4 pb-16 lg:px-14 lg:py-28 xl:px-20">
          {/* Ghost "II" — Roman numeral for "Second" */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 -right-4 -translate-y-1/2 leading-none font-bold text-[#1a1c1b]/[0.04] select-none lg:-right-8"
            style={{
              fontFamily: "var(--font-noto-serif)",
              fontSize: "clamp(14rem, 28vw, 26rem)",
            }}
          >
            II
          </span>

          <div className="relative">
            {/* Three-weight headline */}
            <h1
              className="ss-a1 leading-[0.9] tracking-tight text-[#1a1c1b]"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              <span
                className="block font-normal text-[#1a1c1b]/45 italic"
                style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.2rem)" }}
              >
                Frames
              </span>
              <span
                className="block font-bold"
                style={{ fontSize: "clamp(3.4rem, 7vw, 6.4rem)" }}
              >
                Worth
              </span>
              <span
                className="block font-normal"
                style={{ fontSize: "clamp(2rem, 4vw, 3.6rem)" }}
              >
                Seeing
              </span>
            </h1>

            {/* Divider */}
            <div className="ss-a2 mt-8 h-px w-full bg-[#cdc6b3]/60" />

            {/* Body */}
            <p
              className="ss-a3 mt-6 max-w-xs text-sm leading-[1.75] text-[#5f5e5e]"
              style={{ fontFamily: "var(--font-manrope)" }}
            >
              Prescription lenses, statement sunglasses, and blue-light
              protection.
            </p>

            {/* CTAs */}
            <div className="ss-a4 mt-9 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2.5 bg-[#6c5e06] px-7 py-3.5 text-[11px] font-bold tracking-[0.22em] text-white uppercase transition-opacity hover:opacity-90"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Shop Frames
                <span className="transition-transform duration-200 group-hover:translate-x-1">
                  →
                </span>
              </Link>
              {/* <Link
                href="/products?category=prescription-frames"
                className="inline-flex items-center border border-[#1a1c1b]/25 px-7 py-3.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[#1a1c1b] transition-colors hover:border-[#1a1c1b] hover:bg-[#1a1c1b] hover:text-white"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Optical Frames
              </Link> */}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
