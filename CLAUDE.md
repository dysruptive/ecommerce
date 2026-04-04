# CLAUDE.md — Multi-Tenant Ecommerce Platform

## Project Overview

A multi-tenant ecommerce platform where 10 startups in Ghana each get their own online store with admin dashboard, product management, Paystack payments, and delivery zone configuration. All stores share one codebase, one database, and one deployment — isolated by `tenantId`.

Read `SPEC.md` for the full technical specification before writing any code.

## Tech Stack

- **Framework**: Next.js 16 (App Router, server-first)
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL on Neon, via Prisma ORM
- **Styling**: TailwindCSS + shadcn/ui components
- **Auth**: Auth.js with credentials provider
- **Payments**: Paystack (single account, subaccounts per store)
- **Images**: Cloudinary (free tier, URL-based API)
- **Email**: Resend
- **SMS**: Arkesel HTTP API
- **Deployment**: Vercel

## Architecture Principles

### Multi-Tenancy is the Core Constraint

Every database query for store-level data MUST include a `tenantId` filter. Never query products, orders, customers, or any store-scoped table without it. Create a `withTenantId()` helper and use it everywhere.

```typescript
// ALWAYS do this
const products = await prisma.product.findMany({
  where: { tenantId: currentTenantId, ...otherFilters },
});

// NEVER do this
const products = await prisma.product.findMany({
  where: { ...otherFilters },
});
```

### Tenant Resolution

Tenant is resolved in middleware via the request hostname:
- `*.yourdomain.com` → extract subdomain → lookup by `slug`
- Any other hostname → lookup by `customDomain`
- Root domain (`yourdomain.com`) → marketing site
- Unknown host → 404

The resolved `tenantId` is passed via request headers (`x-tenant-id`, `x-tenant-slug`) to server components and API routes.

## Code Standards

### General Rules

- Write modular code. No file should exceed 200 lines. Split into logical units.
- Use TypeScript strict mode. No `any` types unless absolutely unavoidable, and add a comment explaining why.
- Every function that touches the database must accept `tenantId` as a parameter — do not rely on global state.
- Use server actions for mutations (create, update, delete). Use server components for data fetching.
- Use Route Handlers (`app/api/`) only for webhooks (Paystack) and external API integrations (Arkesel, Resend).
- Validate all user input with Zod schemas. Define schemas in a shared `/lib/validations/` directory.
- Handle errors explicitly. No silent catches. Log errors with context (tenantId, action, input).

### File & Folder Structure

```
├── app/
│   ├── (dashboard)/          # Admin dashboard (protected)
│   │   ├── layout.tsx        # Dashboard layout with sidebar
│   │   ├── page.tsx          # Dashboard overview
│   │   ├── products/
│   │   ├── orders/
│   │   ├── customers/
│   │   ├── delivery-zones/
│   │   ├── discounts/
│   │   └── settings/
│   ├── auth/
│   │   ├── login/
│   │   └── register/
│   ├── api/
│   │   ├── webhooks/
│   │   │   └── paystack/
│   │   └── upload/
│   ├── products/             # Storefront product listing + detail pages
│   ├── cart/
│   ├── checkout/
│   └── page.tsx              # Homepage — routes to per-store page component
├── stores/                   # Per-store homepage designs
│   ├── _template/            # Copy-paste starter for new stores
│   │   ├── page.tsx          # Data fetching only; passes props to sections
│   │   └── sections/
│   │       ├── hero.tsx
│   │       ├── category-grid.tsx
│   │       └── product-grid.tsx
│   ├── <store-slug>/         # One folder per store
│   │   ├── page.tsx
│   │   └── sections/
│   │       └── ...           # Presentational only — no DB calls, no async
│   └── ...
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── store/                # Shared storefront components (header, footer, ProductCard, …)
│   ├── dashboard/            # Dashboard components
│   └── shared/               # Shared across store + dashboard
├── lib/
│   ├── db.ts
│   ├── auth.ts
│   ├── tenant.ts
│   ├── paystack.ts
│   ├── cloudinary.ts
│   ├── notifications/
│   │   ├── email.ts
│   │   ├── sms.ts
│   │   └── index.ts
│   └── validations/
├── actions/                  # Server actions
├── hooks/
├── types/
├── middleware.ts
└── prisma/
```

### Per-Store Homepage Pattern

Each store gets a custom homepage under `stores/<slug>/`. The pattern is strict:

