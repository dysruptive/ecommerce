import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { SecondSightFontProvider } from "../font-provider";
import { SecondSightCartContent } from "./page";

export function SecondSightCartPage({ tenant }: { tenant: Tenant }) {
  return (
    <SecondSightFontProvider>
      <StoreLayout tenant={tenant}>
        <div className="min-h-screen bg-[#f9f9f7] px-6 pt-28 pb-20 lg:px-8">
          <div className="mx-auto max-w-[1440px]">
            <h1
              className="mb-12 text-4xl font-bold text-[#1a1c1b] md:text-5xl"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              Your Cart
            </h1>
            <SecondSightCartContent />
          </div>
        </div>
      </StoreLayout>
    </SecondSightFontProvider>
  );
}
