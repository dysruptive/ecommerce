"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useCart } from "@/hooks/use-cart";
import { createCheckoutOrder, validateDiscountCode } from "@/actions/orders";

interface DeliveryZone {
  id: string;
  name: string;
  type: string;
  regions: string | null;
  fee: string | number | null;
}

interface CheckoutFormProps {
  deliveryZones: DeliveryZone[];
  primaryColor: string;
  emailEnabled: boolean;
  smsEnabled: boolean;
}

export function CheckoutForm({ deliveryZones, primaryColor, emailEnabled, smsEnabled }: CheckoutFormProps) {
  const { items, total: subtotal, clearCart } = useCart();
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{
    code: string;
    amount: number;
    message: string;
  } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isApplyingDiscount, startApplyTransition] = useTransition();

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  // Courier zones have no platform fee — the courier quotes the customer directly
  const deliveryFee = selectedZone?.fee != null ? Number(selectedZone.fee) : 0;
  const discountAmount = appliedDiscount?.amount ?? 0;
  const total = subtotal + deliveryFee - discountAmount;

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg font-medium">Your cart is empty</p>
        <Button asChild variant="outline" className="mt-4">
          <Link href="/products">Browse Products</Link>
        </Button>
      </div>
    );
  }

  function handleApplyDiscount() {
    if (!discountCode.trim()) return;
    setDiscountError(null);
    startApplyTransition(async () => {
      const result = await validateDiscountCode(discountCode.trim(), subtotal);
      if (result.success) {
        setAppliedDiscount({
          code: discountCode.trim().toUpperCase(),
          amount: result.discountAmount,
          message: result.message,
        });
        setDiscountError(null);
      } else {
        setAppliedDiscount(null);
        setDiscountError(result.error);
      }
    });
  }

  function handleRemoveDiscount() {
    setAppliedDiscount(null);
    setDiscountCode("");
    setDiscountError(null);
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    // Inject the validated discount code into the form data
    if (appliedDiscount) {
      formData.set("discountCode", appliedDiscount.code);
    }
    startTransition(async () => {
      const result = await createCheckoutOrder(JSON.stringify(items), formData);
      if (result.success) {
        clearCart();
        window.location.href = result.authorizationUrl;
      } else {
        setError(result.error);
      }
    });
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Customer Info */}
      <Card>
        <CardHeader>
          <CardTitle>Your Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="customerName">Full Name</Label>
            <Input id="customerName" name="customerName" required />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="customerPhone">
                Phone <span className="text-destructive">*</span>
              </Label>
              <Input
                id="customerPhone"
                name="customerPhone"
                type="tel"
                placeholder="+233..."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerEmail">
                Email{" "}
                <span className="text-xs font-normal text-muted-foreground">
                  (optional)
                </span>
              </Label>
              <Input
                id="customerEmail"
                name="customerEmail"
                type="email"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Delivery */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="deliveryAddress">Delivery Address</Label>
            <Textarea
              id="deliveryAddress"
              name="deliveryAddress"
              placeholder="Street, area, landmark..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Delivery Zone</Label>
            <input type="hidden" name="deliveryZoneId" value={selectedZoneId} />
            <div className="space-y-2">
              {deliveryZones.map((zone) => (
                <label
                  key={zone.id}
                  className={`flex cursor-pointer items-center justify-between rounded-md border p-3 transition-colors ${
                    selectedZoneId === zone.id
                      ? "border-[var(--store-primary)] bg-[var(--store-primary)]/5"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="_zone"
                      value={zone.id}
                      checked={selectedZoneId === zone.id}
                      onChange={() => setSelectedZoneId(zone.id)}
                      className="accent-[var(--store-primary)]"
                    />
                    <div>
                      <p className="text-sm font-medium">{zone.name}</p>
                      {zone.type === "FIXED" && zone.regions && (
                        <p className="text-xs text-muted-foreground">
                          {zone.regions}
                        </p>
                      )}
                      {zone.type === "COURIER" && (
                        <p className="text-xs text-muted-foreground">
                          We will book a courier to deliver to your address
                        </p>
                      )}
                    </div>
                  </div>
                  {zone.fee != null ? (
                    <span className="text-sm font-medium tabular-nums">
                      GHS {Number(zone.fee).toFixed(2)}
                    </span>
                  ) : (
                    <span className="text-xs text-muted-foreground">Price varies</span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Discount */}
      <Card>
        <CardHeader>
          <CardTitle>Discount Code</CardTitle>
        </CardHeader>
        <CardContent>
          {appliedDiscount ? (
            <div className="flex items-center justify-between rounded-md border border-green-200 bg-green-50 px-3 py-2">
              <div>
                <span className="text-sm font-medium text-green-800">
                  {appliedDiscount.code}
                </span>
                <p className="text-xs text-green-700">{appliedDiscount.message}</p>
              </div>
              <button
                type="button"
                onClick={handleRemoveDiscount}
                className="text-xs text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value)}
                  placeholder="Enter code"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleApplyDiscount();
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleApplyDiscount}
                  disabled={isApplyingDiscount || !discountCode.trim()}
                >
                  {isApplyingDiscount ? "Checking..." : "Apply"}
                </Button>
              </div>
              {discountError && (
                <p className="text-sm text-destructive">{discountError}</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification preferences */}
      {(emailEnabled || smsEnabled) && (
        <Card>
          <CardHeader>
            <CardTitle>Order Updates</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">
              How would you like to receive updates on your order?
            </p>
            <div className="space-y-2">
              {smsEnabled && (
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="notifyBySMS"
                    defaultChecked
                    className="h-4 w-4 accent-[var(--store-primary)]"
                  />
                  <div>
                    <p className="text-sm font-medium">SMS</p>
                    <p className="text-xs text-muted-foreground">
                      Updates sent to your phone number
                    </p>
                  </div>
                </label>
              )}
              {emailEnabled && (
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    name="notifyByEmail"
                    className="h-4 w-4 accent-[var(--store-primary)]"
                  />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-xs text-muted-foreground">
                      Only available if you provide an email address
                    </p>
                  </div>
                </label>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Note */}
      <Card>
        <CardHeader>
          <CardTitle>Order Note</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="customerNote"
            placeholder="Any special instructions?"
            rows={2}
          />
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div
              key={`${item.productId}-${item.variantId ?? ""}`}
              className="flex justify-between text-sm"
            >
              <span>
                {item.name} x {item.quantity}
              </span>
              <span>GHS {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <Separator />
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>GHS {subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Delivery</span>
            <span>
              {!selectedZone
                ? "Select an option"
                : selectedZone.fee != null
                ? `GHS ${deliveryFee.toFixed(2)}`
                : "Quoted at delivery"}
            </span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between text-sm text-green-700">
              <span>Discount ({appliedDiscount!.code})</span>
              <span>-GHS {discountAmount.toFixed(2)}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>GHS {total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      <Button
        type="submit"
        className="w-full py-6 text-base"
        style={{ backgroundColor: primaryColor, color: "white" }}
        disabled={isPending || !selectedZoneId}
      >
        {isPending ? "Processing..." : `Pay GHS ${total.toFixed(2)} with Paystack`}
      </Button>
    </form>
  );
}
