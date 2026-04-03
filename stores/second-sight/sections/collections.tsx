import Link from "next/link";

interface Category {
  id: string;
  slug: string;
  name: string;
  imageUrl?: string | null;
}

interface CollectionsProps {
  categories: Category[];
}

const COLLECTION_META = [
  { label: "Clarity, redefined", bgClass: "bg-stone-800" },
  { label: "Style for every sun", bgClass: "bg-zinc-900" },
];

const FALLBACK_COLLECTIONS = [
  { id: "prescription-frames", slug: "prescription-frames", name: "Prescription Frames", imageUrl: null },
  { id: "sunglasses", slug: "sunglasses", name: "Sunglasses", imageUrl: null },
];

export function Collections({ categories }: CollectionsProps) {
  const items = categories.length > 0 ? categories.slice(0, 2) : FALLBACK_COLLECTIONS;

  return (
    <section className="bg-stone-50 py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900">
            Our Collections
          </h2>
          <p className="mt-2 text-stone-500">
            Two distinct lines. One commitment to quality.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {items.map((item, index) => {
            const meta = COLLECTION_META[index] ?? COLLECTION_META[0];
            return (
              <Link
                key={item.id}
                href={`/products?category=${item.slug}`}
                className="group relative aspect-[4/3] overflow-hidden"
              >
                {/* Background */}
                <div
                  className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${meta.bgClass}`}
                />

                {/* Glasses watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-10">
                  <svg viewBox="0 0 240 96" className="w-64" fill="none" aria-hidden="true">
                    <rect x="3" y="3" width="96" height="64" rx="24" stroke="white" strokeWidth="4" />
                    <rect x="141" y="3" width="96" height="64" rx="24" stroke="white" strokeWidth="4" />
                    <path d="M99 35 L141 35" stroke="white" strokeWidth="4" />
                  </svg>
                </div>

                {/* Top amber slide-in line */}
                <div className="absolute left-0 top-0 h-1 w-0 bg-amber-500 transition-all duration-300 group-hover:w-full" />

                {/* Text content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <p className="text-xs font-semibold uppercase tracking-[0.15em] text-amber-400">
                    {meta.label}
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-white">{item.name}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-stone-300 transition-colors group-hover:text-white">
                    Browse Collection
                    <svg
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
