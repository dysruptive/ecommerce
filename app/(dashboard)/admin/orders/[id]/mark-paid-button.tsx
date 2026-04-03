"use client";

import { useState } from "react";
import { toast } from "sonner";
import { markOrderAsPaid } from "@/actions/order-status";

export function MarkPaidButton({ orderId }: { orderId: string }) {
  const [showRef, setShowRef] = useState(false);
  const [ref, setRef] = useState("");
  const [isPending, setIsPending] = useState(false);

  async function handleMark() {
    setIsPending(true);
    const result = await markOrderAsPaid(orderId, ref || undefined);
    setIsPending(false);
    if (!result.success) toast.error(result.error);
    else {
      toast.success("Order marked as paid.");
      setShowRef(false);
      setRef("");
    }
  }

  return (
    <div className="space-y-2">
      {showRef ? (
        <div className="flex gap-2">
          <input
            className="h-9 flex-1 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
            placeholder="Payment reference (optional)"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <button
            onClick={handleMark}
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Confirm"}
          </button>
          <button
            onClick={() => setShowRef(false)}
            className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowRef(true)}
          className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#1C1917] hover:bg-[#F8F7F4]"
        >
          Mark as Paid
        </button>
      )}
    </div>
  );
}
