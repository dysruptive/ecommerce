import { notFound } from "next/navigation";
import Image from "next/image";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { OrderStatusUpdate } from "./order-status-update";
import { MarkPaidButton } from "./mark-paid-button";
import { ResendButton } from "./resend-button";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700", CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-violet-50 text-violet-700", SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700", CANCELLED: "bg-red-50 text-red-700",
  PAID: "bg-emerald-50 text-emerald-700", UNPAID: "bg-amber-50 text-amber-700",
  REFUNDED: "bg-rose-50 text-rose-700",
};

function Pill({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-stone-50 text-stone-500"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const card = "rounded-xl border border-[#E5E2DB] bg-white";
const cardHeader = "border-b border-[#E5E2DB] px-5 py-4";
const cardTitle = "text-sm font-semibold text-[#1C1917]";
const cardBody = "px-5 py-4";

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantFromSession();

  const order = await prisma.order.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      items: { include: { product: { select: { images: { orderBy: { position: "asc" }, take: 1 } } } } },
      customer: true,
      deliveryZone: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-5">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${order.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}`}
      />

      <div className="grid gap-5 md:grid-cols-2">
        {/* Status card */}
        <div className={card}>
          <div className={cardHeader}><p className={cardTitle}>Status</p></div>
          <div className={`${cardBody} space-y-4`}>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716C]">Order</span>
              <Pill status={order.status} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#78716C]">Payment</span>
              <Pill status={order.paymentStatus} />
            </div>
            {order.paymentRef && (
              <p className="text-xs text-[#A8A29E]">Ref: {order.paymentRef}</p>
            )}
            <div className="border-t border-[#F5F3EE] pt-4 space-y-3">
              {order.paymentStatus !== "PAID" && <MarkPaidButton orderId={order.id} />}
              {order.paymentStatus === "PAID" && <ResendButton orderId={order.id} />}
              <OrderStatusUpdate orderId={order.id} currentStatus={order.status} />
            </div>
          </div>
        </div>

        {/* Customer card */}
        <div className={card}>
          <div className={cardHeader}><p className={cardTitle}>Customer</p></div>
          <div className={`${cardBody} space-y-1 text-sm`}>
            <p className="font-semibold text-[#1C1917]">{order.customer.name}</p>
            <p className="text-[#78716C]">{order.customer.email}</p>
            {order.customer.phone && <p className="text-[#78716C]">{order.customer.phone}</p>}
            {order.deliveryAddress && (
              <div className="mt-3 border-t border-[#F5F3EE] pt-3">
                <p className="font-semibold text-[#1C1917]">Delivery Address</p>
                <p className="mt-0.5 text-[#78716C]">{order.deliveryAddress}</p>
                {order.deliveryZone && (
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-[#78716C]">{order.deliveryZone.name}</span>
                    {order.deliveryZone.type === "COURIER" && (
                      <span className="rounded-full border border-[#E5E2DB] px-2 py-0.5 text-xs text-[#78716C]">
                        Courier
                      </span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Items</p></div>
        <div className={cardBody}>
          <div className="space-y-3">
            {order.items.map((item) => {
              const img = item.product?.images?.[0]?.url;
              return (
                <div key={item.id} className="flex items-center gap-3 text-sm">
                  <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg border border-[#E5E2DB] bg-[#F8F7F4]">
                    {img && <Image src={img} alt={item.name} width={44} height={44} className="h-full w-full object-cover" />}
                  </div>
                  <span className="flex-1 text-[#1C1917]">{item.name} <span className="text-[#A8A29E]">× {item.quantity}</span></span>
                  <span className="font-semibold tabular-nums text-[#1C1917]">₵{(item.price.toNumber() * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-4 space-y-2 border-t border-[#F5F3EE] pt-4 text-sm">
            <div className="flex justify-between text-[#78716C]"><span>Subtotal</span><span className="tabular-nums">₵{order.subtotal.toNumber().toFixed(2)}</span></div>
            <div className="flex justify-between text-[#78716C]"><span>Delivery</span><span className="tabular-nums">₵{order.deliveryFee.toNumber().toFixed(2)}</span></div>
            {order.discountAmount.toNumber() > 0 && (
              <div className="flex justify-between text-emerald-600"><span>Discount</span><span className="tabular-nums">−₵{order.discountAmount.toNumber().toFixed(2)}</span></div>
            )}
            <div className="flex justify-between border-t border-[#E5E2DB] pt-2 font-semibold text-[#1C1917]">
              <span>Total</span><span className="tabular-nums">₵{order.total.toNumber().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      {order.customerNote && (
        <div className={card}>
          <div className={cardHeader}><p className={cardTitle}>Customer Note</p></div>
          <div className={cardBody}><p className="text-sm text-[#78716C]">{order.customerNote}</p></div>
        </div>
      )}
    </div>
  );
}
