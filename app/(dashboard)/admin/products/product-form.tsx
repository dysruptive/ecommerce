"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ImageUpload,
  type UploadedImage,
} from "@/components/dashboard/image-upload";

interface Category {
  id: string;
  name: string;
}

interface VariantRow {
  id?: string;
  name: string;
  sku: string;
  price: string;
  stock: string;
}

interface ProductData {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  compareAtPrice: string | number | null;
  sku: string | null;
  stock: number;
  trackStock: boolean;
  isPublished: boolean;
  categoryId: string | null;
  images?: { id: string; url: string; altText: string | null; position: number }[];
  variants?: { id: string; name: string; sku: string | null; price: string | number; stock: number }[];
}

interface ProductFormProps {
  categories: Category[];
  product?: ProductData;
  tenantSlug: string;
  action: (
    prev: { success: true } | { success: false; error: string } | null,
    formData: FormData,
  ) => Promise<{ success: true } | { success: false; error: string } | null>;
}

function emptyVariant(): VariantRow {
  return { name: "", sku: "", price: "", stock: "0" };
}

const inputCls = "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const labelCls = "block text-sm font-medium text-[#1C1917]";
const card = "rounded-xl border border-[#E5E2DB] bg-white";
const cardHeader = "border-b border-[#E5E2DB] px-5 py-4";
const cardTitle = "text-sm font-semibold text-[#1C1917]";
const cardBody = "px-5 py-5";

export function ProductForm({
  categories,
  product,
  tenantSlug,
  action,
}: ProductFormProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(action, null);

  const [images, setImages] = useState<UploadedImage[]>(
    product?.images?.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText ?? undefined,
      position: img.position,
    })) ?? [],
  );

  const [variants, setVariants] = useState<VariantRow[]>(
    product?.variants?.map((v) => ({
      id: v.id,
      name: v.name,
      sku: v.sku ?? "",
      price: String(Number(v.price)),
      stock: String(v.stock),
    })) ?? [],
  );

  if (state?.success) {
    router.push("/admin/products");
  }

  function addVariant() {
    setVariants((prev) => [...prev, emptyVariant()]);
  }

  function removeVariant(idx: number) {
    setVariants((prev) => prev.filter((_, i) => i !== idx));
  }

  function updateVariant(idx: number, field: keyof VariantRow, value: string) {
    setVariants((prev) =>
      prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <input
        type="hidden"
        name="imagesJson"
        value={JSON.stringify(images.map((img, i) => ({ ...img, position: i })))}
      />
      <input
        type="hidden"
        name="variantsJson"
        value={JSON.stringify(
          variants.map((v) => ({
            ...v,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock, 10) || 0,
          })),
        )}
      />

      {state?.success === false && (
        <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
      )}

      {/* Details */}
      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Details</p></div>
        <div className={`${cardBody} space-y-4`}>
          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="name">Name</label>
            <input id="name" name="name" className={inputCls} defaultValue={product?.name ?? ""} required />
          </div>
          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={4}
              className="w-full rounded-lg border border-[#E5E2DB] bg-white px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309] resize-none"
              defaultValue={product?.description ?? ""}
            />
          </div>
        </div>
      </div>

      {/* Images */}
      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Images</p></div>
        <div className={cardBody}>
          <ImageUpload
            images={images}
            onChange={setImages}
            folder={`stores/${tenantSlug}/products`}
            maxImages={5}
          />
        </div>
      </div>

      {/* Pricing & Inventory */}
      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Pricing & Inventory</p></div>
        <div className={`${cardBody} space-y-4`}>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="price">Price (₵)</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                defaultValue={product ? Number(product.price) : ""}
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="compareAtPrice">Compare-at Price (₵)</label>
              <input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                className={inputCls}
                defaultValue={product?.compareAtPrice ? Number(product.compareAtPrice) : ""}
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="sku">SKU</label>
              <input id="sku" name="sku" className={inputCls} defaultValue={product?.sku ?? ""} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="stock">Stock</label>
              <input
                id="stock"
                name="stock"
                type="number"
                min="0"
                className={inputCls}
                defaultValue={product?.stock ?? 0}
                required
              />
            </div>
            <div className="flex items-end gap-3 pb-0.5">
              <Switch id="trackStock" name="trackStock" defaultChecked={product?.trackStock ?? true} />
              <label htmlFor="trackStock" className="text-sm text-[#1C1917]">Track stock</label>
            </div>
          </div>
        </div>
      </div>

      {/* Organization */}
      <div className={card}>
        <div className={cardHeader}><p className={cardTitle}>Organization</p></div>
        <div className={`${cardBody} space-y-4`}>
          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="categoryId">Category</label>
            <Select name="categoryId" defaultValue={product?.categoryId ?? ""}>
              <SelectTrigger className="h-10 rounded-lg border-[#E5E2DB] bg-white text-sm text-[#1C1917] focus:ring-[#B45309]/20">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent className="border-[#E5E2DB]">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id} className="text-sm focus:bg-[#FEF3C7] focus:text-[#92400E]">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="isPublished" name="isPublished" defaultChecked={product?.isPublished ?? false} />
            <label htmlFor="isPublished" className="text-sm text-[#1C1917]">Published</label>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className={card}>
        <div className={`${cardHeader} flex items-center justify-between`}>
          <p className={cardTitle}>Variants</p>
          <button
            type="button"
            onClick={addVariant}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-[#E5E2DB] bg-white px-3 text-xs font-medium text-[#1C1917] hover:bg-[#F8F7F4]"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Variant
          </button>
        </div>
        <div className={cardBody}>
          {variants.length === 0 ? (
            <p className="text-sm text-[#A8A29E]">
              No variants. Add variants if this product comes in different sizes, colours, etc.
            </p>
          ) : (
            <div className="space-y-2">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 rounded-xl border border-[#E5E2DB] p-3"
                >
                  <input
                    placeholder="Name (e.g. Large / Red)"
                    value={v.name}
                    onChange={(e) => updateVariant(idx, "name", e.target.value)}
                    className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                    required
                  />
                  <input
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                    className="h-9 w-24 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                  />
                  <input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, "price", e.target.value)}
                    className="h-9 w-24 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                    required
                  />
                  <input
                    placeholder="Stock"
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                    className="h-9 w-20 rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeVariant(idx)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
        >
          {isPending ? "Saving..." : product ? "Update Product" : "Create Product"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/products")}
          className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
