import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { StoreLayout } from "@/components/store/store-layout";
import { ImageGallery } from "./image-gallery";
import { AddToCartForm } from "./add-to-cart-form";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tenant = await getCurrentTenant();
  const product = await prisma.product.findFirst({
    where: { tenantId: tenant.id, slug, isPublished: true, isArchived: false },
    select: { name: true, description: true, images: { take: 1 } },
  });
  if (!product) return { title: "Product Not Found" };
  return {
    title: `${product.name} | ${tenant.name}`,
    description: product.description ?? `${product.name} from ${tenant.name}`,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.images[0]?.url ? [product.images[0].url] : undefined,
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const tenant = await getCurrentTenant();

  const product = await prisma.product.findFirst({
    where: {
      tenantId: tenant.id,
      slug,
      isPublished: true,
      isArchived: false,
    },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { name: "asc" } },
      category: { select: { name: true } },
    },
  });

  if (!product) notFound();

  const price = product.price.toNumber();
  const compareAtPrice = product.compareAtPrice?.toNumber();
  const hasDiscount = compareAtPrice && compareAtPrice > price;

  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Image gallery */}
          <ImageGallery
            images={product.images.map((img) => ({
              id: img.id,
              url: img.url,
              altText: img.altText,
            }))}
            productName={product.name}
          />

          {/* Info */}
          <div className="space-y-4">
            {product.category && (
              <p className="text-sm text-muted-foreground">
                {product.category.name}
              </p>
            )}

            <h1 className="text-2xl font-bold sm:text-3xl">{product.name}</h1>

            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--store-primary)" }}
              >
                GHS {price.toFixed(2)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-muted-foreground line-through">
                    GHS {compareAtPrice.toFixed(2)}
                  </span>
                  <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                    Save GHS {(compareAtPrice - price).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock status */}
            {product.trackStock && (
              <p
                className={`text-sm font-medium ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0
                  ? `${product.stock} in stock`
                  : "Out of stock"}
              </p>
            )}

            {product.description && (
              <p className="text-muted-foreground">{product.description}</p>
            )}

            <AddToCartForm
              product={{
                id: product.id,
                name: product.name,
                price,
                imageUrl: product.images[0]?.url,
                stock: product.stock,
                trackStock: product.trackStock,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  name: v.name,
                  price: v.price.toNumber(),
                  stock: v.stock,
                })),
              }}
            />
          </div>
        </div>
      </div>
    </StoreLayout>
  );
}
