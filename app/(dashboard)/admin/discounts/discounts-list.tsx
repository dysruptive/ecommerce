"use client";

import { useState, useActionState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  createDiscount,
  updateDiscount,
  deleteDiscount,
} from "@/actions/discounts";

interface Discount {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED_AMOUNT";
  value: string | number;
  minPurchase: string | number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

type ActionResult = { success: true } | { success: false; error: string } | null;

function DiscountForm({
  discount,
  action,
  onClose,
}: {
  discount?: Discount;
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  onClose: () => void;
}) {
  const [state, formAction, isPending] = useActionState(action, null);

  if (state?.success) onClose();

  return (
    <form action={formAction} className="space-y-4">
      {state?.success === false && (
        <div className="text-sm text-destructive">{state.error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="d-code">Code</Label>
          <Input
            id="d-code"
            name="code"
            defaultValue={discount?.code ?? ""}
            placeholder="e.g. SAVE10"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="d-type">Type</Label>
          <Select name="type" defaultValue={discount?.type ?? "PERCENTAGE"}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PERCENTAGE">Percentage</SelectItem>
              <SelectItem value="FIXED_AMOUNT">Fixed Amount (GHS)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="d-value">Value</Label>
          <Input
            id="d-value"
            name="value"
            type="number"
            step="0.01"
            min="0"
            defaultValue={discount ? Number(discount.value) : ""}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="d-min">Min Purchase (GHS)</Label>
          <Input
            id="d-min"
            name="minPurchase"
            type="number"
            step="0.01"
            min="0"
            defaultValue={
              discount?.minPurchase ? Number(discount.minPurchase) : ""
            }
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="d-max">Max Uses</Label>
          <Input
            id="d-max"
            name="maxUses"
            type="number"
            min="1"
            defaultValue={discount?.maxUses ?? ""}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="d-expires">Expires At</Label>
        <Input
          id="d-expires"
          name="expiresAt"
          type="datetime-local"
          defaultValue={
            discount?.expiresAt
              ? new Date(discount.expiresAt).toISOString().slice(0, 16)
              : ""
          }
        />
      </div>
      <div className="flex items-center gap-2">
        <Switch
          id="d-active"
          name="isActive"
          defaultChecked={discount?.isActive ?? true}
        />
        <Label htmlFor="d-active">Active</Label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Saving..." : discount ? "Update" : "Create"}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
      </div>
    </form>
  );
}

export function DiscountsList({ discounts }: { discounts: Discount[] }) {
  const [createOpen, setCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Discount
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New Discount</DialogTitle>
            </DialogHeader>
            <DiscountForm
              action={createDiscount}
              onClose={() => setCreateOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {discounts.length === 0 ? (
        <div className="rounded-md border p-8 text-center text-sm text-muted-foreground">
          No discounts yet. Create your first discount code.
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Usage</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {discounts.map((d) => (
                <TableRow key={d.id}>
                  <TableCell className="font-mono font-medium">
                    {d.code}
                  </TableCell>
                  <TableCell>
                    {d.type === "PERCENTAGE" ? "Percentage" : "Fixed"}
                  </TableCell>
                  <TableCell className="text-right">
                    {d.type === "PERCENTAGE"
                      ? `${Number(d.value)}%`
                      : `GHS ${Number(d.value).toFixed(2)}`}
                  </TableCell>
                  <TableCell className="text-right">
                    {d.usedCount}
                    {d.maxUses ? ` / ${d.maxUses}` : ""}
                  </TableCell>
                  <TableCell>
                    <Badge variant={d.isActive ? "default" : "secondary"}>
                      {d.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Dialog
                        open={editingId === d.id}
                        onOpenChange={(open) =>
                          setEditingId(open ? d.id : null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg">
                          <DialogHeader>
                            <DialogTitle>Edit {d.code}</DialogTitle>
                          </DialogHeader>
                          <DiscountForm
                            discount={d}
                            action={updateDiscount.bind(null, d.id)}
                            onClose={() => setEditingId(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={async () => {
                          if (confirm(`Delete "${d.code}"?`)) {
                            const result = await deleteDiscount(d.id);
                            if (!result.success) alert(result.error);
                          }
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
