"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getTenantFromSession } from "@/lib/tenant";

export async function dismissOnboarding(): Promise<void> {
  const tenant = await getTenantFromSession();

  await prisma.tenant.update({
    where: { id: tenant.id },
    data: { onboardingDismissedAt: new Date() },
  });

  revalidatePath("/admin");
}
