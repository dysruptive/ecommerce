import type { Tenant, Order, Customer } from "@/generated/prisma/client";
import {
  sendOrderConfirmationEmail,
  sendNewOrderEmailToOwner,
  sendOrderStatusEmail,
} from "./email";
import { sendSMS, orderConfirmedSMS, orderShippedSMS, newOrderSMS } from "./sms";
import { prisma } from "@/lib/db";

interface OrderWithItems extends Order {
  items: { name: string; quantity: number; price: { toNumber(): number } }[];
  customer: Customer;
}

function buildOrderEmailData(order: OrderWithItems, tenant: Tenant) {
  return {
    orderNumber: order.orderNumber,
    customerName: order.customer.name,
    customerEmail: order.customer.email,
    items: order.items.map((i) => ({
      name: i.name,
      quantity: i.quantity,
      price: i.price.toNumber(),
    })),
    subtotal: order.subtotal.toNumber(),
    deliveryFee: order.deliveryFee.toNumber(),
    discountAmount: order.discountAmount.toNumber(),
    total: order.total.toNumber(),
    storeName: tenant.name,
    storeEmail: tenant.contactEmail,
  };
}

/**
 * Fire-and-forget notifications when an order is confirmed (payment successful).
 */
export async function notifyOrderConfirmed(
  order: OrderWithItems,
  tenant: Tenant,
) {
  const tasks: Promise<unknown>[] = [];
  const emailData = buildOrderEmailData(order, tenant);

  // Email to customer
  if (tenant.emailEnabled) {
    tasks.push(sendOrderConfirmationEmail(emailData));

    // Email to store owner
    const owner = await prisma.user.findFirst({
      where: { tenantId: tenant.id, role: "OWNER" },
      select: { email: true },
    });
    if (owner) {
      tasks.push(
        sendNewOrderEmailToOwner({ ...emailData, ownerEmail: owner.email }),
      );
    }
  }

  // SMS to customer
  if (tenant.smsEnabled && tenant.arkeselApiKey && order.customer.phone) {
    tasks.push(
      sendSMS(
        order.customer.phone,
        orderConfirmedSMS({
          customerName: order.customer.name,
          orderNumber: order.orderNumber,
          total: order.total.toNumber(),
          storeName: tenant.name,
        }),
        tenant.arkeselApiKey,
        tenant.name,
      ),
    );

    // SMS to store owner
    if (tenant.contactPhone) {
      tasks.push(
        sendSMS(
          tenant.contactPhone,
          newOrderSMS({
            orderNumber: order.orderNumber,
            total: order.total.toNumber(),
            customerName: order.customer.name,
          }),
          tenant.arkeselApiKey,
          tenant.name,
        ),
      );
    }
  }

  // Fire and forget — log failures but don't block
  await Promise.allSettled(tasks);
}

/**
 * Fire-and-forget notifications when an order status is updated.
 */
export async function notifyOrderStatusUpdated(
  order: OrderWithItems,
  tenant: Tenant,
  newStatus: string,
) {
  const tasks: Promise<unknown>[] = [];

  if (tenant.emailEnabled) {
    tasks.push(
      sendOrderStatusEmail({
        customerEmail: order.customer.email,
        customerName: order.customer.name,
        orderNumber: order.orderNumber,
        newStatus,
        storeName: tenant.name,
      }),
    );
  }

  if (
    tenant.smsEnabled &&
    tenant.arkeselApiKey &&
    order.customer.phone &&
    newStatus === "SHIPPED"
  ) {
    tasks.push(
      sendSMS(
        order.customer.phone,
        orderShippedSMS({
          orderNumber: order.orderNumber,
          storeName: tenant.name,
        }),
        tenant.arkeselApiKey,
        tenant.name,
      ),
    );
  }

  await Promise.allSettled(tasks);
}
