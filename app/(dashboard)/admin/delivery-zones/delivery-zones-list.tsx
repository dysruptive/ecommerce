"use client";

import { useState, useActionState, useRef } from "react";
import { Plus, Trash2, Pencil, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import {
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone,
  reorderDeliveryZones,
} from "@/actions/delivery-zones";

interface Zone {
  id: string;
  name: string;
  regions: string;
  fee: string | number;
  isActive: boolean;
  position: number;
}

function ZoneForm({
  zone,
  action,
  onClose,
}: {
  zone?: Zone;
  action: (
    prev: { success: true } | { success: false; error: string } | null,
    formData: FormData,
  ) => Promise<{ success: true } | { success: false; error: string } | null>;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success) {
    onClose();
  }

  return (
    <form action={formAction} className="space-y-4">
      {state?.success === false && (
        <div className="text-sm text-destructive">{state.error}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="zone-name">Zone Name</Label>
        <Input
          id="zone-name"
          name="name"
          defaultValue={zone?.name ?? ""}
          required
        />
      </div>
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

export function DeliveryZonesList({ zones: initialZones }: { zones: Zone[] }) {
  const [zones, setZones] = useState(initialZones);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

  // Drag-and-drop state
  const dragIndex = useRef<number | null>(null);
  const dragOverIndex = useRef<number | null>(null);

  function handleDragStart(index: number) {
    dragIndex.current = index;
  }

  function handleDragEnter(index: number) {
    dragOverIndex.current = index;
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
    dragOverIndex.current = null;
    setReorderError(null);
    const result = await reorderDeliveryZones(zones.map((z) => z.id));
    if (!result.success) setReorderError(result.error);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        {reorderError && (
          <p className="text-sm text-destructive">{reorderError}</p>
        )}
        <div className="ml-auto">
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Zone
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Delivery Zone</DialogTitle>
              </DialogHeader>
              <ZoneForm
                action={createDeliveryZone}
                onClose={() => setCreateOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {zones.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          No delivery zones configured.
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Drag to reorder — checkout displays zones in this order.
          </p>
          {zones.map((zone, index) => (
            <Card
              key={zone.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragEnter={() => handleDragEnter(index)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className="cursor-grab active:cursor-grabbing active:opacity-60"
            >
              <CardContent className="flex items-center gap-3 py-4">
                <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground" />
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{zone.name}</span>
                    <Badge variant={zone.isActive ? "default" : "secondary"}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                  <p className="truncate text-sm text-muted-foreground">
                    {zone.regions}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">
                    GHS {Number(zone.fee).toFixed(2)}
                  </span>
                  <Dialog
                    open={editingId === zone.id}
                    onOpenChange={(open) =>
                      setEditingId(open ? zone.id : null)
                    }
                  >
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit {zone.name}</DialogTitle>
                      </DialogHeader>
                      <ZoneForm
                        zone={zone}
                        action={updateDeliveryZone.bind(null, zone.id)}
                        onClose={() => setEditingId(null)}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive"
                    onClick={async () => {
                      if (confirm(`Delete "${zone.name}"?`)) {
                        const result = await deleteDeliveryZone(zone.id);
                        if (!result.success) alert(result.error);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
