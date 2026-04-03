import type { Tenant } from "@/types";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { Hero } from "./sections/hero";
import { Collections } from "./sections/collections";
import { FeaturedFrames } from "./sections/featured-frames";
import { BrandPromise } from "./sections/brand-promise";

export async function SecondSightPage({ tenant }: { tenant: Tenant }) {
  const [categories, featured] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
      take: 2,
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const featuredItems = featured.map((p) => ({
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
      <Collections categories={categories} />
      <FeaturedFrames products={featuredItems} />
      <BrandPromise />
    </StoreLayout>
  );
}