- **`stores/<slug>/page.tsx`** — the entry point. Does ALL data fetching (Prisma queries), converts `Decimal` → `number`, then passes plain data as props to sections. No JSX layout here beyond `<StoreLayout>`.
- **`stores/<slug>/sections/*.tsx`** — pure presentational components. No `async`, no DB calls, no `prisma`. Receive typed props, return JSX.
- **`stores/_template/`** — the copy-paste starter. Duplicate this folder when adding a new store.

To add a new store:
1. Copy `stores/_template/` → `stores/<your-slug>/`
2. Build out the store's components: `font-provider.tsx`, `components/header.tsx`, `components/footer.tsx`, `sections/`, `products/listing.tsx`, `products/detail.tsx`, `cart/index.tsx`, `checkout/index.tsx`
3. Add a **single entry** to `STORE_REGISTRY` in `stores/registry.ts`:

```typescript
import { YourStoreHeader } from "@/stores/your-slug/components/header";
// ... other imports

export const STORE_REGISTRY: Record<string, StoreConfig> = {
  // existing stores ...
  "your-slug": {
    Header: YourStoreHeader,
    Footer: YourStoreFooter,
    HomePage: YourStorePage,
    ProductsPage: YourStoreProductsListing,
    DetailPage: YourStoreProductDetail,
    CartPage: YourStoreCartPage,
    CheckoutPage: YourStoreCheckoutPage,
  },
};
```

All routes (`/`, `/products`, `/products/[slug]`, `/cart`, `/checkout`) automatically pick up the new store. Any slug not in `STORE_REGISTRY` falls back to the template automatically.

### Store Landing Page Design

Before writing a single line of code for a new store homepage, use the `frontend-design` skill — invoke it with `/frontend-design`. This skill produces distinctive, production-grade interfaces that avoid generic AI aesthetics.

#### Step 1 — Brand Discovery (ask these questions first)

Do not start designing until you have answers to these. Ask the store owner (or whoever is briefing you):

**Identity**
- What is the store name and tagline (if any)?
- What does it sell, and who is the primary customer? (age, gender, income bracket, Ghanaian city or nationwide?)
- What 3 adjectives should the brand feel like? (e.g., "fresh, local, trustworthy" or "premium, minimal, modern")
- Are there any existing brand assets — logo, brand colours, fonts, photography?

**Tone & References**
- Share 1–3 websites or stores you admire aesthetically (can be international). What specifically do you like about them?
- What should this store NOT feel like? (e.g., "not loud and busy", "not corporate")
- Is the vibe more warm/human or cool/sleek?

**Content**
- What are the 2–3 hero categories or flagship products to feature on the homepage?
- Is there a key promotional angle — price, quality, speed, locality, exclusivity?
- Do you have real photography, or will we use placeholder/Unsplash images for now?

**Practical**
- What's the primary call to action on the homepage? (Shop now / Browse categories / Get a quote)
- Any seasonal context? (launch campaign, holiday, etc.)

Only proceed to design once you have at least: adjectives, a reference site, and the hero content. If you're missing these, ask — don't guess.

#### Step 2 — Design Principles

**Minimalism over decoration**
- One dominant typographic weight per section. Don't mix 4 font sizes in a hero.
- Generous whitespace is a feature, not wasted space. Sections need room to breathe.
- Max 2 typefaces per store: one display/heading font, one body font. Both must be loaded via `next/font`.
- Max 3 brand colours + neutrals. Define them as Tailwind config extensions, not inline hex values.

**Avoid the "AI-generated" look**
These patterns immediately signal generic AI output — avoid all of them:
- Purple-to-blue gradients as hero backgrounds
- Cards with `rounded-2xl shadow-xl` applied to everything
- "Shop Now →" as the only CTA copy — write something specific to the brand
- Generic hero text like "Discover Our Amazing Collection" — use the actual brand voice
- Symmetrical 3-column "feature icon + heading + paragraph" sections
- Testimonials with 5 gold stars and first-name-only attribution
- Floating blurred blob shapes as decorative background elements
- The color palette: `indigo-600`, `purple-500`, `pink-400` — unless the brand explicitly calls for it

**What makes it feel real instead**
- Use the brand's actual words and voice — interview the brief, don't fill in blanks with filler copy
- Odd-grid layouts: 2-col asymmetric, full-bleed image with overlapping text card, horizontal scroll product strip
- Intentional constraint: one section does ONE thing — hero sells the brand, category grid orients the shopper, product strip creates urgency
- Use `font-feature-settings` for number formatting in prices — tabular figures look professional
- Micro-details: hover states that reveal price, image zoom on hover, smooth skeleton loaders
- Actual Ghanaian context where relevant — currency (₵), city names in delivery copy, local imagery

