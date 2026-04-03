import { PageHeader } from "@/components/dashboard/page-header";
import { Pagination } from "@/components/dashboard/pagination";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { OrdersTable } from "./orders-table";
import { OrderFilters } from "./order-filters";
import type { Prisma } from "@/generated/prisma/client";

const PAGE_SIZE = 20;

interface Props {
  searchParams: Promise<{
    status?: string;
    payment?: string;
    q?: string;
    from?: string;
    to?: string;
    page?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const tenant = await getTenantFromSession();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10));

  const where: Prisma.OrderWhereInput = { tenantId: tenant.id };
  if (params.status) where.status = params.status as Prisma.EnumOrderStatusFilter;
  if (params.payment) where.paymentStatus = params.payment as Prisma.EnumPaymentStatusFilter;
  if (params.q) {
    const q = params.q.trim();
    where.OR = [
      { orderNumber: { contains: q, mode: "insensitive" } },
      { customer: { name: { contains: q, mode: "insensitive" } } },
    ];
  }
  if (params.from || params.to) {
    where.createdAt = {
      ...(params.from ? { gte: new Date(params.from) } : {}),
      ...(params.to ? { lte: new Date(`${params.to}T23:59:59`) } : {}),
    };
  }

  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Orders"
        description={`${total} order${total !== 1 ? "s" : ""}`}
      />
      <OrderFilters
        currentStatus={params.status}
        currentPayment={params.payment}
        currentSearch={params.q}
        currentFrom={params.from}
        currentTo={params.to}
      />
      <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />
      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}
