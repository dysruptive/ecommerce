import { hasTenantContext, getCurrentTenant } from "@/lib/tenant";
import type { Tenant } from "@/types";

// ─── Per-store homepage registry ──────────────────────────────────────────────
// To add a homepage for a new store:
//   1. Copy stores/_template/ → stores/<slug>/
//   2. Customise the sections and page.tsx to match the brand
//   3. Add one line to STORE_PAGES below (slug → exported page component)

import { FreshMartPage } from "@/stores/fresh-mart/page";
import { StyleHubGhPage } from "@/stores/stylehub-gh/page";
import { TemplatePage } from "@/stores/_template/page";

type HomepageComponent = (props: { tenant: Tenant }) => Promise<React.ReactNode> | React.ReactNode;

const STORE_PAGES: Record<string, HomepageComponent> = {
  "fresh-mart": FreshMartPage,
  "stylehub-gh": StyleHubGhPage,
};
// ──────────────────────────────────────────────────────────────────────────────

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
  const Page = STORE_PAGES[tenant.slug] ?? TemplatePage;

  return <Page tenant={tenant} />;
}
