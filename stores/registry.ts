/**
 * Central store registry.
 *
 * To add a new store:
 *   1. Copy stores/_template/ → stores/<slug>/
 *   2. Build out the store's components (header, footer, pages)
 *   3. Import them below and add a single entry to STORE_REGISTRY
 *
 * That's it. All routes automatically pick up the new store.
 */

import type { Tenant } from "@/types";

// ── Shared prop types ─────────────────────────────────────────────────────────

export interface ProductItem {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number;
  imageUrl?: string;
}

export interface ProductDetail {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  price: number;
  compareAtPrice?: number;
  images: { id: string; url: string; altText: string | null }[];
  variants: { id: string; name: string; price: number; stock: number }[];
  category?: { name: string } | null;
  stock: number;
  trackStock: boolean;
}

export interface ListingFilters {
  category?: string;
  q?: string;
  sort?: string;
}

export interface DeliveryZoneData {
  id: string;
  name: string;
  type: string;
  regions: string | null;
  fee: string | number;
}

// ── Component types ───────────────────────────────────────────────────────────

export type HeaderComponent = (props: {
  storeName: string;
  logoUrl?: string | null;
}) => React.ReactNode;

export type FooterComponent = (props: {
  storeName: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
}) => React.ReactNode;

export type HomepageComponent = (props: {
  tenant: Tenant;
}) => Promise<React.ReactNode> | React.ReactNode;

export type ListingComponent = (props: {
  tenant: Tenant;
  products: ProductItem[];
  categories: { slug: string; name: string }[];
  filters: ListingFilters;
}) => React.ReactNode;

export type DetailComponent = (props: {
  tenant: Tenant;
  product: ProductDetail;
}) => React.ReactNode;

export type CartPageComponent = (props: {
  tenant: Tenant;
}) => React.ReactNode;

export type CheckoutPageComponent = (props: {
  tenant: Tenant;
  deliveryZones: DeliveryZoneData[];
}) => React.ReactNode;

// ── Store config ──────────────────────────────────────────────────────────────

export interface StoreConfig {
  Header?: HeaderComponent;
  Footer?: FooterComponent;
  HomePage?: HomepageComponent;
  ProductsPage?: ListingComponent;
  DetailPage?: DetailComponent;
  CartPage?: CartPageComponent;
  CheckoutPage?: CheckoutPageComponent;
}

// ── Store imports ─────────────────────────────────────────────────────────────

// Fresh Mart
import { FreshMartHeader } from "@/stores/fresh-mart/components/header";
import { FreshMartFooter } from "@/stores/fresh-mart/components/footer";
import { FreshMartPage } from "@/stores/fresh-mart/page";
import { FreshMartProductsListing } from "@/stores/fresh-mart/products/listing";
import { FreshMartProductDetail } from "@/stores/fresh-mart/products/detail";

// StyleHub GH
import { StyleHubHeader } from "@/stores/stylehub-gh/components/header";
import { StyleHubFooter } from "@/stores/stylehub-gh/components/footer";
import { StyleHubGhPage } from "@/stores/stylehub-gh/page";
import { StyleHubProductsListing } from "@/stores/stylehub-gh/products/listing";
import { StyleHubProductDetail } from "@/stores/stylehub-gh/products/detail";

// Second Sight
import { SecondSightHeader } from "@/stores/second-sight/components/header";
import { SecondSightFooter } from "@/stores/second-sight/components/footer";
import { SecondSightPage } from "@/stores/second-sight/page";
import { SecondSightProductsListing } from "@/stores/second-sight/products/listing";
import { SecondSightProductDetail } from "@/stores/second-sight/products/detail";
import { SecondSightCartPage } from "@/stores/second-sight/cart/index";

// ── Registry ──────────────────────────────────────────────────────────────────

export const STORE_REGISTRY: Record<string, StoreConfig> = {
  "fresh-mart": {
    Header: FreshMartHeader,
    Footer: FreshMartFooter,
    HomePage: FreshMartPage,
    ProductsPage: FreshMartProductsListing,
    DetailPage: FreshMartProductDetail,
  },
  "stylehub-gh": {
    Header: StyleHubHeader,
    Footer: StyleHubFooter,
    HomePage: StyleHubGhPage,
    ProductsPage: StyleHubProductsListing,
    DetailPage: StyleHubProductDetail,
  },
  "second-sight": {
    Header: SecondSightHeader,
    Footer: SecondSightFooter,
    HomePage: SecondSightPage,
    ProductsPage: SecondSightProductsListing,
    DetailPage: SecondSightProductDetail,
    CartPage: SecondSightCartPage,
  },
};
