"use client";

import { useState, useActionState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
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

const inputCls = "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const labelCls = "text-sm font-medium text-[#1C1917]";

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
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="d-code">Code</label>
          <input id="d-code" name="code" className={`${inputCls} font-mono uppercase`} defaultValue={discount?.code ?? ""} placeholder="SAVE10" required />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="d-type">Type</label>
          <Select name="type" defaultValue={discount?.type ?? "PERCENTAGE"}>
            <SelectTrigger className="h-10 rounded-lg border-[#E5E2DB] bg-white text-sm text-[#1C1917] focus:ring-[#B45309]/20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="border-[#E5E2DB]">
              <SelectItem value="PERCENTAGE" className="text-sm focus:bg-[#FEF3C7] focus:text-[#92400E]">Percentage</SelectItem>
              <SelectItem value="FIXED_AMOUNT" className="text-sm focus:bg-[#FEF3C7] focus:text-[#92400E]">Fixed Amount (₵)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="d-value">Value</label>
          <input id="d-value" name="value" type="number" step="0.01" min="0" className={inputCls} defaultValue={discount ? Number(discount.value) : ""} required />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="d-min">Min Purchase (₵)</label>
          <input id="d-min" name="minPurchase" type="number" step="0.01" min="0" className={inputCls} defaultValue={discount?.minPurchase ? Number(discount.minPurchase) : ""} />
        </div>
        <div className="space-y-1.5">
          <label className={labelCls} htmlFor="d-max">Max Uses</label>
          <input id="d-max" name="maxUses" type="number" min="1" className={inputCls} defaultValue={discount?.maxUses ?? ""} />
        </div>
      </div>
      <div className="space-y-1.5">
        <label className={labelCls} htmlFor="d-expires">Expires At</label>
        <input
          id="d-expires"
          name="expiresAt"
          type="datetime-local"
          className={inputCls}
          defaultValue={discount?.expiresAt ? new Date(discount.expiresAt).toISOString().slice(0, 16) : ""}
        />
      </div>
      <div className="flex items-center gap-3">
        <Switch id="d-active" name="isActive" defaultChecked={discount?.isActive ?? true} />
        <label htmlFor="d-active" className="text-sm text-[#1C1917]">Active</label>
      </div>
      <div className="flex gap-2 pt-1">
        <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50">
          {isPending ? "Saving..." : discount ? "Update" : "Create"}
        </button>
        <button type="button" onClick={onClose} className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]">
          Cancel
        </button>
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
            <button className="inline-flex h-9 items-center gap-2 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524]">
              <Plus className="h-4 w-4" />
              Add Discount
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-lg border-[#E5E2DB] bg-white">
            <DialogHeader>
              <DialogTitle className="text-[#1C1917]">New Discount</DialogTitle>
            </DialogHeader>
            <DiscountForm action={createDiscount} onClose={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {discounts.length === 0 ? (
        <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
          <p className="text-sm text-[#A8A29E]">No discounts yet. Create your first discount code.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-[#E5E2DB] bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E5E2DB] bg-[#F8F7F4]">
                {["Code", "Type", "Value", "Usage", "Status", ""].map((h, i) => (
                  <th
                    key={i}
                    className={`px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#A8A29E] ${i === 2 || i === 3 ? "text-right" : "text-left"}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F5F3EE]">
              {discounts.map((d) => (
                <tr key={d.id} className="hover:bg-[#FAFAF8]">
                  <td className="px-4 py-3.5">
                    <span className="font-mono font-medium text-[#1C1917]">{d.code}</span>
                  </td>
                  <td className="px-4 py-3.5 text-[#78716C]">
                    {d.type === "PERCENTAGE" ? "Percentage" : "Fixed"}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums font-medium text-[#1C1917]">
                    {d.type === "PERCENTAGE" ? `${Number(d.value)}%` : `₵${Number(d.value).toFixed(2)}`}
                  </td>
                  <td className="px-4 py-3.5 text-right tabular-nums text-[#78716C]">
                    {d.usedCount}{d.maxUses ? ` / ${d.maxUses}` : ""}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${d.isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                      {d.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Dialog open={editingId === d.id} onOpenChange={(open) => setEditingId(open ? d.id : null)}>
                        <DialogTrigger asChild>
                          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-[#F0EDE8] hover:text-[#1C1917]">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="max-w-lg border-[#E5E2DB] bg-white">
                          <DialogHeader>
                            <DialogTitle className="text-[#1C1917]">Edit {d.code}</DialogTitle>
                          </DialogHeader>
                          <DiscountForm
                            discount={d}
                            action={updateDiscount.bind(null, d.id)}
                            onClose={() => setEditingId(null)}
                          />
                        </DialogContent>
                      </Dialog>
                      <button
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
                        onClick={async () => {
                          if (confirm(`Delete "${d.code}"?`)) {
                            const result = await deleteDiscount(d.id);
                            if (!result.success) alert(result.error);
                          }
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
