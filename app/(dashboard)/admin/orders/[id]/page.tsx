import { notFound } from "next/navigation";
import Image from "next/image";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { OrderStatusUpdate } from "./order-status-update";
import { MarkPaidButton } from "./mark-paid-button";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function OrderDetailPage({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantFromSession();

  const order = await prisma.order.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      items: {
        include: {
          product: {
            select: { images: { orderBy: { position: "asc" }, take: 1 } },
          },
        },
      },
      customer: true,
      deliveryZone: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Order ${order.orderNumber}`}
        description={`Placed ${order.createdAt.toLocaleDateString()}`}
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Status */}
        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Order:</span>
              <Badge>{order.status}</Badge>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium">Payment:</span>
              <Badge
                variant={
                  order.paymentStatus === "PAID" ? "default" : "secondary"
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            {order.paymentRef && (
              <p className="text-xs text-muted-foreground">
                Ref: {order.paymentRef}
              </p>
            )}
            <Separator />
            {order.paymentStatus !== "PAID" && (
              <>
                <MarkPaidButton orderId={order.id} />
                <Separator />
              </>
            )}
            <OrderStatusUpdate
              orderId={order.id}
              currentStatus={order.status}
            />
          </CardContent>
        </Card>

        {/* Customer */}
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-muted-foreground">{order.customer.email}</p>
            {order.customer.phone && (
              <p className="text-muted-foreground">{order.customer.phone}</p>
            )}
            {order.deliveryAddress && (
              <>
                <Separator className="my-2" />
                <p className="font-medium">Delivery Address</p>
                <p className="text-muted-foreground">
                  {order.deliveryAddress}
                </p>
                {order.deliveryZone && (
                  <p className="text-muted-foreground">
                    Zone: {order.deliveryZone.name}
                  </p>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {order.items.map((item) => {
            const imageUrl = item.product?.images?.[0]?.url;
            return (
              <div key={item.id} className="flex items-center gap-3 text-sm">
                <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-md border bg-muted">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={item.name}
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full" />
                  )}
                </div>
                <span className="flex-1">
                  {item.name} × {item.quantity}
                </span>
                <span className="font-medium">
                  GHS {(item.price.toNumber() * item.quantity).toFixed(2)}
                </span>
              </div>
            );
          })}
          <Separator />
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>GHS {order.subtotal.toNumber().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>GHS {order.deliveryFee.toNumber().toFixed(2)}</span>
            </div>
            {order.discountAmount.toNumber() > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>
                  -GHS {order.discountAmount.toNumber().toFixed(2)}
                </span>
              </div>
            )}
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span>GHS {order.total.toNumber().toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>

      {order.customerNote && (
        <Card>
          <CardHeader>
            <CardTitle>Customer Note</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {order.customerNote}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
