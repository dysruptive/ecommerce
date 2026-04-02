import { getCurrentTenant } from "@/lib/tenant";
import { StoreLayout } from "@/components/store/store-layout";
import { CartContent } from "./cart-content";

export default async function CartPage() {
  const tenant = await getCurrentTenant();

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Your Cart</h1>
        <CartContent primaryColor={tenant.primaryColor} />
      </div>
    </StoreLayout>
  );
}
