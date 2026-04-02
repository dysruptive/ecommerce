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

interface BestsellersProps {
  products: ProductItem[];
}

export function Bestsellers({ products }: BestsellersProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-yellow-50 py-12">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-green-900">Our Bestsellers</h2>
          <Link href="/products" className="text-sm font-semibold text-green-700 hover:underline">
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
