"use client";

import { useState, useEffect, useActionState, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus } from "lucide-react";
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
} from "@/components/ui/dialog";
import {
  ProductImagesSection,
  type UploadedImage,
} from "./product-images-section";
import {
  ProductVariantsSection,
  type VariantRow,
} from "./product-variants-section";
import { VariantAIHelper } from "./variant-ai-helper";
import { createCategoryInline } from "@/actions/categories";

interface Category {
  id: string;
  name: string;
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

const inputCls =
  "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
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
  const [categoryList, setCategoryList] = useState<Category[]>(categories);
  const [selectedCategoryId, setSelectedCategoryId] = useState(product?.categoryId ?? "");
  const [newCatOpen, setNewCatOpen] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [isCreatingCat, startCatTransition] = useTransition();
  const newCatInputRef = useRef<HTMLInputElement>(null);
  const [isPublished, setIsPublished] = useState(product?.isPublished ?? false);

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

  useEffect(() => {
    if (!state) return;
    if (state.success) {
      toast.success(product ? "Product updated." : "Product created.");
      router.push("/admin/products");
    } else {
      toast.error(state.error);
    }
  }, [state, router, product]);

  function handleCreateCategory() {
    if (!newCatName.trim()) return;
    startCatTransition(async () => {
      const result = await createCategoryInline(newCatName.trim());
      if (result.success) {
        setCategoryList((prev) =>
          [...prev, result.category].sort((a, b) => a.name.localeCompare(b.name)),
        );
        setSelectedCategoryId(result.category.id);
        setNewCatOpen(false);
        setNewCatName("");
        toast.success(`"${result.category.name}" created.`);
      } else {
        toast.error(result.error);
      }
    });
  }

