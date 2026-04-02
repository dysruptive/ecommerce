import { notFound } from "next/navigation";
import Link from "next/link";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function CustomerDetailPage({ params }: Props) {
  const { id } = await params;
  const tenant = await getTenantFromSession();

  const customer = await prisma.customer.findFirst({
    where: { id, tenantId: tenant.id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!customer) notFound();

  const totalSpent = customer.orders
    .filter((o) => o.paymentStatus === "PAID")
    .reduce((sum, o) => sum + o.total.toNumber(), 0);

  return (
    <div className="space-y-6">
      <PageHeader title={customer.name} />

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm">
          <p>
            <span className="font-medium">Email:</span> {customer.email}
          </p>
          <p>
            <span className="font-medium">Phone:</span>{" "}
            {customer.phone ?? "—"}
          </p>
          <p>
            <span className="font-medium">Orders:</span>{" "}
            {customer.orders.length}
          </p>
          <p>
            <span className="font-medium">Total Spent:</span> GHS{" "}
            {totalSpent.toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Customer Since:</span>{" "}
            {customer.createdAt.toLocaleDateString()}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
        </CardHeader>
        <CardContent>
          {customer.orders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customer.orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="font-medium hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </TableCell>
                    <TableCell className="text-right">
                      GHS {order.total.toNumber().toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          order.paymentStatus === "PAID"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {order.paymentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{order.status}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {order.createdAt.toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
