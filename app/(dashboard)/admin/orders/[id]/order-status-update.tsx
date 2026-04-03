"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { updateOrderStatus } from "@/actions/order-status";
import type { OrderStatus } from "@/types";

const ALL_STATUSES = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

export function OrderStatusUpdate({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [newStatus, setNewStatus] = useState("");
  const [isPending, setIsPending] = useState(false);

  const options = ALL_STATUSES.filter((s) => s !== currentStatus);

  async function handleUpdate() {
    if (!newStatus) return;
    setIsPending(true);
    const result = await updateOrderStatus(orderId, newStatus as OrderStatus);
    setIsPending(false);
    if (!result.success) toast.error(result.error);
    else {
      toast.success(`Status updated to ${newStatus.charAt(0) + newStatus.slice(1).toLowerCase()}.`);
      setNewStatus("");
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Update Status</p>
      <div className="flex gap-2">
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="h-9 flex-1 rounded-lg border-[#E5E2DB] bg-white text-sm text-[#1C1917] focus:ring-[#B45309]/20 focus:border-[#B45309]">
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent className="border-[#E5E2DB] shadow-sm">
            {options.map((s) => (
              <SelectItem key={s} value={s} className="text-sm text-[#1C1917] focus:bg-[#FEF3C7] focus:text-[#92400E]">
                {s.charAt(0) + s.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <button
          onClick={handleUpdate}
          disabled={!newStatus || isPending}
          className={`h-9 rounded-lg px-4 text-sm font-medium disabled:opacity-50 ${
            newStatus === "CANCELLED"
              ? "bg-red-600 text-white hover:bg-red-700"
              : "border border-[#E5E2DB] bg-white text-[#1C1917] hover:bg-[#F8F7F4]"
          }`}
        >
          {isPending ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
}
