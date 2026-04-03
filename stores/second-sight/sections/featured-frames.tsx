import Link from "next/link";
import { ProductImage } from "@/components/store/product-image";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface SignatureEditProps {
  products: ProductItem[];
}

export function SignatureEdit({ products }: SignatureEditProps) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[#f4f4f2] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1440px]">
        {/* Header */}
        <div className="mb-14 flex items-end justify-between">
          <div>
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-[#5f5e5e]">
              Seasonal Icons
            </span>
            <h2
              className="mt-3 text-4xl font-bold text-[#1a1c1b] md:text-5xl"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              The Signature Edit
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden text-xs font-semibold uppercase tracking-[0.15em] text-[#6c5e06] underline-offset-4 hover:underline sm:block"
          >
            View All →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => {
            const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
            return (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[#ffffff]">
                  <ProductImage
                    url={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Quick-add button on hover */}
                  <div className="absolute bottom-4 right-4 translate-y-2 opacity-0 transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-md backdrop-blur-sm">
                      <svg viewBox="0 0 16 16" className="h-4 w-4 text-[#1a1c1b]" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M8 2v12M2 8h12" strokeLinecap="round" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <h4
                      className="text-base font-bold text-[#1a1c1b]"
                      style={{ fontFamily: "var(--font-noto-serif)" }}
                    >
                      {p.name}
                    </h4>
                    {hasDiscount && (
                      <p className="mt-0.5 text-xs uppercase tracking-widest text-[#5f5e5e]">On Sale</p>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-[#6c5e06]">₵{p.price.toLocaleString()}</span>
                    {hasDiscount && (
                      <p className="text-xs text-[#5f5e5e] line-through">₵{p.compareAtPrice!.toLocaleString()}</p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 sm:hidden">
          <Link href="/products" className="block text-center text-xs font-semibold uppercase tracking-[0.15em] text-[#6c5e06] underline-offset-4 hover:underline">
            View All →
          </Link>
        </div>
      </div>
    </section>
  );
}
