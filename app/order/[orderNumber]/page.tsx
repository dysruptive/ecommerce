import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { PaymentPoller } from "./payment-poller";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const tenant = await getCurrentTenant();

  const order = await prisma.order.findFirst({
    where: { tenantId: tenant.id, orderNumber },
    include: { items: true, customer: true, deliveryZone: true },
  });

  if (!order) notFound();

  const isPaid = order.paymentStatus === "PAID";

  return (
    <StoreLayout tenant={tenant}>
      {!isPaid && <PaymentPoller />}

      <div className="mx-auto max-w-xl px-4 py-10">
        {/* Status banner */}
        <div className={`mb-8 rounded-2xl p-6 text-center ${isPaid ? "bg-emerald-50" : "bg-amber-50"}`}>
          {isPaid ? (
            <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-500" />
          ) : (
            <Clock className="mx-auto mb-3 h-12 w-12 animate-pulse text-amber-500" />
          )}
          <h1 className="text-xl font-bold text-gray-900">
            {isPaid ? "Payment confirmed!" : "Waiting for payment…"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {isPaid
              ? `Your order ${order.orderNumber} is confirmed. We'll be in touch soon.`
              : "This page will update automatically once your payment is processed."}
          </p>
        </div>

        {/* Order card */}
        <div className="divide-y divide-gray-100 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Order</p>
              <p className="text-base font-bold text-gray-900">#{order.orderNumber}</p>
            </div>
            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
              isPaid
                ? "bg-emerald-100 text-emerald-700"
                : order.paymentStatus === "FAILED"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
            }`}>
              {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
            </span>
          </div>

          {/* Customer */}
          <div className="px-5 py-4">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Customer</p>
            <p className="text-sm font-medium text-gray-900">{order.customer.name}</p>
            {order.customer.phone && (
              <p className="text-sm text-gray-500">{order.customer.phone}</p>
            )}
          </div>

          {/* Delivery */}
          {order.deliveryZone && (
            <div className="px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Delivery</p>
              <p className="text-sm font-medium text-gray-900">{order.deliveryZone.name}</p>
              {order.deliveryAddress && (
                <p className="text-sm text-gray-500">{order.deliveryAddress}</p>
              )}
            </div>
          )}

          {/* Items */}
          <div className="px-5 py-4">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-400">Items</p>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.name}
                    <span className="ml-1 text-gray-400">× {item.quantity}</span>
                  </span>
                  <span className="font-medium tabular-nums text-gray-900">
                    ₵{(item.price.toNumber() * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="space-y-1.5 px-5 py-4 text-sm">
            <div className="flex justify-between text-gray-500">
              <span>Subtotal</span>
              <span className="tabular-nums">₵{order.subtotal.toNumber().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Delivery</span>
              <span className="tabular-nums">₵{order.deliveryFee.toNumber().toFixed(2)}</span>
            </div>
            {order.discountAmount.toNumber() > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span className="tabular-nums">−₵{order.discountAmount.toNumber().toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-100 pt-2 font-bold text-gray-900">
              <span>Total</span>
              <span className="tabular-nums">₵{order.total.toNumber().toFixed(2)}</span>
            </div>
          </div>

          {/* Note */}
          {order.customerNote && (
            <div className="px-5 py-4">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Note</p>
              <p className="text-sm text-gray-600">{order.customerNote}</p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/products"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 underline-offset-2 hover:underline"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </StoreLayout>
  );
}
