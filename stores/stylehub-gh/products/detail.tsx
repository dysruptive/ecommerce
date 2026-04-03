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

export function StyleHubProductDetail({ tenant, product }: { tenant: Tenant; product: ProductDetail }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = hasDiscount ? Math.round((1 - product.price / product.compareAtPrice!) * 100) : null;

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* Breadcrumb */}
        <p className="mb-8 text-[11px] font-semibold uppercase tracking-[0.15em] text-zinc-500">
          <a href="/" className="hover:text-zinc-900">Home</a>
          {" / "}
          <a href="/products" className="hover:text-zinc-900">Shop</a>
          {product.category && <>{" / "}<span className="text-zinc-900">{product.category.name}</span></>}
        </p>

        <div className="grid gap-12 md:grid-cols-2">
          <ImageGallery images={product.images} productName={product.name} />

          <div>
            {product.category && (
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-zinc-400">
                {product.category.name}
              </p>
            )}

            <h1 className="mt-2 text-4xl font-black uppercase leading-none tracking-tight text-zinc-900">
              {product.name}
            </h1>

            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-black text-zinc-900">₵{product.price.toFixed(2)}</span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-zinc-400 line-through">₵{product.compareAtPrice!.toFixed(2)}</span>
                  <span className="bg-zinc-900 px-2 py-0.5 text-xs font-black text-white">
                    -{discount}% OFF
                  </span>
                </>
              )}
            </div>

            {product.trackStock && (
              <p className={`mt-2 text-sm font-semibold ${product.stock > 0 ? "text-emerald-600" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} pieces available` : "Sold out"}
              </p>
            )}

            {product.description && (
              <p className="mt-5 border-t border-zinc-100 pt-5 text-sm leading-relaxed text-zinc-500">
                {product.description}
              </p>
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

            <p className="mt-4 text-xs text-zinc-400">
              Authentic Ghanaian craftsmanship · Nationwide delivery available
            </p>
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
