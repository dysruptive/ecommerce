import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { SecondSightFontProvider } from "../font-provider";
import { SecondSightCheckoutContent } from "./checkout-content";
import type { DeliveryZoneData } from "@/stores/registry";

export function SecondSightCheckoutPage({ tenant, deliveryZones }: { tenant: Tenant; deliveryZones: DeliveryZoneData[] }) {
  const smsEnabled = !!process.env.ARKESEL_API_KEY;

  return (
    <SecondSightFontProvider>
      <StoreLayout tenant={tenant}>
        <div className="min-h-screen bg-[#f9f9f7] px-6 pt-28 pb-20 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <h1
              className="mb-12 text-4xl font-bold text-[#1a1c1b] md:text-5xl"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              Checkout
            </h1>
            <SecondSightCheckoutContent tenant={tenant} deliveryZones={deliveryZones} smsEnabled={smsEnabled} />
          </div>
        </div>
      </StoreLayout>
    </SecondSightFontProvider>
  );
}
