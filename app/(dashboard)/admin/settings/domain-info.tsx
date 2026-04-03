"use client";

import type { Tenant } from "@/types";

export function DomainInfo({ tenant }: { tenant: Tenant }) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Domain</p>
        <p className="mt-0.5 text-xs text-[#78716C]">Your store&apos;s subdomain and custom domain settings.</p>
      </div>
      <div className="space-y-5 px-5 py-5">
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#1C1917]">Subdomain</p>
          <p className="font-mono text-sm text-[#78716C]">
            {tenant.slug}.{rootDomain}
          </p>
        </div>

        <div className="space-y-1">
          <p className="text-sm font-medium text-[#1C1917]">Custom Domain</p>
          {tenant.customDomain ? (
            <div className="flex items-center gap-2">
              <p className="font-mono text-sm text-[#78716C]">{tenant.customDomain}</p>
              <span
                className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  tenant.domainStatus === "VERIFIED"
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-amber-50 text-amber-700"
                }`}
              >
                {tenant.domainStatus}
              </span>
            </div>
          ) : (
            <p className="text-sm text-[#A8A29E]">
              No custom domain configured. Contact the platform admin to set one up.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
