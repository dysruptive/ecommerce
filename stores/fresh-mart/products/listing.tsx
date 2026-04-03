import Link from "next/link";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductImage } from "@/components/store/product-image";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface Props {
  tenant: Tenant;
  products: ProductItem[];
  categories: { slug: string; name: string }[];
  filters: { category?: string; q?: string; sort?: string };
}

function FreshMartProductCard({ product }: { product: ProductItem }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col overflow-hidden rounded-xl border border-green-100 bg-white transition-shadow hover:shadow-md">
      <div className="relative">
        <ProductImage
          url={product.imageUrl}
          alt={product.name}
          className="aspect-square w-full"
          imageClassName="transition-transform group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasDiscount && (
          <span className="absolute left-2 top-2 rounded-full bg-yellow-400 px-2 py-0.5 text-[10px] font-black text-green-900">
            SALE
          </span>
        )}
      </div>
      <div className="p-3">
        <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-800">{product.name}</p>
        <div className="mt-1.5 flex items-baseline gap-2">
          <span className="font-bold text-green-700">₵{product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-xs text-gray-400 line-through">₵{product.compareAtPrice!.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function FreshMartProductsListing({ tenant, products, categories, filters }: Props) {
  return (
    <StoreLayout tenant={tenant}>
      {/* Hero banner */}
      <div className="bg-green-700 px-4 py-8 text-white">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-300">Fresh Picks</p>
          <h1 className="mt-1 text-3xl font-extrabold">
            {filters.category
              ? categories.find((c) => c.slug === filters.category)?.name ?? "Products"
              : "All Products"}
          </h1>
          <p className="mt-1 text-sm text-green-200">Farm-fresh, locally sourced, delivered to your door.</p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <ProductFilters
          categories={categories}
          currentCategory={filters.category}
          currentSort={filters.sort}
          currentQuery={filters.q}
        />

        {products.length === 0 ? (
          <p className="mt-12 text-center text-gray-400">No products found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <FreshMartProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
