import { prisma } from "@/lib/db";
import { StatsCard } from "@/components/platform/stats-card";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";

export default async function PlatformOverviewPage() {
  const [totalStores, claimedStores, totalOrders, revenueResult, recentTenants] =
    await Promise.all([
      prisma.tenant.count(),
      prisma.tenant.count({ where: { users: { some: {} } } }),
      prisma.order.count(),
      prisma.order.aggregate({
        _sum: { total: true },
        where: { paymentStatus: "PAID" },
      }),
      prisma.tenant.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { orders: true, users: true } } },
      }),
    ]);

  const totalRevenue = Number(revenueResult._sum.total ?? 0);
  const unclaimedStores = totalStores - claimedStores;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Overview</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Platform-wide metrics across all stores
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

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard
          label="Total Stores"
          value={totalStores}
          sub={
            unclaimedStores > 0
              ? `${unclaimedStores} unclaimed`
              : "All claimed"
          }
        />
        <StatsCard
          label="Claimed"
          value={claimedStores}
          sub={`of ${totalStores} store${totalStores !== 1 ? "s" : ""}`}
        />
        <StatsCard label="Total Orders" value={totalOrders} />
        <StatsCard
          label="Revenue"
          value={`₵${totalRevenue.toFixed(2)}`}
          sub="Paid orders"
        />
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-zinc-900">Recent Stores</h2>
          <Link
            href="/platform/stores"
            className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-zinc-100">
          {recentTenants.map((tenant) => (
            <Link
              key={tenant.id}
              href={`/platform/stores/${tenant.slug}`}
              className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-zinc-50/60"
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-7 w-7 rounded border border-zinc-200/60"
                  style={{ backgroundColor: tenant.primaryColor }}
                />
                <div>
                  <p className="text-sm font-medium text-zinc-900">
                    {tenant.name}
                  </p>
                  <p className="text-xs text-zinc-400">{tenant.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm tabular-nums text-zinc-900">
                    {tenant._count.orders}
                  </p>
                  <p className="text-xs text-zinc-400">orders</p>
                </div>
                {tenant._count.users > 0 ? (
                  <span className="w-20 rounded-full bg-emerald-50 px-2.5 py-1 text-center text-xs font-medium text-emerald-700">
                    Claimed
                  </span>
                ) : (
                  <span className="w-20 rounded-full bg-amber-50 px-2.5 py-1 text-center text-xs font-medium text-amber-700">
                    Unclaimed
                  </span>
                )}
              </div>
            </Link>
          ))}
          {recentTenants.length === 0 && (
            <div className="px-5 py-12 text-center">
              <p className="text-sm text-zinc-400">No stores created yet.</p>
              <Link
                href="/platform/stores/new"
                className="mt-2 inline-block text-sm text-zinc-900 underline underline-offset-2"
              >
                Create the first one
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
