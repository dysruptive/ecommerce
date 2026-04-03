import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import type { Prisma } from "@/generated/prisma/client";
import { STORE_REGISTRY } from "@/stores/registry";
import { TemplateProductsListing } from "@/stores/_template/products/listing";

interface Props {
  searchParams: Promise<{ category?: string; q?: string; sort?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: "asc" },
  });

  const where: Prisma.ProductWhereInput = {
    tenantId: tenant.id,
    isPublished: true,
    isArchived: false,
  };

  if (params.category) {
    const cat = categories.find((c) => c.slug === params.category);
    if (cat) where.categoryId = cat.id;
  }

  if (params.q) {
    where.name = { contains: params.q, mode: "insensitive" };
  }

  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { price: "asc" };
  if (params.sort === "price-desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy,
  });

  const productItems = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    price: p.price.toNumber(),
    compareAtPrice: p.compareAtPrice?.toNumber(),
    imageUrl: p.images[0]?.url,
  }));

  const Page =
    STORE_REGISTRY[tenant.slug]?.ProductsPage ?? TemplateProductsListing;

  return (
    <Page
      tenant={tenant}
      products={productItems}
      categories={categories.map((c) => ({ slug: c.slug, name: c.name }))}
      filters={{ category: params.category, q: params.q, sort: params.sort }}
    />
  );
}
