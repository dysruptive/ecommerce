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

interface SaleSectionProps {
  products: ProductItem[];
}

export function SaleSection({ products }: SaleSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-14">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-2 inline-block rounded-full bg-red-500 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
          Sale
        </div>
        <div className="mb-8 flex items-end justify-between">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            Reduced Prices
          </h2>
          <Link
            href="/products"
            className="text-sm font-bold uppercase tracking-wider hover:underline"
            style={{ color: "var(--store-primary)" }}
          >
            Shop Sale →
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
