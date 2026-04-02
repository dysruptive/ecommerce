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
      <h2 className="mb-6 text-2xl font-bold text-green-900">Shop by Category</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className="group flex items-center justify-center rounded-xl border-2 border-green-100 bg-green-50 px-4 py-5 text-center text-sm font-semibold text-green-800 transition-all hover:border-green-600 hover:bg-green-700 hover:text-white"
          >
            {cat.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
