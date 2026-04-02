import type { Tenant } from "@/types";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { Hero } from "./sections/hero";
import { CategoryShowcase } from "./sections/category-showcase";
import { NewArrivals } from "./sections/new-arrivals";
import { SaleSection } from "./sections/sale-section";
import { BrandBar } from "./sections/brand-bar";

export async function StyleHubGhPage({ tenant }: { tenant: Tenant }) {
  const [categories, newArrivals, sale] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
    // Products with a compareAtPrice are on sale
    prisma.product.findMany({
      where: {
        tenantId: tenant.id,
        isPublished: true,
        isArchived: false,
        compareAtPrice: { not: null },
      },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const toItems = (products: typeof newArrivals) =>
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
      <CategoryShowcase categories={categories} />
      <NewArrivals products={toItems(newArrivals)} />
      <SaleSection products={toItems(sale)} />
      <BrandBar />
    </StoreLayout>
  );
}
