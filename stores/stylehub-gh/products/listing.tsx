"use client";

import { useState } from "react";
import Link from "next/link";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductImage } from "@/components/store/product-image";
import { Search } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

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

function StyleHubFilters({
  categories,
  filters,
}: {
  categories: { slug: string; name: string }[];
  filters: Props["filters"];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.q ?? "");

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    value ? p.set(key, value) : p.delete(key);
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      {/* Category tabs */}
      <button
        onClick={() => setParam("category", "")}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${!filters.category ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          onClick={() => setParam("category", c.slug)}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${filters.category === c.slug ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"}`}
        >
          {c.name}
        </button>
      ))}
      {/* Search */}
      <form
        onSubmit={(e) => { e.preventDefault(); setParam("q", query); }}
        className="relative ml-auto"
      >
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
        />
      </form>
    </div>
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
