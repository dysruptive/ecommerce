"use client";

import { useState } from "react";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

interface Variant {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface AddToCartFormProps {
  product: {
    id: string;
    name: string;
    price: number;
    imageUrl?: string;
    stock: number;
    trackStock: boolean;
    variants: Variant[];
  };
}

export function AddToCartForm({ product }: AddToCartFormProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(
    product.variants.length > 0 ? product.variants[0] : null,
  );
  const [added, setAdded] = useState(false);

  const activePrice = selectedVariant?.price ?? product.price;
  const activeStock = selectedVariant?.stock ?? product.stock;
  const inStock = !product.trackStock || activeStock > 0;

  function handleAddToCart() {
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id,
      name: selectedVariant
        ? `${product.name} — ${selectedVariant.name}`
        : product.name,
      price: activePrice,
      quantity,
      imageUrl: product.imageUrl,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <div className="space-y-4">
      {/* Variant selector */}
      {product.variants.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Option</p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => (
              <button
                key={v.id}
                onClick={() => setSelectedVariant(v)}
                className={`rounded-md border px-3 py-1.5 text-sm transition-colors ${
                  selectedVariant?.id === v.id
                    ? "border-[var(--store-primary)] bg-[var(--store-primary)]/10 font-medium"
                    : "hover:bg-muted"
                }`}
              >
                {v.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Quantity</p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-10 text-center font-medium">{quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => setQuantity(quantity + 1)}
            disabled={product.trackStock && quantity >= activeStock}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Button
        className="w-full py-6 text-base"
        style={{
          backgroundColor: "var(--store-primary)",
          color: "white",
        }}
        onClick={handleAddToCart}
        disabled={!inStock}
      >
        <ShoppingBag className="mr-2 h-5 w-5" />
        {!inStock
          ? "Out of Stock"
          : added
            ? "Added to Cart!"
            : `Add to Cart — GHS ${(activePrice * quantity).toFixed(2)}`}
      </Button>
    </div>
  );
}
