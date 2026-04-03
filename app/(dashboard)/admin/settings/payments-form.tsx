"use client";

import { useActionState } from "react";
import { updatePaymentSettings } from "@/actions/settings";
import type { Tenant } from "@/types";

export function PaymentsForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(updatePaymentSettings, null);

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Payments</p>
        <p className="mt-0.5 text-xs text-[#78716C]">
          Paystack subaccount configuration. The platform admin creates the subaccount on your behalf — paste the code here once it&apos;s ready.
        </p>
      </div>
      <div className="px-5 py-5">
        <form action={formAction} className="space-y-5">
          {state?.success === false && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
          )}
          {state?.success === true && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Payment settings saved.</div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-[#1C1917]">Status</span>
            {tenant.paystackSubaccountCode ? (
              <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                Connected
              </span>
            ) : (
              <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
                Not configured
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]" htmlFor="paystackSubaccountCode">
              Paystack Subaccount Code
            </label>
            <input
              id="paystackSubaccountCode"
              name="paystackSubaccountCode"
              placeholder="ACCT_xxxxxxxxxxxxxxxxx"
              defaultValue={tenant.paystackSubaccountCode ?? ""}
              className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 font-mono text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
            />
            <p className="text-xs text-[#A8A29E]">
              Found in your Paystack dashboard under Settings → Subaccounts.
            </p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save"}
          </button>
        </form>
      </div>
    </div>
  );
}
