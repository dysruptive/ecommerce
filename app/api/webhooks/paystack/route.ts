import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { prisma } from "@/lib/db";
import { verifyTransaction } from "@/lib/paystack";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY ?? "";

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature") ?? "";

    // Verify webhook signature
    const hash = createHmac("sha512", PAYSTACK_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      console.error("Paystack webhook: invalid signature");
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    // Mark failed payment attempts
    if (event.event === "charge.failure") {
      const ref = event.data.reference as string;
      await prisma.order.updateMany({
        where: { paymentRef: ref, paymentStatus: "UNPAID" },
        data: { paymentStatus: "FAILED" },
      });
      return NextResponse.json({ received: true });
    }

    // Handle refunds processed from the Paystack dashboard
    if (event.event === "refund.processed") {
      const ref = event.data.transaction_reference as string;
      await prisma.order.updateMany({
        where: { paymentRef: ref, paymentStatus: "PAID" },
        data: { paymentStatus: "REFUNDED" },
      });
      return NextResponse.json({ received: true });
    }

    if (event.event !== "charge.success") {
      return NextResponse.json({ received: true });
    }

    const reference = event.data.reference as string;

    // Verify the transaction with Paystack
    const verification = await verifyTransaction(reference);
    if (verification.data.status !== "success") {
      console.error("Paystack webhook: transaction not successful", reference);
      return NextResponse.json({ received: true });
    }

    const { orderId, tenantId } = verification.data.metadata;

    // Find the order
    const order = await prisma.order.findFirst({
      where: { id: orderId, tenantId },
      include: {
        items: { include: { product: true } },
      },
    });

    if (!order) {
      console.error("Paystack webhook: order not found", orderId);
      return NextResponse.json({ received: true });
    }

    // Check if already processed
    if (order.paymentStatus === "PAID") {
      return NextResponse.json({ received: true });
    }

    // Verify amount matches
    const expectedAmount = Math.round(order.total.toNumber() * 100);
    if (verification.data.amount !== expectedAmount) {
      console.error(
        "Paystack webhook: amount mismatch",
        verification.data.amount,
        expectedAmount,
      );
      return NextResponse.json({ received: true });
    }

    // Build stock decrement operations
    const stockOps = order.items
      .filter((item) => item.product.trackStock)
      .map((item) =>
        item.variantId
          ? prisma.productVariant.update({
              where: { id: item.variantId },
              data: { stock: { decrement: item.quantity } },
            })
          : prisma.product.update({
              where: { id: item.productId },
              data: { stock: { decrement: item.quantity } },
            }),
      );

    // Mark paid + discount count + stock decrements in one atomic transaction
    await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { paymentStatus: "PAID", paymentRef: reference, status: "CONFIRMED" },
      }),
      ...(order.discountId
        ? [prisma.discount.update({
            where: { id: order.discountId },
            data: { usedCount: { increment: 1 } },
          })]
        : []),
      ...stockOps,
    ]);

    // Send notifications (fire-and-forget)
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (tenant) {
      const fullOrder = await prisma.order.findUnique({
        where: { id: order.id },
        include: { items: true, customer: true },
      });
      if (fullOrder) {
        const { notifyOrderConfirmed } = await import("@/lib/notifications");
        notifyOrderConfirmed(fullOrder, tenant).catch((err) =>
          console.error("Notification error:", err),
        );
      }
    }

    console.log(`Order ${order.orderNumber} paid — ${reference}`);

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Paystack webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
