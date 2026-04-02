import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { DiscountsList } from "./discounts-list";

export default async function DiscountsPage() {
  const tenant = await getTenantFromSession();

  const discounts = await prisma.discount.findMany({
    where: { tenantId: tenant.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Discounts"
        description="Manage discount codes for your store"
      />
      <DiscountsList discounts={JSON.parse(JSON.stringify(discounts))} />
    </div>
  );
}
