"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { ProductImage } from "@/components/store/product-image";

export function SecondSightCartContent() {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p
          className="text-3xl font-bold text-[#1a1c1b]"
          style={{ fontFamily: "var(--font-noto-serif)" }}
        >
          Your cart is empty
        </p>
        <p className="mt-4 text-sm text-[#5f5e5e]">
          Browse the collection and find your frames.
        </p>
        <Link
          href="/products"
          className="mt-8 inline-flex items-center bg-[#6c5e06] px-8 py-3 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
        >
          SHOP COLLECTION
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      {/* Items */}
      <div className="lg:col-span-7">
        <div className="divide-y divide-[#cdc6b3]/30">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId ?? ""}`}
              className="flex gap-6 py-8"
            >
              <div className="h-28 w-20 shrink-0 overflow-hidden bg-[#f0ede8]">
                <ProductImage
                  url={item.imageUrl}
                  alt={item.name}
                  className="h-full w-full"
                  imageClassName="object-cover"
                />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between">
                  <h3
                    className="text-base font-bold text-[#1a1c1b]"
                    style={{ fontFamily: "var(--font-noto-serif)" }}
                  >
                    {item.name}
                  </h3>
                  <button
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="text-[#5f5e5e] transition-colors hover:text-[#1a1c1b]"
                    aria-label="Remove"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 border border-[#cdc6b3]/50">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1, item.variantId)}
                      className="flex h-8 w-8 items-center justify-center text-[#1a1c1b] transition-colors hover:bg-[#f0ede8]"
                      aria-label="Decrease"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-6 text-center text-sm text-[#1a1c1b]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1, item.variantId)}
                      className="flex h-8 w-8 items-center justify-center text-[#1a1c1b] transition-colors hover:bg-[#f0ede8]"
                      aria-label="Increase"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <span className="text-sm font-bold text-[#6c5e06]">
                    ₵{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="lg:col-span-5">
        <div className="bg-[#f0ede8] p-8">
          <h2
            className="text-xl font-bold text-[#1a1c1b]"
            style={{ fontFamily: "var(--font-noto-serif)" }}
          >
            Order Summary
          </h2>
          <div className="mt-6 flex items-center justify-between border-t border-[#cdc6b3]/40 pt-6">
            <span className="text-sm text-[#5f5e5e]">Subtotal</span>
            <span className="text-lg font-bold text-[#1a1c1b]">₵{total.toLocaleString()}</span>
          </div>
          <p className="mt-2 text-xs text-[#5f5e5e]">Shipping calculated at checkout.</p>
          <Link
            href="/checkout"
            className="mt-8 flex w-full items-center justify-center bg-[#6c5e06] py-3.5 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90"
          >
            PROCEED TO CHECKOUT
          </Link>
          <Link
            href="/products"
            className="mt-4 flex w-full items-center justify-center border border-[#cdc6b3]/60 py-3.5 text-sm font-medium tracking-wide text-[#1a1c1b] transition-colors hover:bg-[#f9f9f7]"
          >
            CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    </div>
  );
}
