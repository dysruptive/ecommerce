import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function CustomersPage() {
  const tenant = await getTenantFromSession();

  const customers = await prisma.customer.findMany({
    where: { tenantId: tenant.id },
    include: {
      _count: { select: { orders: true } },
      orders: {
        where: { paymentStatus: "PAID" },
        select: { total: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description={`${customers.length} customers`}
      />

      {customers.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          No customers yet. Customers are created automatically at checkout.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Total Spent</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => {
                const totalSpent = customer.orders.reduce(
                  (sum, o) => sum + o.total.toNumber(),
                  0,
                );
                return (
                  <TableRow key={customer.id}>
                    <TableCell>
                      <Link
                        href={`/admin/customers/${customer.id}`}
                        className="font-medium hover:underline"
                      >
                        {customer.name}
                      </Link>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.phone ?? "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      {customer._count.orders}
                    </TableCell>
                    <TableCell className="text-right">
                      GHS {totalSpent.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {customer.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
