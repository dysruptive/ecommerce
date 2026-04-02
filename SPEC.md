# SPEC.md — Multi-Tenant Ecommerce Platform Specification

## 1. Product Summary

A multi-tenant ecommerce platform serving 10 Ghana-based startups. Each startup gets a fully functional online store with product management, Paystack payments (via subaccounts), configurable delivery zones, and customer notifications — all running on one codebase, one database, one deployment.

**Key constraint**: This is a promo for 10 stores, not a self-service SaaS. Stores are onboarded manually. There is no public signup flow for new stores.

---

## 2. Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript (strict) |
| Database | PostgreSQL (Neon) |
| ORM | Prisma |
| Styling | TailwindCSS + shadcn/ui |
| Auth | Auth.js (credentials provider) |
| Payments | Paystack (subaccounts) |
| Images | Cloudinary (free tier) |
| Email | Resend |
| SMS | Arkesel |
| Deployment | Vercel |

---

## 3. Multi-Tenancy

### 3.1 Tenant Resolution

Resolved in `middleware.ts` on every request:

```
Request arrives → read Host header
  ├── Host matches ROOT_DOMAIN (e.g., yourdomain.com)
  │   → Marketing site (no tenant context)
  ├── Host is subdomain of ROOT_DOMAIN (e.g., store1.yourdomain.com)
  │   → Extract "store1" → lookup Tenant by slug
  ├── Host is any other domain (e.g., mystore.com)
  │   → Lookup Tenant by customDomain
  └── No tenant found → 404 page
```

### 3.2 Tenant Context Propagation

Middleware sets request headers:
- `x-tenant-id`: The tenant's database ID
- `x-tenant-slug`: The tenant's slug

Server components and API routes read these headers to scope all queries.

Create a helper:

```typescript
// lib/tenant.ts
export async function getCurrentTenant(): Promise<Tenant> {
  // Reads x-tenant-id from headers
  // Fetches full tenant record from DB
  // Throws if not found
}
```

### 3.3 Routing Structure

```
yourdomain.com/               → Marketing landing page
yourdomain.com/auth/login      → Platform-level auth

store1.yourdomain.com/         → Store 1 storefront homepage
store1.yourdomain.com/products → Store 1 product listing
store1.yourdomain.com/cart     → Store 1 cart
store1.yourdomain.com/checkout → Store 1 checkout
store1.yourdomain.com/admin    → Store 1 dashboard (protected)

mystore.com/                   → Custom domain → same as subdomain routing
mystore.com/admin              → Custom domain dashboard (protected)
```

### 3.4 Data Isolation

Every store-scoped database table includes a `tenantId` column. Every query on these tables MUST filter by `tenantId`. There are no exceptions.

---

## 4. Database Schema

### 4.1 Global Tables (no tenantId)

#### User
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  passwordHash  String
  tenantId      String
  tenant        Tenant    @relation(fields: [tenantId], references: [id])
  role          Role      @default(OWNER)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

enum Role {
  OWNER
  STAFF
}
```

#### Tenant
```prisma
model Tenant {
  id                    String    @id @default(cuid())
  name                  String
  slug                  String    @unique
  customDomain          String?   @unique
  domainStatus          DomainStatus @default(UNVERIFIED)
  logoUrl               String?
  description           String?
  currency              String    @default("GHS")
  contactEmail          String?
  contactPhone          String?
  address               String?

  // Paystack
  paystackSubaccountCode String?

  // Notification settings
  emailEnabled          Boolean   @default(true)
  smsEnabled            Boolean   @default(false)
  arkeselApiKey         String?

  // Theme
  primaryColor          String    @default("#000000")
  accentColor           String    @default("#3B82F6")

  users                 User[]
  products              Product[]
  categories            Category[]
  orders                Order[]
  customers             Customer[]
  deliveryZones         DeliveryZone[]
  discounts             Discount[]

  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
}

