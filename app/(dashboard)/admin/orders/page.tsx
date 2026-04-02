import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { OrdersTable } from "./orders-table";
import { OrderFilters } from "./order-filters";
import type { Prisma } from "@/generated/prisma/client";

interface Props {
  searchParams: Promise<{
    status?: string;
    payment?: string;
  }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const tenant = await getTenantFromSession();
  const params = await searchParams;

  const where: Prisma.OrderWhereInput = { tenantId: tenant.id };
  if (params.status) {
    where.status = params.status as Prisma.EnumOrderStatusFilter;
  }
  if (params.payment) {
    where.paymentStatus = params.payment as Prisma.EnumPaymentStatusFilter;
  }

  const orders = await prisma.order.findMany({
    where,
    include: { customer: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader title="Orders" description={`${orders.length} orders`} />
      <OrderFilters
        currentStatus={params.status}
        currentPayment={params.payment}
      />
      <OrdersTable orders={JSON.parse(JSON.stringify(orders))} />
    </div>
  );
}
