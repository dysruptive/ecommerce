import Link from "next/link";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pagination } from "@/components/dashboard/pagination";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { ProductsTable } from "./products-table";
import { CategoriesDialog } from "./categories-dialog";
import { ProductSearch } from "./product-search";

const PAGE_SIZE = 25;

interface Props {
  searchParams: Promise<{ q?: string; page?: string }>;
}

export default async function ProductsPage({ searchParams }: Props) {
  const tenant = await getTenantFromSession();
  const { q, page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const where = {
    tenantId: tenant.id,
    isArchived: false,
    ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {}),
  };

  const [total, products, categories] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: { category: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
    prisma.category.findMany({
      where: { tenantId: tenant.id },
      include: { _count: { select: { products: true } } },
      orderBy: { name: "asc" },
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Products"
        description={`${total} product${total !== 1 ? "s" : ""}`}
        action={
          <div className="flex gap-2">
            <CategoriesDialog categories={JSON.parse(JSON.stringify(categories))} />
            <Link
              href="/admin/products/new"
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524]"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
        }
      />
      <ProductSearch current={q} />
      <ProductsTable products={JSON.parse(JSON.stringify(products))} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
