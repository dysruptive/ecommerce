import { ShoppingCart, DollarSign, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/dashboard/page-header";
import { OnboardingChecklist } from "@/components/dashboard/onboarding-checklist";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";

async function getOverviewStats(tenantId: string) {
  const [totalOrders, pendingOrders, lowStockProducts, recentOrders] =
    await Promise.all([
      prisma.order.count({ where: { tenantId } }),
      prisma.order.count({ where: { tenantId, status: "PENDING" } }),
      prisma.product.count({
        where: { tenantId, isArchived: false, stock: { lte: 5 }, trackStock: true },
      }),
      prisma.order.findMany({
        where: { tenantId },
        include: { customer: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  const revenueResult = await prisma.order.aggregate({
    where: { tenantId, paymentStatus: "PAID" },
    _sum: { total: true },
  });

  return {
    totalOrders,
    pendingOrders,
    lowStockProducts,
    revenue: revenueResult._sum.total?.toNumber() ?? 0,
    recentOrders,
  };
}

export default async function DashboardOverviewPage() {
  const tenant = await getTenantFromSession();
  const stats = await getOverviewStats(tenant.id);

  const cards = [
    {
      title: "Total Orders",
      value: stats.totalOrders,
      icon: ShoppingCart,
    },
    {
      title: "Revenue",
      value: `GHS ${stats.revenue.toFixed(2)}`,
      icon: DollarSign,
    },
    {
      title: "Pending Orders",
      value: stats.pendingOrders,
      icon: Clock,
    },
    {
      title: "Low Stock",
      value: stats.lowStockProducts,
      icon: AlertTriangle,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back to ${tenant.name}`}
      />

      <OnboardingChecklist />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {card.title}
              </CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div>
                    <span className="font-medium">{order.orderNumber}</span>
                    <span className="ml-2 text-muted-foreground">
                      {order.customer.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>GHS {order.total.toNumber().toFixed(2)}</span>
                    <Badge
                      variant={
                        order.paymentStatus === "PAID"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.paymentStatus}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
