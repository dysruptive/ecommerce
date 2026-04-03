"use client";

import { Plus, Trash2 } from "lucide-react";

export interface VariantRow {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

const inputCls =
  "h-9 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const colLabelCls = "text-xs font-medium text-[#78716C]";

interface ProductVariantsSectionProps {
  variants: VariantRow[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onUpdate: (idx: number, field: keyof VariantRow, value: string) => void;
}

export function ProductVariantsSection({
  variants,
  onAdd,
  onRemove,
  onUpdate,
}: ProductVariantsSectionProps) {
  if (variants.length === 0) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-[#E5E2DB] bg-[#FAFAF9] px-5 py-6">
        <p className="text-sm text-[#78716C]">
          Use variants if this product comes in different sizes, colours, or
          options.
        </p>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DB] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F8F7F4]"
        >
          <Plus className="h-3.5 w-3.5" />
          Add variant
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Column headers */}
      <div className="grid grid-cols-[1fr_100px_100px_80px_36px] gap-2 px-1">
        <span className={colLabelCls}>Option *</span>
        <span className={colLabelCls}>Price (₵) *</span>
        <span className={colLabelCls}>SKU</span>
        <span className={colLabelCls}>Stock *</span>
        <span />
      </div>

      {/* Variant rows */}
      {variants.map((v, idx) => (
        <div
          key={idx}
          className="grid grid-cols-[1fr_100px_100px_80px_36px] gap-2 rounded-xl border border-[#E5E2DB] bg-white p-3"
        >
          <input
            placeholder="e.g. Large / Red"
            value={v.name}
            onChange={(e) => onUpdate(idx, "name", e.target.value)}
            className={inputCls}
            required
          />
          <input
            placeholder="0.00"
            type="number"
            step="0.01"
            min="0"
            value={v.price}
            onChange={(e) => onUpdate(idx, "price", e.target.value)}
            className={inputCls}
            required
          />
          <input
            placeholder="SKU-001"
            value={v.sku}
            onChange={(e) => onUpdate(idx, "sku", e.target.value)}
            className={inputCls}
          />
          <input
            placeholder="0"
            type="number"
            min="0"
            value={v.stock}
            onChange={(e) => onUpdate(idx, "stock", e.target.value)}
            className={inputCls}
            required
          />
          <button
            type="button"
            onClick={() => onRemove(idx)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={onAdd}
        className="inline-flex items-center gap-1 text-sm font-medium text-[#B45309] hover:underline underline-offset-2"
      >
        <Plus className="h-3.5 w-3.5" />
        Add another variant
      </button>
    </div>
  );
}
