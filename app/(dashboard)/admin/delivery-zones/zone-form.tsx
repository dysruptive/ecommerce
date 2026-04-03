"use client";

import { useState, useActionState } from "react";
import { Truck, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export function ZoneForm({ zone, action, onClose }: ZoneFormProps) {
  const [state, formAction, isPending] = useActionState(action, null);
  const [type, setType] = useState<"FIXED" | "COURIER">(
    zone?.type ?? "FIXED",
  );

  if (state?.success) onClose();

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="type" value={type} />

      {state?.success === false && (
        <div className="text-sm text-destructive">{state.error}</div>
      )}

      {/* Type selector */}
      <div className="space-y-2">
        <Label>Delivery Type</Label>
        <div className="grid grid-cols-2 gap-2">
          {(["FIXED", "COURIER"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-md border p-3 text-left text-sm transition-colors ${
                type === t
                  ? "border-primary bg-primary/5 font-medium"
                  : "hover:bg-muted"
              }`}
            >
              {t === "FIXED" ? (
                <Truck className="mb-1 h-4 w-4" />
              ) : (
                <Bike className="mb-1 h-4 w-4" />
              )}
              <p>{t === "FIXED" ? "Fixed Zone" : "Courier"}</p>
              <p className="text-xs font-normal text-muted-foreground">
                {t === "FIXED"
                  ? "Set price per region"
                  : "Yango, Bolt, Uber etc."}
              </p>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="zone-name">Name</Label>
        <Input
          id="zone-name"
          name="name"
          defaultValue={zone?.name ?? (type === "COURIER" ? "Yango / Bolt / Uber" : "")}
          required
        />
      </div>

      {type === "FIXED" && (
        <div className="space-y-2">
          <Label htmlFor="zone-regions">Regions</Label>
          <Input
            id="zone-regions"
            name="regions"
            defaultValue={zone?.regions ?? ""}
            placeholder="e.g. Accra Metropolitan, Tema"
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="zone-fee">Fee (GHS)</Label>
        <Input
          id="zone-fee"
          name="fee"
          type="number"
          step="0.01"
          min="0"
          defaultValue={zone ? Number(zone.fee) : ""}
          required
        />
        {type === "COURIER" && (
          <p className="text-xs text-muted-foreground">
            Set to 0 to absorb the courier cost, or charge a flat rate to
            cover it.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch
          id="zone-active"
          name="isActive"
          defaultChecked={zone?.isActive ?? true}
        />
        <Label htmlFor="zone-active">Active</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : zone ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
