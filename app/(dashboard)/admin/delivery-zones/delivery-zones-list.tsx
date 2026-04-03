"use client";

import { useState, useRef } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, GripVertical, Truck, Bike } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  reorderDeliveryZones,
} from "@/actions/delivery-zones";
import { ZoneForm, type Zone } from "./zone-form";

export function DeliveryZonesList({ zones: initialZones }: { zones: Zone[] }) {
  const [zones, setZones] = useState(initialZones);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const dragIndex = useRef<number | null>(null);

  // Derive the current delivery method from existing zones
  const currentType = zones.length > 0 ? zones[0].type : null;
  const isCourierMode = currentType === "COURIER";

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragEnter(index: number) {
    if (dragIndex.current === null || dragIndex.current === index) return;
    setZones((prev) => {
      const next = [...prev];
      const [moved] = next.splice(dragIndex.current!, 1);
      next.splice(index, 0, moved);
      dragIndex.current = index;
      return next;
    });
  }

  async function handleDragEnd() {
    dragIndex.current = null;
    const result = await reorderDeliveryZones(zones.map((z) => z.id));
    if (!result.success) toast.error(result.error);
  }

  return (
    <div className="space-y-4">
      {/* Mode banner */}
      {currentType && (
        <div className={`flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm ${
          isCourierMode
            ? "border-blue-200 bg-blue-50 text-blue-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-800"
        }`}>
          {isCourierMode ? (
            <Bike className="h-4 w-4 shrink-0" />
          ) : (
            <Truck className="h-4 w-4 shrink-0" />
          )}
          <span className="font-medium">
            {isCourierMode ? "Courier delivery" : "Fixed delivery zones"}
          </span>
          <span className="text-xs opacity-70">
            {isCourierMode
              ? "Orders are delivered via Yango, Bolt, Uber or similar. Customers are quoted a price by the courier — you don't set a fee."
              : "You have your own dispatch riders with fixed prices per area. Customers pay the delivery fee at checkout."}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="ml-auto">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524]">
                <Plus className="h-4 w-4" />
                Add Option
              </button>
            </DialogTrigger>
            <DialogContent className="border-[#E5E2DB] bg-white">
              <DialogHeader>
                <DialogTitle className="text-[#1C1917]">New Delivery Option</DialogTitle>
              </DialogHeader>
              <ZoneForm
                lockedType={currentType ?? undefined}
                action={createDeliveryZone}
                onClose={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {zones.length === 0 ? (
        <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
          <p className="text-sm font-medium text-[#1C1917]">No delivery options yet</p>
          <p className="mt-1 text-xs text-[#A8A29E]">
            Add your first option to choose your delivery method.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {!isCourierMode && (
            <p className="text-xs text-[#A8A29E]">Drag to reorder — checkout displays options in this order.</p>
          )}
          {zones.map((zone, index) => (
            <div
              key={zone.id}
              draggable={!isCourierMode}
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`flex items-center gap-3 rounded-xl border border-[#E5E2DB] bg-white px-4 py-3.5 ${!isCourierMode ? "cursor-grab active:cursor-grabbing active:opacity-60" : ""}`}
            >
              {!isCourierMode && (
                <GripVertical className="h-4 w-4 shrink-0 text-[#C8C4BD]" />
              )}

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  {isCourierMode ? (
                    <Bike className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                  ) : (
                    <Truck className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                  )}
                  <span className="text-sm font-medium text-[#1C1917]">{zone.name}</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${zone.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                {zone.type === "FIXED" && zone.regions && (
                  <p className="truncate text-xs text-[#A8A29E]">{zone.regions}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                {zone.type === "FIXED" && zone.fee != null && (
                  <span className="text-sm font-semibold tabular-nums text-[#1C1917]">
                    ₵{Number(zone.fee).toFixed(2)}
                  </span>
                )}

                <Dialog open={editingId === zone.id} onOpenChange={(open) => setEditingId(open ? zone.id : null)}>
                  <DialogTrigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-[#F0EDE8] hover:text-[#1C1917]">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="border-[#E5E2DB] bg-white">
                    <DialogHeader>
                      <DialogTitle className="text-[#1C1917]">Edit {zone.name}</DialogTitle>
                    </DialogHeader>
                    <ZoneForm
                      zone={zone}
                      lockedType={zone.type}
                      action={updateDeliveryZone.bind(null, zone.id)}
                      onClose={() => setEditingId(null)}
                    />
                  </DialogContent>
                </Dialog>

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
                  onClick={async () => {
                    if (confirm(`Delete "${zone.name}"?`)) {
                      const result = await deleteDeliveryZone(zone.id);
                      if (!result.success) toast.error(result.error);
                      else toast.success(`"${zone.name}" deleted.`);
                    }
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