**Never fabricate store content**
These are real stores with real customers. Do not invent anything that hasn't been explicitly confirmed:
- No made-up collection names (e.g. "The Clarity Collection", "The Signature Edit")
- No invented labels like "Seasonal Icons" or "New Season Premiere"
- No unconfirmed promises — do not write "Free Delivery", "30-Day Returns", or any policy copy unless the store owner has confirmed it
- No location-specific claims (e.g. "crafted for Accra") unless explicitly briefed
- No placeholder image blocks — if there's no real image, design around the absence rather than leaving empty coloured boxes
- If you don't have the real copy, ask. Do not fill the gap with something plausible-sounding.

**Typography rules**
- Pick the heading font based on the brand adjectives: geometric sans (modern/minimal), humanist sans (friendly/local), serif (premium/editorial)
- Body text: minimum `text-base` (16px), `leading-relaxed`, never pure black — use `zinc-800` or `neutral-700`
- Hero headline: large but not maxed out — `text-5xl lg:text-7xl` with tight tracking (`tracking-tight`) reads better than `text-9xl`

**Layout rules**
- Homepage sections: Hero → Categories or Trust signal → Featured products → Brand story or USP strip → Footer
- Hero must be viewport-height on desktop (`min-h-screen`) or at least 80vh — no half-height heroes
- Product grid: 2-col on mobile, 3-col on tablet, 4-col on desktop. Use `grid` not `flex flex-wrap`.
- Never centre-align body text in paragraphs longer than ~50 characters — left-aligned reads better

#### Step 3 — Implementation Checklist

Before calling the code done:

- [ ] Real copy — no Lorem Ipsum, no "Amazing Product Name", no "Category 1"
- [ ] Mobile-first — check layout at 375px before 1440px
- [ ] All images have `alt` text that describes the image for the brand
- [ ] Color contrast passes WCAG AA for all text on background combinations
- [ ] Loading state: product grid shows skeleton while data loads (use `animate-pulse`)
- [ ] CTA button has a hover state that's visually distinct (not just opacity change)
- [ ] Navigation header is sticky and readable over the hero background
- [ ] Footer includes store name, social links placeholder, and delivery zone mention

### Naming Conventions

- Files: `kebab-case.ts` (e.g., `delivery-zones.ts`)
- Components: `PascalCase.tsx` (e.g., `ProductCard.tsx`)
- Server actions: named exports, verb-first (e.g., `createProduct`, `updateOrderStatus`)
- Database models: `PascalCase` singular (e.g., `Product`, `DeliveryZone`)
- API routes: `route.ts` inside descriptive folders (e.g., `api/webhooks/paystack/route.ts`)

### Component Patterns

- Keep server components as the default. Only add `"use client"` when you need interactivity (forms, modals, cart).
- Client components should be leaf nodes — push them as deep into the tree as possible.
- Extract reusable UI patterns into `/components/shared/`.
- Dashboard pages follow a consistent layout: page header with title + action button, then content area.

```typescript
// Dashboard page pattern
export default async function ProductsPage() {
  const tenant = await getCurrentTenant();
  const products = await getProducts(tenant.id);

  return (
    <PageHeader
      title="Products"
      action={<CreateProductButton />}
    />
    <ProductsTable products={products} />
  );
}
```

### Cart Implementation

- Cart lives in localStorage (guest checkout only).
- Use a `useCart()` hook that provides: `items`, `addItem`, `removeItem`, `updateQuantity`, `clearCart`, `total`.
- Cart items store: `productId`, `name`, `price`, `quantity`, `imageUrl`, `variantId` (if applicable).
- Validate cart against current prices/stock server-side before creating the order at checkout.

## Integration Guidelines

### Paystack

- ONE Paystack account (platform owner). Each store gets a Paystack subaccount linked to their bank details.
- Store the `subaccountCode` on the Tenant model.
- When initializing a transaction, pass `subaccount: tenant.subaccountCode` and optionally `transaction_charge` for your platform fee.
- Verify payments via webhook (`charge.success` event), not client-side callbacks.
- Webhook endpoint: `POST /api/webhooks/paystack` — verify signature using your Paystack secret key.
- On successful payment: update order status to `PAID`, send email + SMS notifications.

### Cloudinary

