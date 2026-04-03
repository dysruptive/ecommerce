import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface BentoGridProps {
  categories: Category[];
}

const TONAL_BACKGROUNDS = [
  "bg-[#e8e8e6]",
  "bg-[#d4cfc4]",
  "bg-[#dddbe8]",
  "bg-[#e2ddd4]",
];

export function BentoCategories({ categories }: BentoGridProps) {
  if (categories.length === 0) return null;

  const items = categories.slice(0, 3);
  const [primary, ...rest] = items;

  return (
    <section className="px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-12 lg:h-[680px]">
          {/* Primary tile — 7 cols */}
          <Link
            href={`/products?category=${primary.slug}`}
            className={`group relative overflow-hidden md:col-span-7 ${TONAL_BACKGROUNDS[0]}`}
          >
            <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.02]" />
            <div className="absolute bottom-10 left-10">
              <h3
                className="text-4xl font-bold text-[#1a1c1b]"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {primary.name}
              </h3>
              <span className="mt-2 inline-block border-b border-[#6c5e06]/40 pb-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6c5e06]">
                Shop Now →
              </span>
            </div>
          </Link>

          {/* Secondary tiles — 5 cols, stacked */}
          <div className="flex flex-col gap-6 md:col-span-5">
            {rest.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={`group relative flex-1 overflow-hidden ${TONAL_BACKGROUNDS[i + 1] ?? TONAL_BACKGROUNDS[1]}`}
              >
                <div className="absolute bottom-7 left-8">
                  <h3
                    className="text-3xl font-bold text-[#1a1c1b]"
                    style={{ fontFamily: "var(--font-noto-serif)" }}
                  >
                    {cat.name}
                  </h3>
                  <span className="mt-1.5 inline-block border-b border-[#6c5e06]/40 pb-0.5 text-xs font-semibold uppercase tracking-[0.18em] text-[#6c5e06]">
                    Shop Now →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
