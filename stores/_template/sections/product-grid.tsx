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

interface ProductGridProps {
  products: ProductItem[];
  title?: string;
}

export function ProductGrid({ products, title = "Latest Products" }: ProductGridProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link
          href="/products"
          className="text-sm font-semibold hover:underline"
          style={{ color: "var(--store-primary)" }}
        >
          View All →
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="text-muted-foreground">No products yet.</p>
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
    </section>
  );
}
