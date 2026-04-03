import Link from "next/link";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ImageGallery } from "@/components/store/image-gallery";
import { AddToCartForm } from "@/components/store/add-to-cart-form";
import { Leaf, Truck } from "lucide-react";

interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number;
  images: { id: string; url: string; altText: string | null }[];
  variants: { id: string; name: string; price: number; stock: number }[];
  category?: { name: string } | null;
  stock: number;
  trackStock: boolean;
}

export function FreshMartProductDetail({ tenant, product }: { tenant: Tenant; product: ProductDetail }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const savings = hasDiscount ? product.compareAtPrice! - product.price : 0;

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Breadcrumb */}
        <p className="mb-6 text-xs text-gray-500">
          <Link href="/" className="hover:text-green-700">Home</Link>
          {" / "}
          <Link href="/products" className="hover:text-green-700">Products</Link>
          {product.category && <>{" / "}<span className="text-gray-700">{product.category.name}</span></>}
        </p>

        <div className="grid gap-10 md:grid-cols-2">
          <ImageGallery images={product.images} productName={product.name} />

          <div>
            {product.category && (
              <span className="inline-block rounded-full bg-green-100 px-3 py-0.5 text-xs font-semibold text-green-800">
                {product.category.name}
              </span>
            )}

            <h1 className="mt-3 text-3xl font-extrabold text-gray-900">{product.name}</h1>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-3xl font-extrabold text-green-700">₵{product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₵{product.compareAtPrice!.toFixed(2)}</span>
                  <span className="rounded-full bg-yellow-400 px-2.5 py-0.5 text-xs font-black text-green-900">
                    Save ₵{savings.toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {product.trackStock && product.variants.length === 0 && (
              <p className={`mt-2 flex items-center gap-1.5 text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                <Leaf className="h-3.5 w-3.5" />
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            {product.description && (
              <p className="mt-4 text-sm leading-relaxed text-gray-600">{product.description}</p>
            )}

            <div className="mt-6">
              <AddToCartForm
                product={{
                  id: product.id,
                  name: product.name,
                  price: product.price,
                  imageUrl: product.images[0]?.url,
                  stock: product.stock,
                  trackStock: product.trackStock,
                  variants: product.variants,
                }}
              />
            </div>

            {/* Delivery note */}
            <div className="mt-6 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-4 py-3 text-sm text-green-800">
              <Truck className="h-4 w-4 shrink-0 text-green-600" />
              <span>Same-day delivery available in Accra Metro. Order before 2pm.</span>
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
