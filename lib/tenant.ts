import { headers } from "next/headers";
import { cache } from "react";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import type { Tenant } from "@/generated/prisma/client";

/**
 * Read tenant identification from request headers set by middleware.
 * Returns null if no tenant context (e.g., marketing site).
 */
async function getTenantHints(): Promise<{
  slug: string;
  lookupType: "slug" | "domain";
} | null> {
  const headersList = await headers();
  const slug = headersList.get("x-tenant-slug");
  const lookupType = headersList.get("x-tenant-lookup-type") as
    | "slug"
    | "domain"
    | null;

  if (!slug || !lookupType) return null;
  return { slug, lookupType };
}

/**
 * Resolve the current tenant from request headers.
 * Cached per-request via React `cache()` to avoid duplicate DB queries.
 * Throws if called outside a tenant context.
 */
export const getCurrentTenant = cache(async (): Promise<Tenant> => {
  const hints = await getTenantHints();

  if (!hints) {
    throw new Error("No tenant context — this route requires a tenant");
  }

  const tenant = await prisma.tenant.findUnique({
    where:
      hints.lookupType === "slug"
        ? { slug: hints.slug }
        : { customDomain: hints.slug },
  });

  if (!tenant) {
    notFound();
  }

  return tenant;
});

/**
 * Check if the current request has tenant context (is on a store subdomain/domain).
 */
export async function hasTenantContext(): Promise<boolean> {
  const hints = await getTenantHints();
  return hints !== null;
}

/**
 * Resolve tenant from the authenticated user's session.
 * Use this in dashboard/admin contexts where tenant comes from session, not hostname.
 */
export const getTenantFromSession = cache(async (): Promise<Tenant> => {
  const { auth } = await import("@/lib/auth");
  const session = await auth();

  if (!session?.user?.tenantId) {
    throw new Error("No authenticated session with tenantId");
  }

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
  });

  if (!tenant) {
    throw new Error(`Tenant not found for session: ${session.user.tenantId}`);
  }

  return tenant;
});

/**
 * Helper to add tenantId to a Prisma where clause.
 */
export function withTenantId<T extends Record<string, unknown>>(
  tenantId: string,
  where: T,
): T & { tenantId: string } {
  return { ...where, tenantId };
}
