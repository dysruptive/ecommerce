import { ShoppingCart, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { RangeTabs } from "./range-tabs";
import Link from "next/link";

const PAY_STYLES: Record<string, string> = {
  PAID: "bg-emerald-50 text-emerald-700",
  UNPAID: "bg-amber-50 text-amber-700",
  REFUNDED: "bg-rose-50 text-rose-700",
  FAILED: "bg-red-50 text-red-700",
};

interface Props {
  searchParams: Promise<{ range?: string }>;
}

function getRangeFilter(range: string): { gte: Date } | undefined {
  const now = new Date();
  if (range === "today") {
    return { gte: new Date(now.getFullYear(), now.getMonth(), now.getDate()) };
  }
  if (range === "week") {
    const start = new Date(now);
    start.setDate(now.getDate() - now.getDay());
    start.setHours(0, 0, 0, 0);
    return { gte: start };
  }
  if (range === "month") {
    return { gte: new Date(now.getFullYear(), now.getMonth(), 1) };
  }
  return undefined;
}

async function getStats(tenantId: string, createdAt?: { gte: Date }) {
  const dateFilter = createdAt ? { createdAt } : {};
  const [totalOrders, pendingOrders, lowStock, recent] = await Promise.all([
    prisma.order.count({ where: { tenantId, ...dateFilter } }),
    prisma.order.count({ where: { tenantId, status: "PENDING", ...dateFilter } }),
    prisma.product.count({
      where: { tenantId, isArchived: false, stock: { lte: 5 }, trackStock: true },
    }),
    prisma.order.findMany({
      where: { tenantId, ...dateFilter },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);
  const rev = await prisma.order.aggregate({
    where: { tenantId, paymentStatus: "PAID", ...dateFilter },
    _sum: { total: true },
  });
  return {
    totalOrders,
    pendingOrders,
    lowStock,
    revenue: rev._sum.total?.toNumber() ?? 0,
    recent,
  };
}

export default async function DashboardOverviewPage({ searchParams }: Props) {
  const tenant = await getTenantFromSession();
  const { range = "all" } = await searchParams;
  const dateFilter = getRangeFilter(range);
  const s = await getStats(tenant.id, dateFilter);

  const cards = [
    { label: "Total Orders", value: s.totalOrders, icon: ShoppingCart, cls: "bg-blue-50 text-blue-600" },
    { label: "Revenue", value: `₵${s.revenue.toFixed(2)}`, icon: DollarSign, cls: "bg-emerald-50 text-emerald-600" },
    { label: "Pending", value: s.pendingOrders, icon: Clock, cls: "bg-amber-50 text-amber-600" },
    { label: "Low Stock", value: s.lowStock, icon: AlertTriangle, cls: s.lowStock > 0 ? "bg-red-50 text-red-600" : "bg-stone-50 text-stone-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <PageHeader title="Overview" description={tenant.name} />
        <RangeTabs current={range} />
      </div>

      <OnboardingChecklist />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="rounded-xl border border-[#E5E2DB] bg-white p-5 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
            style={{ animationDelay: `${i * 50}ms`, animationFillMode: "both" }}
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-[#A8A29E]">
                {card.label}
              </p>
              <div className={`rounded-lg p-2 ${card.cls}`}>
                <card.icon className="h-4 w-4" />
              </div>
            </div>
            <p className="text-2xl font-bold tabular-nums text-[#1C1917]">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-[#E5E2DB] bg-white">
        <div className="flex items-center justify-between border-b border-[#E5E2DB] px-5 py-4">
          <h2 className="text-sm font-semibold text-[#1C1917]">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs font-medium text-[#B45309] hover:underline underline-offset-2">
            View all →
          </Link>
        </div>
        {s.recent.length === 0 ? (
          <p className="px-5 py-10 text-center text-sm text-[#A8A29E]">
            No orders yet. Share your store link to start receiving orders.
          </p>
        ) : (
          <div className="divide-y divide-[#F5F3EE]">
            {s.recent.map((order) => (
              <Link
                key={order.id}
                href={`/admin/orders/${order.id}`}
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#FAFAF8]"
              >
                <div>
                  <p className="text-sm font-medium text-[#1C1917]">{order.orderNumber}</p>
                  <p className="text-xs text-[#A8A29E]">{order.customer.name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold tabular-nums text-[#1C1917]">
                    ₵{order.total.toNumber().toFixed(2)}
                  </span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${PAY_STYLES[order.paymentStatus] ?? "bg-stone-50 text-stone-500"}`}>
                    {order.paymentStatus.charAt(0) + order.paymentStatus.slice(1).toLowerCase()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
