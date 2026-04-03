import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { StatsCard } from "@/components/platform/stats-card";
import { InvitePanel } from "@/components/platform/invite-panel";

export default async function StoreDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true },
      },
      _count: {
        select: { products: true, orders: true, customers: true },
      },
    },
  });

  if (!tenant) notFound();

  const revenueResult = await prisma.order.aggregate({
    where: { tenantId: tenant.id, paymentStatus: "PAID" },
    _sum: { total: true },
  });

  const revenue = Number(revenueResult._sum.total ?? 0);
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  const inviteUrl = tenant.inviteToken
    ? `${base}/auth/invite/${tenant.inviteToken}`
    : null;
  const isClaimed = tenant.users.length > 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/platform/stores" className="flex items-center gap-1.5 hover:text-zinc-900">
          <ArrowLeft className="h-4 w-4" />
          Stores
        </Link>
        <span className="text-zinc-300">/</span>
        <span className="text-zinc-900">{tenant.name}</span>
      </div>

      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div
            className="h-11 w-11 rounded-lg border border-zinc-200"
            style={{ backgroundColor: tenant.primaryColor }}
          />
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              {tenant.name}
            </h1>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono text-xs text-zinc-400">
                {tenant.slug}
              </span>
              {isClaimed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  Claimed
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                  Unclaimed
                </span>
              )}
            </div>
          </div>
        </div>
        <a
          href={`http://${slug}.localhost:3000`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-zinc-200 bg-white px-3 py-1.5 text-sm text-zinc-600 hover:bg-zinc-50"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Preview
        </a>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatsCard label="Products" value={tenant._count.products} />
        <StatsCard label="Orders" value={tenant._count.orders} />
        <StatsCard label="Customers" value={tenant._count.customers} />
        <StatsCard
          label="Revenue"
          value={`₵${revenue.toFixed(2)}`}
          sub="Paid orders"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border border-zinc-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-zinc-900">
            Store Details
          </h2>
          <dl className="space-y-3">
            {tenant.contactEmail && (
              <div className="flex items-center justify-between">
                <dt className="text-sm text-zinc-500">Email</dt>
                <dd className="text-sm text-zinc-900">{tenant.contactEmail}</dd>
              </div>
            )}
            {tenant.contactPhone && (
              <div className="flex items-center justify-between">
                <dt className="text-sm text-zinc-500">Phone</dt>
                <dd className="text-sm text-zinc-900">{tenant.contactPhone}</dd>
              </div>
            )}
            {tenant.address && (
              <div className="flex items-start justify-between gap-4">
                <dt className="shrink-0 text-sm text-zinc-500">Address</dt>
                <dd className="text-right text-sm text-zinc-900">
                  {tenant.address}
                </dd>
              </div>
            )}
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-500">Primary color</dt>
              <dd className="flex items-center gap-2 text-sm font-mono text-zinc-900">
                <span
                  className="h-4 w-4 rounded-sm border border-zinc-200"
                  style={{ backgroundColor: tenant.primaryColor }}
                />
                {tenant.primaryColor}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-sm text-zinc-500">Created</dt>
              <dd className="text-sm text-zinc-900">
                {tenant.createdAt.toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>

        {!isClaimed ? (
          <InvitePanel
            slug={tenant.slug}
            initialInviteUrl={inviteUrl}
            expiresAt={tenant.inviteTokenExpiresAt?.toISOString() ?? null}
          />
        ) : (
          <div className="rounded-lg border border-zinc-200 bg-white p-5">
            <h2 className="mb-4 text-sm font-semibold text-zinc-900">Owner</h2>
            <div className="space-y-3">
              {tenant.users.map((user) => (
                <div key={user.id} className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-sm font-semibold text-zinc-600">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-zinc-500">{user.email}</p>
                  </div>
                  <span className="ml-auto rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium capitalize text-zinc-600">
                    {user.role.toLowerCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
