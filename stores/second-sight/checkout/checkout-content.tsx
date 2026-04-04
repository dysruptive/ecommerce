"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useCart } from "@/hooks/use-cart";
import { createCheckoutOrder, validateDiscountCode } from "@/actions/orders";
import type { DeliveryZoneData } from "@/stores/registry";
import type { Tenant } from "@/types";

const inputCls =
  "w-full border-b border-[#cdc6b3] bg-transparent py-2.5 text-sm text-[#1a1c1b] outline-none placeholder:text-[#cdc6b3] focus:border-[#6c5e06] transition-colors";
const labelCls = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-[#5f5e5e]";
const sectionHeadingCls = "mb-6 text-xs font-semibold uppercase tracking-widest text-[#5f5e5e]";

export function SecondSightCheckoutContent({ tenant, deliveryZones, smsEnabled }: { tenant: Tenant; deliveryZones: DeliveryZoneData[]; smsEnabled: boolean }) {
  const { items, total: subtotal, clearCart } = useCart();
  const [selectedZoneId, setSelectedZoneId] = useState("");
  const [discountCode, setDiscountCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<{ code: string; amount: number; message: string } | null>(null);
  const [discountError, setDiscountError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isApplyingDiscount, startApplyTransition] = useTransition();

  const selectedZone = deliveryZones.find((z) => z.id === selectedZoneId);
  const deliveryFee = selectedZone?.fee != null ? Number(selectedZone.fee) : 0;
  const discountAmount = appliedDiscount?.amount ?? 0;
  const total = subtotal + deliveryFee - discountAmount;

  if (items.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-3xl font-bold text-[#1a1c1b]" style={{ fontFamily: "var(--font-noto-serif)" }}>
          Your cart is empty
        </p>
        <p className="mt-4 text-sm text-[#5f5e5e]">Browse the collection and find your frames.</p>
        <Link href="/products" className="mt-8 inline-flex items-center bg-[#6c5e06] px-8 py-3 text-sm font-medium tracking-wide text-white transition-opacity hover:opacity-90">
          SHOP COLLECTION
        </Link>
      </div>
    );
  }

  function handleApplyDiscount() {
    if (!discountCode.trim()) return;
    setDiscountError(null);
    startApplyTransition(async () => {
      const result = await validateDiscountCode(discountCode.trim(), subtotal);
      if (result.success) {
        setAppliedDiscount({ code: discountCode.trim().toUpperCase(), amount: result.discountAmount, message: result.message });
      } else {
        setAppliedDiscount(null);
        setDiscountError(result.error);
      }
    });
  }

  function handleSubmit(formData: FormData) {
    setError(null);
    if (appliedDiscount) formData.set("discountCode", appliedDiscount.code);
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
    <form action={handleSubmit}>
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
        {/* Left — form */}
        <div className="space-y-12 lg:col-span-7">
          {error && <p className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

          {/* Details */}
          <div>
            <p className={sectionHeadingCls}>Your Details</p>
            <div className="space-y-5">
              <div>
                <label className={labelCls}>Full Name *</label>
                <input name="customerName" required className={inputCls} placeholder="Your full name" />
              </div>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className={labelCls}>Phone *</label>
                  <input name="customerPhone" type="tel" required className={inputCls} placeholder="+233..." />
                </div>
                <div>
                  <label className={labelCls}>Email (optional)</label>
                  <input name="customerEmail" type="email" className={inputCls} placeholder="your@email.com" />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <p className={sectionHeadingCls}>Delivery</p>
            <div className="space-y-6">
              <div>
                <label className={labelCls}>Delivery Address *</label>
                <textarea name="deliveryAddress" required rows={3} className={`${inputCls} resize-none`} placeholder="Street, area, landmark..." />
              </div>
              <input type="hidden" name="deliveryZoneId" value={selectedZoneId} />
              {deliveryZones.length > 0 && (
                <div>
                  <p className={labelCls}>{deliveryZones[0].type === "COURIER" ? "Courier Service *" : "Delivery Zone *"}</p>
                  <div className="mt-2 space-y-2">
                    {deliveryZones.map((zone) => (
                      <label key={zone.id} className={`flex cursor-pointer items-center justify-between border px-4 py-3.5 transition-colors ${selectedZoneId === zone.id ? "border-[#6c5e06] bg-[#f0ede8]" : "border-[#cdc6b3]/50 hover:bg-[#f0ede8]/50"}`}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="_zone" value={zone.id} checked={selectedZoneId === zone.id} onChange={() => setSelectedZoneId(zone.id)} className="accent-[#6c5e06]" />
                          <div>
                            <p className="text-sm font-medium text-[#1a1c1b]">{zone.name}</p>
                            {zone.type === "FIXED" && zone.regions && <p className="text-xs text-[#5f5e5e]">{zone.regions}</p>}
                            {zone.type === "COURIER" && <p className="text-xs text-[#5f5e5e]">Courier delivery to your address</p>}
                          </div>
                        </div>
                        {zone.fee != null
                          ? <span className="text-sm font-medium tabular-nums text-[#1a1c1b]">₵{Number(zone.fee).toFixed(2)}</span>
                          : <span className="text-xs text-[#5f5e5e]">Price varies</span>}
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Discount */}
          <div>
            <p className={sectionHeadingCls}>Discount Code</p>
            {appliedDiscount ? (
              <div className="flex items-center justify-between border border-[#6c5e06]/30 bg-[#f0ede8] px-4 py-3">
                <div>
                  <span className="text-sm font-medium text-[#6c5e06]">{appliedDiscount.code}</span>
                  <p className="text-xs text-[#5f5e5e]">{appliedDiscount.message}</p>
                </div>
                <button type="button" onClick={() => { setAppliedDiscount(null); setDiscountCode(""); setDiscountError(null); }} className="text-xs text-[#5f5e5e] underline hover:text-[#1a1c1b]">Remove</button>
              </div>
            ) : (
              <div className="flex gap-3">
                <input value={discountCode} onChange={(e) => setDiscountCode(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleApplyDiscount(); } }} className={inputCls} placeholder="Enter promo code" />
                <button type="button" onClick={handleApplyDiscount} disabled={isApplyingDiscount || !discountCode.trim()} className="border border-[#cdc6b3] px-5 py-2 text-xs font-medium uppercase tracking-wider text-[#1a1c1b] transition-colors hover:bg-[#f0ede8] disabled:opacity-40">
                  {isApplyingDiscount ? "..." : "Apply"}
                </button>
              </div>
            )}
            {discountError && <p className="mt-2 text-xs text-red-600">{discountError}</p>}
          </div>

          {/* Note */}
          <div>
            <p className={sectionHeadingCls}>Order Note</p>
            <textarea name="customerNote" rows={2} className={`${inputCls} resize-none`} placeholder="Special instructions, gift messages, etc." />
          </div>

          {/* Notifications */}
          {(smsEnabled || tenant.emailEnabled) && (
            <div>
              <p className={sectionHeadingCls}>Order Updates</p>
              <div className="space-y-3">
                {smsEnabled && (
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" name="notifyBySMS" defaultChecked className="accent-[#6c5e06]" />
                    <div>
                      <p className="text-sm text-[#1a1c1b]">SMS</p>
                      <p className="text-xs text-[#5f5e5e]">Updates sent to your phone number</p>
                    </div>
                  </label>
                )}
                {tenant.emailEnabled && (
                  <label className="flex cursor-pointer items-center gap-3">
                    <input type="checkbox" name="notifyByEmail" className="accent-[#6c5e06]" />
                    <div>
                      <p className="text-sm text-[#1a1c1b]">Email</p>
                      <p className="text-xs text-[#5f5e5e]">Only if you provide an email address</p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right — summary */}
        <div className="lg:col-span-5">
          <div className="sticky top-28 bg-[#f0ede8] p-8">
            <h2 className="text-xl font-bold text-[#1a1c1b]" style={{ fontFamily: "var(--font-noto-serif)" }}>Order Summary</h2>
            <div className="mt-6 space-y-3 border-t border-[#cdc6b3]/40 pt-6">
              {items.map((item) => (
                <div key={`${item.productId}-${item.variantId ?? ""}`} className="flex justify-between text-sm">
                  <span className="text-[#5f5e5e]">{item.name} × {item.quantity}</span>
                  <span className="font-medium tabular-nums text-[#1a1c1b]">₵{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 border-t border-[#cdc6b3]/40 pt-6">
              <div className="flex justify-between text-sm">
                <span className="text-[#5f5e5e]">Subtotal</span>
                <span className="font-medium tabular-nums text-[#1a1c1b]">₵{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5f5e5e]">Delivery</span>
                <span className="font-medium tabular-nums text-[#1a1c1b]">
                  {!selectedZone ? "—" : selectedZone.fee != null ? `₵${deliveryFee.toFixed(2)}` : "Quoted"}
                </span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#5f5e5e]">Discount ({appliedDiscount!.code})</span>
                  <span className="font-medium tabular-nums text-[#6c5e06]">−₵{discountAmount.toFixed(2)}</span>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between border-t border-[#cdc6b3]/40 pt-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#1a1c1b]">Total</span>
              <span className="text-2xl font-bold tabular-nums text-[#1a1c1b]" style={{ fontFamily: "var(--font-noto-serif)" }}>₵{total.toFixed(2)}</span>
            </div>
            <button type="submit" disabled={isPending || (deliveryZones.length > 0 && !selectedZoneId)} className="mt-8 flex w-full items-center justify-center bg-[#6c5e06] py-4 text-sm font-medium tracking-widest text-white transition-opacity hover:opacity-90 disabled:opacity-50">
              {isPending ? "PROCESSING..." : `PAY ₵${total.toFixed(2)}`}
            </button>
            <Link href="/cart" className="mt-4 flex w-full items-center justify-center border border-[#cdc6b3]/60 py-3.5 text-xs font-medium tracking-wider text-[#1a1c1b] transition-colors hover:bg-[#f9f9f7]">
              BACK TO CART
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
