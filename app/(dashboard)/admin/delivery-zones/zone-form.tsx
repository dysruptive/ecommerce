"use client";

import { useState, useEffect, useActionState } from "react";
import { Truck, Bike } from "lucide-react";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";

type ActionResult = { success: true } | { success: false; error: string } | null;

export interface Zone {
  id: string;
  name: string;
  type: "FIXED" | "COURIER";
  regions: string | null;
  fee: string | number | null;
  isActive: boolean;
  position: number;
}

interface ZoneFormProps {
  zone?: Zone;
  /** If zones of a given type already exist, the type is locked to that type */
  lockedType?: "FIXED" | "COURIER";
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  onClose: () => void;
}

const inputCls = "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const labelCls = "text-sm font-medium text-[#1C1917]";

export function ZoneForm({ zone, lockedType, action, onClose }: ZoneFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [type, setType] = useState<"FIXED" | "COURIER">(
    zone?.type ?? lockedType ?? "FIXED",
  );

  useEffect(() => {
    if (!state) return;
    if (state.success) onClose();
    else toast.error(state.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const isCourier = type === "COURIER";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      {/* Only show type selector when there are no existing zones (no locked type) and not editing */}
      {!lockedType && !zone && (
        <div className="space-y-2">
          <label className={labelCls}>How do you deliver orders?</label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setType("FIXED")}
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                type === "FIXED"
                  ? "border-[#B45309] bg-[#FEF3C7]"
                  : "border-[#E5E2DB] bg-white hover:bg-[#F8F7F4]"
              }`}
            >
              <Truck className="mb-1.5 h-4 w-4 text-[#78716C]" />
              <p className="font-medium text-[#1C1917]">My own dispatch</p>
              <p className="text-xs text-[#78716C]">
                You have your own riders with fixed prices for different areas.
              </p>
            </button>
            <button
              type="button"
              onClick={() => setType("COURIER")}
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                type === "COURIER"
                  ? "border-[#B45309] bg-[#FEF3C7]"
                  : "border-[#E5E2DB] bg-white hover:bg-[#F8F7F4]"
              }`}
            >
              <Bike className="mb-1.5 h-4 w-4 text-[#78716C]" />
              <p className="font-medium text-[#1C1917]">Courier service</p>
              <p className="text-xs text-[#78716C]">
                You use Yango, Bolt, Uber or similar. Price varies by distance.
              </p>
            </button>
          </div>
        </div>
      )}

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="zone-name">Name</label>
        <input
          id="zone-name"
          name="name"
          className={inputCls}
          defaultValue={zone?.name ?? (isCourier ? "Yango / Bolt / Uber" : "")}
          required
        />
      </div>

      {!isCourier && (
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="zone-regions">Regions</label>
          <input
            id="zone-regions"
            name="regions"
            className={inputCls}
            defaultValue={zone?.regions ?? ""}
            placeholder="e.g. Accra Metropolitan, Tema"
            required
          />
        </div>
      )}

      {!isCourier && (
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="zone-fee">Fee (₵)</label>
          <input
            id="zone-fee"
            name="fee"
            type="number"
            step="0.01"
            min="0"
            className={inputCls}
            defaultValue={zone?.fee != null ? Number(zone.fee) : ""}
            required
          />
        </div>
      )}

      {isCourier && (
        <p className="rounded-lg border border-[#E5E2DB] bg-[#F8F7F4] px-3 py-2.5 text-xs text-[#78716C]">
          No fee needed. The courier (Yango, Bolt, Uber etc.) quotes the customer directly based on distance and demand — you don&apos;t control the price.
        </p>
      )}

      <div className="flex items-center gap-3">
        <Switch id="zone-active" name="isActive" defaultChecked={zone?.isActive ?? true} />
        <label htmlFor="zone-active" className="text-sm text-[#1C1917]">Active</label>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
        >
          {isPending ? "Saving..." : zone ? "Update" : "Create"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
