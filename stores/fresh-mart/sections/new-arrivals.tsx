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
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Just Arrived</h2>
        <Link href="/products?sort=newest" className="text-sm font-semibold text-green-700 hover:underline">
          See More →
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
    </section>
  );
}
