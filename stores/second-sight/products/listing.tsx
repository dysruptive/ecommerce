"use client";

import Link from "next/link";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Search } from "lucide-react";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductImage } from "@/components/store/product-image";
import { SecondSightFontProvider } from "../font-provider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

const triggerCls =
  "h-10 rounded-none border-[#cdc6b3]/60 bg-[#f9f9f7] text-sm text-[#1a1c1b] focus:ring-0 focus:border-[#6c5e06] data-[placeholder]:text-[#5f5e5e]/60";
const contentCls =
  "rounded-none border-[#cdc6b3]/60 bg-[#f9f9f7] p-0 shadow-sm backdrop-blur-none";
const itemCls =
  "rounded-none text-sm text-[#1a1c1b] cursor-pointer data-[highlighted]:!bg-[#f0ede8] data-[highlighted]:!text-[#1a1c1b] [&[data-highlighted]_*]:!text-[#1a1c1b]";

function Filters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
}: {
  categories: { slug: string; name: string }[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery ?? "");
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* Search */}
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", query);
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f5e5e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search frames..."
          className="h-10 w-full border border-[#cdc6b3]/60 bg-[#f9f9f7] pl-9 pr-4 text-sm text-[#1a1c1b] placeholder:text-[#5f5e5e]/60 focus:border-[#6c5e06] focus:outline-none"
        />
      </form>

      {/* Category — only render after mount to avoid Radix ID mismatch */}
      {mounted && categories.length > 0 && (
        <Select
          value={currentCategory ?? "all"}
          onValueChange={(v) => updateParam("category", v === "all" ? "" : v)}
        >
          <SelectTrigger className={`w-full sm:w-44 ${triggerCls}`}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all" className={itemCls}>All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug} className={itemCls}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Sort */}
      {mounted && (
        <Select
          value={currentSort ?? "newest"}
          onValueChange={(v) => updateParam("sort", v === "newest" ? "" : v)}
        >
          <SelectTrigger className={`w-full sm:w-44 ${triggerCls}`}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="newest" className={itemCls}>Newest</SelectItem>
            <SelectItem value="price-asc" className={itemCls}>Price: Low to High</SelectItem>
            <SelectItem value="price-desc" className={itemCls}>Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function ProductCard({ product }: { product: ProductItem }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#f0ede8]">
        <ProductImage
          url={product.imageUrl}
          alt={product.name}
          className="h-full w-full"
          imageClassName="transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {hasDiscount && (
          <span className="absolute left-4 top-4 bg-[#1a1c1b] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#f9f9f7]">
            Sale
          </span>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between">
        <h3
          className="text-sm font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
          {product.name}
        </h3>
        <div className="text-right">
          <span className="text-sm font-bold text-[#6c5e06]">
            ₵{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <p className="text-xs text-[#5f5e5e] line-through">
              ₵{product.compareAtPrice!.toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export function SecondSightProductsListing({ tenant, products, categories, filters }: Props) {
  const activeCategory = categories.find((c) => c.slug === filters.category);

  return (
    <SecondSightFontProvider>
      <StoreLayout tenant={tenant}>
        <div className="min-h-screen bg-[#f9f9f7]">
          {/* Page header */}
          <div className="border-b border-[#cdc6b3]/30 px-6 pt-24 pb-8 lg:px-8">
            <div className="mx-auto max-w-[1440px]">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#5f5e5e]">
                {activeCategory ? "Collection" : "All Collections"}
              </span>
              <h1
                className="mt-2 text-4xl font-bold text-[#1a1c1b] md:text-5xl"
                style={{ fontFamily: "var(--font-noto-serif)" }}
              >
                {activeCategory?.name ?? "All Frames"}
              </h1>
              <p className="mt-2 text-sm text-[#5f5e5e]">
                {products.length} {products.length === 1 ? "frame" : "frames"}
              </p>
            </div>
          </div>

          {/* Filters + grid */}
          <div className="px-6 py-10 lg:px-8">
            <div className="mx-auto max-w-[1440px]">
              <Filters
                categories={categories}
                currentCategory={filters.category}
                currentSort={filters.sort}
                currentQuery={filters.q}
              />

              {products.length === 0 ? (
                <p className="mt-20 text-center text-sm text-[#5f5e5e]">
                  No frames available yet.
                </p>
              ) : (
                <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
                  {products.map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </StoreLayout>
    </SecondSightFontProvider>
  );
}
