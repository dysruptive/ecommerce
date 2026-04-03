"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useRef } from "react";
import { Search, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface OrderFiltersProps {
  currentStatus?: string;
  currentPayment?: string;
  currentSearch?: string;
  currentFrom?: string;
  currentTo?: string;
}

export function OrderFilters({
  currentStatus,
  currentPayment,
  currentSearch,
  currentFrom,
  currentTo,
}: OrderFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchRef = useRef<HTMLInputElement>(null);

  const update = useCallback(
    (changes: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page"); // reset to page 1 on filter change
      for (const [key, val] of Object.entries(changes)) {
        if (val) params.set(key, val);
        else params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  const triggerCls = "h-9 rounded-lg border-[#E5E2DB] bg-white text-sm text-[#1C1917] focus:ring-[#B45309]/20 focus:border-[#B45309] w-44";
  const contentCls = "border-[#E5E2DB] shadow-sm";
  const itemCls = "text-sm text-[#1C1917] focus:bg-[#FEF3C7] focus:text-[#92400E]";

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    update({ q: searchRef.current?.value || undefined });
  }

  return (
    <div className="space-y-3">
      {/* Search bar */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[#A8A29E]" />
        <input
          ref={searchRef}
          defaultValue={currentSearch ?? ""}
          placeholder="Search by order number or customer name…"
          className="h-9 w-full rounded-lg border border-[#E5E2DB] bg-white pl-9 pr-9 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
        />
        {currentSearch && (
          <button
            type="button"
            onClick={() => {
              if (searchRef.current) searchRef.current.value = "";
              update({ q: undefined });
            }}
            className="absolute right-2.5 text-[#A8A29E] hover:text-[#78716C]"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </form>

      {/* Filter row */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={currentStatus ?? "all"}
          onValueChange={(v) => update({ status: v === "all" ? undefined : v })}
        >
          <SelectTrigger className={triggerCls}>
            <SelectValue placeholder="Order Status" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all" className={itemCls}>All Statuses</SelectItem>
            <SelectItem value="PENDING" className={itemCls}>Pending</SelectItem>
            <SelectItem value="CONFIRMED" className={itemCls}>Confirmed</SelectItem>
            <SelectItem value="PROCESSING" className={itemCls}>Processing</SelectItem>
            <SelectItem value="SHIPPED" className={itemCls}>Shipped</SelectItem>
            <SelectItem value="DELIVERED" className={itemCls}>Delivered</SelectItem>
            <SelectItem value="CANCELLED" className={itemCls}>Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={currentPayment ?? "all"}
          onValueChange={(v) => update({ payment: v === "all" ? undefined : v })}
        >
          <SelectTrigger className={triggerCls}>
            <SelectValue placeholder="Payment" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all" className={itemCls}>All Payments</SelectItem>
            <SelectItem value="UNPAID" className={itemCls}>Unpaid</SelectItem>
            <SelectItem value="PAID" className={itemCls}>Paid</SelectItem>
            <SelectItem value="REFUNDED" className={itemCls}>Refunded</SelectItem>
            <SelectItem value="FAILED" className={itemCls}>Failed</SelectItem>
          </SelectContent>
        </Select>

        {/* Date range */}
        <div className="flex items-center gap-2">
          <input
            type="date"
            defaultValue={currentFrom ?? ""}
            onChange={(e) => update({ from: e.target.value || undefined })}
            className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#B45309]"
          />
          <span className="text-xs text-[#A8A29E]">to</span>
          <input
            type="date"
            defaultValue={currentTo ?? ""}
            onChange={(e) => update({ to: e.target.value || undefined })}
            className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] outline-none focus:border-[#B45309]"
          />
        </div>

        {/* Clear all */}
        {(currentStatus || currentPayment || currentSearch || currentFrom || currentTo) && (
          <button
            onClick={() => update({ status: undefined, payment: undefined, q: undefined, from: undefined, to: undefined })}
            className="text-xs text-[#A8A29E] hover:text-[#78716C] underline underline-offset-2"
          >
            Clear all
          </button>
        )}
      </div>
    </div>
  );
}
