import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { STORE_REGISTRY } from "@/stores/registry";
import { StoreLayout } from "@/components/store/store-layout";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const tenant = await getCurrentTenant();

  const deliveryZones = await prisma.deliveryZone.findMany({
    where: { tenantId: tenant.id, isActive: true },
    orderBy: { position: "asc" },
  });

  const zones = JSON.parse(JSON.stringify(deliveryZones));
  const CheckoutPage = STORE_REGISTRY[tenant.slug]?.CheckoutPage;

  if (CheckoutPage) return <CheckoutPage tenant={tenant} deliveryZones={zones} />;

  const smsEnabled = !!process.env.ARKESEL_API_KEY;

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <CheckoutForm
          deliveryZones={zones}
          primaryColor={tenant.primaryColor}
          emailEnabled={true}
          smsEnabled={smsEnabled}
        />
      </div>
    </StoreLayout>
  );
}
