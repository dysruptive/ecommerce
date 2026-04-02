import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { ProductForm } from "../product-form";
import { createProduct } from "@/actions/products";

export default async function NewProductPage() {
  const tenant = await getTenantFromSession();

  const categories = await prisma.category.findMany({
    where: { tenantId: tenant.id },
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <PageHeader title="New Product" />
      <ProductForm
        categories={JSON.parse(JSON.stringify(categories))}
        tenantSlug={tenant.slug}
        action={createProduct}
      />
    </div>
  );
}
