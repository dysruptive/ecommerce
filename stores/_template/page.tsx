import type { Tenant } from "@/types";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { Hero } from "./sections/hero";
import { CategoryGrid } from "./sections/category-grid";
import { ProductGrid } from "./sections/product-grid";

// ─── Copy this file to stores/<your-slug>/page.tsx to start a new store ───────
// 1. Duplicate the whole stores/_template/ folder and rename it to your slug
// 2. Add a single entry to STORE_REGISTRY in stores/registry.ts
// 3. Customise sections/ to match the store's brand

export async function TemplatePage({ tenant }: { tenant: Tenant }) {
  const [categories, products] = await Promise.all([
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      orderBy: { name: "asc" },
    }),
    prisma.product.findMany({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
  ]);

  const productItems = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice?.toNumber(),
    imageUrl: p.images[0]?.url,
  }));

  return (
    <StoreLayout tenant={tenant}>
      <Hero tenant={tenant} />
      <CategoryGrid categories={categories} />
      <ProductGrid products={productItems} />
    </StoreLayout>
  );
}
