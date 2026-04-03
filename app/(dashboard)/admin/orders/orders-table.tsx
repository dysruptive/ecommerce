import Link from "next/link";

interface Order {
  id: string;
  orderNumber: string;
  total: string | number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customer: { name: string };
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

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
        <p className="text-sm text-[#A8A29E]">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E2DB] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E2DB] bg-[#F8F7F4]">
            {["Order", "Customer", "Total", "Payment", "Status", "Date"].map((h, i) => (
              <th
                key={h}
                className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E] ${i >= 2 && i <= 3 ? "text-right" : "text-left"}`}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5F3EE]">
          {orders.map((order) => (
            <tr key={order.id} className="group hover:bg-[#FAFAF8]">
              <td className="px-4 py-3.5">
                <Link href={`/admin/orders/${order.id}`} className="font-semibold text-[#1C1917] hover:text-[#B45309]">
                  {order.orderNumber}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-[#78716C]">
                <Link href={`/admin/orders/${order.id}`} className="block hover:text-[#1C1917]">
                  {order.customer.name}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums font-semibold text-[#1C1917]">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  ₵{Number(order.total).toFixed(2)}
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  <Pill status={order.paymentStatus} />
                </Link>
              </td>
              <td className="px-4 py-3.5">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  <Pill status={order.status} />
                </Link>
              </td>
              <td className="px-4 py-3.5 text-[#A8A29E]">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  {new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "2-digit" })}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
