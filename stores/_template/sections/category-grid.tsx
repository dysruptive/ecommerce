import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
}

interface CategoryGridProps {
  categories: Category[];
}

export function CategoryGrid({ categories }: CategoryGridProps) {
  if (categories.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <h2 className="mb-6 text-2xl font-bold">Shop by Category</h2>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="rounded-full border-2 px-5 py-2 text-sm font-semibold transition-colors hover:text-white"
            style={{
              borderColor: "var(--store-primary)",
              color: "var(--store-primary)",
            }}
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
