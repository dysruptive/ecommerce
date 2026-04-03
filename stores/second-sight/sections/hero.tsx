import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/stores/second-sight/hero.png"
          alt="Second Sight premium eyewear"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#1a1c1b]/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 py-32 lg:px-8 lg:py-0">
        <div className="max-w-2xl">
          <span
            className="text-xs font-semibold uppercase tracking-[0.2em] text-[#6c5e06]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            New Season Premiere
          </span>
          <h1
            className="mt-5 text-6xl font-bold leading-[0.95] tracking-tight text-[#1a1c1b] md:text-8xl lg:text-[6rem]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            The Clarity<br />Collection
          </h1>
          <p className="mt-7 max-w-md text-base leading-relaxed text-[#5f5e5e]">
            Precision frames for every story. Prescription lenses, statement sunglasses, and blue-light protection — crafted for Accra.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/products"
              className="inline-flex items-center bg-[#6c5e06] px-8 py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
            >
              SHOP COLLECTION
            </Link>
            <Link
              href="/products?category=prescription-frames"
              className="inline-flex items-center border border-[#cdc6b3]/60 px-8 py-3.5 text-sm font-medium tracking-wide text-[#1a1c1b] transition-colors hover:bg-[#f4f4f2]"
            >
              OPTICAL FRAMES
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
