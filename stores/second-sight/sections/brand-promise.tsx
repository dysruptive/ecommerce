const PILLARS = [
  {
    num: "01",
    heading: "Prescription Ready",
    body: "Every frame is fitted to your exact prescription — single vision, bifocal, or progressive.",
  },
  {
    num: "02",
    heading: "Titanium & Acetate",
    body: "Premium materials selected for weight, durability, and comfort. Frames built to hold their shape for years.",
  },
  {
    num: "03",
    heading: "Blue Light Protection",
    body: "Purpose-built lenses that filter digital screen glare, reducing eye strain through long working hours.",
  },
];

export function BrandStory() {
  return (
    <>
      {/* Craft section */}
      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid grid-cols-1 items-start gap-16 lg:grid-cols-12">

            {/* Left — text */}
            <div className="lg:col-span-5">
              <div className="mb-6 flex items-center gap-4">
                <div className="h-px w-8 bg-[#6c5e06]" />
                <span
                  className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#6c5e06]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Our Craft
                </span>
              </div>
              <h2
                className="text-4xl font-bold leading-tight text-[#1a1c1b] md:text-5xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                Precision Made.<br />Built to Last.
              </h2>
              <p
                className="mt-7 text-sm leading-[1.8] text-[#5f5e5e]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Every Second Sight frame goes through a rigorous quality process using premium acetate and lightweight titanium alloys. We believe great eyewear should be an investment — pieces you reach for every day, year after year.
              </p>
            </div>

            {/* Right — numbered pillars */}
            <div className="lg:col-span-7">
              {PILLARS.map((item) => (
                <div
                  key={item.num}
                  className="flex gap-8 border-t border-[#cdc6b3]/50 py-8 last:border-b"
                >
                  <span
                    className="flex-none text-sm font-bold tabular-nums text-[#cdc6b3]"
                    style={{ fontFamily: "var(--font-manrope)" }}
                  >
                    {item.num}
                  </span>
                  <div>
                    <h3
                      className="text-lg font-bold text-[#1a1c1b]"
                      style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                      {item.heading}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed text-[#5f5e5e]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      {item.body}
                    </p>
                  </div>
                </div>
              ))}
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
          <p
            className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[#c5b358]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            — Second Sight Eyewear
          </p>
        </div>
      </section>
    </>
  );
}
