"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import type { OrderStatus } from "@/generated/prisma/client";

type ActionResult = { success: true } | { success: false; error: string };

const ALL_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

export async function markOrderAsPaid(
  orderId: string,
  paymentRef?: string,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();

    const order = await prisma.order.findFirst({ where: { id: orderId, tenantId } });
    if (!order) return { success: false, error: "Order not found." };
    if (order.paymentStatus === "PAID") {
      return { success: false, error: "Order is already marked as paid." };
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        paymentStatus: "PAID",
        paymentRef: paymentRef || null,
        status: order.status === "PENDING" ? "CONFIRMED" : order.status,
      },
    });

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("markOrderAsPaid error:", error);
    return { success: false, error: "Failed to mark order as paid." };
  }
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();

    const order = await prisma.order.findFirst({ where: { id: orderId, tenantId } });
    if (!order) return { success: false, error: "Order not found." };
    if (!ALL_STATUSES.includes(newStatus)) return { success: false, error: "Invalid status." };
    if (order.status === newStatus) return { success: false, error: "Order is already in that status." };

    if (newStatus === "CANCELLED" && order.paymentStatus === "PAID") {
      // Restore stock for items that were decremented by the webhook
      const items = await prisma.orderItem.findMany({
        where: { orderId },
        include: { product: { select: { trackStock: true } } },
      });

      const stockOps = items
        .filter((item) => item.product.trackStock)
        .map((item) =>
          item.variantId
            ? prisma.productVariant.update({
                where: { id: item.variantId },
                data: { stock: { increment: item.quantity } },
              })
            : prisma.product.update({
                where: { id: item.productId },
                data: { stock: { increment: item.quantity } },
              }),
        );

      await prisma.$transaction([
        prisma.order.update({ where: { id: orderId }, data: { status: newStatus } }),
        ...stockOps,
      ]);
    } else {
      await prisma.order.update({ where: { id: orderId }, data: { status: newStatus } });
    }

    // Send notifications (fire-and-forget)
    const fullOrder = await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true, customer: true },
    });
    const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
    if (fullOrder && tenant) {
      const { notifyOrderStatusUpdated } = await import("@/lib/notifications");
      notifyOrderStatusUpdated(fullOrder, tenant, newStatus).catch((err) =>
        console.error("Notification error:", err),
      );
    }

    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, error: "Failed to update order status." };
  }
}

export async function resendOrderConfirmation(orderId: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();

    const [order, tenant] = await Promise.all([
      prisma.order.findFirst({
        where: { id: orderId, tenantId },
        include: { items: true, customer: true },
      }),
      prisma.tenant.findUnique({ where: { id: tenantId } }),
    ]);

    if (!order) return { success: false, error: "Order not found." };
    if (!tenant) return { success: false, error: "Store not found." };
    if (order.paymentStatus !== "PAID") {
      return { success: false, error: "Can only resend confirmation for paid orders." };
    }

    const { notifyOrderConfirmed } = await import("@/lib/notifications");
    await notifyOrderConfirmed(order, tenant);
    return { success: true };
  } catch (error) {
    console.error("resendOrderConfirmation error:", error);
    return { success: false, error: "Failed to resend confirmation." };
  }
}