  return (
    <form action={formAction}>
      {/* Hidden inputs for complex state */}
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
      <input type="hidden" name="isPublished" value={isPublished ? "on" : ""} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_288px] items-start">
        {/* ── Left column ── */}
        <div className="space-y-5">
          {/* Details card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Details</p>
            </div>
            <div className={`${cardBody} space-y-4`}>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="name">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  className={inputCls}
                  placeholder="Product name"
                  defaultValue={product?.name ?? ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="description">
                  Description{" "}
                  <span className="font-normal text-[#A8A29E]">(optional)</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  placeholder="Describe the product..."
                  className="w-full resize-none rounded-lg border border-[#E5E2DB] bg-white px-3 py-2.5 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                  defaultValue={product?.description ?? ""}
                />
              </div>
            </div>
          </div>

          {/* Images card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Images</p>
            </div>
            <div className={cardBody}>
              <ProductImagesSection
                images={images}
                onChange={setImages}
                folder={`stores/${tenantSlug}/products`}
              />
            </div>
          </div>

          {/* Variants card */}
          <div className={card}>
            <div className={`${cardHeader} flex items-center justify-between`}>
              <p className={cardTitle}>Variants</p>
              <VariantAIHelper
                onApply={(rows) => setVariants(rows)}
              />
            </div>
            <div className={cardBody}>
              <ProductVariantsSection
                variants={variants}
                onAdd={() => setVariants((prev) => [...prev, emptyVariant()])}
                onRemove={(idx) =>
                  setVariants((prev) => prev.filter((_, i) => i !== idx))
                }
                onUpdate={(idx, field, value) =>
                  setVariants((prev) =>
                    prev.map((v, i) => (i === idx ? { ...v, [field]: value } : v)),
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="space-y-4 lg:sticky lg:top-6">
          {/* Status card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Status</p>
            </div>
            <div className={cardBody}>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <span
                    className={[
                      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                      isPublished
                        ? "bg-green-100 text-green-800"
                        : "bg-[#F5F4F2] text-[#78716C]",
                    ].join(" ")}
                  >
                    {isPublished ? "Live" : "Draft"}
                  </span>
                  <p className="mt-1 text-xs text-[#A8A29E]">
                    {isPublished
                      ? "Visible on your store"
                      : "Not visible to customers"}
                  </p>
                </div>
                <Switch
                  id="isPublishedToggle"
                  checked={isPublished}
                  onCheckedChange={setIsPublished}
                />
              </div>
            </div>
          </div>

          {/* Pricing card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Pricing</p>
            </div>
            <div className={`${cardBody} space-y-4`}>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="price">
                  Price (₵) <span className="text-red-500">*</span>
                </label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputCls}
                  defaultValue={product ? Number(product.price) : ""}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="compareAtPrice">
                  Compare-at (₵){" "}
                  <span className="font-normal text-[#A8A29E]">(optional)</span>
                </label>
                <input
                  id="compareAtPrice"
                  name="compareAtPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={inputCls}
                  defaultValue={
                    product?.compareAtPrice ? Number(product.compareAtPrice) : ""
                  }
                />
                <p className="text-xs text-[#A8A29E]">
                  Shown as original price when on sale
                </p>
              </div>
            </div>
          </div>

          {/* Inventory card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Inventory</p>
            </div>
            <div className={`${cardBody} space-y-4`}>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="sku">
                  SKU{" "}
                  <span className="font-normal text-[#A8A29E]">(optional)</span>
                </label>
                <input
                  id="sku"
                  name="sku"
                  placeholder="SKU-001"
                  className={inputCls}
                  defaultValue={product?.sku ?? ""}
                />
              </div>
              <div className="space-y-1.5">
                <label className={labelCls} htmlFor="stock">
                  Stock <span className="text-red-500">*</span>
                </label>
                <input
                  id="stock"
                  name="stock"
                  type="number"
                  min="0"
                  placeholder="0"
                  className={inputCls}
                  defaultValue={product?.stock ?? 0}
                  required
                />
              </div>
              <div className="flex items-center gap-3">
                <Switch
                  id="trackStock"
                  name="trackStock"
                  defaultChecked={product?.trackStock ?? true}
                />
                <label htmlFor="trackStock" className="text-sm text-[#1C1917]">
                  Track stock
                </label>
              </div>
            </div>
          </div>

          {/* Organization card */}
          <div className={card}>
            <div className={cardHeader}>
              <p className={cardTitle}>Organization</p>
            </div>
            <div className={cardBody}>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={labelCls}>
                    Category{" "}
                    <span className="font-normal text-[#A8A29E]">(optional)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewCatOpen(true);
                      setTimeout(() => newCatInputRef.current?.focus(), 50);
                    }}
                    className="inline-flex items-center gap-1 text-xs font-medium text-[#B45309] hover:underline underline-offset-2"
                  >
                    <Plus className="h-3 w-3" />
                    New category
                  </button>
                </div>
                <input type="hidden" name="categoryId" value={selectedCategoryId} />
                <Select value={selectedCategoryId} onValueChange={setSelectedCategoryId}>
                  <SelectTrigger className="h-10 rounded-lg border-[#E5E2DB] bg-white text-sm text-[#1C1917] focus:ring-[#B45309]/20">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent className="border-[#E5E2DB]">
                    {categoryList.map((cat) => (
                      <SelectItem
                        key={cat.id}
                        value={cat.id}
                        className="text-sm focus:bg-[#FEF3C7] focus:text-[#92400E]"
                      >
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Dialog open={newCatOpen} onOpenChange={setNewCatOpen}>
                <DialogContent className="border-[#E5E2DB] bg-white sm:max-w-sm">
                  <DialogHeader>
                    <DialogTitle className="text-[#1C1917]">New Category</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <input
                      ref={newCatInputRef}
                      value={newCatName}
                      onChange={(e) => setNewCatName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCreateCategory();
                        }
                      }}
                      placeholder="Category name"
                      className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isCreatingCat || !newCatName.trim()}
                        onClick={handleCreateCategory}
                        className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
                      >
                        {isCreatingCat ? "Creating..." : "Create"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setNewCatOpen(false);
                          setNewCatName("");
                        }}
                        className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          {/* Actions card */}
          <div className={card}>
            <div className={`${cardBody} space-y-2`}>
              <button
                type="submit"
                disabled={isPending}
                className="h-10 w-full rounded-lg bg-[#1C1917] text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
              >
                {isPending
                  ? "Saving..."
                  : product
                    ? "Update Product"
                    : isPublished
                      ? "Save Product"
                      : "Save Draft"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/admin/products")}
                className="h-10 w-full rounded-lg border border-[#E5E2DB] bg-white text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
