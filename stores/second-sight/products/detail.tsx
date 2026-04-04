import Link from "next/link";
import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ImageGallery } from "@/components/store/image-gallery";
import { AddToCartForm } from "@/components/store/add-to-cart-form";

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

export function SecondSightProductDetail({ tenant, product }: { tenant: Tenant; product: ProductDetail }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : null;

  return (
    <StoreLayout tenant={tenant}>
      <div className="bg-[#f5f5f5] px-6 pb-4 pt-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] text-gray-400">
            <Link href="/" className="hover:text-gray-700">Home</Link>
            {" / "}
            <Link href="/products" className="hover:text-gray-700">Frames</Link>
            {product.category && <>{" / "}<span className="text-gray-600">{product.category.name}</span></>}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2">
          <div className="rounded-none border border-gray-100 bg-white p-4">
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          <div className="flex flex-col gap-5">
            {product.category && (
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400">
                {product.category.name}
              </p>
            )}

            <h1 className="text-2xl font-black leading-tight text-gray-900">{product.name}</h1>

            {/* Price */}
            <div className="flex flex-wrap items-baseline gap-3 border-b border-gray-100 pb-5">
              <span className="text-3xl font-black text-gray-900" style={{ fontFeatureSettings: '"tnum"' }}>
                ₵{product.price.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-gray-400 line-through">₵{product.compareAtPrice!.toLocaleString()}</span>
                  <span className="bg-red-500 px-2 py-0.5 text-[11px] font-black text-white">
                    {discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.trackStock && product.variants.length === 0 && (
              <p className={`text-sm font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}

            {product.description && (
              <p className="text-sm leading-relaxed text-gray-500">{product.description}</p>
            )}

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

            {/* Trust row */}
            <div className="mt-2 grid grid-cols-3 gap-2 border-t border-gray-100 pt-5 text-center">
              {[
                { label: "Prescription\nReady" },
                { label: "Free Accra\nDelivery" },
                { label: "30-Day\nReturns" },
              ].map((item) => (
                <div key={item.label} className="bg-gray-50 px-2 py-3">
                  <p className="whitespace-pre-line text-[10px] font-semibold uppercase leading-tight tracking-wide text-gray-500">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
