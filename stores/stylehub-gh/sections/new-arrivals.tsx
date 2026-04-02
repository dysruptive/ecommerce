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

interface NewArrivalsProps {
  products: ProductItem[];
}

export function NewArrivals({ products }: NewArrivalsProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-zinc-50 py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-400">
              Just Dropped
            </p>
            <h2 className="mt-1 text-3xl font-black uppercase tracking-tight">
              New Arrivals
            </h2>
          </div>
          <Link
            href="/products"
            className="text-sm font-bold uppercase tracking-wider hover:underline"
            style={{ color: "var(--store-primary)" }}
          >
            View All →
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
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
      </div>
    </section>
  );
}
