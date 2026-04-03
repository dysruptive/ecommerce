"use client";

import { useState } from "react";
import Link from "next/link";
import { ProductImage } from "@/components/store/product-image";
import { Heart } from "lucide-react";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface PicksForYouProps {
  products: ProductItem[];
}

const TABS = ["Best Sellers", "New Arrivals", "On Sale"] as const;
type Tab = (typeof TABS)[number];

function PickProductCard({ product }: { product: ProductItem }) {
  const hasDiscount =
    product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : null;

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group relative flex flex-col overflow-hidden border border-gray-100 bg-white transition-shadow hover:shadow-md"
    >
      {/* Discount badge */}
      {discount && (
        <span className="absolute left-2 top-2 z-10 bg-red-500 px-1.5 py-0.5 text-[10px] font-black text-white">
          -{discount}%
        </span>
      )}

      {/* Wishlist */}
      <button
        onClick={(e) => e.preventDefault()}
        className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm transition-colors hover:bg-red-50"
        aria-label="Save to wishlist"
      >
        <Heart className="h-3.5 w-3.5 text-gray-400 transition-colors hover:text-red-500" />
      </button>

      {/* Image */}
      <ProductImage
        url={product.imageUrl}
        alt={product.name}
        className="aspect-square w-full"
        imageClassName="transition-transform group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />

      {/* Details */}
      <div className="p-3">
        <p className="line-clamp-2 text-[12px] font-medium leading-snug text-gray-800">
          {product.name}
        </p>
        <div className="mt-1.5 flex items-baseline gap-1.5">
          <span className="text-sm font-black text-gray-900">
            ₵{product.price.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[11px] text-gray-400 line-through">
              ₵{product.compareAtPrice!.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function PicksForYou({ products }: PicksForYouProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Best Sellers");

  if (products.length === 0) return null;

  const filtered =
    activeTab === "On Sale"
      ? products.filter((p) => p.compareAtPrice && p.compareAtPrice > p.price)
      : products.slice(0, 8);

  return (
    <section className="bg-[#f7f7f7] py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header with tabs */}
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-3">
          <h2 className="text-lg font-black text-gray-900">Picks for You</h2>
          <div className="flex flex-wrap gap-2">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-[12px] font-semibold transition-colors ${
                  activeTab === tab
                    ? "bg-gray-900 text-white"
                    : "border border-gray-300 bg-white text-gray-600 hover:border-gray-900 hover:text-gray-900"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Product grid */}
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400">No products in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((p) => (
              <PickProductCard key={p.id} product={p} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/products"
            className="inline-flex items-center border border-gray-300 bg-white px-8 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-900 hover:text-gray-900"
          >
            View All Frames →
          </Link>
        </div>
      </div>
    </section>
  );
}
