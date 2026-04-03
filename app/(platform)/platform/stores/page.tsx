import { prisma } from "@/lib/db";
import { StoresTable } from "@/components/platform/stores-table";
import Link from "next/link";
import { Plus } from "lucide-react";

export default async function StoresPage() {
  const [tenants, revenueByStore] = await Promise.all([
    prisma.tenant.findMany({
      include: {
        _count: { select: { orders: true, users: true, products: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.groupBy({
      by: ["tenantId"],
      where: { paymentStatus: "PAID" },
      _sum: { total: true },
    }),
  ]);

  const revenueMap = Object.fromEntries(
    revenueByStore.map((r) => [r.tenantId, Number(r._sum.total ?? 0)]),
  );

  const stores = tenants.map((t) => ({
    ...t,
    revenue: revenueMap[t.id] ?? 0,
  }));

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Stores</h1>
          <p className="mt-1 text-sm text-zinc-500">
            {tenants.length} store{tenants.length !== 1 ? "s" : ""} on the
            platform
          </p>
        </div>
        <Link
          href="/platform/stores/new"
          className="flex items-center gap-2 rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
        >
          <Plus className="h-4 w-4" />
          New Store
        </Link>
      </div>
      <StoresTable stores={stores} />
    </div>
  );
}
