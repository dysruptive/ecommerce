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

// Copy to stores/<slug>/products/detail.tsx and customise for the brand.
export function TemplateProductDetail({ tenant, product }: { tenant: Tenant; product: ProductDetail }) {
  const hasDiscount = product.compareAtPrice && product.compareAtPrice > product.price;

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          <ImageGallery images={product.images} productName={product.name} />
          <div className="space-y-4">
            {product.category && (
              <p className="text-sm text-muted-foreground">{product.category.name}</p>
            )}
            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold" style={{ color: "var(--store-primary)" }}>
                GHS {product.price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    GHS {product.compareAtPrice!.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                    Save GHS {(product.compareAtPrice! - product.price).toFixed(2)}
                  </span>
                </>
              )}
            </div>
            {product.trackStock && (
              <p className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-600"}`}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </p>
            )}
            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
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
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
