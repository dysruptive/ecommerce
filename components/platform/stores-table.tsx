import Link from "next/link";

interface StoreSummary {
  id: string;
  name: string;
  slug: string;
  primaryColor: string;
  createdAt: Date;
  _count: { users: number; orders: number; products: number };
  revenue: number;
}

export function StoresTable({ stores }: { stores: StoreSummary[] }) {
  if (stores.length === 0) {
    return (
      <div className="rounded-lg border border-zinc-200 bg-white py-20 text-center">
        <p className="text-sm text-zinc-400">No stores yet.</p>
        <Link
          href="/platform/stores/new"
          className="mt-2 inline-block text-sm text-zinc-900 underline underline-offset-2"
        >
          Create the first store
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50/60">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Store
            </th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Status
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Products
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Orders
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Revenue
            </th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Created
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100">
          {stores.map((store) => (
            <tr key={store.id} className="group hover:bg-zinc-50/60">
              <td className="px-4 py-3.5">
                <Link
                  href={`/platform/stores/${store.slug}`}
                  className="flex items-center gap-3"
                >
                  <div
                    className="h-6 w-6 shrink-0 rounded border border-zinc-200/60"
                    style={{ backgroundColor: store.primaryColor }}
                  />
                  <div>
                    <p className="font-medium text-zinc-900 group-hover:text-zinc-600">
                      {store.name}
                    </p>
                    <p className="text-xs text-zinc-400">{store.slug}</p>
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3.5">
                {store._count.users > 0 ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Claimed
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    Unclaimed
                  </span>
                )}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums text-zinc-600">
                {store._count.products}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums text-zinc-600">
                {store._count.orders}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums font-medium text-zinc-900">
                ₵{store.revenue.toFixed(2)}
              </td>
              <td className="px-4 py-3.5 text-right text-zinc-400">
                {new Date(store.createdAt).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "2-digit",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
