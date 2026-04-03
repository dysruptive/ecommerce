import { z } from "zod";

export const generalSettingsSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100),
  description: z.string().max(500).optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
});



export const paymentSettingsSchema = z.object({
  bankCode: z.string().min(1, "Please select a bank"),
  accountNumber: z.string().regex(/^\d{6,}$/, "Account number must be at least 6 digits"),
});

export const subaccountCodeSchema = z.object({
  paystackSubaccountCode: z.string().max(100).optional().or(z.literal("")),
});
