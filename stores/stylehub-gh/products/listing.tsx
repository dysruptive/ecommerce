import Link from "next/link";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductImage } from "@/components/store/product-image";
import { StyleHubFilters } from "./filters";

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

function StyleHubProductCard({ product }: { product: ProductItem }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : null;

  return (
    <Link href={`/products/${product.slug}`} className="group flex flex-col">
      <div className="relative overflow-hidden bg-zinc-100">
        <ProductImage
          url={product.imageUrl}
          alt={product.name}
          className="aspect-[3/4] w-full"
          imageClassName="transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {discount && (
          <span className="absolute right-2 top-2 bg-white px-2 py-0.5 text-[10px] font-black text-zinc-900">
            -{discount}%
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 translate-y-full bg-zinc-900 py-2.5 text-center text-xs font-bold uppercase tracking-wider text-white transition-transform duration-200 group-hover:translate-y-0">
          Quick View
        </div>
      </div>
      <div className="mt-2.5 px-0.5">
        <p className="line-clamp-1 text-sm font-semibold text-zinc-900">{product.name}</p>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-sm font-black text-zinc-900">₵{product.price.toFixed(2)}</span>
          {hasDiscount && (
            <span className="text-xs text-zinc-400 line-through">₵{product.compareAtPrice!.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  );
}


export function StyleHubProductsListing({ tenant, products, categories, filters }: Props) {
  return (
    <StoreLayout tenant={tenant}>
      {/* Header banner */}
      <div className="border-b border-zinc-200 bg-white px-4 py-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-zinc-400">
            {new Date().getFullYear()} Collection
          </p>
          <h1 className="mt-1 text-4xl font-black uppercase tracking-tight text-zinc-900">
            {filters.category
              ? categories.find((c) => c.slug === filters.category)?.name ?? "Collection"
              : "All Styles"}
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-8">
        <StyleHubFilters categories={categories} filters={filters} />

        {products.length === 0 ? (
          <p className="mt-12 text-center text-zinc-400">No styles found.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => <StyleHubProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
