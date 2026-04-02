import type { Tenant } from "@/types";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { Hero } from "./sections/hero";
import { TrustBadges } from "./sections/trust-badges";
import { CategoryGrid } from "./sections/category-grid";
import { Bestsellers } from "./sections/bestsellers";
import { NewArrivals } from "./sections/new-arrivals";
import { DeliveryBanner } from "./sections/delivery-banner";

export async function FreshMartPage({ tenant }: { tenant: Tenant }) {
  const [categories, featured, newArrivals] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "asc" },
      take: 4,
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const toItems = (products: typeof featured) =>
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price.toNumber(),
      compareAtPrice: p.compareAtPrice?.toNumber(),
      imageUrl: p.images[0]?.url,
    }));

  return (
    <StoreLayout tenant={tenant}>
      <Hero />
      <TrustBadges />
      <CategoryGrid categories={categories} />
      <Bestsellers products={toItems(featured)} />
      <NewArrivals products={toItems(newArrivals)} />
      <DeliveryBanner />
    </StoreLayout>
  );
}