- Use URL-based transformations — no server-side SDK needed.
- Upload flow: client uploads to Cloudinary directly (unsigned upload preset), receives URL, saves URL to database.
- Organize images by tenant: use folder structure `stores/{tenantSlug}/products/`.
- For display, use Next.js `<Image>` component with Cloudinary URLs and appropriate width/height.
- Generate responsive variants via URL params (e.g., `w_400,c_fill,q_auto,f_auto`).

### Notifications (Resend + Arkesel)

- Build a unified notification service in `/lib/notifications/index.ts`.
- Each notification type (order confirmation, new order alert to owner) has a function that dispatches to both email and SMS based on tenant settings.
- Email: use Resend SDK, React Email for templates.
- SMS: Arkesel is a simple HTTP POST — no SDK needed. Send to the Arkesel REST API endpoint with your API key.
- Store notification preferences and API keys in tenant settings. Store owners configure their own Arkesel API key if they want SMS.
- Never block the checkout flow on notification delivery. Fire and forget, log failures.

```typescript
// Notification dispatch pattern
export async function notifyOrderConfirmed(order: Order, tenant: Tenant) {
  const tasks = [];

  if (tenant.settings.emailEnabled) {
    tasks.push(sendOrderConfirmationEmail(order, tenant));
  }

  if (tenant.settings.smsEnabled && tenant.settings.arkeselApiKey) {
    tasks.push(sendOrderConfirmationSMS(order, tenant));
  }

  await Promise.allSettled(tasks); // Don't throw on individual failures
}
```

### Auth

- Auth.js credentials provider only. No OAuth for now.
- Store owner creates account during onboarding (done manually by platform admin for these 10 stores).
- Session must include `tenantId` and `role`.
- Dashboard routes are protected via middleware — redirect to `/auth/login` if no session.
- Storefront routes are public (guest checkout).

## Database Rules

- Every store-level table has a `tenantId` column with an index.
- Use `@relation` in Prisma for foreign keys. Enforce referential integrity.
- Use enums for status fields (`OrderStatus`, `PaymentStatus`, `DomainStatus`).
- Soft delete where appropriate (products — use `isArchived` flag instead of deleting, so existing order references remain valid).
- Timestamps on everything: `createdAt`, `updatedAt`.
- Write a seed script that creates 2-3 demo tenants with sample products, categories, and delivery zones.

## Performance & Security

- Use Prisma's `select` to fetch only needed fields — avoid `select *` patterns.
- Add database indexes on: `tenantId` (all store tables), `slug` (Tenant), `customDomain` (Tenant), `email` (User), `status` (Order).
- Rate limit the Paystack webhook endpoint.
- Sanitize all user-provided HTML content.
- Never expose Paystack secret keys or Arkesel API keys to the client.
- Store all secrets in environment variables, never in code.
- Validate the Paystack webhook signature on every request before processing.

## Testing Approach

- Seed script should be runnable via `npx prisma db seed`.
- Each major feature should be testable independently.
- Test tenant isolation: verify that Store A cannot see Store B's data.

## Environment Variables

```env
# Database
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Paystack
PAYSTACK_SECRET_KEY=
PAYSTACK_PUBLIC_KEY=

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

# Resend
RESEND_API_KEY=

# Arkesel (platform default — stores can override with their own)
ARKESEL_API_KEY=

# App
NEXT_PUBLIC_ROOT_DOMAIN=
```

## Build Phases

Follow the phases defined in SPEC.md in order. Complete each phase before moving to the next. Each phase should result in working, testable functionality.

### End-to-End Testing After Each Phase

**Every phase MUST be tested against the running dev server before being marked complete.** Type-checking and builds passing is not sufficient — they miss runtime bugs like Edge runtime incompatibilities, missing tenant context, broken redirects, and incorrect data flow.

After completing a phase:

1. Start the dev server (`npm run dev`)
2. Test every user-facing flow introduced in the phase using `curl` or the browser
3. Test both happy paths AND failure cases (wrong input, missing auth, missing tenant context)
4. Verify the response contains the expected content — not just a 200 status
5. Fix all bugs found before moving to the next phase

Example tests to always include:
- **Auth flows**: Login with valid/invalid credentials, protected route access with/without session
- **Tenant isolation**: Verify tenant A's dashboard doesn't leak tenant B's data
- **Middleware**: Test root domain, subdomain, and custom domain resolution
- **Server actions**: Test form submissions with valid and invalid data
- **Edge runtime**: Any code imported by middleware must be Edge-compatible (no Prisma, no Node.js APIs)
