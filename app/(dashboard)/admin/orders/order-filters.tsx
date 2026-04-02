"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
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
}

export function OrderFilters({
  currentStatus,
  currentPayment,
}: OrderFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value && value !== "all") {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3">
      <Select
        value={currentStatus ?? "all"}
        onValueChange={(v) => updateParam("status", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Order Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Statuses</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="CONFIRMED">Confirmed</SelectItem>
          <SelectItem value="PROCESSING">Processing</SelectItem>
          <SelectItem value="SHIPPED">Shipped</SelectItem>
          <SelectItem value="DELIVERED">Delivered</SelectItem>
          <SelectItem value="CANCELLED">Cancelled</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={currentPayment ?? "all"}
        onValueChange={(v) => updateParam("payment", v)}
      >
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Payment" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Payments</SelectItem>
          <SelectItem value="UNPAID">Unpaid</SelectItem>
          <SelectItem value="PAID">Paid</SelectItem>
          <SelectItem value="REFUNDED">Refunded</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
