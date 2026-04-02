import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

export function CategoryShowcase({ categories }: CategoryShowcaseProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-14">
      <h2 className="mb-8 text-center text-3xl font-black uppercase tracking-tight">
        Shop by Category
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {categories.map((cat, i) => {
          // Alternate between accent and dark backgrounds for visual rhythm
          const isDark = i % 3 === 2;
          return (
            <Link
              key={cat.id}
              href={`/products?category=${cat.slug}`}
              className="group relative flex min-h-[140px] items-end overflow-hidden rounded-lg p-6 transition-transform hover:-translate-y-0.5"
              style={{
                backgroundColor: isDark ? "var(--store-primary)" : "var(--store-accent)",
                color: "white",
              }}
            >
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest opacity-70">
                  Explore
                </p>
                <p className="mt-1 text-xl font-black uppercase">{cat.name}</p>
              </div>
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-4xl font-black opacity-10 transition-opacity group-hover:opacity-20">
                →
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
