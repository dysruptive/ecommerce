"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <form action={formAction} className="space-y-6">
      {/* Hidden serialized images */}
      <input
        type="hidden"
        name="imagesJson"
        value={JSON.stringify(
          images.map((img, i) => ({ ...img, position: i })),
        )}
      />

      {/* Hidden serialized variants */}
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
        <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {state.error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              defaultValue={product?.name ?? ""}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={product?.description ?? ""}
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>
          <ImageUpload
            images={images}
            onChange={setImages}
            folder={`stores/${tenantSlug}/products`}
            maxImages={5}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pricing & Inventory</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="price">Price (GHS)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product ? Number(product.price) : ""}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="compareAtPrice">Compare-at Price (GHS)</Label>
              <Input
                id="compareAtPrice"
                name="compareAtPrice"
                type="number"
                step="0.01"
                min="0"
                defaultValue={
                  product?.compareAtPrice
                    ? Number(product.compareAtPrice)
                    : ""
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                min="0"
                defaultValue={product?.stock ?? 0}
                required
              />
            </div>
            <div className="flex items-end gap-2 pb-1">
              <Switch
                id="trackStock"
                name="trackStock"
                defaultChecked={product?.trackStock ?? true}
              />
              <Label htmlFor="trackStock">Track stock</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Organization</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="categoryId">Category</Label>
            <Select
              name="categoryId"
              defaultValue={product?.categoryId ?? ""}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="isPublished"
              name="isPublished"
              defaultChecked={product?.isPublished ?? false}
            />
            <Label htmlFor="isPublished">Published</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Variants</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No variants. Add variants if this product comes in different sizes, colours, etc.
            </p>
          ) : (
            <div className="space-y-3">
              {variants.map((v, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-2 rounded-md border p-3"
                >
                  <Input
                    placeholder="Name (e.g. Large / Red)"
                    value={v.name}
                    onChange={(e) => updateVariant(idx, "name", e.target.value)}
                    required
                  />
                  <Input
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => updateVariant(idx, "sku", e.target.value)}
                    className="w-24"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={v.price}
                    onChange={(e) => updateVariant(idx, "price", e.target.value)}
                    className="w-24"
                    required
                  />
                  <Input
                    placeholder="Stock"
                    type="number"
                    min="0"
                    value={v.stock}
                    onChange={(e) => updateVariant(idx, "stock", e.target.value)}
                    className="w-20"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 shrink-0 text-destructive"
                    onClick={() => removeVariant(idx)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending
            ? "Saving..."
            : product
              ? "Update Product"
              : "Create Product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/products")}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
