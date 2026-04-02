import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(2000).optional().or(z.literal("")),
  price: z.coerce.number().positive("Price must be positive"),
  compareAtPrice: z.coerce.number().positive().optional().or(z.literal("")),
  sku: z.string().max(100).optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  trackStock: z.boolean(),
  isPublished: z.boolean(),
  categoryId: z.string().optional().or(z.literal("")),
});

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().or(z.literal("")),
});
