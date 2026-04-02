"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { discountSchema } from "@/lib/validations/discount";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

export async function createDiscount(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = discountSchema.safeParse({
      code: formData.get("code"),
      type: formData.get("type"),
      value: formData.get("value"),
      minPurchase: formData.get("minPurchase") || undefined,
      maxUses: formData.get("maxUses") || undefined,
      isActive: formData.get("isActive") === "on",
      expiresAt: formData.get("expiresAt") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const existing = await prisma.discount.findUnique({
      where: { tenantId_code: { tenantId, code: parsed.data.code } },
    });
    if (existing) {
      return { success: false, error: "A discount with this code already exists." };
    }

    await prisma.discount.create({
      data: {
        tenantId,
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        minPurchase:
          parsed.data.minPurchase
            ? Number(parsed.data.minPurchase)
            : null,
        maxUses:
          parsed.data.maxUses
            ? Number(parsed.data.maxUses)
            : null,
        isActive: parsed.data.isActive,
        expiresAt:
          parsed.data.expiresAt && parsed.data.expiresAt !== ""
            ? new Date(parsed.data.expiresAt)
            : null,
      },
    });

    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (error) {
    console.error("createDiscount error:", error);
    return { success: false, error: "Failed to create discount." };
  }
}

export async function updateDiscount(
  discountId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = discountSchema.safeParse({
      code: formData.get("code"),
      type: formData.get("type"),
      value: formData.get("value"),
      minPurchase: formData.get("minPurchase") || undefined,
      maxUses: formData.get("maxUses") || undefined,
      isActive: formData.get("isActive") === "on",
      expiresAt: formData.get("expiresAt") || undefined,
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const discount = await prisma.discount.findFirst({
      where: { id: discountId, tenantId },
    });
    if (!discount) {
      return { success: false, error: "Discount not found." };
    }

    if (parsed.data.code !== discount.code) {
      const existing = await prisma.discount.findUnique({
        where: { tenantId_code: { tenantId, code: parsed.data.code } },
      });
      if (existing) {
        return { success: false, error: "A discount with this code already exists." };
      }
    }

    await prisma.discount.update({
      where: { id: discountId },
      data: {
        code: parsed.data.code,
        type: parsed.data.type,
        value: parsed.data.value,
        minPurchase:
          parsed.data.minPurchase
            ? Number(parsed.data.minPurchase)
            : null,
        maxUses:
          parsed.data.maxUses
            ? Number(parsed.data.maxUses)
            : null,
        isActive: parsed.data.isActive,
        expiresAt:
          parsed.data.expiresAt && parsed.data.expiresAt !== ""
            ? new Date(parsed.data.expiresAt)
            : null,
      },
    });

    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (error) {
    console.error("updateDiscount error:", error);
    return { success: false, error: "Failed to update discount." };
  }
}

export async function deleteDiscount(discountId: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const discount = await prisma.discount.findFirst({
      where: { id: discountId, tenantId },
    });
    if (!discount) {
      return { success: false, error: "Discount not found." };
    }

    await prisma.discount.delete({ where: { id: discountId } });
    revalidatePath("/admin/discounts");
    return { success: true };
  } catch (error) {
    console.error("deleteDiscount error:", error);
    return { success: false, error: "Failed to delete discount." };
  }
}
