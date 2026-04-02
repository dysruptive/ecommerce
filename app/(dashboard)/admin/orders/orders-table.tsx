import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Order {
  id: string;
  orderNumber: string;
  total: string | number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  customer: { name: string };
}

function statusVariant(status: string) {
  switch (status) {
    case "DELIVERED":
    case "PAID":
      return "default" as const;
    case "CANCELLED":
    case "FAILED":
      return "destructive" as const;
    default:
      return "secondary" as const;
  }
}

export function OrdersTable({ orders }: { orders: Order[] }) {
  if (orders.length === 0) {
    return (
      <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
        No orders found.
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Payment</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} className="cursor-pointer">
              <TableCell>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-medium hover:underline"
                >
                  {order.orderNumber}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block">
                  {order.customer.name}
                </Link>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  GHS {Number(order.total).toFixed(2)}
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block">
                  <Badge variant={statusVariant(order.paymentStatus)}>
                    {order.paymentStatus}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell>
                <Link href={`/admin/orders/${order.id}`} className="block">
                  <Badge variant={statusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </Link>
              </TableCell>
              <TableCell className="text-muted-foreground">
                <Link href={`/admin/orders/${order.id}`} className="block">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
