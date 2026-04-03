import { hasTenantContext, getCurrentTenant } from "@/lib/tenant";
import { STORE_REGISTRY } from "@/stores/registry";
import { TemplatePage } from "@/stores/_template/page";

export default async function HomePage() {
  const isTenant = await hasTenantContext();

  if (!isTenant) {
    return (
      <main className="flex min-h-svh flex-col items-center justify-center p-6">
        <h1 className="text-3xl font-bold">Multi-Tenant Ecommerce Platform</h1>
        <p className="mt-2 text-muted-foreground">
          Powering online stores across Ghana.
        </p>
      </main>
    );
  }

  const tenant = await getCurrentTenant();
  const Page = STORE_REGISTRY[tenant.slug]?.HomePage ?? TemplatePage;

  return <Page tenant={tenant} />;
}