enum DomainStatus {
  UNVERIFIED
  VERIFIED
}
```

### 4.2 Store-Scoped Tables (all have tenantId)

#### Category
```prisma
model Category {
  id          String    @id @default(cuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  name        String
  slug        String
  description String?
  imageUrl    String?
  products    Product[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([tenantId, slug])
  @@index([tenantId])
}
```

#### Product
```prisma
model Product {
  id          String    @id @default(cuid())
  tenantId    String
  tenant      Tenant    @relation(fields: [tenantId], references: [id])
  name        String
  slug        String
  description String?
  price       Decimal   @db.Decimal(10, 2)
  compareAtPrice Decimal? @db.Decimal(10, 2)
  sku         String?
  stock       Int       @default(0)
  trackStock  Boolean   @default(true)
  isPublished Boolean   @default(false)
  isArchived  Boolean   @default(false)
  categoryId  String?
  category    Category? @relation(fields: [categoryId], references: [id])
  images      ProductImage[]
  variants    ProductVariant[]
  orderItems  OrderItem[]
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  @@unique([tenantId, slug])
  @@index([tenantId])
  @@index([tenantId, isPublished])
}
```

#### ProductImage
```prisma
model ProductImage {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  url        String
  altText    String?
  position   Int      @default(0)
  createdAt  DateTime @default(now())
}
```

#### ProductVariant
```prisma
model ProductVariant {
  id         String   @id @default(cuid())
  productId  String
  product    Product  @relation(fields: [productId], references: [id], onDelete: Cascade)
  name       String          // e.g., "Large / Red"
  sku        String?
  price      Decimal  @db.Decimal(10, 2)
  stock      Int      @default(0)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
```

#### Customer
```prisma
model Customer {
  id         String   @id @default(cuid())
  tenantId   String
  tenant     Tenant   @relation(fields: [tenantId], references: [id])
  email      String
  name       String
  phone      String?
  orders     Order[]
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@unique([tenantId, email])
  @@index([tenantId])
}
```

#### Order
```prisma
model Order {
  id              String        @id @default(cuid())
  tenantId        String
  tenant          Tenant        @relation(fields: [tenantId], references: [id])
  orderNumber     String
  customerId      String
  customer        Customer      @relation(fields: [customerId], references: [id])
  items           OrderItem[]
  subtotal        Decimal       @db.Decimal(10, 2)
  deliveryFee     Decimal       @db.Decimal(10, 2) @default(0)
  discountAmount  Decimal       @db.Decimal(10, 2) @default(0)
  total           Decimal       @db.Decimal(10, 2)
  status          OrderStatus   @default(PENDING)
  paymentStatus   PaymentStatus @default(UNPAID)
  paymentRef      String?
  deliveryZoneId  String?
  deliveryZone    DeliveryZone? @relation(fields: [deliveryZoneId], references: [id])
  deliveryAddress String?
  customerNote    String?
  createdAt       DateTime      @default(now())
  updatedAt       DateTime      @updatedAt

  @@unique([tenantId, orderNumber])
  @@index([tenantId])
  @@index([tenantId, status])
}

enum OrderStatus {
  PENDING
  CONFIRMED
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
  FAILED
}
```

#### OrderItem
```prisma
model OrderItem {
  id          String   @id @default(cuid())
  orderId     String
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  productId   String
  product     Product  @relation(fields: [productId], references: [id])
  variantId   String?
  name        String          // Snapshot of product name at time of order
  price       Decimal  @db.Decimal(10, 2) // Snapshot of price at time of order
  quantity    Int
  createdAt   DateTime @default(now())
}
```

#### DeliveryZone
```prisma
model DeliveryZone {
  id          String   @id @default(cuid())
  tenantId    String
  tenant      Tenant   @relation(fields: [tenantId], references: [id])
  name        String
  regions     String          // Comma-separated region names
  fee         Decimal  @db.Decimal(10, 2)
  isActive    Boolean  @default(true)
  position    Int      @default(0)
  orders      Order[]
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([tenantId])
}
```

#### Discount
```prisma
model Discount {
  id              String       @id @default(cuid())
  tenantId        String
  tenant          Tenant       @relation(fields: [tenantId], references: [id])
  code            String
  type            DiscountType
  value           Decimal      @db.Decimal(10, 2)  // percentage or fixed amount
  minPurchase     Decimal?     @db.Decimal(10, 2)
  maxUses         Int?
  usedCount       Int          @default(0)
  isActive        Boolean      @default(true)
  startsAt        DateTime     @default(now())
  expiresAt       DateTime?
  createdAt       DateTime     @default(now())
  updatedAt       DateTime     @updatedAt

  @@unique([tenantId, code])
  @@index([tenantId])
}

enum DiscountType {
  PERCENTAGE
  FIXED_AMOUNT
}
```

### 4.3 Default Delivery Zones (Ghana)

The seed script should create these defaults for each tenant (store owners can edit later):

| Zone | Name | Regions | Default Fee (GHS) |
|------|------|---------|-------------------|
| 1 | Accra Metro | Accra Metropolitan, Tema | 15.00 |
| 2 | Greater Accra | Ga East, Ga West, Ga South, Adentan, La-Nkwantanang | 25.00 |
| 3 | Ashanti Region | Kumasi, Obuasi, Ejisu | 40.00 |
| 4 | Central & Western | Cape Coast, Takoradi, Sekondi | 45.00 |
| 5 | Nationwide | All other regions | 55.00 |

---

## 5. Authentication

### 5.1 Strategy

- Auth.js with credentials provider (email + password).
- No OAuth or social login.
- No customer accounts — customers checkout as guests.
- Only store owners/staff have accounts.

### 5.2 Session Shape

```typescript
{
  user: {
    id: string;
    email: string;
    name: string;
    tenantId: string;
    role: "OWNER" | "STAFF";
  }
}
```

### 5.3 Protected Routes

- `/admin/**` routes require authentication.
- Middleware checks for valid session on all `/admin` paths.
- If not authenticated, redirect to `/auth/login`.
- After login, redirect back to `/admin`.

---

## 6. Store Dashboard

### 6.1 Dashboard Overview Page (`/admin`)

Display summary cards:
- Total orders (today / this week / this month)
- Revenue (today / this week / this month)
- Pending orders count
- Low stock products count
- Recent orders list (last 10)

### 6.2 Products (`/admin/products`)

**List view**: Data table with columns — image thumbnail, name, price, stock, status (published/draft), actions (edit/archive).

**Create/Edit form**:
- Name, description (rich text optional, plain text is fine for v1)
- Price, compare-at price (for showing discounts)
- SKU
- Stock quantity, track stock toggle
- Category selector (dropdown)
- Image upload (Cloudinary direct upload, max 5 images, drag to reorder)
- Published toggle
- Variants section (optional): add variants with name, price override, stock

**Actions**: Create, update, archive (soft delete), bulk archive.

### 6.3 Orders (`/admin/orders`)

**List view**: Data table — order number, customer name, total, payment status, order status, date, actions.

**Filters**: By status, by payment status, by date range.

**Order detail view**:
- Customer info (name, email, phone, delivery address)
- Order items list with quantities and prices
- Subtotal, delivery fee, discount, total
- Payment status and reference
- Order status with update dropdown (PENDING → CONFIRMED → PROCESSING → SHIPPED → DELIVERED)
- Cancel button
- Customer note (if any)

**Status updates**: When order status changes, trigger notification to customer (email + SMS if enabled).

### 6.4 Customers (`/admin/customers`)

**List view**: Name, email, phone, total orders, total spent, date joined.

**Detail view**: Customer info + order history.

Customers are created automatically at checkout from guest info. Deduplicated by email per tenant.

### 6.5 Delivery Zones (`/admin/delivery-zones`)

**List view**: Sortable table — zone name, regions, fee, active toggle.

**Create/Edit form**: Name, regions (text field), fee (number), active toggle.

**Reorder**: Drag to reorder (determines display order at checkout).

### 6.6 Discounts (`/admin/discounts`)

**List view**: Code, type, value, usage (used/max), status (active/expired/inactive), dates.

**Create/Edit form**:
- Code (auto-generate option)
- Type: percentage or fixed amount
- Value
- Minimum purchase amount (optional)
- Max uses (optional, blank = unlimited)
- Start date, expiry date (optional)
- Active toggle

### 6.7 Settings (`/admin/settings`)

Organized in tabs or sections:

**General**: Store name, description, logo upload, contact email, contact phone, address.

**Theme**: Primary color picker, accent color picker. (Basic for v1 — just colors that apply to the storefront.)

**Payments**: Display current Paystack subaccount status. Platform admin sets this up — store owner sees connection status.

**Notifications**:
- Email enabled toggle (uses platform Resend account)
- SMS enabled toggle
- Arkesel API key input (store owner provides their own key for SMS)
- Test notification button

**Domain**: Display current subdomain. Custom domain field (manually configured by platform admin in Vercel, display status here).

---

## 7. Storefront

### 7.1 Pages

**Homepage** (`/`):
- Store logo and name in header
- Featured/recent products grid
- Category navigation
- Simple hero section (store description)

**Products listing** (`/products`):
- Product grid with image, name, price
- Filter by category
- Search by product name
- Sort by: newest, price low-high, price high-low

**Product detail** (`/products/[slug]`):
- Image gallery (main image + thumbnails)
- Name, price, compare-at price (show savings)
- Description
- Variant selector (if variants exist)
- Stock status
- Quantity selector
- Add to cart button

**Cart** (`/cart`):
- Cart items list with image, name, variant, price, quantity (editable), line total
- Remove item button
- Cart subtotal
- Continue shopping / Proceed to checkout buttons

**Checkout** (`/checkout`):
- Customer info form: name, email, phone
- Delivery address
- Delivery zone selector (shows zones with fees)
- Discount code input with apply button
- Order summary (items, subtotal, delivery fee, discount, total)
- Pay with Paystack button

**Order confirmation** (`/order/[orderNumber]`):
- Thank you message
- Order summary
- Order number for reference
- Expected delivery info based on zone

### 7.2 Layout

- Header: store logo/name, navigation (Home, Products), cart icon with item count
- Footer: store contact info, powered by link
- Mobile responsive — most Ghana shoppers are on mobile

### 7.3 Design

- Clean, professional, fast-loading
- Use tenant's primary and accent colors from settings
- Product images should be optimized via Cloudinary URL transforms
- Prioritize mobile layout — stack everything vertically, large tap targets
- Use Next.js `<Image>` component for all product images

---

## 8. Payments (Paystack)

### 8.1 Flow

```
Customer clicks "Pay with Paystack"
  → Frontend calls server action: createOrder()
  → Server validates cart against current prices/stock
  → Server creates Customer record (or finds existing by email)
  → Server creates Order + OrderItems
  → Server initializes Paystack transaction:
      POST https://api.paystack.co/transaction/initialize
      {
        email: customer.email,
        amount: total * 100,  // amount in pesewas
        subaccount: tenant.paystackSubaccountCode,
        transaction_charge: platformFee * 100,  // optional flat fee
        callback_url: "https://{domain}/order/{orderNumber}",
        metadata: { orderId, tenantId, orderNumber }
      }
  → Server returns authorization_url
  → Frontend redirects to Paystack
  → Customer pays
  → Paystack redirects to callback_url
  → Paystack sends webhook to /api/webhooks/paystack
```

### 8.2 Webhook Handler

```
POST /api/webhooks/paystack

1. Verify webhook signature (hash request body with secret key, compare to x-paystack-signature header)
2. Parse event
3. If event === "charge.success":
   a. Extract reference from data
   b. Verify transaction: GET https://api.paystack.co/transaction/verify/{reference}
   c. Confirm amount matches order total
   d. Update Order.paymentStatus = PAID
   e. Update Order.paymentRef = reference
   f. Update Order.status = CONFIRMED
   g. Reduce stock for each OrderItem (if trackStock enabled)
   h. Send notifications (email + SMS)
4. Return 200
```

### 8.3 Platform Fee

The platform owner (you) keeps a fee from each transaction. Options:
- **Flat fee**: e.g., GHS 2 per transaction → pass `transaction_charge: 200`
- **Percentage**: Set when creating the subaccount → `percentage_charge: 5` (you keep 5%)

Configure this per tenant in the Tenant model or use a global default.

---

## 9. Notifications

### 9.1 Email (Resend)

**Triggered emails**:

| Event | Recipient | Content |
|-------|-----------|---------|
| Order confirmed (payment successful) | Customer | Order summary, items, total, order number |
| Order status updated | Customer | New status, order number |
| New order received | Store owner | Order summary, customer details |

Use React Email for templates. Keep templates simple and mobile-friendly.

### 9.2 SMS (Arkesel)

**Triggered SMS**:

| Event | Recipient | Message |
|-------|-----------|---------|
| Order confirmed | Customer | "Hi {name}, your order #{orderNumber} has been confirmed. Total: GHS {total}. Thank you for shopping with {storeName}!" |
| Order shipped | Customer | "Your order #{orderNumber} from {storeName} has been shipped." |
| New order | Store owner | "New order #{orderNumber} — GHS {total} from {customerName}." |

**Arkesel API integration**:

```typescript
// lib/notifications/sms.ts
export async function sendSMS(to: string, message: string, apiKey: string) {
  const response = await fetch("https://sms.arkesel.com/api/v2/sms/send", {
    method: "POST",
    headers: {
      "api-key": apiKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      sender: "StoreName",  // max 11 chars
      recipients: [to],
      message,
    }),
  });

  return response.json();
}
```

### 9.3 Configuration

Each tenant can enable/disable email and SMS independently in their dashboard settings. SMS requires the store owner to input their own Arkesel API key.

---

## 10. Image Upload (Cloudinary)

### 10.1 Upload Flow

1. Create an **unsigned upload preset** in Cloudinary dashboard
2. Client-side upload directly to Cloudinary (no server roundtrip for the file itself)
3. On success, save the returned `secure_url` to the database

```typescript
// Client-side upload
const formData = new FormData();
formData.append("file", file);
formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
formData.append("folder", `stores/${tenantSlug}/products`);

const res = await fetch(
  `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
  { method: "POST", body: formData }
);
const data = await res.json();
// data.secure_url → save to DB
```

### 10.2 Image Display

Use Cloudinary URL transformations for responsive images:

```
https://res.cloudinary.com/{cloud}/image/upload/w_400,h_400,c_fill,q_auto,f_auto/{public_id}
```

---

## 11. Build Phases

Complete each phase fully before moving to the next. Each phase should produce working, testable functionality.

### Phase 1: Project Foundation
- Initialize Next.js 16 project with TypeScript
- Configure TailwindCSS
- Install and configure shadcn/ui
- Set up Prisma with the complete schema from Section 4
- Configure Neon database connection
- Run initial migration
- Create seed script with 2 demo tenants, sample categories, products, and delivery zones
- Build `middleware.ts` with tenant resolution logic
- Create tenant utility functions (`getCurrentTenant`, `getTenantFromHeaders`)
- Set up environment variables

### Phase 2: Authentication
- Configure Auth.js with credentials provider
- Create login page (`/auth/login`)
- Implement password hashing (bcrypt)
- Configure session to include tenantId and role
- Add middleware protection for `/admin` routes
- Create user in seed script for each demo tenant

### Phase 3: Dashboard Layout & Settings
- Build dashboard layout: sidebar navigation, header with store name, main content area
- Dashboard overview page with placeholder stats
- Settings page with all tabs (General, Theme, Notifications, Domain)
- Server actions for updating settings
- Logo upload via Cloudinary

### Phase 4: Product Management
- Products list page with data table (shadcn/ui DataTable)
- Create product page/modal with full form
- Edit product page
- Archive product action
- Image upload component (multi-image, reorder)
- Category CRUD (simple modal/form)
- Product variants CRUD (inline on product form)

### Phase 5: Delivery Zones & Discounts
- Delivery zones list with inline editing
- Create/edit delivery zone form
- Reorder delivery zones
- Discounts list page
- Create/edit discount form
- Discount validation logic (expiry, max uses, min purchase)

### Phase 6: Storefront
- Store homepage with product grid
- Product listing page with category filter, search, sort
- Product detail page with image gallery, variant selector
- Cart page (localStorage-based via useCart hook)
- Storefront header and footer
- Responsive mobile-first layout
- Apply tenant theme colors (CSS variables)

### Phase 7: Checkout & Payments
- Checkout page with customer form, delivery zone selector, discount code
- Order creation server action (validate cart, create customer, create order)
- Paystack transaction initialization
- Paystack redirect flow
- Webhook handler (`/api/webhooks/paystack`)
- Order confirmation page
- Stock reduction on successful payment

### Phase 8: Order Management
- Orders list in dashboard with filters
- Order detail view
- Order status update actions with dropdown
- Customer list in dashboard
- Customer detail with order history

### Phase 9: Notifications
- Resend integration with React Email templates
- Order confirmation email to customer
- New order email to store owner
- Arkesel SMS integration
- Order confirmation SMS to customer
- New order SMS to store owner
- Notification settings in dashboard (enable/disable, API key input)
- Test notification button

### Phase 10: Polish & Deploy
- Dashboard overview with real stats (queries for revenue, order counts, low stock)
- SEO: meta tags, Open Graph per store, proper titles
- Error handling: proper error pages (404, 500)
- Loading states: skeleton loaders for dashboard tables and storefront grids
- Empty states: helpful messages when no products, no orders, etc.
- Vercel deployment configuration
- Environment variable setup
- Custom domain setup documentation

---

## 12. Seed Data

The seed script (`prisma/seed.ts`) should create:

**Tenant 1: "Fresh Mart"**
- Slug: `fresh-mart`
- Categories: Fruits, Vegetables, Beverages
- 8-10 products with realistic Ghana pricing (GHS)
- Default delivery zones
- 1 owner user (email: owner@freshmart.test, password: password123)

**Tenant 2: "StyleHub GH"**
- Slug: `stylehub-gh`
- Categories: Men's Wear, Women's Wear, Accessories
- 8-10 products with realistic Ghana pricing (GHS)
- Default delivery zones
- 1 owner user (email: owner@stylehub.test, password: password123)

Include a few sample orders in different statuses to populate the dashboard.

---

## 13. Non-Goals (Explicitly Out of Scope)

- Self-service store creation / public signup
- Multiple staff roles beyond OWNER and STAFF
- Automated Vercel Domains API integration (custom domains added manually)
- Multiple storefront themes / theme marketplace
- Customer accounts / login
- Abandoned cart recovery
- Analytics dashboard
- Subscription billing for store owners
- Inventory management beyond simple stock counts
- Multi-currency (all stores use GHS)
- Multi-language / i18n
- Reviews and ratings
