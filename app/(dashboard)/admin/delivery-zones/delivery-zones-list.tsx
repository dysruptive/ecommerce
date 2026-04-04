"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, ArrowUp, ArrowDown, Truck, Bike } from "lucide-react";
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
  updateDeliveryMode,
} from "@/actions/delivery-zones";
import { ZoneForm, type Zone } from "./zone-form";

interface DeliveryZonesListProps {
  zones: Zone[];
  deliveryMode: "FIXED" | "COURIER";
}

export function DeliveryZonesList({ zones: initialZones, deliveryMode: initialMode }: DeliveryZonesListProps) {
  const router = useRouter();
  const [zones, setZones] = useState(initialZones);
  const [deliveryMode, setDeliveryMode] = useState(initialMode);
  const [createOpen, setCreateOpen] = useState(false);
  const [createType, setCreateType] = useState<"FIXED" | "COURIER">("FIXED");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  // Sync local state when server data changes (after router.refresh())
  const [prevInitial, setPrevInitial] = useState(initialZones);
  if (initialZones !== prevInitial) {
    setPrevInitial(initialZones);
    setZones(initialZones);
  }

  const fixedZones = zones.filter((z) => z.type === "FIXED");
  const courierZones = zones.filter((z) => z.type === "COURIER");

  async function handleSwitchMode(mode: "FIXED" | "COURIER") {
    if (mode === deliveryMode) return;
    setIsSwitching(true);
    const result = await updateDeliveryMode(mode);
    setIsSwitching(false);
    if (result.success) {
      setDeliveryMode(mode);
      toast.success(`Switched to ${mode === "FIXED" ? "fixed delivery zones" : "courier delivery"}.`);
    } else {
      toast.error(result.error);
    }
  }

  async function handleDelete(zone: Zone) {
    if (!confirm(`Delete "${zone.name}"?`)) return;
    setZones((prev) => prev.filter((z) => z.id !== zone.id));
    const result = await deleteDeliveryZone(zone.id);
    if (result.success) {
      toast.success(`"${zone.name}" deleted.`);
    } else {
      toast.error(result.error);
      router.refresh();
    }
  }

  async function moveZone(zone: Zone, direction: "up" | "down") {
    const sameType = zones.filter((z) => z.type === zone.type);
    const index = sameType.findIndex((z) => z.id === zone.id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sameType.length) return;

    // Build new full zones array with swapped positions within this type
    const newSameType = [...sameType];
    [newSameType[index], newSameType[targetIndex]] = [newSameType[targetIndex], newSameType[index]];
    const otherZones = zones.filter((z) => z.type !== zone.type);
    const newZones = zone.type === "FIXED"
      ? [...newSameType, ...otherZones]
      : [...otherZones, ...newSameType];
    setZones(newZones);

    const result = await reorderDeliveryZones(newZones.map((z) => z.id));
    if (!result.success) {
      toast.error(result.error);
      setZones(zones);
    }
  }

  function openCreate(type: "FIXED" | "COURIER") {
    setCreateType(type);
    setCreateOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Mode toggle */}
      <div className="rounded-xl border border-[#E5E2DB] bg-white p-4">
        <p className="mb-3 text-sm font-medium text-[#1C1917]">Active delivery method at checkout</p>
        <div className="flex gap-2">
          <button
            onClick={() => handleSwitchMode("FIXED")}
            disabled={isSwitching}
            className={`flex flex-1 items-center gap-2.5 rounded-lg border p-3 text-left text-sm transition-colors disabled:opacity-60 ${
              deliveryMode === "FIXED"
                ? "border-[#B45309] bg-[#FEF3C7] text-[#92400E]"
                : "border-[#E5E2DB] bg-white text-[#78716C] hover:bg-[#F8F7F4]"
            }`}
          >
            <Truck className="h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Fixed zones</p>
              <p className="text-xs opacity-70">Your own riders, fixed prices per area</p>
            </div>
          </button>
          <button
            onClick={() => handleSwitchMode("COURIER")}
            disabled={isSwitching}
            className={`flex flex-1 items-center gap-2.5 rounded-lg border p-3 text-left text-sm transition-colors disabled:opacity-60 ${
              deliveryMode === "COURIER"
                ? "border-[#B45309] bg-[#FEF3C7] text-[#92400E]"
                : "border-[#E5E2DB] bg-white text-[#78716C] hover:bg-[#F8F7F4]"
            }`}
          >
            <Bike className="h-4 w-4 shrink-0" />
            <div>
              <p className="font-medium">Courier</p>
              <p className="text-xs opacity-70">Yango, Bolt, Uber — price varies</p>
            </div>
          </button>
        </div>
      </div>

      {/* Fixed zones */}
      <ZoneSection
        title="Fixed Delivery Zones"
        description="Regions with set delivery fees shown at checkout when using fixed mode."
        type="FIXED"
        zones={fixedZones}
        isActive={deliveryMode === "FIXED"}
        onAdd={() => openCreate("FIXED")}
        onEdit={(id) => setEditingId(id)}
        onMove={moveZone}
        onDelete={handleDelete}
        editingId={editingId}
        onEditClose={() => {
          setEditingId(null);
          router.refresh();
        }}
      />

      {/* Courier options */}
      <ZoneSection
        title="Courier Options"
        description="Third-party delivery services shown at checkout when using courier mode."
        type="COURIER"
        zones={courierZones}
        isActive={deliveryMode === "COURIER"}
        onAdd={() => openCreate("COURIER")}
        onEdit={(id) => setEditingId(id)}
        onMove={moveZone}
        onDelete={handleDelete}
        editingId={editingId}
        onEditClose={() => {
          setEditingId(null);
          router.refresh();
        }}
      />

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="border-[#E5E2DB] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#1C1917]">
              {createType === "FIXED" ? "New Delivery Zone" : "New Courier Option"}
            </DialogTitle>
          </DialogHeader>
          <ZoneForm
            lockedType={createType}
            action={createDeliveryZone}
            onClose={() => {
              setCreateOpen(false);
              router.refresh();
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ZoneSection({
  title,
  description,
  type,
  zones,
  isActive,
  onAdd,
  onEdit,
  onMove,
  onDelete,
  editingId,
  onEditClose,
}: {
  title: string;
  description: string;
  type: "FIXED" | "COURIER";
  zones: Zone[];
  isActive: boolean;
  onAdd: () => void;
  onEdit: (id: string) => void;
  onMove: (zone: Zone, direction: "up" | "down") => void;
  onDelete: (zone: Zone) => void;
  editingId: string | null;
  onEditClose: () => void;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#1C1917]">{title}</p>
          {isActive ? (
            <span className="inline-flex rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
              Active
            </span>
          ) : (
            <span className="inline-flex rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
              Inactive at checkout
            </span>
          )}
        </div>
        <button
          onClick={onAdd}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DB] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F8F7F4]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add
        </button>
      </div>

      {zones.length === 0 ? (
        <div className="rounded-xl border border-dashed border-[#E5E2DB] bg-white px-4 py-6 text-center">
          <p className="text-xs text-[#A8A29E]">
            {type === "FIXED"
              ? "No fixed zones yet. Add zones with prices for different areas."
              : "No courier options yet. Add Yango, Bolt, Uber etc."}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {type === "FIXED" && zones.length > 1 && (
            <p className="text-xs text-[#A8A29E]">{description}</p>
          )}
          {zones.map((zone, index) => (
            <div
              key={zone.id}
              className="flex items-center gap-3 rounded-xl border border-[#E5E2DB] bg-white px-4 py-3.5"
            >
              {type === "FIXED" && zones.length > 1 && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => onMove(zone, "up")}
                    disabled={index === 0}
                    className="flex h-6 w-6 items-center justify-center rounded text-[#C8C4BD] hover:bg-[#F0EDE8] hover:text-[#78716C] disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => onMove(zone, "down")}
                    disabled={index === zones.length - 1}
                    className="flex h-6 w-6 items-center justify-center rounded text-[#C8C4BD] hover:bg-[#F0EDE8] hover:text-[#78716C] disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="min-w-0 flex-1 space-y-0.5">
                <div className="flex items-center gap-2">
                  {type === "COURIER"
                    ? <Bike className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                    : <Truck className="h-3.5 w-3.5 shrink-0 text-[#78716C]" />
                  }
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

                <Dialog open={editingId === zone.id} onOpenChange={(open) => open ? onEdit(zone.id) : onEditClose()}>
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
                      onClose={onEditClose}
                    />
                  </DialogContent>
                </Dialog>

                <button
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
                  onClick={() => onDelete(zone)}
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
