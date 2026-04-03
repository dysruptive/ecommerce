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
              <ZoneForm action={createDeliveryZone} onClose={() => setCreateOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {zones.length === 0 ? (
        <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
          <p className="text-sm text-[#A8A29E]">No delivery options configured yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-[#A8A29E]">Drag to reorder — checkout displays options in this order.</p>
          {zones.map((zone, index) => (
            <div
              key={zone.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="flex cursor-grab items-center gap-3 rounded-xl border border-[#E5E2DB] bg-white px-4 py-3.5 active:cursor-grabbing active:opacity-60"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-[#C8C4BD]" />

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  {zone.type === "COURIER" ? (
                    <Bike className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                  ) : (
                    <Truck className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                  )}
                  <span className="text-sm font-medium text-[#1C1917]">{zone.name}</span>
                  <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${zone.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                    {zone.isActive ? "Active" : "Inactive"}
                  </span>
                  {zone.type === "COURIER" && (
                    <span className="inline-flex rounded-full border border-[#E5E2DB] px-2 py-0.5 text-xs text-[#78716C]">
                      Courier
                    </span>
                  )}
                </div>
                {zone.type === "FIXED" && zone.regions && (
                  <p className="truncate text-xs text-[#A8A29E]">{zone.regions}</p>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm font-semibold tabular-nums text-[#1C1917]">
                  ₵{Number(zone.fee).toFixed(2)}
                </span>

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
