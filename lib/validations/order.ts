import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100),
  customerEmail: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  customerPhone: z.string().min(1, "Phone number is required").max(20),
  deliveryAddress: z.string().min(1, "Delivery address is required").max(500),
  deliveryZoneId: z.string().optional().or(z.literal("")),
  discountCode: z.string().max(50).optional().or(z.literal("")),
  customerNote: z.string().max(500).optional().or(z.literal("")),
  notifyByEmail: z.preprocess((v) => v === "on", z.boolean()).default(false),
  notifyBySMS: z.preprocess((v) => v === "on", z.boolean()).default(false),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional(),
});
