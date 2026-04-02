"use client";

import { useState } from "react";
import { ProductImage } from "@/components/store/product-image";

interface GalleryImage {
  id: string;
  url: string;
  altText: string | null;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (images.length === 0) {
    return (
      <ProductImage
        url={null}
        alt={productName}
        className="aspect-square w-full rounded-lg"
      />
    );
  }

  const selected = images[selectedIndex];

  return (
    <div>
      <ProductImage
        url={selected.url}
        alt={selected.altText ?? productName}
        className="aspect-square w-full rounded-lg"
        sizes="(max-width: 768px) 100vw, 50vw"
      />
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button
              key={img.id}
              type="button"
              onClick={() => setSelectedIndex(i)}
              className={`overflow-hidden rounded-md border-2 transition-colors ${
                i === selectedIndex
                  ? "border-[var(--store-primary)]"
                  : "border-transparent hover:border-muted-foreground/30"
              }`}
            >
              <ProductImage
                url={img.url}
                alt={img.altText ?? productName}
                className="aspect-square w-full"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
