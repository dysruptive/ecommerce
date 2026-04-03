import type { Tenant } from "@/types";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";
import { STORE_REGISTRY } from "@/stores/registry";

interface StoreLayoutProps {
  tenant: Tenant;
  children: React.ReactNode;
}

export function StoreLayout({ tenant, children }: StoreLayoutProps) {
  const config = STORE_REGISTRY[tenant.slug];
  const Header = config?.Header ?? StoreHeader;
  const Footer = config?.Footer ?? StoreFooter;

  return (
    <div
      className="flex min-h-svh flex-col bg-white"
      style={
        {
          "--store-primary": tenant.primaryColor,
          "--store-accent": tenant.accentColor,
        } as React.CSSProperties
      }
    >
      <Header storeName={tenant.name} logoUrl={tenant.logoUrl} />
      <main className="flex-1">{children}</main>
      <Footer
        storeName={tenant.name}
        contactEmail={tenant.contactEmail}
        contactPhone={tenant.contactPhone}
      />
    </div>
  );
}
