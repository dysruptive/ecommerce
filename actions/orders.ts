"use server";

import { prisma } from "@/lib/db";
import { initializeTransaction } from "@/lib/paystack";
import { checkoutSchema, cartItemSchema } from "@/lib/validations/order";
import { z } from "zod";
import { headers } from "next/headers";
import { getCurrentTenant } from "@/lib/tenant";

type CheckoutResult =
  | { success: true; authorizationUrl: string }
  | { success: false; error: string };

type DiscountResult =
  | { success: true; discountAmount: number; message: string }
  | { success: false; error: string };

/**
 * Validates a discount code against the current cart subtotal without creating
 * an order. Used for the live "Apply" button at checkout.
 */
export async function validateDiscountCode(
  code: string,
  subtotal: number,
): Promise<DiscountResult> {
  try {
    const tenant = await getCurrentTenant();

    const discount = await prisma.discount.findUnique({
      where: {
        tenantId_code: { tenantId: tenant.id, code: code.toUpperCase() },
      },
    });

    if (!discount || !discount.isActive) {
      return { success: false, error: "Invalid or inactive discount code." };
    }
    if (discount.expiresAt && discount.expiresAt < new Date()) {
      return { success: false, error: "Discount code has expired." };
    }
    if (discount.maxUses && discount.usedCount >= discount.maxUses) {
      return { success: false, error: "Discount code has reached its usage limit." };
    }
    if (discount.minPurchase && subtotal < discount.minPurchase.toNumber()) {
      return {
        success: false,
        error: `Minimum purchase of GHS ${discount.minPurchase.toNumber().toFixed(2)} required.`,
      };
    }

    let discountAmount =
      discount.type === "PERCENTAGE"
        ? (subtotal * discount.value.toNumber()) / 100
        : discount.value.toNumber();
    discountAmount = Math.min(discountAmount, subtotal);

    const label =
      discount.type === "PERCENTAGE"
        ? `${discount.value.toNumber()}% off`
        : `GHS ${discount.value.toNumber().toFixed(2)} off`;

    return {
      success: true,
      discountAmount,
      message: `Code applied: ${label}`,
    };
  } catch (error) {
    console.error("validateDiscountCode error:", error);
    return { success: false, error: "Could not validate discount code." };
  }
}

