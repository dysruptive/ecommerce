# Operations Guide — Multi-Tenant Ecommerce Platform

This guide covers two things:
1. **Testing the platform** — as a store owner and as a customer
2. **Onboarding a new store** — from zero to live

---

## Getting Started Locally

### 1. Set up your environment

Ensure your `.env` file has these values:

```env
DATABASE_URL=                          # Neon PostgreSQL connection string
AUTH_SECRET=                           # Random string (openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

PAYSTACK_SECRET_KEY=sk_test_...        # Use test keys locally
PAYSTACK_PUBLIC_KEY=pk_test_...

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=

RESEND_API_KEY=
ARKESEL_API_KEY=

NEXT_PUBLIC_ROOT_DOMAIN=localhost:3000
```

### 2. Set up the database

```bash
npx prisma migrate deploy
npx prisma db seed
```

This creates two demo stores:
- **Fresh Mart** — `owner@freshmart.gh` / `password123`
- **StyleHub GH** — `owner@stylehub.gh` / `password123`

### 3. Make subdomains work in your browser

Add these lines to `/etc/hosts` so subdomains resolve locally:

```
127.0.0.1  fresh-mart.localhost
127.0.0.1  stylehub-gh.localhost
```

On Mac: `sudo nano /etc/hosts`, paste the lines, save with `Ctrl+O`.

### 4. Start the dev server

```bash
npm run dev
```

---

## Part 1: Testing as a Customer

Open your browser and go to `http://fresh-mart.localhost:3000`. For StyleHub use `http://stylehub-gh.localhost:3000`.

### Storefront browsing

1. **Homepage** — You should see the store hero, featured categories, and a product grid
2. **Products page** — Click "Shop" or go to `/products`. All store products should appear
3. **Search** — Type in the search bar. Results filter and the URL updates to `?q=your-term`. Reload — results persist (filters live in the URL)
4. **Category filter** — Click a category chip. URL updates to `?category=vegetables`
5. **Sort** — Change the sort dropdown. URL updates to `?sort=price_asc`
6. **Product detail** — Click any product. You should see images, price, description, stock status, and an "Add to Cart" button

### Cart

1. Click "Add to Cart" on a product — the cart icon in the header should show a count badge
2. Add the same product again — quantity increments, no duplicate row
3. Navigate to `/cart` — all items, quantities, prices, and total visible
4. Use the +/- buttons to change quantity — total updates instantly
5. Click remove on an item — it disappears
6. **Refresh the page** — cart should still be there (stored in localStorage)

### Checkout

1. From the cart page, click "Checkout"
2. Fill in: full name, email, phone number, delivery address
3. Select a delivery zone from the dropdown — the delivery fee adds to the total
4. Optionally enter a discount code
5. Click "Place Order" — you should be redirected to Paystack's payment page

### Payment (test mode)

On the Paystack payment page use these test card details:

| Field   | Value               |
|---------|---------------------|
| Card    | 4084 0840 8408 4081 |
| CVV     | 408                 |
| Expiry  | Any future date     |
| PIN     | 0000                |
| OTP     | 123456              |

After completing payment you should land on the order confirmation page at `/order/[orderNumber]`, showing your order details, items, and status.

### What to verify after a test order

Open Prisma Studio (`npx prisma studio` in your terminal) and check:
- Order `status` = `PAID`
- Order `paymentStatus` = `PAID`
- `paymentRef` is populated
- Product `stock` decreased by the quantities ordered
- A `Customer` record exists with the email you used

---

## Part 2: Testing as a Store Owner

Go to `http://fresh-mart.localhost:3000/auth/login`.

### Login

1. Enter `owner@freshmart.test` / `password123` → you should land on `/admin`
2. **Wrong password test**: enter an incorrect password → error message shown, no crash
3. **Unauthenticated access test**: open a private/incognito window, go directly to `http://fresh-mart.localhost:3000/admin` → should redirect to the login page

### Dashboard overview

`/admin` should show summary cards (revenue, orders, products, customers) and a recent orders table. All numbers should reflect only Fresh Mart's data.

### Products

Go to `/admin/products`.

**Create:**
1. Click "Add Product"
2. Fill in name, description, price, stock, category
3. Upload an image (goes to Cloudinary)
4. Save → redirected to the products list with the new product visible

