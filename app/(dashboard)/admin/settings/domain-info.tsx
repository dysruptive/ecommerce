"use client";

import { useEffect, useActionState, useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, Clock, Copy, Check } from "lucide-react";
import { updateCustomDomain } from "@/actions/settings";
import type { Tenant } from "@/types";

const inputCls =
  "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 font-mono text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className="ml-1 inline-flex items-center text-[#A8A29E] hover:text-[#1C1917]"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
}

export function DomainInfo({ tenant }: { tenant: Tenant }) {
  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const [state, formAction, isPending] = useActionState(updateCustomDomain, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success("Custom domain saved. Contact the platform admin to activate it on Vercel.");
    else toast.error(state.error);
  }, [state]);

  const isApex = tenant.customDomain
    ? tenant.customDomain.split(".").length === 2
    : false;

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Domain</p>
        <p className="mt-0.5 text-xs text-[#78716C]">Your store&apos;s subdomain and custom domain settings.</p>
      </div>

      <div className="space-y-6 px-5 py-5">
        {/* Subdomain — read only */}
        <div className="space-y-1">
          <p className="text-sm font-medium text-[#1C1917]">Subdomain</p>
          <p className="font-mono text-sm text-[#78716C]">
            {tenant.slug}.{rootDomain}
          </p>
          <p className="text-xs text-[#A8A29E]">This subdomain is permanent and cannot be changed.</p>
        </div>

        {/* Custom domain form */}
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-[#1C1917]" htmlFor="customDomain">
              Custom Domain
            </label>
            <input
              id="customDomain"
              name="customDomain"
              className={inputCls}
              defaultValue={tenant.customDomain ?? ""}
              placeholder="shop.mystore.com"
            />
            <p className="text-xs text-[#A8A29E]">
              Enter your domain without <span className="font-mono">https://</span>. After saving, follow the DNS steps below, then notify the platform admin to activate it on Vercel.
            </p>
          </div>

          {/* Status badge */}
          {tenant.customDomain && (
            <div className="flex items-center gap-2">
              {tenant.domainStatus === "VERIFIED" ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Active
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                  <Clock className="h-3.5 w-3.5" />
                  Pending activation
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Domain"}
          </button>
        </form>

        {/* DNS instructions — shown whenever a custom domain is set */}
        {tenant.customDomain && (
          <div className="rounded-lg border border-[#E5E2DB] bg-[#F8F7F4] p-4 space-y-3">
            <p className="text-sm font-medium text-[#1C1917]">DNS Configuration</p>
            <p className="text-xs text-[#78716C]">
              Add the following record at your domain registrar (Namecheap, GoDaddy, Cloudflare, etc.):
            </p>

            {isApex ? (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#1C1917]">Apex domain (e.g. mystore.com)</p>
                <div className="overflow-x-auto rounded-md border border-[#E5E2DB] bg-white">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E2DB]">
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Type</th>
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Name</th>
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 font-mono text-[#1C1917]">A</td>
                        <td className="px-3 py-2 font-mono text-[#1C1917]">@</td>
                        <td className="px-3 py-2 font-mono text-[#1C1917] flex items-center">
                          76.76.21.21
                          <CopyButton text="76.76.21.21" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs font-medium text-[#1C1917]">Subdomain (e.g. shop.mystore.com)</p>
                <div className="overflow-x-auto rounded-md border border-[#E5E2DB] bg-white">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[#E5E2DB]">
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Type</th>
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Name</th>
                        <th className="px-3 py-2 text-left font-medium text-[#78716C]">Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="px-3 py-2 font-mono text-[#1C1917]">CNAME</td>
                        <td className="px-3 py-2 font-mono text-[#1C1917]">
                          {tenant.customDomain.split(".")[0]}
                        </td>
                        <td className="px-3 py-2 font-mono text-[#1C1917] flex items-center">
                          cname.vercel-dns.com
                          <CopyButton text="cname.vercel-dns.com" />
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            <p className="text-xs text-[#A8A29E]">
              DNS changes can take up to 48 hours to propagate. Once done, notify the platform admin — they will add the domain in Vercel to complete activation.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
