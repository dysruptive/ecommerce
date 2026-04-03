import type { Tenant } from "@/types";
import { StoreLayout } from "@/components/store/store-layout";
import { ProductFilters } from "@/components/store/product-filters";
import { ProductCard } from "@/components/store/product-card";

interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

interface Props {
  tenant: Tenant;
  products: ProductItem[];
  categories: { slug: string; name: string }[];
  filters: { category?: string; q?: string; sort?: string };
}

// Copy to stores/<slug>/products/listing.tsx and customise for the brand.
export function TemplateProductsListing({ tenant, products, categories, filters }: Props) {
  return (
    <StoreLayout tenant={tenant}>
      <div className="mx-auto max-w-6xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Products</h1>
        <ProductFilters
          categories={categories}
          currentCategory={filters.category}
          currentSort={filters.sort}
          currentQuery={filters.q}
        />
        {products.length === 0 ? (
          <p className="mt-8 text-center text-muted-foreground">No products found.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                slug={p.slug}
                name={p.name}
                price={p.price}
                compareAtPrice={p.compareAtPrice}
                imageUrl={p.imageUrl}
              />
            ))}
          </div>
        )}
      </div>
    </StoreLayout>
  );
}