function generateOrderNumber(prefix: string): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}${random}`;
}

export async function createCheckoutOrder(
  cartItemsJson: string,
  formData: FormData,
): Promise<CheckoutResult> {
  try {
    const tenant = await getCurrentTenant();

    // Parse and validate form data
    const parsed = checkoutSchema.safeParse({
      customerName: formData.get("customerName"),
      customerEmail: formData.get("customerEmail"),
      customerPhone: formData.get("customerPhone"),
      deliveryAddress: formData.get("deliveryAddress"),
      deliveryZoneId: formData.get("deliveryZoneId"),
      discountCode: formData.get("discountCode"),
      customerNote: formData.get("customerNote"),
      notifyByEmail: formData.get("notifyByEmail"),
      notifyBySMS: formData.get("notifyBySMS"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    // Parse and validate cart items
    const cartItems = z.array(cartItemSchema).safeParse(JSON.parse(cartItemsJson));
    if (!cartItems.success || cartItems.data.length === 0) {
      return { success: false, error: "Cart is empty or invalid." };
    }

    // Validate cart against current DB prices/stock
    const productIds = [...new Set(cartItems.data.map((i) => i.productId))];
    const products = await prisma.product.findMany({
      where: { id: { in: productIds }, tenantId: tenant.id, isArchived: false },
      include: { variants: true },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));
    let subtotal = 0;

    for (const item of cartItems.data) {
      const product = productMap.get(item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.name}" is no longer available.` };
      }

      if (item.variantId) {
        const variant = product.variants.find((v) => v.id === item.variantId);
        if (!variant) {
          return { success: false, error: `Variant for "${item.name}" is no longer available.` };
        }
        if (product.trackStock && variant.stock < item.quantity) {
          return { success: false, error: `"${item.name}" — only ${variant.stock} left in stock.` };
        }
        subtotal += variant.price.toNumber() * item.quantity;
      } else {
        if (product.trackStock && product.stock < item.quantity) {
          return { success: false, error: `"${item.name}" — only ${product.stock} left in stock.` };
        }
        subtotal += product.price.toNumber() * item.quantity;
      }
    }

    // Validate delivery zone
    const deliveryZone = await prisma.deliveryZone.findFirst({
      where: { id: parsed.data.deliveryZoneId, tenantId: tenant.id, isActive: true },
    });
    if (!deliveryZone) {
      return { success: false, error: "Invalid delivery zone." };
    }
    const deliveryFee = deliveryZone.fee.toNumber();

    // Apply discount if provided
    let discountAmount = 0;
    let appliedDiscountId: string | null = null;
    if (parsed.data.discountCode) {
      const discount = await prisma.discount.findUnique({
        where: {
          tenantId_code: {
            tenantId: tenant.id,
            code: parsed.data.discountCode.toUpperCase(),
          },
        },
      });

      if (!discount || !discount.isActive) {
        return { success: false, error: "Invalid or inactive discount code." };
      }
      if (discount.expiresAt && discount.expiresAt < new Date()) {
        return { success: false, error: "Discount code has expired." };
      }
      if (discount.maxUses && discount.usedCount >= discount.maxUses) {
        return { success: false, error: "Discount code has reached its usage limit." };
      }
      if (discount.minPurchase && subtotal < discount.minPurchase.toNumber()) {
        return {
          success: false,
          error: `Minimum purchase of GHS ${discount.minPurchase.toNumber().toFixed(2)} required.`,
        };
      }

      if (discount.type === "PERCENTAGE") {
        discountAmount = (subtotal * discount.value.toNumber()) / 100;
      } else {
        discountAmount = discount.value.toNumber();
      }
      discountAmount = Math.min(discountAmount, subtotal);

      // Store the discount ID — usedCount is incremented by the webhook only
      // after payment succeeds, avoiding double-counting on abandoned checkouts.
      appliedDiscountId = discount.id;
    }

    const total = subtotal + deliveryFee - discountAmount;

    // If no email provided, synthesise one for Paystack (which requires it)
    // and to satisfy the customer unique constraint. Real email notifications
    // are skipped for orders with a synthetic email.
    const phone = parsed.data.customerPhone;
    const customerEmail =
      parsed.data.customerEmail ||
      `${phone.replace(/\D/g, "")}@checkout.dysruptivetech.com`;
    const hasRealEmail = !!parsed.data.customerEmail;

    // Create or find customer
    const customer = await prisma.customer.upsert({
      where: {
        tenantId_email: { tenantId: tenant.id, email: customerEmail },
      },
      update: {
        name: parsed.data.customerName,
        phone,
      },
      create: {
        tenantId: tenant.id,
        email: customerEmail,
        name: parsed.data.customerName,
        phone,
      },
    });

    // Generate order number
    const prefix = tenant.slug
      .split("-")
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 3);
    const orderNumber = generateOrderNumber(prefix);

    // Create order
    const order = await prisma.order.create({
      data: {
        tenantId: tenant.id,
        orderNumber,
        customerId: customer.id,
        subtotal,
        deliveryFee,
        discountAmount,
        total,
        deliveryZoneId: deliveryZone.id,
        discountId: appliedDiscountId,
        deliveryAddress: parsed.data.deliveryAddress,
        customerNote: parsed.data.customerNote || null,
        notifyByEmail: parsed.data.notifyByEmail && hasRealEmail,
        notifyBySMS: parsed.data.notifyBySMS,
        items: {
          create: cartItems.data.map((item) => {
            const product = productMap.get(item.productId)!;
            const variant = item.variantId
              ? product.variants.find((v) => v.id === item.variantId)
              : null;

            return {
              productId: item.productId,
              variantId: item.variantId ?? null,
              name: item.name,
              price: variant ? variant.price : product.price,
              quantity: item.quantity,
            };
          }),
        },
      },
    });

    // Build callback URL
    const headersList = await headers();
    const host = headersList.get("host") ?? "localhost:3000";
    const protocol = host.includes("localhost") ? "http" : "https";
    const callbackUrl = `${protocol}://${host}/order/${orderNumber}`;

    // Initialize Paystack transaction
    const paystackResponse = await initializeTransaction({
      email: customerEmail,
      amount: Math.round(total * 100), // pesewas
      callbackUrl,
      subaccountCode: tenant.paystackSubaccountCode,
      metadata: {
        orderId: order.id,
        tenantId: tenant.id,
        orderNumber,
      },
    });

    // Save the Paystack reference
    await prisma.order.update({
      where: { id: order.id },
      data: { paymentRef: paystackResponse.data.reference },
    });

    return { success: true, authorizationUrl: paystackResponse.data.authorization_url };
  } catch (error) {
    console.error("createCheckoutOrder error:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
