"use client";

import { useEffect, useActionState, useState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronsUpDown, Check, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { connectPaystackAccount, verifyBankAccount } from "@/actions/settings";
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

  const mobileMoney = banks.filter((b) => b.type === "mobile_money");
  const regularBanks = banks.filter((b) => b.type !== "mobile_money");

  function renderItem(bank: PaystackBank) {
    return (
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
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls="bank-listbox"
          aria-haspopup="listbox"
          className="flex h-10 w-full items-center justify-between rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] outline-none hover:bg-[#FAFAF8] focus:border-[#B45309]"
        >
          <span className={selected ? "text-[#1C1917]" : "text-[#A8A29E]"}>
            {selected ? selected.name : "Select bank or mobile money"}
          </span>
          <ChevronsUpDown className="h-4 w-4 shrink-0 text-[#A8A29E]" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>Not found.</CommandEmpty>
            {mobileMoney.length > 0 && (
              <CommandGroup heading="Mobile Money">
                {mobileMoney.map(renderItem)}
              </CommandGroup>
            )}
            {regularBanks.length > 0 && (
              <CommandGroup heading="Banks">
                {regularBanks.map(renderItem)}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

type VerifyState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "verified"; accountName: string }
  | { status: "error"; message: string };

export function PaymentsForm({
  tenant,
  banks,
}: {
  tenant: Tenant;
  banks: PaystackBank[];
}) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(connectPaystackAccount, null);
  const [selectedBank, setSelectedBank] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [verify, setVerify] = useState<VerifyState>({ status: "idle" });
  const [changing, setChanging] = useState(false);
  const [, startVerifyTransition] = useTransition();
  const [, startResetTransition] = useTransition();
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success("Bank account connected successfully.");
      startResetTransition(() => setChanging(false));
      router.refresh();
    } else {
      toast.error(state.error);
    }
  }, [state, router]);

  function handleBankChange(code: string) {
    setSelectedBank(code);
    setVerify({ status: "idle" });
  }

  function handleAccountNumberChange(value: string) {
    setAccountNumber(value.replace(/\D/g, ""));
    setVerify({ status: "idle" });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!selectedBank || accountNumber.length < 6) return;

    debounceRef.current = setTimeout(() => {
      setVerify({ status: "loading" });
      startVerifyTransition(async () => {
        const result = await verifyBankAccount(selectedBank, accountNumber);
        if (result.success) {
          setVerify({ status: "verified", accountName: result.accountName });
        } else {
          setVerify({ status: "error", message: result.error });
        }
      });
    }, 700);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [selectedBank, accountNumber]);

  const isConnected = !!tenant.paystackSubaccountCode;
  const canSubmit = verify.status === "verified" && selectedBank;
  const isMobileMoney = banks.find((b) => b.code === selectedBank)?.type === "mobile_money";
  const selectedBankName = banks.find((b) => b.code === selectedBank)?.name ?? "";

  // Mask account number: show last 4 chars, rest as *
  function maskAccount(num: string) {
    if (num.length <= 4) return num;
    return "•".repeat(num.length - 4) + num.slice(-4);
  }

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Payments</p>
        <p className="mt-0.5 text-xs text-[#78716C]">
          {isConnected
            ? "Your payout account for receiving payments."
            : "Connect a bank or mobile money account to receive payments."}
        </p>
      </div>

      <div className="px-5 py-5 space-y-5">
        {/* Connected account card */}
        {isConnected && !changing && (
          <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 px-4 py-4">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-sm font-semibold text-emerald-900">
                    {tenant.paystackAccountName ?? "Account connected"}
                  </span>
                </div>
                {(tenant.paystackBankName || tenant.paystackAccountNumber) && (
                  <p className="text-xs text-emerald-700 pl-6">
                    {tenant.paystackBankName}
                    {tenant.paystackBankName && tenant.paystackAccountNumber && " · "}
                    {tenant.paystackAccountNumber && maskAccount(tenant.paystackAccountNumber)}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setChanging(true)}
                className="shrink-0 text-xs font-medium text-[#B45309] hover:underline underline-offset-2"
              >
                Change
              </button>
            </div>
          </div>
        )}

        {/* Form — shown when not connected, or when changing */}
        {(!isConnected || changing) && (
          <form action={formAction} className="space-y-5">
            <input type="hidden" name="bankCode" value={selectedBank} />
            <input type="hidden" name="accountNumber" value={accountNumber} />
            <input type="hidden" name="bankName" value={selectedBankName} />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]">Bank</label>
            {banks.length > 0 ? (
              <BankCombobox banks={banks} value={selectedBank} onChange={handleBankChange} />
            ) : (
              <input
                placeholder="Bank code (e.g. 030)"
                onChange={(e) => handleBankChange(e.target.value)}
                className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
              />
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]" htmlFor="accountNumber">
              {isMobileMoney ? "Mobile Money Number" : "Account Number"}
            </label>
            <input
              id="accountNumber"
              inputMode="numeric"
              value={accountNumber}
              onChange={(e) => handleAccountNumberChange(e.target.value)}
              placeholder={isMobileMoney ? "e.g. 0551234987" : "Enter account number"}
              className={`h-10 w-full rounded-lg border bg-white px-3 font-mono text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none transition-colors ${
                verify.status === "verified"
                  ? "border-emerald-400 focus:border-emerald-500"
                  : verify.status === "error"
                  ? "border-red-300 focus:border-red-400"
                  : "border-[#E5E2DB] focus:border-[#B45309]"
              }`}
            />

            {/* Verification feedback */}
            {verify.status === "loading" && (
              <div className="flex items-center gap-1.5 text-xs text-[#78716C]">
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                Verifying account...
              </div>
            )}
            {verify.status === "verified" && (
              <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0" />
                {verify.accountName}
              </div>
            )}
            {verify.status === "error" && (
              <div className="flex items-center gap-1.5 text-xs text-red-600">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                {verify.message}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending || !canSubmit}
              className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
            >
              {isPending
                ? "Connecting..."
                : changing
                ? "Update account"
                : "Connect account"}
            </button>
            {changing && (
              <button
                type="button"
                onClick={() => { setChanging(false); setSelectedBank(""); setAccountNumber(""); setVerify({ status: "idle" }); }}
                className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
        )}
      </div>
    </div>
  );
}
