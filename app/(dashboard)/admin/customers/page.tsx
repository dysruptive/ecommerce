import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { Pagination } from "@/components/dashboard/pagination";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";

const PAGE_SIZE = 25;

interface Props {
  searchParams: Promise<{ page?: string }>;
}

export default async function CustomersPage({ searchParams }: Props) {
  const tenant = await getTenantFromSession();
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const [total, customers] = await Promise.all([
    prisma.customer.count({ where: { tenantId: tenant.id } }),
    prisma.customer.findMany({
      where: { tenantId: tenant.id },
      include: {
        _count: { select: { orders: true } },
        orders: { where: { paymentStatus: "PAID" }, select: { total: true } },
      },
      orderBy: { createdAt: "desc" },
      take: PAGE_SIZE,
      skip: (page - 1) * PAGE_SIZE,
    }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Customers"
        description={`${total} customer${total !== 1 ? "s" : ""}`}
      />

      {customers.length === 0 && page === 1 ? (
        <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
          <p className="text-sm text-[#A8A29E]">No customers yet.</p>
          <p className="mt-1 text-xs text-[#A8A29E]">Customers are created automatically at checkout.</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-xl border border-[#E5E2DB] bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#E5E2DB] bg-[#F8F7F4]">
                  {["Name", "Email", "Phone", "Orders", "Total Spent", "Joined"].map((h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E] ${i >= 3 && i <= 4 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EE]">
                {customers.map((customer) => {
                  const totalSpent = customer.orders.reduce(
                    (sum, o) => sum + o.total.toNumber(),
                    0,
                  );
                  return (
                    <tr key={customer.id} className="hover:bg-[#FAFAF8]">
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/admin/customers/${customer.id}`}
                          className="font-medium text-[#1C1917] hover:text-[#B45309]"
                        >
                          {customer.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3.5 text-[#78716C]">{customer.email}</td>
                      <td className="px-4 py-3.5 text-[#78716C]">
                        {customer.phone ?? <span className="text-[#A8A29E]">—</span>}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums font-medium text-[#1C1917]">
                        {customer._count.orders}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums font-medium text-[#1C1917]">
                        ₵{totalSpent.toFixed(2)}
                      </td>
                      <td className="px-4 py-3.5 text-[#A8A29E]">
                        {customer.createdAt.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "2-digit",
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
