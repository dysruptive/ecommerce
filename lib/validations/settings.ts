import { z } from "zod";

export const generalSettingsSchema = z.object({
  name: z.string().min(1, "Store name is required").max(100),
  description: z.string().max(500).optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().max(20).optional().or(z.literal("")),
  address: z.string().max(200).optional().or(z.literal("")),
});

export const themeSettingsSchema = z.object({
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color"),
});

export const notificationSettingsSchema = z.object({
  emailEnabled: z.boolean(),
  smsEnabled: z.boolean(),
});

export const paymentSettingsSchema = z.object({
  paystackSubaccountCode: z.string().max(100).optional().or(z.literal("")),
});
