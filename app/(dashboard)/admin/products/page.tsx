import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { ProductsTable } from "./products-table";
import { CategoriesDialog } from "./categories-dialog";

export default async function ProductsPage() {
  const tenant = await getTenantFromSession();

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { tenantId: tenant.id, isArchived: false },
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        description={`${products.length} products`}
        action={
          <div className="flex gap-2">
            <CategoriesDialog
              categories={JSON.parse(JSON.stringify(categories))}
            />
            <Button asChild>
              <Link href="/admin/products/new">
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Link>
            </Button>
          </div>
        }
      />
      <ProductsTable products={JSON.parse(JSON.stringify(products))} />
    </div>
  );
}
