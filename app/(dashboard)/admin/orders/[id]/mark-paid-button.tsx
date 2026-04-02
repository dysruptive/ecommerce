"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { markOrderAsPaid } from "@/actions/order-status";

export function MarkPaidButton({ orderId }: { orderId: string }) {
  const [showRef, setShowRef] = useState(false);
  const [ref, setRef] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleMark() {
    setIsPending(true);
    setError(null);
    const result = await markOrderAsPaid(orderId, ref || undefined);
    setIsPending(false);
    if (!result.success) setError(result.error);
  }

  return (
    <div className="space-y-2">
      {error && <p className="text-sm text-destructive">{error}</p>}
      {showRef ? (
        <div className="flex gap-2">
          <Input
            placeholder="Payment reference (optional)"
            value={ref}
            onChange={(e) => setRef(e.target.value)}
          />
          <Button onClick={handleMark} disabled={isPending}>
            {isPending ? "Saving..." : "Confirm"}
          </Button>
          <Button variant="ghost" onClick={() => setShowRef(false)}>
            Cancel
          </Button>
        </div>
      ) : (
        <Button variant="outline" onClick={() => setShowRef(true)}>
          Mark as Paid
        </Button>
      )}
    </div>
  );
}
