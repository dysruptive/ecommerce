"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Pencil, GripVertical, Truck, Bike } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { ZoneForm, type Zone } from "./zone-form";

export function DeliveryZonesList({ zones: initialZones }: { zones: Zone[] }) {
  const [zones, setZones] = useState(initialZones);
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [reorderError, setReorderError] = useState<string | null>(null);

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
                Add Option
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>New Delivery Option</DialogTitle>
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
          No delivery options configured yet.
        </div>
      ) : (
        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">
            Drag to reorder — checkout displays options in this order.
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
                    {zone.type === "COURIER" ? (
                      <Bike className="h-3.5 w-3.5 text-muted-foreground" />
                    ) : (
                      <Truck className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                    <span className="font-medium">{zone.name}</span>
                    <Badge variant={zone.isActive ? "default" : "secondary"}>
                      {zone.isActive ? "Active" : "Inactive"}
                    </Badge>
                    {zone.type === "COURIER" && (
                      <Badge variant="outline">Courier</Badge>
                    )}
                  </div>
                  {zone.type === "FIXED" && zone.regions && (
                    <p className="truncate text-sm text-muted-foreground">
                      {zone.regions}
                    </p>
                  )}
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
