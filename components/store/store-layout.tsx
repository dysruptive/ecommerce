import type { Tenant } from "@/types";
import { StoreHeader } from "@/components/store/store-header";
import { StoreFooter } from "@/components/store/store-footer";

interface StoreLayoutProps {
  tenant: Tenant;
  children: React.ReactNode;
}

export function StoreLayout({ tenant, children }: StoreLayoutProps) {
  return (
    <div
      className="flex min-h-svh flex-col"
      style={
        {
          "--store-primary": tenant.primaryColor,
          "--store-accent": tenant.accentColor,
        } as React.CSSProperties
      }
    >
      <StoreHeader storeName={tenant.name} logoUrl={tenant.logoUrl} />
      <main className="flex-1">{children}</main>
      <StoreFooter
        storeName={tenant.name}
        contactEmail={tenant.contactEmail}
        contactPhone={tenant.contactPhone}
      />
    </div>
  );
}
