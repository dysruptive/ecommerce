import { redirect } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { PackageSearch } from "lucide-react";

interface Props {
  searchParams: Promise<{ order?: string; contact?: string }>;
}

export default async function TrackOrderPage({ searchParams }: Props) {
  const tenant = await getCurrentTenant();
  const { order: orderNumber, contact } = await searchParams;

  let error: string | null = null;

  if (orderNumber && contact) {
    const normalized = contact.trim().toLowerCase();
    const found = await prisma.order.findFirst({
      where: {
        tenantId: tenant.id,
        orderNumber: orderNumber.trim().toUpperCase(),
        customer: {
          OR: [
            { email: { equals: normalized, mode: "insensitive" } },
            { phone: normalized },
          ],
        },
      },
      select: { orderNumber: true },
    });

    if (found) {
      redirect(`/order/${found.orderNumber}`);
    } else {
      error = "No order found. Please check your order number and contact details.";
    }
  }

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-md px-4 py-16">
        <div className="mb-8 text-center">
          <PackageSearch className="mx-auto mb-4 h-12 w-12 text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900">Track Your Order</h1>
          <p className="mt-2 text-sm text-gray-500">
            Enter your order number and the email or phone you used at checkout.
          </p>
        </div>

        <form method="GET" className="space-y-4">
          {error && (
            <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label htmlFor="order" className="block text-sm font-medium text-gray-700">
              Order Number
            </label>
            <input
              id="order"
              name="order"
              defaultValue={orderNumber ?? ""}
              placeholder="e.g. FM-A1B2C3"
              required
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700">
              Email or Phone Number
            </label>
            <input
              id="contact"
              name="contact"
              type="text"
              defaultValue={contact ?? ""}
              placeholder="you@example.com or 0244000000"
              required
              className="h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-400"
            />
          </div>

          <button
            type="submit"
            className="h-11 w-full rounded-xl font-semibold text-sm text-white"
            style={{ backgroundColor: `var(--store-primary, #1C1917)` }}
          >
            Find My Order
          </button>
        </form>
      </div>
    </StoreLayout>
  );
}
