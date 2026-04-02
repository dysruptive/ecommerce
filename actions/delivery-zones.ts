"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { deliveryZoneSchema } from "@/lib/validations/delivery-zone";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

export async function createDeliveryZone(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = deliveryZoneSchema.safeParse({
      name: formData.get("name"),
      regions: formData.get("regions"),
      fee: formData.get("fee"),
      isActive: formData.get("isActive") === "on",
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const maxPosition = await prisma.deliveryZone.aggregate({
      where: { tenantId },
      _max: { position: true },
    });

    await prisma.deliveryZone.create({
      data: {
        tenantId,
        ...parsed.data,
        position: (maxPosition._max.position ?? -1) + 1,
      },
    });

    revalidatePath("/admin/delivery-zones");
    return { success: true };
  } catch (error) {
    console.error("createDeliveryZone error:", error);
    return { success: false, error: "Failed to create delivery zone." };
  }
}

export async function updateDeliveryZone(
  zoneId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = deliveryZoneSchema.safeParse({
      name: formData.get("name"),
      regions: formData.get("regions"),
      fee: formData.get("fee"),
      isActive: formData.get("isActive") === "on",
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const zone = await prisma.deliveryZone.findFirst({
      where: { id: zoneId, tenantId },
    });
    if (!zone) {
      return { success: false, error: "Delivery zone not found." };
    }

    await prisma.deliveryZone.update({
      where: { id: zoneId },
      data: parsed.data,
    });

    revalidatePath("/admin/delivery-zones");
    return { success: true };
  } catch (error) {
    console.error("updateDeliveryZone error:", error);
    return { success: false, error: "Failed to update delivery zone." };
  }
}

/**
 * Accepts an ordered array of zone IDs and updates each zone's position to
 * match the index in that array.
 */
export async function reorderDeliveryZones(
  orderedIds: string[],
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();

    // Verify all zones belong to this tenant
    const zones = await prisma.deliveryZone.findMany({
      where: { id: { in: orderedIds }, tenantId },
      select: { id: true },
    });
    if (zones.length !== orderedIds.length) {
      return { success: false, error: "One or more zones not found." };
    }

    await prisma.$transaction(
      orderedIds.map((id, position) =>
        prisma.deliveryZone.update({ where: { id }, data: { position } }),
      ),
    );

    revalidatePath("/admin/delivery-zones");
    return { success: true };
  } catch (error) {
    console.error("reorderDeliveryZones error:", error);
    return { success: false, error: "Failed to reorder zones." };
  }
}

export async function deleteDeliveryZone(zoneId: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const zone = await prisma.deliveryZone.findFirst({
      where: { id: zoneId, tenantId },
      include: { _count: { select: { orders: true } } },
    });
    if (!zone) {
      return { success: false, error: "Delivery zone not found." };
    }
    if (zone._count.orders > 0) {
      return {
        success: false,
        error: `Cannot delete — ${zone._count.orders} orders use this zone.`,
      };
    }

    await prisma.deliveryZone.delete({ where: { id: zoneId } });
    revalidatePath("/admin/delivery-zones");
    return { success: true };
  } catch (error) {
    console.error("deleteDeliveryZone error:", error);
    return { success: false, error: "Failed to delete delivery zone." };
  }
}
