export function BrandStory() {
  return (
    <>
      {/* Editorial brand story */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-12">
            {/* Text — 5 cols */}
            <div className="lg:col-span-5">
              <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#6c5e06]">
                Our Craft
              </span>
              <h2
                className="mt-5 text-4xl font-bold leading-tight text-[#1a1c1b] md:text-5xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                Precision Made. Built to Last.
              </h2>
              <p className="mt-7 text-base leading-relaxed text-[#5f5e5e]">
                Every Second Sight frame goes through a rigorous quality process using premium acetate and lightweight titanium alloys. We believe great eyewear should be an investment — pieces you reach for every day, year after year.
              </p>
            </div>

            {/* Tonal image block — 7 cols */}
            <div className="grid grid-cols-2 gap-5 lg:col-span-7">
              <div className="aspect-[4/5] bg-[#e8e8e6] pt-16">
                <div className="h-full w-full bg-[#dddbd6]" />
              </div>
              <div className="aspect-[4/5] bg-[#d4cfc4]" />
            </div>
          </div>
        </div>
      </section>

      {/* Dark quote section */}
      <section className="bg-[#1a1c1b] px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <blockquote
            className="text-3xl font-bold italic leading-tight text-[#f9f9f7] md:text-4xl lg:text-5xl"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            &ldquo;See the world through the right lens.&rdquo;
          </blockquote>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.25em] text-[#c5b358]">
            — Second Sight Eyewear, Accra
          </p>
        </div>
      </section>
    </>
  );
}
