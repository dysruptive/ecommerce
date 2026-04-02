"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  const [error, setError] = useState<string | null>(null);

  const options = ALL_STATUSES.filter((s) => s !== currentStatus);

  async function handleUpdate() {
    if (!newStatus) return;
    setIsPending(true);
    setError(null);
    const result = await updateOrderStatus(orderId, newStatus as OrderStatus);
    setIsPending(false);
    if (!result.success) {
      setError(result.error);
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">Update Status</p>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <div className="flex gap-2">
        <Select value={newStatus} onValueChange={setNewStatus}>
          <SelectTrigger className="flex-1">
            <SelectValue placeholder="Select new status" />
          </SelectTrigger>
          <SelectContent>
            {options.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          onClick={handleUpdate}
          disabled={!newStatus || isPending}
          variant={newStatus === "CANCELLED" ? "destructive" : "outline"}
        >
          {isPending ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>
  );
}
