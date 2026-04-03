"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  generalSettingsSchema,
  themeSettingsSchema,
  notificationSettingsSchema,
  paymentSettingsSchema,
} from "@/lib/validations/settings";

type ActionResult = { success: true } | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

export async function updateGeneralSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = generalSettingsSchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
      contactEmail: formData.get("contactEmail"),
      contactPhone: formData.get("contactPhone"),
      address: formData.get("address"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description || null,
        contactEmail: parsed.data.contactEmail || null,
        contactPhone: parsed.data.contactPhone || null,
        address: parsed.data.address || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateGeneralSettings error:", error);
    return { success: false, error: "Failed to update settings." };
  }
}

export async function updateThemeSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = themeSettingsSchema.safeParse({
      primaryColor: formData.get("primaryColor"),
      accentColor: formData.get("accentColor"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: parsed.data,
    });

    return { success: true };
  } catch (error) {
    console.error("updateThemeSettings error:", error);
    return { success: false, error: "Failed to update theme." };
  }
}

export async function updateNotificationSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = notificationSettingsSchema.safeParse({
      emailEnabled: formData.get("emailEnabled") === "on",
      smsEnabled: formData.get("smsEnabled") === "on",
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        emailEnabled: parsed.data.emailEnabled,
        smsEnabled: parsed.data.smsEnabled,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updateNotificationSettings error:", error);
    return { success: false, error: "Failed to update notifications." };
  }
}

export async function updatePaymentSettings(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = paymentSettingsSchema.safeParse({
      paystackSubaccountCode: formData.get("paystackSubaccountCode"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    await prisma.tenant.update({
      where: { id: tenantId },
      data: {
        paystackSubaccountCode: parsed.data.paystackSubaccountCode || null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("updatePaymentSettings error:", error);
    return { success: false, error: "Failed to update payment settings." };
  }
}

export async function updateLogoUrl(logoUrl: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    await prisma.tenant.update({
      where: { id: tenantId },
      data: { logoUrl },
    });
    return { success: true };
  } catch (error) {
    console.error("updateLogoUrl error:", error);
    return { success: false, error: "Failed to update logo." };
  }
}
