import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const tenant = await getCurrentTenant();

  const deliveryZones = await prisma.deliveryZone.findMany({
    where: { tenantId: tenant.id, isActive: true },
    orderBy: { position: "asc" },
  });

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <CheckoutForm
          deliveryZones={JSON.parse(JSON.stringify(deliveryZones))}
          primaryColor={tenant.primaryColor}
          emailEnabled={tenant.emailEnabled}
          smsEnabled={tenant.smsEnabled}
        />
      </div>
    </StoreLayout>
  );
}
