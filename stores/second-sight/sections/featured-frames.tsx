import Link from "next/link";
import { ProductCard } from "@/components/store/product-card";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface FeaturedFramesProps {
  products: ProductItem[];
}

export function FeaturedFrames({ products }: FeaturedFramesProps) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-stone-900">
              New Arrivals
            </h2>
            <p className="mt-2 text-stone-500">
              Just landed. Designed to be worn daily.
            </p>
          </div>
          <Link
            href="/products"
            className="hidden text-sm font-semibold text-amber-600 underline-offset-4 hover:underline sm:block"
          >
            View all frames →
          </Link>
        </div>

        {products.length === 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-stone-200" />
                <div className="mt-3 h-4 w-3/4 rounded bg-stone-200" />
                <div className="mt-2 h-4 w-1/3 rounded bg-stone-200" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        )}

        <div className="mt-8 sm:hidden">
          <Link
            href="/products"
            className="block text-center text-sm font-semibold text-amber-600 underline-offset-4 hover:underline"
          >
            View all frames →
          </Link>
        </div>
      </div>
    </section>
  );
}
