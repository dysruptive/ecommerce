import Link from "next/link";
import { ProductImage } from "@/components/store/product-image";

interface ProductCardProps {
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  imageUrl?: string | null;
}

export function ProductCard({
  slug,
  name,
  price,
  compareAtPrice,
  imageUrl,
}: ProductCardProps) {
  return (
    <Link
      href={`/products/${slug}`}
      className="group block overflow-hidden rounded-lg border transition-shadow hover:shadow-md"
    >
      <ProductImage
        url={imageUrl}
        alt={name}
        className="aspect-square w-full"
        imageClassName="transition-transform group-hover:scale-105"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
      />
      <div className="p-3">
        <h3 className="text-sm font-medium leading-tight line-clamp-2">
          {name}
        </h3>
        <div className="mt-1.5 flex items-center gap-2">
          <span
            className="font-semibold"
            style={{ color: "var(--store-primary)" }}
          >
            GHS {price.toFixed(2)}
          </span>
          {compareAtPrice && compareAtPrice > price && (
            <span className="text-sm text-muted-foreground line-through">
              GHS {compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
