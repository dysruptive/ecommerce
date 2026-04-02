import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { DeliveryZonesList } from "./delivery-zones-list";

export default async function DeliveryZonesPage() {
  const tenant = await getTenantFromSession();

  const zones = await prisma.deliveryZone.findMany({
    where: { tenantId: tenant.id },
    orderBy: { position: "asc" },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Delivery Zones"
        description="Configure delivery areas and fees"
      />
      <DeliveryZonesList zones={JSON.parse(JSON.stringify(zones))} />
    </div>
  );
}
