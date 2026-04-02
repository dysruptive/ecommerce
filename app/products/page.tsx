import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductCard } from "@/components/store/product-card";
import { ProductFilters } from "./product-filters";
import type { Prisma } from "@/generated/prisma/client";

interface Props {
  searchParams: Promise<{
    category?: string;
    q?: string;
    sort?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();
  const params = await searchParams;

  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
    orderBy: { name: "asc" },
  });

  // Build the where clause
  const where: Prisma.ProductWhereInput = {
    tenantId: tenant.id,
    isPublished: true,
    isArchived: false,
  };

  if (params.category) {
    const category = categories.find((c) => c.slug === params.category);
    if (category) where.categoryId = category.id;
  }

  if (params.q) {
    where.name = { contains: params.q, mode: "insensitive" };
  }

  // Build the orderBy
  let orderBy: Prisma.ProductOrderByWithRelationInput = { createdAt: "desc" };
  if (params.sort === "price-asc") orderBy = { price: "asc" };
  if (params.sort === "price-desc") orderBy = { price: "desc" };

  const products = await prisma.product.findMany({
    where,
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
    orderBy,
  });

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Products</h1>

        <ProductFilters
          categories={categories.map((c) => ({
            slug: c.slug,
            name: c.name,
          }))}
          currentCategory={params.category}
          currentSort={params.sort}
          currentQuery={params.q}
        />

        {products.length === 0 ? (
          <p className="mt-8 text-center text-muted-foreground">
            No products found.
          </p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                slug={product.slug}
                name={product.name}
                price={product.price.toNumber()}
                compareAtPrice={product.compareAtPrice?.toNumber()}
                imageUrl={product.images[0]?.url}
              />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
