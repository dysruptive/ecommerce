"use server";

import { randomBytes } from "crypto";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { createTenantSchema } from "@/lib/validations/platform";
import { revalidatePath } from "next/cache";

type CreateTenantResult =
  | { success: true; inviteUrl: string; slug: string }
  | { success: false; error: string; fieldErrors?: Record<string, string[]> };

type RegenerateResult =
  | { success: true; inviteUrl: string }
  | { success: false; error: string };

async function requirePlatformAdmin() {
  const session = await auth();
  if (session?.user?.role !== "PLATFORM_ADMIN") {
    throw new Error("Unauthorized");
  }
}

function buildInviteUrl(slug: string, token: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base}/auth/invite/${token}`;
}

export async function createTenant(
  _prev: CreateTenantResult | null,
  formData: FormData,
): Promise<CreateTenantResult> {
  await requirePlatformAdmin();

  const raw = {
    name: formData.get("name"),
    slug: formData.get("slug"),
    primaryColor: formData.get("primaryColor") || "#1a1c1b",
    accentColor: formData.get("accentColor") || "#6c5e06",
    contactEmail: formData.get("contactEmail") || "",
    contactPhone: formData.get("contactPhone") || "",
    address: formData.get("address") || "",
  };

  const parsed = createTenantSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  const { name, slug, primaryColor, accentColor, contactEmail, contactPhone, address } =
    parsed.data;

  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    return { success: false, error: `A store with slug "${slug}" already exists.` };
  }

  const inviteToken = randomBytes(32).toString("hex");
  const inviteTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.tenant.create({
    data: {
      name,
      slug,
      primaryColor,
      accentColor,
      contactEmail: contactEmail || null,
      contactPhone: contactPhone || null,
      address: address || null,
      inviteToken,
      inviteTokenExpiresAt,
    },
  });

  revalidatePath("/platform/stores");

  return {
    success: true,
    inviteUrl: buildInviteUrl(slug, inviteToken),
    slug,
  };
}

export async function regenerateInvite(slug: string): Promise<RegenerateResult> {
  await requirePlatformAdmin();

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, name: true, users: { select: { id: true }, take: 1 } },
  });

  if (!tenant) {
    return { success: false, error: "Store not found." };
  }

  if (tenant.users.length > 0) {
    return {
      success: false,
      error: "This store has already been claimed by its owner.",
    };
  }

  const inviteToken = randomBytes(32).toString("hex");
  const inviteTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.tenant.update({
    where: { slug },
    data: { inviteToken, inviteTokenExpiresAt },
  });

  revalidatePath(`/platform/stores/${slug}`);

  return { success: true, inviteUrl: buildInviteUrl(slug, inviteToken) };
}
