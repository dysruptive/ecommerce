import { notFound } from "next/navigation";
import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { ProductForm } from "../product-form";
import { updateProduct } from "@/actions/products";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const tenant = await getTenantFromSession();

  const [product, categories] = await Promise.all([
    prisma.product.findFirst({
      where: { id, tenantId: tenant.id },
      include: {
        images: { orderBy: { position: "asc" } },
        variants: { orderBy: { name: "asc" } },
      },
    }),
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!product) notFound();

  const boundUpdate = updateProduct.bind(null, product.id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title={`Edit: ${product.name}`} />
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        product={JSON.parse(JSON.stringify(product))}
        tenantSlug={tenant.slug}
        action={boundUpdate}
      />
    </div>
  );
}
