"use client";

import { useState, useActionState } from "react";
import { Truck, Bike } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type ActionResult = { success: true } | { success: false; error: string } | null;

export interface Zone {
  id: string;
  name: string;
  type: "FIXED" | "COURIER";
  regions: string | null;
  fee: string | number;
  isActive: boolean;
  position: number;
}

interface ZoneFormProps {
  zone?: Zone;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  onClose: () => void;
}

const inputCls = "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const labelCls = "text-sm font-medium text-[#1C1917]";

export function ZoneForm({ zone, action, onClose }: ZoneFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [type, setType] = useState<"FIXED" | "COURIER">(zone?.type ?? "FIXED");

  if (state?.success) onClose();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      {state?.success === false && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
      )}

      <div className="space-y-2">
        <label className={labelCls}>Delivery Type</label>
        <div className="grid grid-cols-2 gap-2">
          {(["FIXED", "COURIER"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-xl border p-3 text-left text-sm transition-colors ${
                type === t
                  ? "border-[#B45309] bg-[#FEF3C7]"
                  : "border-[#E5E2DB] bg-white hover:bg-[#F8F7F4]"
              }`}
            >
              {t === "FIXED" ? (
                <Truck className="mb-1.5 h-4 w-4 text-[#78716C]" />
              ) : (
                <Bike className="mb-1.5 h-4 w-4 text-[#78716C]" />
              )}
              <p className="font-medium text-[#1C1917]">{t === "FIXED" ? "Fixed Zone" : "Courier"}</p>
              <p className="text-xs text-[#78716C]">
                {t === "FIXED" ? "Set price per region" : "Yango, Bolt, Uber etc."}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="zone-name">Name</label>
        <input
          id="zone-name"
          name="name"
          className={inputCls}
          defaultValue={zone?.name ?? (type === "COURIER" ? "Yango / Bolt / Uber" : "")}
          required
        />
      </div>

      {type === "FIXED" && (
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

      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="zone-fee">Fee (₵)</label>
        <input
          id="zone-fee"
          name="fee"
          type="number"
          step="0.01"
          min="0"
          className={inputCls}
          defaultValue={zone ? Number(zone.fee) : ""}
          required
        />
        {type === "COURIER" && (
          <p className="text-xs text-[#A8A29E]">
            Set to 0 to absorb the courier cost, or charge a flat rate to cover it.
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Switch id="zone-active" name="isActive" defaultChecked={zone?.isActive ?? true} />
        <label htmlFor="zone-active" className="text-sm text-[#1C1917]">Active</label>
      </div>

      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50">
          {isPending ? "Saving..." : zone ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onClose} className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]">
          Cancel
        </button>
      </div>
    </form>
  );
}
