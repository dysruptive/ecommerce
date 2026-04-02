import { z } from "zod";

export const discountSchema = z.object({
  code: z.string().min(1, "Code is required").max(50).transform((v) => v.toUpperCase()),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"]),
  value: z.coerce.number().positive("Value must be positive"),
  minPurchase: z.coerce.number().min(0).optional().or(z.literal("")),
  maxUses: z.coerce.number().int().positive().optional().or(z.literal("")),
  isActive: z.boolean(),
  expiresAt: z.string().optional().or(z.literal("")),
});
