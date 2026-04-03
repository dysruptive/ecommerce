import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCurrentTenant } from "@/lib/tenant";
import { prisma } from "@/lib/db";
import { STORE_REGISTRY } from "@/stores/registry";
import type { ProductDetail } from "@/stores/registry";
import { TemplateProductDetail } from "@/stores/_template/products/detail";

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
    where: { tenantId: tenant.id, slug, isPublished: true, isArchived: false },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { name: "asc" } },
      category: { select: { name: true } },
    },
  });

  if (!product) notFound();

  const productData: ProductDetail = {
    id: product.id,
    slug: product.slug,
    name: product.name,
    description: product.description,
    price: product.price.toNumber(),
    compareAtPrice: product.compareAtPrice?.toNumber(),
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      altText: img.altText,
    })),
    variants: product.variants.map((v) => ({
      id: v.id,
      name: v.name,
      price: v.price.toNumber(),
      stock: v.stock,
    })),
    category: product.category,
    stock: product.stock,
    trackStock: product.trackStock,
  };

  const Page =
    STORE_REGISTRY[tenant.slug]?.DetailPage ?? TemplateProductDetail;

  return <Page tenant={tenant} product={productData} />;
}
