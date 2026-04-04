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

export function SignatureEdit({ products }: { products: ProductItem[] }) {
  if (products.length === 0) return null;

  return (
    <section className="bg-[#f4f4f2] px-6 py-20 lg:px-8">
      <div className="mx-auto max-w-[1440px]">

        {/* Header */}
        <div className="mb-12 flex items-end justify-between border-b border-[#cdc6b3]/60 pb-7">
          <div>
            <div className="mb-4 flex items-center gap-4">
              <div className="h-px w-8 bg-[#6c5e06]" />
              <span
                className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#6c5e06]"
                style={{ fontFamily: "var(--font-manrope)" }}
              >
                Eyewear
              </span>
            </div>
            <h2
              className="text-4xl font-bold text-[#1a1c1b] md:text-5xl"
              style={{ fontFamily: "var(--font-noto-serif)" }}
            >
              Featured Frames
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1c1b] underline-offset-4 hover:underline sm:block"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            View All →
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 lg:grid-cols-4">
          {products.slice(0, 4).map((p) => {
            const hasDiscount = p.compareAtPrice && p.compareAtPrice > p.price;
            return (
              <Link key={p.id} href={`/products/${p.slug}`} className="group">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-white">
                  <ProductImage
                    url={p.imageUrl}
                    alt={p.name}
                    className="h-full w-full"
                    imageClassName="transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {hasDiscount && (
                    <span className="absolute left-3 top-3 bg-[#6c5e06] px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white">
                      Sale
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="mt-4 flex items-start justify-between gap-3">
                  <h4
                    className="text-sm font-bold leading-snug text-[#1a1c1b] transition-colors group-hover:text-[#6c5e06]"
                    style={{ fontFamily: "var(--font-noto-serif)" }}
                  >
                    {p.name}
                  </h4>
                  <div className="shrink-0 text-right">
                    <span
                      className="text-sm font-bold tabular-nums text-[#1a1c1b]"
                      style={{ fontFamily: "var(--font-manrope)" }}
                    >
                      ₵{p.price.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <p
                        className="text-xs tabular-nums text-[#5f5e5e] line-through"
                        style={{ fontFamily: "var(--font-manrope)" }}
                      >
                        ₵{p.compareAtPrice!.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-10 sm:hidden">
          <Link
            href="/products"
            className="block text-center text-[11px] font-bold uppercase tracking-[0.2em] text-[#1a1c1b] underline-offset-4 hover:underline"
            style={{ fontFamily: "var(--font-manrope)" }}
          >
            View All →
          </Link>
        </div>

      </div>
    </section>
  );
}
