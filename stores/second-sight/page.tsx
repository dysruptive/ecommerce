import type { Tenant } from "@/types";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { SecondSightFontProvider } from "./font-provider";
import { Hero } from "./sections/hero";
import { BentoCategories } from "./sections/collections";
import { SignatureEdit } from "./sections/featured-frames";
import { BrandStory } from "./sections/brand-promise";

export async function SecondSightPage({ tenant }: { tenant: Tenant }) {
  const [categories, featuredProducts] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
      take: 3,
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 4,
    }),
  ]);

  const products = featuredProducts.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice?.toNumber(),
    imageUrl: p.images[0]?.url,
  }));

  return (
    <SecondSightFontProvider>
      <StoreLayout tenant={tenant}>
        <Hero />
        <BentoCategories categories={categories} />
        <SignatureEdit products={products} />
        <BrandStory />
      </StoreLayout>
    </SecondSightFontProvider>
  );
}
