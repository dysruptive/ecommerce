import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

const CELL_STYLES = [
  { bg: "bg-[#e8e8e6]" },
  { bg: "bg-[#d4cfc4]" },
  { bg: "bg-[#dddbe8]" },
];

export function BentoCategories({ categories }: { categories: Category[] }) {
  if (categories.length === 0) return null;

  const items = categories.slice(0, 3);
  const [primary, ...rest] = items;

  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1440px]">

        {/* Section label */}
        <div className="mb-10 flex items-center gap-4">
          <div className="h-px w-8 bg-[#6c5e06]" />
          <span
            className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#6c5e06]"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            Shop by Category
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 lg:h-[620px]">

          {/* Primary tile — 7 cols */}
          <Link
            href={`/products?category=${primary.slug}`}
            className={`group relative min-h-[300px] overflow-hidden md:col-span-7 ${CELL_STYLES[0].bg}`}
          >
            {/* Ghost ordinal */}
            <span
              aria-hidden="true"
              className="absolute right-6 top-4 select-none font-bold leading-none text-[#1a1c1b]/[0.07]"
              style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(8rem, 14vw, 16rem)" }}
            >
              01
            </span>
            {/* Content */}
            <div className="absolute bottom-10 left-10">
              <h3
                className="text-4xl font-bold leading-tight text-[#1a1c1b] md:text-5xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {primary.name}
              </h3>
              <div className="mt-4 flex items-center gap-1.5">
                <span
                  className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#6c5e06]"
                  style={{ fontFamily: "var(--font-manrope)" }}
                >
                  Explore
                </span>
                <span className="text-[#6c5e06] transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </div>
          </Link>

          {/* Secondary tiles — 5 cols, stacked */}
          <div className="flex flex-col gap-4 md:col-span-5">
            {rest.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group relative min-h-[140px] flex-1 overflow-hidden ${CELL_STYLES[i + 1]?.bg ?? CELL_STYLES[1].bg}`}
              >
                {/* Ghost ordinal */}
                <span
                  aria-hidden="true"
                  className="absolute right-5 top-3 select-none font-bold leading-none text-[#1a1c1b]/[0.07]"
                  style={{ fontFamily: "var(--font-noto-serif)", fontSize: "clamp(5rem, 8vw, 9rem)" }}
                >
                  0{i + 2}
                </span>
                {/* Content */}
                <div className="absolute bottom-7 left-8">
                  <h3
                    className="text-2xl font-bold leading-tight text-[#1a1c1b] md:text-3xl"
                    style={{ fontFamily: "var(--font-noto-serif)" }}
                  >
                    {cat.name}
                  </h3>
                  <div className="mt-2 flex items-center gap-1.5">
                    <span
                      className="text-[10px] font-bold uppercase tracking-[0.28em] text-[#6c5e06]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      Explore
                    </span>
                    <span className="text-[#6c5e06] transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
