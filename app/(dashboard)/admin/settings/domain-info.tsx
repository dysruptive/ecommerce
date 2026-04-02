"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tenant } from "@/types";

export function DomainInfo({ tenant }: { tenant: Tenant }) {
  const rootDomain =
    process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Domain</CardTitle>
        <CardDescription>
          Your store's subdomain and custom domain settings.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium">Subdomain</p>
          <p className="text-sm text-muted-foreground">
            {tenant.slug}.{rootDomain}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium">Custom Domain</p>
          {tenant.customDomain ? (
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {tenant.customDomain}
              </p>
              <Badge
                variant={
                  tenant.domainStatus === "VERIFIED"
                    ? "default"
                    : "secondary"
                }
              >
                {tenant.domainStatus}
              </Badge>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No custom domain configured. Contact the platform admin to set one
              up.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
