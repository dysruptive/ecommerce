"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { resendOrderConfirmation } from "@/actions/order-status";

export function ResendButton({ orderId }: { orderId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleClick() {
    setState("loading");
    const result = await resendOrderConfirmation(orderId);
    setState(result.success ? "done" : "error");
    if (result.success) setTimeout(() => setState("idle"), 3000);
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === "loading"}
      className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4] disabled:opacity-50"
    >
      <Send className="h-3.5 w-3.5" />
      {state === "loading" ? "Sending…" : state === "done" ? "Sent!" : state === "error" ? "Failed" : "Resend Confirmation"}
    </button>
  );
}
