"use client";

import { useEffect, useActionState } from "react";
import { toast } from "sonner";
import { connectPaystackAccount } from "@/actions/settings";
import type { Tenant } from "@/types";
import type { PaystackBank } from "@/lib/paystack";

export function PaymentsForm({
  tenant,
  banks,
}: {
  tenant: Tenant;
  banks: PaystackBank[];
}) {
  const [state, formAction, isPending] = useActionState(connectPaystackAccount, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success("Bank account connected successfully.");
    else toast.error(state.error);
  }, [state]);

  const isConnected = !!tenant.paystackSubaccountCode;

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Payments</p>
        <p className="mt-0.5 text-xs text-[#78716C]">
          Enter your bank account details. We&apos;ll verify the account with Paystack and set up
          your payment connection automatically.
        </p>
      </div>

      <div className="px-5 py-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="text-sm font-medium text-[#1C1917]">Status</span>
          {isConnected ? (
            <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
              Connected
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-stone-100 px-2.5 py-0.5 text-xs font-medium text-stone-500">
              Not configured
            </span>
          )}
        </div>

        {isConnected && (
          <div className="mb-5 rounded-lg border border-emerald-100 bg-emerald-50/50 px-4 py-3">
            <p className="text-xs text-emerald-800">
              Your bank account is connected and ready to accept payments. Fill in the form below
              to switch to a different account.
            </p>
          </div>
        )}

        <form action={formAction} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]" htmlFor="bankCode">
              Bank
            </label>
            {banks.length > 0 ? (
              <select
                id="bankCode"
                name="bankCode"
                required
                className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#B45309]"
              >
                <option value="">Select your bank</option>
                {banks.map((bank) => (
                  <option key={bank.code} value={bank.code}>
                    {bank.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id="bankCode"
                name="bankCode"
                placeholder="Bank code (e.g. 030)"
                required
                className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]" htmlFor="accountNumber">
              Account Number
            </label>
            <input
              id="accountNumber"
              name="accountNumber"
              inputMode="numeric"
              maxLength={10}
              placeholder="0123456789"
              required
              className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 font-mono text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
            />
            <p className="text-xs text-[#A8A29E]">10-digit account number</p>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending
              ? "Verifying & connecting..."
              : isConnected
              ? "Update bank account"
              : "Connect bank account"}
          </button>
        </form>
      </div>
    </div>
  );
}