**Edit:**
1. Click a product → change the price → save → change reflects in the list

**Archive:**
1. Archive a product → it disappears from the storefront
2. Open Prisma Studio and confirm `isArchived: true` — the record still exists, existing orders still reference it correctly

### Categories

1. Create a category (e.g. "Vegetables")
2. Assign a product to it
3. On the storefront, verify the category appears in the filter and clicking it shows only those products

### Orders

Go to `/admin/orders`.

1. The order you placed in Part 1 should be listed here
2. Click into it — full details visible: customer info, items, payment status, delivery zone
3. Update the status (e.g. mark as "PROCESSING") → verify it saves and reflects in the list

### Customers

Go to `/admin/customers`.

1. The customer created during your test checkout should appear
2. Click them → their order history should be visible

### Delivery Zones

Go to `/admin/delivery-zones`.

1. You should see 5 default Ghana zones (Accra, Kumasi, Tema, Takoradi, Cape Coast)
2. Edit Accra — change the delivery fee → save
3. Toggle a zone inactive → go to the storefront checkout and confirm it no longer appears in the zone dropdown
4. Create a new zone (e.g. "Tamale", ₵40, 4 days) → verify it appears in checkout

### Discounts

Go to `/admin/discounts`.

1. Create a percentage discount: code `LAUNCH20`, 20%, future expiry
2. Create a fixed discount: code `SAVE10`, ₵10 off
3. Go to the storefront checkout, apply `LAUNCH20` → total should reduce by 20%
4. Enter a fake code → error message shown, checkout not blocked

### Settings

Go to `/admin/settings`.

1. Change the store name → save → refresh the storefront and verify the name updated
2. Toggle email notifications on/off → save
3. Enter an Arkesel API key (if available) → save

---

## Part 3: Tenant Isolation Test

This is the most important test — Store A must never see Store B's data.

1. Log in as Fresh Mart owner (`owner@freshmart.test`) at `http://fresh-mart.localhost:3000/auth/login`
2. In the **same browser tab**, manually navigate to `http://stylehub-gh.localhost:3000/admin`
3. The dashboard should show **Fresh Mart's data** — your session is tied to Fresh Mart's `tenantId`
4. Log out, then log in as `owner@stylehub.test` at `http://stylehub-gh.localhost:3000/auth/login`
5. You should now see only StyleHub's products and orders — Fresh Mart's data is invisible

---

## Part 4: Webhook Testing (Payment Confirmation)

Paystack sends a server-to-server webhook after payment. Locally it can't reach `localhost`, so you need ngrok:

