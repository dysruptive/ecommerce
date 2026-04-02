import Image from "next/image";
import { Package } from "lucide-react";

interface ProductImageProps {
  url?: string | null;
  alt: string;
  /** Applied to the outer wrapper div (controls size, aspect ratio, overflow). */
  className?: string;
  /** Applied to the inner next/image element (e.g. hover transitions). */
  imageClassName?: string;
  sizes?: string;
}

export function ProductImage({
  url,
  alt,
  className,
  imageClassName,
  sizes = "(max-width: 768px) 100vw, 50vw",
}: ProductImageProps) {
  if (!url) {
    return (
      <div
        className={`flex items-center justify-center bg-muted ${className ?? ""}`}
      >
        <Package className="h-10 w-10 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <Image
        src={url}
        alt={alt}
        fill
        className={`object-cover ${imageClassName ?? ""}`}
        sizes={sizes}
      />
    </div>
  );
}
