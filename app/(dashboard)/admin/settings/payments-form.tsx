"use client";

import { useEffect, useActionState, useState } from "react";
import { toast } from "sonner";
import { ChevronsUpDown, Check } from "lucide-react";
import { connectPaystackAccount } from "@/actions/settings";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import type { Tenant } from "@/types";
import type { PaystackBank } from "@/lib/paystack";

function BankCombobox({
  banks,
  value,
  onChange,
}: {
  banks: PaystackBank[];
  value: string;
  onChange: (code: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = banks.find((b) => b.code === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] outline-none hover:bg-[#FAFAF8] focus:border-[#B45309]"
        >
          <span className={selected ? "text-[#1C1917]" : "text-[#A8A29E]"}>
            {selected ? selected.name : "Select your bank"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#A8A29E]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search banks..." />
          <CommandList>
            <CommandEmpty>No bank found.</CommandEmpty>
            <CommandGroup>
              {banks.map((bank) => (
                <CommandItem
                  key={bank.code}
                  value={bank.name}
                  onSelect={() => {
                    onChange(bank.code);
                    setOpen(false);
                  }}
                  data-checked={value === bank.code}
                >
                  {bank.name}
                  {value === bank.code && (
                    <Check className="ml-auto h-4 w-4 text-[#B45309]" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export function PaymentsForm({
  tenant,
  banks,
}: {
  tenant: Tenant;
  banks: PaystackBank[];
}) {
  const [state, formAction, isPending] = useActionState(connectPaystackAccount, null);
  const [selectedBank, setSelectedBank] = useState("");

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
          <input type="hidden" name="bankCode" value={selectedBank} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]">Bank</label>
            {banks.length > 0 ? (
              <BankCombobox
                banks={banks}
                value={selectedBank}
                onChange={setSelectedBank}
              />
            ) : (
              // Fallback when bank list failed to load — replace hidden input value directly
              <input
                placeholder="Bank code (e.g. 030)"
                onChange={(e) => setSelectedBank(e.target.value)}
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
            disabled={isPending || (!selectedBank && banks.length > 0)}
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
