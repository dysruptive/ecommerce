"use client";

import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";
import { ProductImage } from "@/components/store/product-image";

export function CartContent({ primaryColor }: { primaryColor: string }) {
  const { items, removeItem, updateQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <ShoppingBag className="mx-auto h-12 w-12 text-muted-foreground/40" />
        <p className="mt-4 text-lg font-medium">Your cart is empty</p>
        <p className="mt-1 text-muted-foreground">
          Browse our products and add something!
        </p>
        <Button asChild className="mt-6" variant="outline">
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={`${item.productId}-${item.variantId ?? ""}`}
            className="flex gap-4"
          >
            <ProductImage
              url={item.imageUrl}
              alt={item.name}
              className="h-20 w-20 shrink-0 rounded-md object-cover"
            />
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-medium leading-tight">{item.name}</h3>
                <p className="text-sm text-muted-foreground">
                  GHS {item.price.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity - 1,
                      item.variantId,
                    )
                  }
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">
                  {item.quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() =>
                    updateQuantity(
                      item.productId,
                      item.quantity + 1,
                      item.variantId,
                    )
                  }
                >
                  <Plus className="h-3 w-3" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="ml-auto h-7 w-7 text-destructive"
                  onClick={() => removeItem(item.productId, item.variantId)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
            <div className="text-right">
              <span className="font-medium">
                GHS {(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </div>
        ))}
      </div>

      <Separator />

      <div className="flex items-center justify-between text-lg font-bold">
        <span>Subtotal</span>
        <span>GHS {total.toFixed(2)}</span>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/products">Continue Shopping</Link>
        </Button>
        <Button
          asChild
          className="flex-1"
          style={{ backgroundColor: primaryColor, color: "white" }}
        >
          <Link href="/checkout">Proceed to Checkout</Link>
        </Button>
      </div>
    </div>
  );
}
