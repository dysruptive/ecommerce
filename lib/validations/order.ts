import { z } from "zod";

export const checkoutSchema = z.object({
  customerName: z.string().min(1, "Name is required").max(100),
  customerEmail: z.string().email("Valid email is required"),
  customerPhone: z.string().min(1, "Phone is required").max(20),
  deliveryAddress: z.string().min(1, "Delivery address is required").max(500),
  deliveryZoneId: z.string().min(1, "Please select a delivery zone"),
  discountCode: z.string().max(50).optional().or(z.literal("")),
  customerNote: z.string().max(500).optional().or(z.literal("")),
});

export const cartItemSchema = z.object({
  productId: z.string(),
  variantId: z.string().optional(),
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  imageUrl: z.string().optional(),
});
