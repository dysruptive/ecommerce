import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Clock } from "lucide-react";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Props {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderConfirmationPage({ params }: Props) {
  const { orderNumber } = await params;
  const tenant = await getCurrentTenant();

  const order = await prisma.order.findFirst({
    where: { tenantId: tenant.id, orderNumber },
    include: {
      items: true,
      customer: true,
      deliveryZone: true,
    },
  });

  if (!order) notFound();

  const isPaid = order.paymentStatus === "PAID";

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-2xl px-4 py-8">
        <div className="mb-8 text-center">
          {isPaid ? (
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          ) : (
            <Clock className="mx-auto h-16 w-16 text-yellow-500" />
          )}
          <h1 className="mt-4 text-2xl font-bold">
            {isPaid ? "Thank You!" : "Order Received"}
          </h1>
          <p className="mt-1 text-muted-foreground">
            {isPaid
              ? "Your payment has been confirmed."
              : "We're waiting for your payment to be confirmed."}
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Order #{order.orderNumber}</CardTitle>
              <Badge
                variant={isPaid ? "default" : "secondary"}
              >
                {order.paymentStatus}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Customer */}
            <div>
              <p className="text-sm font-medium">Customer</p>
              <p className="text-sm text-muted-foreground">
                {order.customer.name} — {order.customer.email}
              </p>
              {order.customer.phone && (
                <p className="text-sm text-muted-foreground">
                  {order.customer.phone}
                </p>
              )}
            </div>

            {/* Delivery */}
            {order.deliveryZone && (
              <div>
                <p className="text-sm font-medium">Delivery</p>
                <p className="text-sm text-muted-foreground">
                  {order.deliveryZone.name} — {order.deliveryAddress}
                </p>
              </div>
            )}

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-sm"
                >
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>
                    GHS{" "}
                    {(item.price.toNumber() * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>GHS {order.subtotal.toNumber().toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
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

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>GHS {order.total.toNumber().toFixed(2)}</span>
            </div>

            {order.customerNote && (
              <div className="mt-2">
                <p className="text-sm font-medium">Note</p>
                <p className="text-sm text-muted-foreground">
                  {order.customerNote}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <Button asChild variant="outline">
            <Link href="/">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </StoreLayout>
  );
}