1. Install ngrok from [ngrok.com](https://ngrok.com) if you haven't already
2. In a separate terminal, run: `ngrok http 3000`
3. Copy the HTTPS URL it gives you (e.g. `https://abc123.ngrok.io`)
4. In your Paystack dashboard go to **Settings → API Keys & Webhooks**
5. Set the webhook URL to: `https://abc123.ngrok.io/api/webhooks/paystack`
6. Complete a test purchase on the storefront using the test card
7. In the ngrok terminal you should see a `POST /api/webhooks/paystack 200` request arrive
8. Check Prisma Studio — the order status should have flipped to `PAID`

---

## Part 5: Adding a New Store

### Step 1: Create the store in the database

Create `scripts/create-store.ts`:

```typescript
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function createStore({
  name,
  slug,
  ownerEmail,
  ownerPassword,
  ownerName,
  currency = "GHS",
}: {
  name: string;
  slug: string;
  ownerEmail: string;
  ownerPassword: string;
  ownerName: string;
  currency?: string;
}) {
  const tenant = await prisma.tenant.create({
    data: {
      name,
      slug,
      currency,
      settings: {
        emailEnabled: true,
        smsEnabled: false,
      },
      users: {
        create: {
          name: ownerName,
          email: ownerEmail,
          password: await bcrypt.hash(ownerPassword, 12),
          role: "OWNER",
        },
      },
      deliveryZones: {
        create: [
          { name: "Accra",      baseFee: 15, estimatedDays: 1, isActive: true },
          { name: "Kumasi",     baseFee: 25, estimatedDays: 2, isActive: true },
          { name: "Tema",       baseFee: 15, estimatedDays: 1, isActive: true },
          { name: "Takoradi",   baseFee: 35, estimatedDays: 3, isActive: true },
          { name: "Cape Coast", baseFee: 30, estimatedDays: 2, isActive: true },
        ],
      },
    },
  });

  console.log(`\nStore created!`);
  console.log(`Name:   ${tenant.name}`);
  console.log(`Slug:   ${tenant.slug}`);
  console.log(`ID:     ${tenant.id}`);
  console.log(`Login:  ${ownerEmail} / ${ownerPassword}`);

  return tenant;
}

// Edit these values for each new store
createStore({
  name: "Kente World",
  slug: "kente-world",
  ownerEmail: "owner@kenteworld.gh",
  ownerPassword: "ChangeMe123!",
  ownerName: "Kwame Mensah",
}).then(() => prisma.$disconnect());
```

Run it:

```bash
npx tsx scripts/create-store.ts
```

### Step 2: Set up their Paystack subaccount

1. Paystack dashboard → **Settings → Subaccounts → Add Subaccount**
2. Enter the store owner's bank details
3. Copy the **Subaccount Code** (e.g. `ACCT_xxxxxxxxxx`)
4. Open Prisma Studio (`npx prisma studio`), find the Tenant record, set `subaccountCode`

### Step 3: DNS setup

**Recommended — wildcard (covers all stores with one record, do this once):**

| Type  | Name | Value                  |
|-------|------|------------------------|
| CNAME | `*`  | `cname.vercel-dns.com` |

**Per-store if not using wildcard:**

| Type  | Name          | Value                  |
|-------|---------------|------------------------|
| CNAME | `kente-world` | `cname.vercel-dns.com` |

### Step 4: Add domain to Vercel

Go to **Vercel Dashboard → Project → Settings → Domains → Add Domain** and add `*.yourdomain.com` (once, for all stores) or `kente-world.yourdomain.com`.

### Step 5: Custom domain (optional)

If the store owner wants `kenteworld.com`:

1. Add to Vercel: **Settings → Domains → Add Domain** → `kenteworld.com`
2. Give the owner these DNS records to set at their registrar:
   - `A` record → `76.76.21.21`
3. Once DNS propagates, open Prisma Studio and set `customDomain = "kenteworld.com"` on their Tenant record — the middleware handles the rest automatically

### Step 6: Onboarding the store owner

Send them:
- Login URL: `https://kente-world.yourdomain.com/auth/login`
- Email + temporary password (tell them to change it in Settings)

**Their setup checklist:**
- [ ] Log in, change password in Settings
- [ ] Upload store logo in Settings
- [ ] Create product categories
- [ ] Review and adjust delivery zones
- [ ] Add all products with images, prices, stock
- [ ] Create a launch discount code (optional)
- [ ] Do one test purchase on their own storefront using the Paystack test card

### Step 7: Go-live checklist

- [ ] Paystack test keys → live keys (update `PAYSTACK_SECRET_KEY` + `PAYSTACK_PUBLIC_KEY` in Vercel env vars — affects all stores)
- [ ] Paystack webhook URL updated to: `https://yourdomain.com/api/webhooks/paystack`
- [ ] At least one active product with stock > 0
- [ ] At least one active delivery zone
- [ ] Paystack subaccount linked and bank details verified
- [ ] SSL certificate active (Vercel handles this — check the Domains page)
- [ ] Send a real ₵1 test order end-to-end

---

## Quick Reference

### Paystack test card

| Field   | Value               |
|---------|---------------------|
| Card    | 4084 0840 8408 4081 |
| CVV     | 408                 |
| Expiry  | Any future date     |
| PIN     | 0000                |
| OTP     | 123456              |

### Demo store credentials

| Store       | URL                                    | Email                  | Password      |
|-------------|----------------------------------------|------------------------|---------------|
| Fresh Mart  | `http://fresh-mart.localhost:3000`     | `owner@freshmart.test` | `password123` |
| StyleHub GH | `http://stylehub-gh.localhost:3000`    | `owner@stylehub.test`  | `password123` |

### Useful commands

```bash
npx prisma studio          # Browse and edit the database in a UI
npx prisma migrate deploy  # Apply schema migrations
npx prisma db seed         # Run the seed script
npm run build              # Production build check
npx tsc --noEmit           # Type-check without building
```
