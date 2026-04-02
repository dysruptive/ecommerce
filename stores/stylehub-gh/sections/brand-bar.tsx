import Link from "next/link";

export function BrandBar() {
  return (
    <section className="border-t border-b py-12 text-center">
      <p className="mx-auto max-w-xl text-sm text-muted-foreground">
        StyleHub GH is your destination for contemporary African fashion. We curate pieces
        that blend local craftsmanship with modern style — made for everyday life in Ghana.
      </p>
      <Link
        href="/products"
        className="mt-6 inline-block text-sm font-bold uppercase tracking-widest hover:underline"
        style={{ color: "var(--store-primary)" }}
      >
        Discover the Collection →
      </Link>
    </section>
  );
}
