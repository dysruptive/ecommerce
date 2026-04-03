import { notFound } from "next/navigation";
import Link from "next/link";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";

interface Props {
  params: Promise<{ id: string }>;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700",
  CONFIRMED: "bg-blue-50 text-blue-700",
  PROCESSING: "bg-violet-50 text-violet-700",
  SHIPPED: "bg-indigo-50 text-indigo-700",
  DELIVERED: "bg-emerald-50 text-emerald-700",
  CANCELLED: "bg-red-50 text-red-700",
  PAID: "bg-emerald-50 text-emerald-700",
  UNPAID: "bg-amber-50 text-amber-700",
  REFUNDED: "bg-rose-50 text-rose-700",
  FAILED: "bg-red-50 text-red-700",
};

function Pill({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status] ?? "bg-stone-50 text-stone-500"}`}>
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
}

const card = "rounded-xl border border-[#E5E2DB] bg-white";
const cardHeader = "border-b border-[#E5E2DB] px-5 py-4";
const cardTitle = "text-sm font-semibold text-[#1C1917]";
const cardBody = "px-5 py-4";

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantFromSession();

  const customer = await prisma.customer.findFirst({
    where: { id, tenantId: tenant.id },
    include: { orders: { orderBy: { createdAt: "desc" } } },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.total.toNumber(), 0);

  return (
    <div className="space-y-5">
      <PageHeader title={customer.name} />

      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Contact Information</p></div>
        <div className={`${cardBody} space-y-3 text-sm`}>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Email</span>
            <span className="font-medium text-[#1C1917]">{customer.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Phone</span>
            <span className="font-medium text-[#1C1917]">{customer.phone ?? <span className="text-[#A8A29E]">—</span>}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Orders</span>
            <span className="font-medium tabular-nums text-[#1C1917]">{customer.orders.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Total Spent</span>
            <span className="font-semibold tabular-nums text-[#1C1917]">₵{totalSpent.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#78716C]">Customer Since</span>
            <span className="text-[#A8A29E]">
              {customer.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
            </span>
          </div>
        </div>
      </div>

      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Order History</p></div>
        <div className={cardBody}>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-[#A8A29E]">No orders yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#F5F3EE]">
                  {["Order", "Total", "Payment", "Status", "Date"].map((h, i) => (
                    <th
                      key={h}
                      className={`pb-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E] ${i === 1 ? "text-right" : "text-left"}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F5F3EE]">
                {customer.orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#FAFAF8]">
                    <td className="py-3">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-semibold text-[#1C1917] hover:text-[#B45309]"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="py-3 text-right tabular-nums font-medium text-[#1C1917]">
                      ₵{order.total.toNumber().toFixed(2)}
                    </td>
                    <td className="py-3">
                      <Pill status={order.paymentStatus} />
                    </td>
                    <td className="py-3">
                      <Pill status={order.status} />
                    </td>
                    <td className="py-3 text-[#A8A29E]">
                      {order.createdAt.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
