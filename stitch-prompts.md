# Google Stitch — Ecommerce Homepage Prompts
## Multi-Tenant Ghana Ecommerce Platform

Each prompt below generates a full homepage design in Stitch. After generating, use the Stitch MCP
(`npx @_davideast/stitch-mcp proxy`) in Claude Code to pull the HTML into the codebase and convert
it into a `stores/<slug>/` folder following the project's section pattern.

---

## MASTER TEMPLATE (fill-in formula)

Use this structure when creating a new store type not listed below:

```
Design a single-page ecommerce homepage for a [STORE TYPE] called "[STORE NAME]" targeting [TARGET CUSTOMER] in Ghana.

BRAND FEEL: [3 adjectives, e.g. "warm, local, trustworthy"]
PRIMARY COLOR: [hex]
ACCENT COLOR: [hex]
BACKGROUND: [hex or description]
FONT STYLE: [geometric sans / humanist sans / serif / slab serif]

SECTIONS (top to bottom):
1. Sticky header — logo left, nav links centre (Home, Shop, About, Delivery), cart icon right. Dark/light to match brand.
2. Hero — full-viewport-height. [Describe layout: split, full-bleed image, centred text, etc.]. Headline: "[HEADLINE]". Subtext: "[SUBTEXT]". CTA button: "[CTA TEXT]".
3. Trust/USP strip — 3–4 horizontal icons with short labels. Icons: [list them, e.g. same-day delivery, free returns, secure payment, locally sourced].
4. Category grid — [number] categories in an asymmetric grid. Categories: [list them]. Each card has an image placeholder and label overlay.
5. Featured products strip — horizontal scroll on mobile, 4-column grid on desktop. Each card: product image, name, price in GHS (₵), add-to-cart button that appears on hover.
6. [OPTIONAL SECTION: brand story / seasonal promo / testimonials / map / newsletter].
7. Footer — store name, social links, delivery zone mention ("Delivering across [city/region]"), Paystack badge.

STYLE RULES:
- No purple-to-blue gradients
- No generic rounded-2xl shadow-xl cards on everything
- Prices use tabular figure font-feature-settings
- Body text neutral-700, never pure black
- CTA button has a bold hover state (not just opacity)
- Mobile-first: check 375px layout
```

---

## STORE 1 — TechHub GH (Electronics & Gadgets)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Think Nothing.tech meets a premium Ghanaian retailer.
> Ultra-minimal. The product IS the design. Zero decorative elements.
> Reference: nothing.tech, framework.computer, teenage.engineering
>
> **Anti-patterns to avoid in every page:**
> - No 3-column "icon + heading + paragraph" feature grids
> - No purple/blue gradients or hero background glow effects
> - No rounded-2xl cards with drop shadows on everything
> - No "Amazing Products" filler copy — every word earns its place
> - No generic star ratings rows or testimonial carousels
> - No floating blobs or decorative background shapes

---

### PAGE 1 — Homepage

```
Design a homepage for TechHub GH, an electronics store for tech-savvy professionals
aged 20–35 in Accra and Kumasi, Ghana.

COLOUR SYSTEM:
- Background: #ffffff (white)
- Surface: #f9f9f9 (near-white for alternating sections)
- Text primary: #0a0a0a (near-black — NOT pure #000000)
- Text secondary: #6b6b6b
- Accent: #e8ff00 (electric lime — used ONLY on the single primary CTA and prices on hover)
- Dark section: #0a0a0a

TYPOGRAPHY:
- Headings: "Inter" or equivalent geometric sans, weight 700–900, tight tracking (-0.03em to -0.05em)
- Body: same family, weight 400, generous line-height 1.65
- Labels/tags: weight 500, 11px, letter-spacing 0.12em, ALL CAPS
- Prices: font-variant-numeric: tabular-nums, weight 600

LAYOUT:

1. HEADER — sticky, white background, 1px bottom border #e5e5e5.
   Left: wordmark "TechHub" in black weight-800 + small "GH" in #6b6b6b weight-400.
   Centre: nav links "Phones · Laptops · Audio · Accessories · Deals" — weight 400, 14px, no underline, gap-8.
   Right: search icon (expands to inline input on click), cart icon with a small number badge in black.
   Height: 56px. Compact, never bulky.

2. HERO — full viewport height (100vh). Single full-bleed dark section (#0a0a0a).
   Layout: product image left-centre (phone or laptop, isolated on black, no background shadow).
   Text block right-aligned: tag "Now Available in Ghana" in electric lime 11px uppercase tracking-wide.
   Headline below tag: "The one phone / you actually need." — weight 900, 64px desktop, tight tracking.
   Subtext: "Genuine tech. Same-day delivery across Accra." — 16px, #999999.
   Single CTA below: "Shop Phones" — white background, black text, sharp rectangle (no border radius),
   12px uppercase tracking-wide. On hover: background turns electric lime (#e8ff00), text stays black.
   Bottom-left corner of the hero: three small data points in a row — "₵ 2,499" / "In Stock" / "2yr Warranty"
   — each separated by a thin | divider. 13px, #666666.

3. CATEGORY STRIP — white background. No heading. 6 categories in a single horizontal row.
   Each category: a pure white square tile (aspect-ratio 1:1), light 1px border (#e5e5e5).
   Category name: large, weight 800, 32px, bottom-left of the tile. On hover: background flips to #0a0a0a,
   text to white. Transition 150ms ease. No images — typography IS the design here.
   Categories: Phones / Laptops / Audio / Wearables / Accessories / Deals

4. FEATURED PRODUCTS — heading "What people are buying" in 13px uppercase weight-500 tracking-wide #6b6b6b.
   Below heading: 4-column grid desktop, 2-column mobile. Cards: white, no shadow, 1px border #f0f0f0.
   Each card: product image (white/grey background, square, fills top 60% of card).
   Below image: product name weight-600 14px, one-line spec in 12px #9b9b9b (e.g. "6.7in · 256GB · 5G"),
   price in ₵ weight-700 16px. NO add-to-cart button visible at rest.
   On hover: card border darkens to #0a0a0a. A minimal "Add — ₵2,499" bar slides up from the bottom,
   dark background, white text, electric lime price.

5. MARQUEE STRIP — thin 40px strip, black background. Single line of scrolling white text:
   "Free delivery on orders over ₵500 · Same-day dispatch before 2pm · 30-day returns · Paystack secured"
   Repeating. Font: 11px uppercase tracking-widest. Electric lime bullet separators.

6. EDITORIAL FULL-BLEED SECTION — off-white (#f5f5f5) background, generous vertical padding (120px).
   Asymmetric 2-column: LEFT 65%: a single large featured product image (laptop, near-full width of column,
   no decorative framing). RIGHT 35%: vertically centred text block.
   Tag: "Staff Pick" in 11px uppercase lime. Product name large weight-800.
   Two lines of spec in 13px #6b6b6b. Price. CTA: "View Details →" — no button, just text link with
   an underline that draws in on hover.

7. FOOTER — dark (#0a0a0a), 4 columns.
   Column 1: "TechHub GH" wordmark + "Delivering across Accra, Kumasi, Takoradi." in small grey.
   Columns 2–3: shop links (Phones, Laptops, Audio, Accessories, Deals) and support links (Contact, FAQs, Returns, Track Order).
   Column 4: "Secure payments" Paystack logo, social icons (Instagram, X, WhatsApp) as minimal line icons.
   Bottom bar: "© 2026 TechHub GH · All prices in Ghana Cedis (₵)" — 11px #555555.

CRITICAL STYLE RULES:
- Whitespace is the hero. Sections have generous padding — never cramped.
- Electric lime (#e8ff00) appears on exactly ONE element per section at most.
- Product images sit on white or near-black backgrounds only — no coloured backgrounds.
- Every section has exactly one job. Hero sells the brand, categories orient the shopper,
  products drive conversion, marquee builds trust, editorial creates desire.
- No section headers with decorative underlines or icon-accent elements.
```

---

### PAGE 2 — Products Grid (Category / Search Results Page)

```
Design a product listing/grid page for TechHub GH electronics store.
This is the page shown when a user clicks "Phones" or searches for a product.

SAME COLOUR SYSTEM AND TYPOGRAPHY as the homepage (see above).

PAGE STRUCTURE:

1. HEADER — identical sticky header from homepage (56px, white, 1px border).

2. BREADCRUMB + PAGE TITLE — 24px top padding. Single line: "TechHub GH / Phones" in 12px #9b9b9b.
   Below: "Phones" as the page H1 — weight 800, 40px, tight tracking. To the right of the H1:
   a small grey pill showing "47 products". Right-aligned: sort dropdown — minimal, no border,
   just "Sort: Featured ▾" in 13px.

3. FILTER BAR — horizontal, sits below the title. NOT a sidebar. A single row of filter pills:
   "All · Under ₵1,000 · ₵1,000–₵3,000 · ₵3,000+ · In Stock · New Arrivals · On Sale"
   Pills at rest: white background, 1px border #d5d5d5, 13px, weight 500, rounded-full.
   Active pill: black background, white text.
   Second row (visible on scroll): brand filters "All Brands · Samsung · Apple · Tecno · Infinix · Xiaomi"

4. PRODUCT GRID — 4 columns desktop, 2 columns tablet, 1 column mobile. No sidebar.
   Each card:
   - White background, 1px border #efefef, no shadow, no border-radius (sharp corners).
   - Top 58%: product image on white background, object-contain.
   - Badge top-left (conditional, only when applicable): "Sale" in black pill OR "New" in lime pill.
     Max one badge per card. Never stack badges.
   - Below image: product name weight-600 14px, line-clamp-2.
   - Spec line: 12px #9b9b9b — most important single spec (e.g. "128GB · Android 15").
   - Price row: weight-700 16px black. If on sale: original price struck through in #c0c0c0 12px beside it.
   - At rest: no button visible.
   - On hover: card border becomes 1px solid #0a0a0a. A slim 36px dark bar slides up from card bottom:
     "Add to cart — ₵1,899" — white text, electric lime price. Smooth 120ms transition.

5. LOAD MORE — centred below the grid. NOT pagination numbers.
   Single button: "Load more products (12 remaining)" — outlined, black border, no fill, sharp rectangle.
   On hover: fills black, white text.

6. FOOTER — same as homepage.

CRITICAL RULES:
- Absolutely no sidebar filter panel. Horizontal filter bar only.
- Cards have zero drop shadow. Border contrast alone separates them from the page.
- Badge system: max one badge, two variants only (black "Sale", lime "New"). Nothing else.
- The hover add-to-cart bar must show the price — not just "Add to Cart" text alone.
- Grid gutter: 1px (tight, like an Apple product page grid — not card-separated with gap-6).
```

---

### PAGE 3 — Product Detail Page

```
Design a product detail page for TechHub GH electronics store.
Example product: "Samsung Galaxy A56 · 256GB · Midnight Black · ₵2,499"

SAME COLOUR SYSTEM AND TYPOGRAPHY as the homepage.

PAGE STRUCTURE:

1. HEADER — same sticky header.

2. BREADCRUMB — "Phones / Samsung / Galaxy A56" in 12px #9b9b9b. 1 line only.

3. PRODUCT MAIN SECTION — 2-column layout, 60/40 split. min-height 85vh.
   LEFT 60% (image area):
   - Large square image container (white background). Main product photo fills ~80% of the area.
   - Below main image: horizontal thumbnail strip — 5 small square thumbnails, 1px border,
     active thumbnail has black border. No rounded corners.
   - Top-right of image: minimal zoom icon (magnifying glass, 16px, #9b9b9b).

   RIGHT 40% (info area, sticky on scroll):
   - Brand label: "Samsung" in 11px uppercase tracking-wide #9b9b9b.
   - Product name H1: "Galaxy A56" weight-800 32px, tight tracking.
   - Short spec tagline: "6.7" AMOLED · 256GB · Android 15" in 14px #6b6b6b.
   - Divider: 1px #e5e5e5 horizontal rule.
   - Price block: ₵2,499 in weight-700 28px. If sale: original ₵2,999 struck through in 16px #c0c0c0 beside it.
     Small "In Stock" pill in lime background, black text, 11px below price.
   - Storage variant selector: label "Storage" in 11px uppercase #9b9b9b. Below: 3 pill options:
     "128GB · ₵1,999" / "256GB · ₵2,499 ✓" / "512GB · ₵3,199"
     Pills: at rest outlined, selected = filled black, white text. Sharp rectangle not rounded-full.
   - Colour variant row: label "Colour". 4 small 20×20px solid colour swatches (no border at rest,
     black 1px border on active). Colour name appears as text below the swatches on selection.
   - Quantity selector: inline "− 1 +" minimal row. No borders, just the number centred.
   - CTA stack: two full-width buttons stacked with 8px gap.
     Primary: "Add to Cart" — black background, white text, sharp rectangle, 48px height.
     Secondary: "Buy Now" — white background, black 1px border, same height.
     On hover: primary lightens slightly, secondary fills black.
   - Trust row below buttons: 3 small items inline — "Genuine Product", "Free Delivery Accra",
     "30-Day Returns". 11px #6b6b6b. No icons — text only, separated by ·

4. PRODUCT SPECS TABLE — full-width, below the 2-column section. White background.
   Heading: "Specifications" in 11px uppercase weight-500 tracking-wide. No decorative element.
   Table: 2 columns (label left in #9b9b9b, value right in #0a0a0a), 1px bottom border per row,
   alternating row background (#ffffff / #fafafa). Specs: Display, Processor, RAM, Storage, Battery,
   Camera, OS, Dimensions, Weight, Connectivity.

5. RELATED PRODUCTS — "You might also like" heading same style as specs label.
   Horizontal scroll strip on mobile, 4-column grid on desktop. Same card design as products grid page.

6. FOOTER — same as homepage.

CRITICAL RULES:
- Variant selectors must show price changes inline — not just the variant name.
- The sticky right column must not have a background or border — it floats on the white page.
- No accordion FAQ section on this page. No reviews section. Product-first.
- Main image must be large enough to be the dominant visual on the page.
- Price must be the clearest hierarchy item in the right column, after the product name.
```

---

### PAGE 4 — Checkout Page

```
Design a checkout page for TechHub GH electronics store.
This is the single-page checkout shown after the customer clicks "Checkout" from the cart.

SAME COLOUR SYSTEM AND TYPOGRAPHY as the homepage.

LAYOUT: 2-column, 60/40 split. Left = form. Right = sticky order summary.

PAGE STRUCTURE:

1. HEADER — simplified header for checkout context. White background, 1px border.
   Left: "TechHub GH" wordmark only (no nav links — reduce exit points).
   Right: "Secure Checkout" in 12px #6b6b6b with a small padlock icon in the same colour.
   No cart icon. No nav.

2. PROGRESS INDICATOR — a single horizontal line with 3 steps below the header.
   Steps: "Cart" → "Details" → "Payment"
   Active step ("Details") in black, weight-600. Completed step ("Cart") in #9b9b9b with a ✓.
   Upcoming step ("Payment") in #d0d0d0. Line connecting steps is 1px, completed portion black.

3. LEFT COLUMN — checkout form, 60% width.

   SECTION A: "Contact"
   Section label: 11px uppercase weight-500 tracking-wide #6b6b6b.
   Fields: Email (full-width). Phone number (full-width).
   Field style: white background, 1px border #d5d5d5, 44px height, no border-radius.
   On focus: border turns black. No coloured focus rings.
   Error state: 1px red border, small red error text below (12px).

   SECTION B: "Delivery"
   Fields: First Name + Last Name (2 columns), Address Line 1 (full), City (full), Region (dropdown).
   Dropdown style: same as input fields. Custom arrow: "▾" in black, no native browser styling.

   SECTION C: "Delivery Zone"
   Heading same style as section labels.
   3 delivery option rows (radio select). Each row: 1px border, 48px height, full-width.
   Left: radio circle (custom, not native) + zone name + description.
   Right: price in ₵ weight-600.
   Selected row: 1px solid #0a0a0a border, black radio fill.
   Options: "Accra — Same Day (before 2pm) — ₵15" / "Accra — Next Day — Free" / "Other Regions — 2–5 Days — ₵30"

   SECTION D: "Discount Code"
   Single row: inline input + "Apply" button. Input: same field style, 70% width.
   Button: outlined black, sharp rectangle, same height as input. On apply: success shows lime ✓ + discount amount.

   CTA: Full-width "Continue to Payment" button — black, white text, 52px height, sharp rectangle.
   Below button: "Powered by Paystack" badge — small, centred, greyscale.

4. RIGHT COLUMN — sticky order summary, 40% width.
   Heading: "Order Summary" 11px uppercase.
   Product list: each item has a small square product image thumbnail (48×48px, 1px border),
   product name + variant in 13px, quantity indicator "×2" in grey, and price right-aligned.
   Divider lines between items.
   Subtotal row. Discount row (in lime if applied). Delivery row. Bold total row at bottom.
   Total: weight-800 20px.
   Below total: "30-Day Returns · Genuine Products · Paystack Secured" in 11px #9b9b9b centred.

5. PAYMENT STEP (second state, shown after "Continue to Payment"):
   Left column changes to a Paystack-branded minimal card widget — white container, black border.
   Heading: "Payment" in same label style.
   Paystack iframe/widget placeholder (realistic: shows card fields — Number, Expiry, CVV — and
   "Pay ₵2,514" button in Paystack green). Mobile money option toggle at top: "Card | Mobile Money".
   Right column stays identical.

6. NO FOOTER on checkout. Instead: minimal bottom bar — 1px top border, white background.
   "© 2026 TechHub GH · Privacy Policy · Terms" — 11px #9b9b9b centred. 40px height.

CRITICAL RULES:
- No distractions. No promotions, banners, or cross-sells anywhere on this page.
- Every form field must be the same height (44px inputs, 52px CTA).
- The sticky order summary must never overlap form content on mobile — it moves below the form.
- Progress indicator is decorative only — no click navigation between steps.
- The "Continue to Payment" button is the only lime-accented element on this page. Everything else is black/white.
- Error states use red text + border only. No error icons, no background fills.
```

---

## STORE 2 — GlowUp Beauty (Cosmetics & Skincare)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Think Aesop meets a Ghanaian beauty brand. Quiet luxury.
> Warm, editorial, ingredient-led. Photography carries the weight. Type is restrained.
> Reference: aesop.com, bybi.com, renskincare.com
>
> **Anti-patterns:** No 5-star rating carousels. No "Amazing Skin in 3 Steps" icon rows.
> No cold white backgrounds. No pink-to-purple gradients. No bubbly rounded UI.

---

### PAGE 1 — Homepage

```
Design a homepage for GlowUp Beauty, a skincare and cosmetics brand for Ghanaian women
aged 18–40 in Accra who prioritise natural African ingredients and skin health.

COLOUR SYSTEM:
- Background: #fdf8f3 (warm cream)
- Surface: #f5ece0 (slightly deeper cream for alternating sections)
- Text primary: #2c1a0e (dark espresso — not pure black)
- Text secondary: #8a6a52 (warm mid-brown)
- Accent: #c9855a (burnt sienna — for interactive states only)
- Border: #e5d5c5 (warm beige)

TYPOGRAPHY:
- Headings: Playfair Display or Cormorant, weight 400–600, generous leading (1.2)
- Body: DM Sans or Inter, weight 400, 15px, leading 1.7
- Labels: DM Sans, 11px, weight 500, uppercase, tracking 0.12em
- Prices: tabular-nums, weight 600, DM Sans

LAYOUT:

1. HEADER — cream background, 1px border-bottom #e5d5c5. 60px height.
   Left: "GlowUp" serif in espresso, weight 500, + small "BEAUTY" sans label beside it.
   Centre: nav "Skincare · Makeup · Hair · Natural · Bundles" — 14px, weight 400, gap-8.
   Right: search icon, cart icon (no badge at rest — small dot appears when items added).
   Announcement bar ABOVE header: #f5ece0 background, 32px height. Centred 12px text:
   "Free delivery over ₵200 · Use GLOW10 for 10% off your first order"

2. HERO — full viewport height, asymmetric 45/55 split.
   LEFT 45%: cream background (#fdf8f3). Generous padding left 80px, vertically centred.
   Tag: "Natural. Ghanaian. Glowing." — 11px uppercase burnt sienna tracking-wide.
   Headline (3 lines, display serif 56px desktop): "Your Skin / Deserves / Nature's Best."
   Body 15px warm-brown: "Handpicked skincare rooted in African ingredients — shea, baobab, and black soap."
   CTA: "Shop Skincare" — espresso background (#2c1a0e), cream text, 44px height, sharp rectangle.
   On hover: burnt sienna background. No border radius.
   Below CTA: three trust items inline: "Dermatologist approved · No parabens · Ships Ghana-wide"
   — 12px, warm-brown, · separator.

   RIGHT 55%: surface colour (#f5ece0). Three product "cards" stacked diagonally —
   top-right card slightly rotated 2deg clockwise, middle front-centre, third partially visible left.
   Each card: white background, 1px border #e5d5c5, product photo top half, name + price bottom.
   No drop shadow — border contrast only.

3. INGREDIENT STRIP — full-width, no heading. 3-column grid on #2c1a0e dark background.
   Each column: one ingredient name in large display serif (cream, 40px), one benefit sentence
   below in 14px warm cream. No icons. Typography does the work.
   Columns: Shea Butter · Baobab Oil · African Black Soap

4. BESTSELLERS — section label "Best Sellers" 11px uppercase. 4-col desktop, 2-col mobile.
   Cards: cream background, 1px border #e5d5c5, no shadow, no rounded corners.
   Top 55%: product image on cream surface. Below: product name serif 15px, benefit line
   12px warm-brown ("Brightens & evens tone"), price weight-600.
   On hover: border becomes #c9855a. "Add to Cart →" text link (not button) appears below price.

5. EDITORIAL STORY SECTION — asymmetric. Left 55%: full-bleed warm image placeholder (2:3).
   Right 45%: cream background, vertically centred. Display serif heading (36px):
   "Made with what the earth grows." 3 ingredient callouts as plain text lines — no icons, no cards:
   each is just "— Shea Butter" in small caps followed by one sentence in body text.
   CTA: "Our Ingredients →" — text link, underline draws in on hover, no button.

6. SKIN CONCERN NAVIGATOR — cream section. Label "Find your routine." above.
   Horizontal scroll row of outlined pills: Dry Skin · Oily Skin · Dark Spots · Anti-Ageing ·
   Sensitive · Brightening · Men's. At rest: 1px border #e5d5c5, 13px body text.
   On active/hover: fills to #2c1a0e, text cream.

7. FOOTER — #2c1a0e (dark espresso). GlowUp Beauty wordmark in cream serif, tagline below in 13px.
   3 columns: Shop, About, Help. "Secure payments via Paystack" small text + badge.
   Social: Instagram, TikTok, WhatsApp — line icons only, cream, no fills. 1px top border #3d2510.
```

---

### PAGE 2 — Products Grid

```
Design a product listing page for GlowUp Beauty. Same colour system as homepage.
Example: user browsed to "Skincare" category — showing 24 products.

1. HEADER — same as homepage, sticky.

2. PAGE TITLE — 32px top padding, breadcrumb "GlowUp Beauty / Skincare" in 12px warm-brown.
   Below: "Skincare" H1, display serif 40px. Right-aligned: "24 products" pill + "Sort: Best Selling ▾" dropdown.

3. FILTER BAR — horizontal row below title. No sidebar.
   Row 1 (concern filters): "All · Moisturisers · Serums · Cleansers · Toners · SPF · Eye Care"
   Row 2 (skin type): "All Skin · Dry · Oily · Combination · Sensitive"
   Pill style: cream background, 1px border #e5d5c5, 13px, rounded-full. Active: fills #2c1a0e, cream text.

4. PRODUCT GRID — 4-col desktop, 2-col mobile. Grid gap: 1px (tight, magazine-like).
   Each card: cream surface (#f5ece0) background. No border. No shadow.
   Top 60%: product image, object-contain on cream. Badge top-left (one max): "New" in espresso pill
   OR "Sale" in burnt sienna pill, 11px, sharp corners.
   Below image: product name, serif 14px. Benefit line: 12px warm-brown. Price: DM Sans weight-600 15px.
   If on sale: original price struck through in 12px faded beside it.
   On hover: a thin 1px espresso border appears on the card. Below price, "Quick Add →" text link fades in.

5. PAGINATION — "Load more (12 remaining)" centred, outlined espresso button.

6. FOOTER — same as homepage.
```

---

### PAGE 3 — Product Detail

```
Design a product detail page for GlowUp Beauty. Same colour system.
Example: "Baobab Brightening Serum · 30ml · ₵189"

1. HEADER — same sticky header.
2. BREADCRUMB — "Skincare / Serums / Baobab Brightening Serum" 12px warm-brown.

3. PRODUCT MAIN — 55/45 split.
   LEFT 55%: image area, white background, square container.
   Main image fills 85% of area. 5 thumbnails below in a row — 1px border, no radius.
   Active thumbnail: espresso border.

   RIGHT 45%: sticky info column.
   Category label: "Serum" 11px uppercase warm-brown.
   Product name H1: display serif 34px. Subline: "30ml · For all skin types" 14px warm-brown.
   Divider: 1px #e5d5c5.
   Price: ₵189 weight-700 26px. "In Stock" small pill: burnt sienna text, no background fill, 1px border.
   Size selector: "Size" label 11px uppercase. 3 pills: "15ml · ₵99" / "30ml · ₵189 ✓" / "60ml · ₵349"
   Selected: filled espresso. Others: outlined.
   Quantity: "− 1 +" inline, minimal.
   CTAs (stacked): "Add to Cart" — espresso fill, cream text, full-width, 48px, sharp.
   "Add to Wishlist →" — text link below, 13px burnt sienna.
   Trust row below: "Natural ingredients · No parabens · Ships in 1–2 days" — 12px, · separator.

4. DESCRIPTION + INGREDIENTS — full-width below hero section, cream background.
   Two-column tab: "How to Use" / "Ingredients" — plain text tabs, active has espresso underline.
   Content: body text 15px, generous line-height 1.7. No accordion. Text open by default.

5. RELATED PRODUCTS — "You may also like" label. 4-col grid, same card style as products page.

6. FOOTER — same.
```

---

### PAGE 4 — Checkout

```
Design a checkout page for GlowUp Beauty. Same colour system.

1. HEADER — simplified: logo only left, "Secure Checkout" 12px warm-brown + padlock right.
2. PROGRESS: "Cart → Details → Payment" same pattern as TechHub but in serif style.

3. LEFT COLUMN (60%) — form sections:
   Contact: Email, Phone. Fields: cream background, 1px border #e5d5c5, 44px height, no radius.
   Focus: border becomes espresso. Labels: 11px uppercase warm-brown above each field.
   Delivery: First + Last (2-col), Address, City, Region dropdown.
   Delivery Zone: 3 radio rows, 1px border, selected row gets espresso border.
     "Accra — Same Day — ₵15" / "Accra — Next Day — Free" / "Other Regions — ₵30"
   Discount: inline input + "Apply" button (outlined espresso).
   CTA: "Continue to Payment" — espresso fill, cream text, 52px, full-width, sharp rectangle.
   Below: "Powered by Paystack" — 12px warm-brown.

4. RIGHT COLUMN (40%) — sticky summary.
   "Your Order" 11px uppercase label. Product rows: 48px thumbnail, name + variant, quantity, price.
   Subtotal / Delivery / Discount / Total rows. Total weight-800 20px espresso.
   Below total: "30-Day Returns · No Parabens · Paystack Secured" 11px centred warm-brown.

5. No footer — minimal bottom bar: "© 2026 GlowUp Beauty · Privacy · Terms" 11px centred.
```

---

## STORE 3 — CasaNova Home (Furniture & Home Goods)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Scandinavian furniture store meets Lagos editorial aesthetic.
> Space is the product. Typography is ultra-light serif. Photography does everything.
> Reference: hay.dk, muuto.com, kinfolk.com
>
> **Anti-patterns:** No 3-feature strips. No shadow cards. No coloured backgrounds except off-white.
> No heavy bold type. No visible borders at rest — spacing separates elements.

---

### PAGE 1 — Homepage

```
Design a homepage for CasaNova Home, a furniture and home goods store for Ghanaian
homeowners aged 25–45 in Accra upgrading their living spaces. Premium, minimal.

COLOUR SYSTEM:
- Background: #ffffff
- Surface: #f7f5f2 (warm off-white for alternating sections)
- Text primary: #1c1a18 (near-black, warm undertone)
- Text secondary: #8a867f (warm grey)
- Accent: #b8955a (brass — interactive states and prices only)
- Divider: #e8e4de

TYPOGRAPHY:
- Headings: Cormorant Garamond or EB Garamond, weight 300, very light, generous leading
- Body: Inter or DM Sans, weight 400, 15px, leading 1.7, #8a867f
- Labels: Inter, 11px, weight 500, uppercase, tracking 0.14em
- Prices: tabular-nums, Inter weight 500

1. HEADER — white, 1px bottom border #e8e4de. 56px.
   Left: "CasaNova" in thin Garamond weight-300 + "HOME" in tiny 9px Inter uppercase beside it.
   Centre: "Living · Bedroom · Dining · Outdoor · Sale" — 13px, weight 400, letter-spacing 0.04em.
   Right: wishlist icon (heart outline), cart icon. Both 20px line icons, #8a867f.

2. HERO — full viewport height. Full-bleed image placeholder (warm-lit Accra interior, natural window light).
   NO overlay gradient — image must be light enough to read without one.
   Text anchored bottom-left, padding 64px. White text only.
   Tag: "New Collection — 2026" 11px uppercase brass (#b8955a).
   Headline: Garamond weight-300, 68px desktop, very tight tracking (-0.04em), 2 lines:
   "Where Comfort / Meets Craft."
   Subtext: 16px, white 70% opacity. "Thoughtfully designed furniture for modern Ghanaian homes."
   CTA: "Explore Collection" — white background, near-black text, 0 border-radius, 44px height.
   On hover: brass (#b8955a) background, white text.

3. CATEGORY ROW — white background. 5 equal-width tiles, full viewport width, no gap between tiles.
   Each tile: aspect-ratio 4:5. Image placeholder fills tile. No overlay at rest.
   Category name: Garamond weight-300, 28px, bottom-left, white. 16px padding.
   On hover: semi-transparent white overlay (opacity 0.12) reveals. Transition 200ms.
   Categories: Living Room · Bedroom · Dining · Kitchen · Outdoor

4. FEATURED COLLECTION — surface (#f7f5f2) background. Left 60%: 2×2 tight grid of products.
   Each product: image (no border, fills cell), product name Garamond 14px below, price brass 13px.
   Right 40%: vertically centred, generous padding. Tag: "The Accra Edit" 11px uppercase.
   Heading Garamond weight-300 48px: "Designed for / how you live." Body 2 sentences 15px warm-grey.
   CTA: "Shop This Collection" — 1px border #1c1a18, no fill, text near-black 13px uppercase tracking.
   On hover: fills #1c1a18, text white.

5. NEW ARRIVALS — white background. Section label 11px uppercase. 4-col grid desktop, 2-col mobile.
   Cards: no border, no shadow, white background with generous padding (24px). Image top.
   Product name Garamond 15px, material note 12px warm-grey ("Solid teak, hand-finished"),
   price Inter weight-500 14px brass. Nothing else. On hover: name becomes near-black.

6. PRESS BAR — surface background. "As Seen In" 11px label. 5 greyscale logos inline,
   evenly spaced. Logo placeholders as text in Garamond italic (publication names only).

7. FOOTER — surface (#f7f5f2). "CasaNova Home" as large Garamond weight-300 watermark text
   behind footer content. 3 columns: Shop, About, Delivery ("Delivering across Greater Accra").
   Paystack badge, social icons (line only). Bottom bar: © line 11px warm-grey.
```

---

### PAGE 2 — Products Grid

```
Same colour system. User browsed "Living Room" — 32 products shown.

1. HEADER — same.
2. TITLE — "Living Room" H1 Garamond weight-300 44px. Right: "32 products" · Sort dropdown (13px).
3. FILTERS — horizontal. Row 1: "All · Sofas · Armchairs · Coffee Tables · Shelving · Rugs"
   Row 2 (price): "All · Under ₵500 · ₵500–₵2,000 · ₵2,000+" | Row 3: "In Stock" toggle.
   Pill style: no background, 1px border #e8e4de, 13px. Active: fills #1c1a18, white text.

4. GRID — 4-col desktop, 2-col mobile. 1px gap (tight grid, no padding between).
   Cards: white background. No border. Top 60%: product image, object-cover, aspect-ratio 4:3.
   Below: product name Garamond 14px, material note 12px warm-grey, price brass weight-500.
   On hover: image brightens slightly (brightness 1.03). Price colour shifts to #1c1a18.
   No button at rest — "Add to Cart →" text link appears below price on hover only.
   Badge: "New" — small Garamond italic, brass colour, no pill/border. Just text.

5. LOAD MORE — centred, 1px border #1c1a18, "Load more" text 13px uppercase tracking, sharp rect.

6. FOOTER — same.
```

---

### PAGE 3 — Product Detail

```
Same colour system. Example: "Kente Lounge Chair · Teak & Linen · ₵1,850"

1. HEADER same. Breadcrumb: "Living Room / Armchairs / Kente Lounge Chair" 12px warm-grey.

2. PRODUCT MAIN — 60/40 split.
   LEFT 60%: image area white. Main image nearly full column width, large, no border.
   4 thumbnails below in a row, no border at rest, 1px #e8e4de border on active.

   RIGHT 40%: sticky. Material tag: "Teak & Linen" 11px uppercase warm-grey.
   H1 Garamond weight-300 38px, tight tracking. Subline: "Handcrafted, locally sourced" 14px warm-grey.
   Divider 1px. Price: ₵1,850 weight-500 Inter 24px brass.
   "In Stock" — text only, 12px warm-grey. No pill.
   Finish/colour selector: "Finish" label 11px. 3 text options inline (not swatches):
   "Natural Teak" / "Dark Walnut" / "Ebony" — plain text pills, outlined at rest.
   Quantity: "− 1 +" minimal inline.
   CTAs: "Add to Cart" 1px border #1c1a18, no fill, sharp, 48px. On hover: fills dark.
   "Buy Now" — dark fill, white text. Stacked order: Buy Now primary, Add to Cart secondary.
   Trust line: "Free assembly in Accra · 30-day returns · 2-year warranty" 12px warm-grey.

3. DIMENSIONS + CARE TABLE — full-width surface section.
   Tab: "Dimensions" / "Materials" / "Care". Plain text tabs, active underlined brass.
   Specs in 2-col table: 1px bottom border rows, alternating white/surface.

4. RELATED — "Complete the room" label. 4-col tight grid, same card style as products page.

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colour system. Garamond headings, Inter body.

1. HEADER — "CasaNova HOME" thin serif left + "Secure Checkout" 12px warm-grey right.
2. PROGRESS — Cart → Details → Payment. Thin 1px line connecting steps, Garamond labels.

3. LEFT COLUMN (60%): same form structure as other stores.
   Fields: white background, 1px #e8e4de border, 44px, no radius. Focus: #1c1a18 border.
   Labels: 11px uppercase warm-grey above fields.
   Delivery zones: 3 rows. Selected: 1px #1c1a18 border.
   Discount: inline input + "Apply" 1px border button.
   CTA: "Continue to Payment" — #1c1a18 fill, white text, 52px, full-width, sharp.

4. RIGHT COLUMN (40%): "Order Summary" 11px uppercase.
   Product rows: 48px image, name, qty, price. Totals rows. Final total Garamond weight-400 22px.
   Below: "Free Assembly in Accra · Paystack Secured · 30-Day Returns" 11px warm-grey centred.

5. No footer. Bottom bar: "© 2026 CasaNova Home · Privacy · Terms" 11px warm-grey centred.
```

---

## STORE 4 — QuickDose Pharmacy (Health & Pharmacy)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Utility-first, clinical, immediate. Think Boots.com or iHerb but cleaner.
> Search is the primary interface. White everywhere. Teal only for functional elements.
> Reference: boots.com, lloydspharmacy.com, iherb.com
>
> **Anti-patterns:** No 3-step "How It Works" icon rows. No blob backgrounds.
> No green/mint as a decorative fill. Search must be front-and-centre on every page.

---

### PAGE 1 — Homepage

```
Design a homepage for QuickDose, an online pharmacy delivering medicines and health products
to Ghanaian families in Accra. Utility-first: fast, trustworthy, clear.

COLOUR SYSTEM:
- Background: #ffffff
- Surface: #f4fbfb (very pale teal tint — barely visible)
- Text primary: #0f2830 (very dark teal-black)
- Text secondary: #587a82
- Accent: #006f7f (deep teal — buttons, links, active states)
- Accent light: #e6f6f8 (pale teal for badges, backgrounds)
- Error/Rx: #d32f2f

TYPOGRAPHY: DM Sans throughout.
- Headings: weight 700, tight tracking
- Body: weight 400, 15px, leading 1.6
- Labels: 11px, weight 600, uppercase, tracking 0.1em

1. HEADER — white, 1px bottom border #d0e8eb, 64px (taller than others — search is prominent).
   Left: "QuickDose" wordmark weight-700 teal (#006f7f) + small pill icon.
   Centre: FULL search bar spanning 40% of header width. "Search medicines, vitamins, brands..."
   1px border #d0e8eb, teal focus ring, 40px height. Search button: teal fill, white magnifier.
   Right: "My Orders" text link 13px, cart icon with badge, "Rx Upload" text link.

2. HERO — NOT full viewport height. 380px desktop. Split layout.
   LEFT 55%: teal background (#006f7f). Generous padding.
   H1 weight-700 40px white: "Your Pharmacy, Delivered in Hours."
   Body 15px white 80%: "Genuine medicines, vitamins, essentials — same-day in Accra."
   Second search bar for product search (same style as header but white background on teal).
   Below: 4 trust items inline, 12px white 70%: "Licensed · Genuine Products · Discreet · Rx Accepted"

   RIGHT 45%: white background. "Upload Prescription" widget.
   Dashed 2px border #d0e8eb, 160px height, centred. Camera icon 32px teal. "Upload Prescription"
   14px weight-600 #0f2830 below icon. "Or browse without one" 12px #587a82.
   Below widget: "Call us: +233 XX XXX XXXX" 13px teal link.

3. CATEGORY GRID — white background. 6 items, 3×2 compact grid.
   Cards: white, 1px border #d0e8eb, 12px padding, rounded-sm (6px).
   Category name weight-600 14px, product count 12px teal below. No images — type only.
   On hover: background #e6f6f8, border teal.
   Categories: Pain Relief · Vitamins · Cold & Flu · Baby Care · Personal Care · Sexual Health

4. DEALS STRIP — surface (#f4fbfb) background. Label "Today's Deals" 11px uppercase + countdown timer right.
   Horizontal scroll of 5 product cards: white, 1px border, 120px wide.
   Card: product image top (square, 80px), name 12px weight-600, was/now price.
   "Shop All Deals →" text link teal at far right.

5. FEATURED PRODUCTS — "Essentials for Every Home" label. 4-col desktop, 2-col mobile.
   Cards: white, 1px border #d0e8eb, 8px radius. Product image, name weight-600 14px,
   brand + pack size 12px #587a82, price teal weight-700.
   "Rx Required" badge: small red pill top-right corner if applicable.
   On hover: "Add to Cart" teal button slides up from card bottom, 36px height, full card width.

6. PHARMACIST BANNER — teal (#006f7f) background, 80px height.
   "Have a question? Chat with our pharmacist." white text weight-600. Right: "Message Us" white
   outlined button with WhatsApp icon. Right-aligned.

7. FOOTER — white, 1px top border. QuickDose logo teal. 4 columns: Medicines, Personal Care,
   Help, Legal. "Licensed by Ghana FDA". Paystack badge. "Same-day Accra · Next-day nationwide."
```

---

### PAGE 2 — Products Grid

```
Same colours. User browsed "Vitamins" — 48 products.

1. HEADER same (search bar pre-filled with "Vitamins").
2. TITLE — "Vitamins" H1 weight-700 36px. "48 products" pill + "Sort ▾" right.
3. FILTERS — horizontal. Row 1: "All · Multivitamins · Vitamin C · Vitamin D · B Complex · Iron · Zinc"
   Row 2: "All Brands · Berocca · Centrum · Seven Seas · Nature's Own"
   Pill style: white, 1px border #d0e8eb, 12px, rounded-full. Active: teal fill, white text.

4. GRID — 4-col desktop, 2-col mobile. Cards: white, 1px border #d0e8eb, 8px radius.
   Image (square, object-contain, white bg). Name weight-600 14px, brand 12px grey,
   pack size 12px grey, price teal weight-700 16px. "Rx Required" red badge top-right if needed.
   At rest: no CTA. On hover: border turns teal, "Add to Cart" bar slides up from bottom.

5. LOAD MORE button, centred, teal outlined.
6. FOOTER same.
```

---

### PAGE 3 — Product Detail

```
Same colours. Example: "Vitamin C 1000mg · 60 Tablets · Nature's Own · ₵49"

1. HEADER same. Breadcrumb: "Vitamins / Vitamin C / Nature's Own 1000mg" 12px grey.

2. PRODUCT MAIN — 50/50 split.
   LEFT: product image large, white bg, square. 4 angle thumbnails below.
   RIGHT: sticky. Brand: "Nature's Own" 11px uppercase teal.
   H1 weight-700 28px. Subline: "60 Tablets · Vitamin C 1000mg" 14px grey.
   Price: ₵49 weight-700 24px teal. "In Stock" green text 12px.
   Pack size selector: "30 Tabs · ₵29" / "60 Tabs · ₵49 ✓" / "120 Tabs · ₵89" — outlined pills.
   Quantity: − 1 + inline minimal.
   CTAs: "Add to Cart" teal fill, white, full-width 48px, 6px radius.
   "Subscribe & Save 10%" outlined teal below.
   Trust: "Genuine · Licensed Pharmacy · Discreet Packing" 12px grey separator ·

3. DESCRIPTION TABLE — white. Tabs: "About" / "Dosage" / "Ingredients". Active tab: teal underline.
   Content as body text 15px. No accordion.

4. RELATED — "Frequently bought together" label. 4-col grid same card style.

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Utility-focused: fastest path to payment.

1. HEADER — QuickDose logo teal left. "Secure Checkout 🔒" right 12px grey.
2. PROGRESS — Cart → Details → Payment. Teal active step.

3. LEFT COLUMN (60%): DM Sans forms.
   Fields: 1px border #d0e8eb, 44px, 6px radius. Teal focus border. 15px text.
   Labels weight-600 12px uppercase #587a82.
   Delivery zones: 3 rows. Selected: 1px teal border, teal radio fill.
     "Accra Same Day (before 2pm) — ₵15" / "Accra Next Day — Free" / "Other Regions — ₵30"
   Discount: inline + "Apply" teal button.
   CTA: "Continue to Payment" teal fill, white, 52px full-width, 6px radius.
   "Powered by Paystack" greyscale badge below.

4. RIGHT COLUMN (40%): "Order Summary" label weight-600.
   Product rows: 48px thumbnail, name, qty, price. Totals rows. Total weight-700 20px teal.
   Below: "Licensed Pharmacy · Genuine Products · Paystack Secured" 11px grey centred.

5. No footer. Bottom bar: "© 2026 QuickDose · Privacy · Terms · Ghana FDA Licensed" 11px grey.
```

---

## STORE 5 — Chop Chop (Food Delivery)
### 4-page set: Homepage · Menu Grid · Dish Detail · Checkout

> **Design direction:** Dark, immediate, appetite-first. Photography dominates every surface.
> Think the visual energy of Nando's.com mixed with a premium Accra street food brand.
> Reference: nandos.com, dishoom.com (for food photography approach)
>
> **Anti-patterns:** No pastel. No generic food emoji headers. No 3-step "How It Works" strips.
> No white-background product cards on the menu — images must be full-bleed.

---

### PAGE 1 — Homepage

```
Design a homepage for Chop Chop, a Ghanaian food delivery service for urban professionals
in Accra who want authentic local food fast. Bold, dark, and food-photography-first.

COLOUR SYSTEM:
- Background: #111111 (near-black)
- Surface: #1c1c1c (card surface)
- Text primary: #f5f0eb (warm off-white)
- Text secondary: #9a9590
- Accent: #e63946 (red — primary CTAs only)
- Highlight: #ffd166 (yellow — prices and secondary highlights)
- Border: #2a2a2a

TYPOGRAPHY:
- Headings: "Poppins" or "Syne", weight 800–900, very tight tracking
- Body: Poppins weight 400, 15px
- Labels: 11px, weight 700, uppercase, tracking 0.14em, #9a9590

1. HEADER — #111111, 1px border #2a2a2a. 60px.
   Left: "Chop Chop" weight-900 warm off-white + small flame icon (SVG line, red).
   Centre: "Delivering to: Accra CBD ▼" pill — 13px, 1px border #2a2a2a, rounded-full.
   Right: cart icon (red badge), "Order Now" red filled button 36px height weight-700 uppercase.

2. HERO — full viewport height, #111111 background.
   Text left-aligned, max-width 560px, vertically centred, left padding 80px.
   Tag: "Now Delivering · Accra CBD" 11px uppercase red.
   Headline Poppins weight-900: "Authentic / Ghanaian Food / In 30 Minutes." — 72px desktop.
   "30 Minutes." underlined in red (CSS text-decoration, not a box).
   Body 16px off-white 70%: "Jollof, waakye, banku, kelewele — straight from the kitchen."
   CTAs: "Order Now" red fill + "See Full Menu" outlined warm off-white. Side by side, 44px height.

   Right side (absolute positioned, right 8% top 50% translate-y-50%): 3 food photography cards
   stacked at organic angles. Each card: dark surface (#1c1c1c), food photo top half,
   dish name + price in yellow (₵) bottom half, 12px padding. No border. Slight rotation:
   top card 3deg, middle 0deg, bottom -2deg.

3. DELIVERY STRIP — yellow (#ffd166) background, 40px height.
   "📍 Accra CBD · 25–45 min delivery · Free over ₵50 · Open 8am–10pm daily" black text 13px weight-700.

4. FOOD TYPE CHIPS — dark background. Label "What are you having?" 11px uppercase.
   Horizontal scroll chips: Jollof & Rice · Waakye · Grills · Soups · Kelewele · Drinks · Desserts.
   At rest: 1px border #2a2a2a, dark bg, off-white text 13px. On hover/active: red fill, white text.

5. POPULAR DISHES — "Most Ordered Right Now" label. 3×2 grid desktop, 1-col mobile.
   Cards: full-bleed food photography, aspect-ratio 3:2.
   Dark gradient overlay (bottom 50%): dish name white weight-700 18px, restaurant name 12px #9a9590,
   price yellow weight-700 14px — all bottom-left. "🔥" badge top-right on top 2 items (11px only).
   On hover: overlay darkens 10%. "Order Now →" text slides up from bottom.

6. FOOTER — #111111. "Chop Chop" wordmark. "Delivering across East Legon, Osu, Cantonments,
   Labone, Tema, Achimota." Social: Instagram, X, WhatsApp — line icons warm off-white.
   Paystack badge greyscale. "Open daily 8am–10pm · +233 XX XXX XXXX"
```

---

### PAGE 2 — Menu Grid (All Dishes)

```
Same colour system. Shows all available dishes across categories.

1. HEADER same. Location pill + cart + "Order Now".
2. TITLE — "Our Menu" H1 Poppins weight-900 40px warm off-white. Breadcrumb not needed.
   Right: "47 dishes available" + "Sort: Popular ▾" in off-white.

3. CATEGORY FILTER — dark bg. Horizontal chips (same style as homepage):
   "All · Jollof & Rice · Waakye · Grills · Soups · Starters · Drinks · Desserts"
   Active chip: red fill.

4. DISH GRID — 3-col desktop, 2-col tablet, 1-col mobile.
   Cards: #1c1c1c background, no border.
   Top 55%: full-bleed food photo, aspect-ratio 16:9.
   Bottom 45%: 16px padding. Dish name weight-700 15px off-white. Restaurant name 12px #9a9590.
   Price yellow weight-700 15px. Delivery time estimate: "25 min" small grey.
   On hover: red "Add to Order →" bar slides up from card bottom, 36px, full-width.

5. LOAD MORE — outlined off-white button, sharp rectangle, centred.
6. FOOTER same.
```

---

### PAGE 3 — Dish Detail

```
Same colours. Example: "Jollof Rice & Grilled Chicken · ₵65"

1. HEADER same. Breadcrumb: "Menu / Grills / Jollof Rice & Grilled Chicken" 12px #9a9590.

2. PRODUCT MAIN — 55/45 split.
   LEFT 55%: full-bleed food photography, aspect-ratio 4:3, fills column. No border.
   Thumbnail strip below: 4 angle photos, 1px #2a2a2a border, no radius. Active: red border.

   RIGHT 45%: sticky, dark bg, generous padding.
   Restaurant tag: "By KitchenMax Accra" 11px uppercase red.
   H1 Poppins weight-800 28px off-white. Subline: "Served with fried plantain" 14px #9a9590.
   Delivery time pill: "~30 min" — 1px border #2a2a2a, 12px.
   Price: ₵65 yellow weight-700 24px.
   Extras/variants: "Add extras" label 11px uppercase. 3-4 checkboxes inline:
   "Extra protein +₵15" / "Extra rice +₵10" / "Add drink +₵20" — 1px border rows, dark bg.
   Quantity: − 1 +. CTAs: "Add to Order — ₵65" red fill, white, full-width 52px, sharp rect.
   Below: "Prepared fresh · Delivered hot · Paystack secured" 12px #9a9590 · separator.

3. MORE FROM THIS RESTAURANT — "Other dishes by KitchenMax" label. 3-col grid same card style.

4. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Dark theme maintained through checkout.

1. HEADER — "Chop Chop" left + "Secure Checkout 🔒" off-white right 12px.
2. PROGRESS — Cart → Details → Payment. Red active step. Steps in off-white.

3. LEFT COLUMN (60%): dark bg (#111111). Form fields:
   Background #1c1c1c, 1px border #2a2a2a, 44px, no radius. Off-white text. Focus: red border.
   Labels: 11px uppercase #9a9590.
   Delivery address: First + Last, Address, Area of Accra (dropdown with neighbourhood list).
   Delivery Zone: 3 rows same pattern — selected row gets red border.
     "Accra CBD — 25 min — ₵15" / "Osu/Labone — 35 min — ₵20" / "Tema/Achimota — 45 min — ₵30"
   Special instructions: textarea, 80px, same field style. Label: "Any instructions for the kitchen?"
   Discount: inline + "Apply" red button.
   CTA: "Continue to Payment" red fill, white weight-700, 52px full-width, sharp.
   "Powered by Paystack" greyscale badge below.

4. RIGHT COLUMN (40%): #1c1c1c, 1px border #2a2a2a. "Your Order" 11px uppercase off-white.
   Dish rows: 48px food photo, name, qty, price in yellow. Totals rows. Total yellow weight-700 20px.
   Below: "Prepared fresh · Delivered hot · Paystack Secured" 11px #9a9590 centred.

5. No footer. Bottom bar #111111: "© 2026 Chop Chop · Privacy · Terms" 11px #9a9590 centred.
```

---

## STORE 6 — Ananse Crafts (Artisan Gifts)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Global artisan marketplace. Think Etsy editorial meets African textile brand.
> Parchment and terracotta. Every product card credits its maker. Storytelling is the product.
> Reference: etsy.com/editorial, wildandthemouth.com, uncommongoods.com
>
> **Anti-patterns:** No symmetrical grids — masonry/irregular preferred. No generic 5-star reviews.
> No cold greys. Artisan attribution mandatory on every product.

---

### PAGE 1 — Homepage

```
Design a homepage for Ananse Crafts, a Ghanaian artisan marketplace targeting diaspora
Ghanaians and international buyers wanting authentic handmade Ghanaian goods.

COLOUR SYSTEM:
- Background: #fdf6ee (warm parchment)
- Surface: #f5ead8 (slightly deeper parchment)
- Text primary: #2d1a0e (dark espresso)
- Text secondary: #8b6340 (warm terracotta-brown)
- Accent: #7a2f1c (deep terracotta — interactive states only)
- Gold: #e8a020 (kente gold — prices, badges)
- Border: #dcc9a8

TYPOGRAPHY:
- Headings: Lora or Libre Baskerville, weight 400–600, generous leading
- Body: Source Sans Pro or DM Sans, 15px, #8b6340, leading 1.7
- Labels: 11px, uppercase, tracking 0.14em, weight 600, #8b6340
- Prices: tabular-nums weight-600, shown in both ₵ and USD

1. HEADER — parchment bg, 1px border #dcc9a8. 60px.
   Left: "Ananse" serif italic espresso + "CRAFTS" small caps beside it + small spider web SVG icon.
   Centre: "Kente · Sculptures · Jewellery · Home Décor · Gift Sets" — 13px, #8b6340.
   Right: "Made in Ghana 🇬🇭" 11px uppercase + cart icon + search icon.

2. HERO — full viewport height. Parchment background with a very subtle paper texture (noise overlay, opacity 0.04).
   Centred layout, max-width 700px, vertically centred. No image — typography IS the hero.
   Tag: "Handmade · Ethically Sourced · Ships Worldwide" 11px uppercase terracotta (#7a2f1c) tracking-wide.
   Headline Lora serif 64px weight-600: "Gifts That / Tell a Story." — tight leading.
   Body 16px #8b6340: "Authentic Ghanaian craftsmanship — kente, wood carvings, beaded jewellery.
   Delivered worldwide."
   CTAs side by side: "Shop Gifts" — terracotta fill, parchment text, sharp rectangle.
   "Meet the Artisans" — 1px border #7a2f1c, no fill, terracotta text.
   Below CTAs: 5 circular artisan avatar placeholders in a row, overlapping slightly.
   Beneath each: "By Kofi" / "By Ama" / "By Kweku" etc in 10px italic.

3. CATEGORY MASONRY — 5 categories in a CSS masonry grid (not uniform rows).
   First category (Kente Fabric) spans 2 rows of height. Others are normal height.
   Cards: image fill, category label large Lora weight-300 italic bottom-left, parchment text 28px.
   No overlay at rest. On hover: semi-transparent surface (#f5ead8 at 60%) appears. Transition 200ms.

4. TRUST BAR — surface (#f5ead8). "As Featured In" 11px uppercase.
   5 publication names in Lora italic, greyscale, evenly spaced: BBC Africa · CNN Travel ·
   Design Indaba · Afripop Magazine · Etsy Featured

5. FEATURED PRODUCTS — parchment bg. Label "Top Picks This Week" 11px uppercase.
   4-col desktop, 2-col mobile. Cards: parchment bg, 1px border #dcc9a8, no shadow, no radius.
   Product image top. Below: artisan credit "By Kweku Mensah" 11px terracotta uppercase.
   Product name Lora 14px espresso. Price: ₵299 gold + "≈ $25 USD" 11px #8b6340 beside it.
   On hover: border becomes terracotta. "Add to Cart →" text link fades in below price.

6. ARTISAN STORY — full-width section. Left 50%: large warm image placeholder (artisan at work).
   Right 50%: surface bg, vertically centred, generous padding.
   Heading Lora 36px: "Made by hand. / Owned by the maker."
   Body: "Every piece is handcrafted by a skilled artisan in Ghana. 85% of every sale goes directly
   to the maker." CTA: "Meet Our Artisans →" text link, terracotta, underline draws in.

7. GIFT BOX BANNER — gold (#e8a020) background.
   "Build a Custom Gift Box" heading Lora 28px espresso.
   Subtext: "Perfect for birthdays, weddings, and diaspora gifts." Body 14px espresso.
   CTA: "Start Building" terracotta outlined button.

8. FOOTER — espresso (#2d1a0e). Ananse Crafts logo parchment.
   "Ships from Accra · Worldwide delivery · 7–14 days international."
   Columns: Shop, About, Shipping. Paystack + DHL placeholders. Social: Instagram, Etsy icon.
```

---

### PAGE 2 — Products Grid

```
Same colours. User browsed "Kente Fabric" — 28 products.

1. HEADER same. 2. TITLE — "Kente Fabric" Lora serif 40px espresso.
3. FILTERS — horizontal. Row 1: "All · Kente Cloth · Kente Bags · Kente Accessories · Custom"
   Row 2 (ship to): "Ships Worldwide · Ships to USA · Ships to UK · Ships to EU"
   Pill style: 1px border #dcc9a8, parchment bg, 13px Lora. Active: terracotta fill, parchment text.

4. GRID — 3-col desktop (artisan goods suit portrait aspect ratios), 2-col mobile.
   Cards: parchment bg. Image aspect-ratio 3:4. Below: artisan credit 11px terracotta,
   product name Lora 14px, price gold + USD equivalent. No button at rest.
   On hover: 1px terracotta border. "Add to Cart →" text link appears.

5. LOAD MORE — terracotta outlined button, Lora italic.
6. FOOTER same.
```

---

### PAGE 3 — Product Detail

```
Same colours. Example: "Kente Stole · Hand-woven · By Ama Asante · ₵350 ≈ $30 USD"

1. HEADER same. Breadcrumb: "Kente / Kente Fabric / Kente Stole" 12px #8b6340.

2. PRODUCT MAIN — 55/45 split.
   LEFT 55%: large image, parchment bg. Aspect-ratio 3:4. 3 thumbnails below horizontal row.

   RIGHT 45%: sticky. "Kente Fabric" 11px uppercase terracotta.
   H1 Lora weight-600 32px espresso. Artisan: "Hand-woven by Ama Asante, Kumasi" 13px italic #8b6340.
   Divider 1px. Price: ₵350 gold weight-600 22px + "≈ $30 USD" 14px #8b6340 beside it.
   "In Stock — Ships within 3–5 days" 12px #8b6340.
   Colour/pattern selector: "Pattern" label 11px uppercase. 3 text options in outlined pills:
   "Classic" / "Ashanti Blue" / "Modern Mix". Selected: terracotta fill.
   Quantity: − 1 +. CTAs: "Add to Cart" terracotta fill, parchment text, full-width 48px, sharp.
   "Add to Gift Box →" text link below, gold colour.
   Trust: "Handmade in Ghana · 85% to maker · Worldwide shipping" 12px #8b6340 · separator.

3. STORY + CARE — Lora italic tabs: "About This Piece" / "Care Instructions" / "Shipping."
   Content as body text — no accordion. Default tab: About.

4. RELATED — "More by Ama Asante" label. 3-col grid same card style.

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Parchment, warm, non-clinical.

1. HEADER — "Ananse Crafts" serif left + "Secure Checkout" 12px #8b6340 right.
2. PROGRESS — Cart → Details → Payment. Terracotta active step. Lora labels.

3. LEFT COLUMN (60%): parchment bg. Fields: 1px border #dcc9a8, 44px, no radius.
   Focus: terracotta border. Labels: 11px uppercase #8b6340.
   Delivery address + Region. International shipping option.
   Delivery Zone: "Standard — 7–14 days — ₵0 / Free" / "Express — 5–7 days — ₵80"
   Discount: inline + "Apply" outlined terracotta.
   CTA: "Continue to Payment" terracotta fill, parchment text, 52px, full-width.
   "Powered by Paystack" greyscale badge.

4. RIGHT COLUMN (40%): surface bg, 1px border #dcc9a8. "Your Order" Lora 11px uppercase.
   Product rows: 48px image, artisan credit 10px terracotta, name, qty, price gold.
   Total Lora weight-600 22px. Below: "Handmade in Ghana · Worldwide Shipping · Paystack Secured" 11px centred.

5. No footer. Bottom bar parchment: "© 2026 Ananse Crafts · Privacy · Terms" 11px #8b6340 centred.
```

---

## STORE 7 — KiddiZone (Children's Clothing & Toys)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Joyful but considered. Think Stokke meets a premium Accra kids brand.
> Colourful but not chaotic. Rounded and friendly. Age-labelling is a design requirement.
> Reference: stokke.com, melijoe.com, minnow.com
>
> **Anti-patterns:** No generic emoji-heavy designs. No low-contrast pastels. No 5-star carousels.
> No decorative blob shapes. Confetti/stars: sparse SVGs only, not filler.

---

### PAGE 1 — Homepage

```
Design a homepage for KiddiZone, a children's clothing and toys store for Ghanaian parents
of kids aged 0–12 in Accra and Kumasi. Joyful, safe, trustworthy.

COLOUR SYSTEM:
- Background: #fffcf7 (warm white, barely tinted)
- Surface: #fff0e8 (soft peach for alternating sections)
- Text primary: #1a1a1a
- Text secondary: #787878
- Accent: #e85d3a (warm coral — primary CTAs only)
- Secondary accent: #29b0a0 (teal/turquoise — secondary CTAs and age badges)
- Highlight: #f8c630 (sunny yellow — sale badges, deal strips)
- Border: #ead8ce

TYPOGRAPHY:
- Headings: Nunito or Fredoka, weight 700–800, rounded feel
- Body: Nunito weight 400, 15px, leading 1.65
- Labels: 11px, weight 700, uppercase, tracking 0.1em
- Age badges: Nunito weight-700, rounded-full pills

1. HEADER — white, 1px border #ead8ce. 60px.
   Left: "KiddiZone" Nunito weight-800 coral (#e85d3a) + star icon (⭐ SVG line, not filled).
   Centre: "Babies · Toddlers · Kids · Toys · Back to School" 14px weight-600.
   Right: cart icon with badge, "Gift Wrapping" 12px teal text link.

2. HERO — full viewport height. Split 50/50.
   LEFT 50%: coral (#e85d3a) background. Generous padding, text vertically centred.
   Headline Nunito weight-800 56px white: "Fun Starts / Here." — tight leading.
   Body 15px white 85%: "Safe, colourful clothes and toys for every age — delivered across Ghana."
   CTAs: "Shop Clothes" white fill, coral text, 44px, rounded-full.
   "Browse Toys" teal fill, white text, rounded-full, same height. Side by side.
   Trust row below: "100% Safe · Age Verified · Free Gift Wrap" 12px white 70%, · separator.

   RIGHT 50%: teal (#29b0a0) background. 3 product "floating cards" at organic positions.
   Each card: white, rounded-xl (16px), product image top, name + age label + price bottom, 12px padding.
   Small confetti SVG shapes (triangles, circles) scattered sparingly — max 8 shapes, all <12px.

3. AGE GROUP TILES — white background. 4 tiles full-width, equal width. No gap between tiles.
   Each tile: 200px height, alternating background (surface peach / teal / yellow / coral).
   Category name Nunito weight-800 24px white, centred vertically. Age range below 14px white 70%.
   Categories: "Baby" (0–2) · "Toddler" (3–5) · "Kids" (6–12) · "Teens"
   Tiles rounded-none (block tiles). On hover: slight scale(1.02) on tile.

4. BEST SELLERS — "Kids are loving this" label. 4-col desktop, 2-col mobile.
   Cards: white, rounded-xl (12px), no shadow, 1px border #ead8ce.
   Image top 58%, rounded-t-xl. Below: age badge (teal pill, "Age 4–8"), product name weight-700 14px,
   category 12px #787878, price coral weight-700 15px.
   On hover: coral border 1px. "Add to Cart" coral button slides up from bottom, rounded-b-xl, 36px.

5. DEALS STRIP — yellow (#f8c630) background, 72px. Countdown timer right.
   "🎁 This Week's Deals — Up to 30% Off" heading Nunito weight-800 18px #1a1a1a. Centred.

6. SAFETY STRIP — teal (#29b0a0) background. 3 items text-only inline, white, Nunito weight-700:
   "CE Certified Toys · No Toxic Materials · Age-Verified" — · separator. 16px. Centred. 60px height.

7. FOOTER — white, 1px top #ead8ce. KiddiZone logo. 3 columns: Shop, Age Groups, Help.
   "Delivering across Accra & Kumasi." Paystack badge. Social: Instagram, Facebook.
```

---

### PAGE 2 — Products Grid

```
Same colours. User browsed "Toys" — 36 products.

1. HEADER same. 2. TITLE — "Toys" H1 Nunito weight-800 40px.
   Right: "36 products" teal pill + "Sort ▾".

3. FILTERS — Row 1: "All · Educational · Outdoor · Creative · Building · Dolls & Figures"
   Row 2: "All Ages · 0–2 · 3–5 · 6–12" (age range filter is critical here)
   Pill style: white, 1px border #ead8ce, 13px Nunito, rounded-full.
   Active: coral fill, white text.

4. GRID — 4-col desktop, 2-col mobile. Cards same as homepage bestsellers.
   Age badge MANDATORY on every card.
   Safety badge "CE Certified" small teal pill on eligible items.
   On hover: coral border + "Add to Cart" bar slides up.

5. LOAD MORE — coral outlined button, rounded-full, Nunito weight-700.
6. FOOTER same.
```

---

### PAGE 3 — Product Detail

```
Same colours. Example: "Junior Lego Set · Ages 5–8 · 120 Pieces · ₵189"

1. HEADER same. Breadcrumb: "Toys / Building / Junior Lego Set" 12px grey.

2. PRODUCT MAIN — 55/45 split.
   LEFT 55%: white bg, image large. 4 angle thumbnails below horizontal, rounded-sm border.

   RIGHT 45%: sticky. Age badge large at top: "Ages 5–8" teal pill, Nunito weight-700 14px.
   H1 Nunito weight-800 28px. Subline: "120 Pieces · Creative Building" 14px grey.
   Price: ₵189 coral weight-700 24px. "In Stock" green text 13px.
   Colour/variant if applicable: text pills outlined, coral on active.
   Quantity: − 1 + coral plus/minus icons.
   CTAs: "Add to Cart" coral fill, white, rounded-full, full-width 52px.
   "Add to Gift Box" outlined teal, rounded-full, full-width below.
   Safety: "CE Certified · Non-toxic · Age verified for 5–8" 12px grey · separator.

3. DESCRIPTION + SAFETY — Tabs: "About" / "Safety Info" / "What's In The Box".
   Safety tab shows CE badge prominently. No accordion.

4. RELATED — "Kids also liked" label. 4-col grid same card style (age badges mandatory).

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Friendly and reassuring tone maintained.

1. HEADER — "KiddiZone" coral left + "Secure Checkout 🔒" grey right 12px.
2. PROGRESS — Cart → Details → Payment. Coral active step.

3. LEFT COLUMN (60%): white bg. Fields: 1px #ead8ce border, 44px, rounded-sm.
   Focus: coral border. Coral focus ring subtle (box-shadow 0 0 0 2px rgba(232,93,58,0.15)).
   Labels: 11px uppercase #787878.
   Address fields standard. Delivery Zone:
     "Accra — Same Day — ₵15" / "Kumasi — Next Day — ₵25" / "Other Regions — ₵35"
   Discount: inline + "Apply" coral button.
   Gift wrapping toggle (unique to this store): "Add gift wrapping +₵10" checkbox with bow icon.
   CTA: "Continue to Payment" coral fill, white weight-800, rounded-full, 52px full-width.
   "Powered by Paystack" greyscale badge.

4. RIGHT COLUMN (40%): surface peach bg, 1px border #ead8ce, rounded-xl.
   "Your Order" label. Product rows: 48px image (rounded-sm), name, age badge 10px teal, qty, price.
   Totals + gift wrap if selected. Total coral weight-800 20px.
   Below: "Safe Materials · Age Verified · Paystack Secured" 11px grey centred.

5. No footer. "© 2026 KiddiZone · Privacy · Terms" 11px grey centred.
```

---

## STORE 8 — AutoPlus GH (Auto Parts)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Industrial utility. Think AutoZone.com but tighter and less cluttered.
> Condensed bold headings. Dark/grey palette. Orange-red reserved exclusively for action.
> Compatibility data (vehicle fit info) is a first-class design element.
> Reference: autozone.com, eurocarparts.com, gates.com
>
> **Anti-patterns:** No rounded cards. No lifestyle photography. No decorative illustrations.
> No 3-column icon features. Part numbers must always be visible and in monospace.

---

### PAGE 1 — Homepage

```
Design a homepage for AutoPlus GH, an automotive parts store targeting Ghanaian car owners
and mechanics in Accra, Tema, and Kumasi. Industrial, utilitarian, no-nonsense.

COLOUR SYSTEM:
- Background: #f2f2f2 (light industrial grey)
- Surface: #ffffff
- Dark: #111111
- Text primary: #111111
- Text secondary: #666666
- Accent: #d63000 (deep orange-red — single CTA colour only)
- Border: #d0d0d0

TYPOGRAPHY:
- Headings: Barlow Condensed or Oswald, weight 700, uppercase, tight tracking
- Body: Inter or Roboto, weight 400, 14px
- Part numbers: JetBrains Mono or monospace, 12px, #666666
- Labels: Inter 11px weight-600 uppercase

1. HEADER — #111111, 56px. No bottom border needed (dark bg provides separation.
   Left: "AutoPlus GH" Barlow Condensed weight-700 24px white + wrench SVG icon orange-red.
   Centre: full search bar 45% width. "Search by make, model, part number..."
   Dark surface (#1c1c1c) bg, 1px #333333 border, white text, 40px height.
   Search button orange-red.
   Right: cart icon white, "My Account" 13px white.

2. HERO — full viewport height, #111111 background. Left column 55%.
   Tag: "Ghana's Genuine Parts Source" 11px uppercase orange-red, tracking-wide.
   Headline Barlow Condensed weight-700 72px uppercase white:
   "THE PART / YOU NEED. / DELIVERED / TODAY."
   Orange-red on "TODAY." (color change only — no underline, no box).
   Body Inter 15px #999999: "Genuine parts for Toyota, Hyundai, Kia, Ford, Nissan — across Ghana."
   CTAs: "Find My Part" orange-red fill, white, sharp rectangle 44px.
   "Browse Catalogue" 1px #666666 border, white text, same height. Side by side.

   Right 45%: single product card floating, dark surface (#1c1c1c) bg, no border.
   Product image white bg inset (80×80px square). Part number in monospace 11px #666666.
   Product name weight-600 15px white. "In Stock" orange-red dot + text 12px.
   Price weight-700 18px white. Delivery: "Accra: Today by 5pm" 12px #999999.

3. VEHICLE FINDER — white surface (#ffffff) background. "Find parts for your car" weight-700 18px.
   3 dropdowns in a row: Make → Model → Year. Each: 1px border #d0d0d0, 44px, no radius.
   "Find Parts" button orange-red fill, full 30% width, sharp rectangle, 44px.
   Dropdowns: Make (Toyota, Hyundai, Kia, Nissan, Ford, VW, Mercedes, BMW, Honda, Mitsubishi).

4. CATEGORY GRID — grey (#f2f2f2) background. 6 items, 2-row layout.
   Cards: #111111 background, no border, no radius, sharp corners.
   Category name Barlow Condensed weight-700 20px uppercase white.
   Category part count 13px #999999. Orange-red horizontal rule above name (2px, 32px wide).
   On hover: background becomes #1c1c1c. Orange-red bar extends full width.
   Categories: Engine Parts · Brakes & Suspension · Tyres & Wheels · Electrical · Body Parts · Tools

5. FEATURED PRODUCTS — "Popular This Week" 11px uppercase label.
   4-col desktop, 2-col mobile. Cards: white, 1px border #d0d0d0, no radius, no shadow.
   Product image (white bg, square 120px). Part no. monospace 11px #999999.
   Product name Inter weight-600 14px. Compatibility: "Fits: Toyota Corolla 2014–2022" 12px #666666 italic.
   Price weight-700 16px #111111. Stock: "In Stock" orange-red dot 12px.
   On hover: bottom border becomes orange-red 2px. "Add to Cart" bar slides up, orange-red bg.

6. BRAND BAR — dark (#111111) bg. "100% Genuine Parts" Barlow Condensed 20px uppercase white.
   5 brand name placeholders in greyscale Inter: Toyota · NGK · Bosch · Gates · Castrol. Evenly spaced.

7. FOOTER — #111111. AutoPlus GH logo. "Delivering: Accra · Tema · Kumasi · Nationwide."
   Columns: Parts, Support, Branches. "Chat mechanic advisor" WhatsApp link. Paystack badge.
```

---

### PAGE 2 — Products Grid

```
Same colours. User browsed "Brakes & Suspension" after selecting Toyota Corolla 2018.

1. HEADER same (search shows "Toyota Corolla 2018 — Brakes & Suspension").
2. TITLE — "Brakes & Suspension" Barlow Condensed weight-700 36px.
   Vehicle context pill: "Toyota Corolla 2018 · Change vehicle" — dark bg, orange-red text, 13px.
   Right: "52 parts" + "Sort ▾".

3. FILTERS — horizontal. Row 1 (part type): "All · Brake Pads · Disc Rotors · Calipers · Shock Absorbers · Springs"
   Row 2 (brand): "All · Bosch · TRW · Monroe · ATE · Delphi"
   Pill style: white, 1px #d0d0d0, 13px Inter, no radius. Active: #111111 fill, white text.

4. GRID — 4-col desktop, 2-col mobile. Cards same as homepage featured products.
   Part numbers MANDATORY on every card, monospace.
   Compatibility label "Fits your Toyota ✓" in small orange-red text — only shows if vehicle selected.
   On hover: "Add to Cart" bar slides up.

5. LOAD MORE — outlined dark button, Barlow Condensed uppercase.
6. FOOTER same.
```

---

### PAGE 3 — Product Detail

```
Same colours. Example: "Bosch Brake Pad Set · ₵320 · Part: BP-8743 · Fits Toyota Corolla 2014–2022"

1. HEADER same. Breadcrumb: "Brakes / Brake Pads / Bosch BP-8743" monospace 12px #666666.

2. PRODUCT MAIN — 50/50 split.
   LEFT 50%: white bg, product image large square. Part number monospace 13px #999999 above image.
   3 angle thumbnails below horizontal. 1px border at rest, orange-red on active.

   RIGHT 50%: sticky. Brand: "BOSCH" Barlow Condensed 13px uppercase orange-red.
   H1 Barlow Condensed weight-700 32px uppercase: "BRAKE PAD SET — FRONT AXLE"
   Part no. monospace 14px #666666: "REF: BP-8743-F". Compatibility: "Fits: Toyota Corolla 2014–2022
   · Fits: Toyota Auris 2013–2019" — each on its own line, 13px #666666 italic.
   Divider 1px #d0d0d0. Price: ₵320 weight-700 Inter 24px #111111. "In Stock — 12 units" 12px orange-red.
   Axle selector (if applicable): "Front Axle" / "Rear Axle" — outlined sharp pills.
   Quantity: − 1 +. CTAs: "Add to Cart" orange-red fill, white, full-width 48px, sharp, Barlow Condensed uppercase.
   "Add to Wishlist →" text link below, Inter 13px #666666.
   Trust: "Genuine Bosch · 2-Year Warranty · Free Delivery Accra" 12px #666666 · separator.

3. SPECS TABLE — white. "Technical Specifications" Barlow Condensed 16px uppercase.
   2-col table, monospace part values, Inter labels. Rows: Part Number, Axle Position,
   Height, Width, Thickness, Material, Compatible Makes.

4. RELATED — "Frequently bought together" label. 4-col grid same card style (part numbers visible).

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Industrial, no-nonsense checkout.

1. HEADER — "AutoPlus GH" left + "Secure Checkout" white right 12px. Dark header maintained.
2. PROGRESS — white text steps on dark bar. Orange-red active step.

3. LEFT COLUMN (60%): grey (#f2f2f2) bg. Fields: white bg, 1px #d0d0d0 border, 44px, no radius.
   Focus: orange-red border. Labels: 11px uppercase #666666.
   Contact: Email, Phone. Note: "We'll send tracking via SMS."
   Delivery: First + Last, Address, City, Region.
   Delivery Zone:
     "Accra — Same Day — ₵20" / "Tema/Kumasi — Next Day — ₵35" / "Other Regions — 3–5 Days — ₵50"
   Also: "Self Pickup — Accra CBD — Free" option row.
   Discount: inline + "Apply" orange-red button.
   CTA: "Continue to Payment" orange-red fill, white Barlow Condensed uppercase, 52px full-width, sharp.

4. RIGHT COLUMN (40%): white, 1px #d0d0d0 border. "Order Summary" Barlow Condensed 13px uppercase.
   Product rows: 48px image, part no. monospace 10px grey, name, qty, price.
   Totals rows. Total Barlow Condensed weight-700 20px. Below: "Genuine Parts · Paystack Secured · Same-Day Accra" 11px grey centred.

5. No footer. "© 2026 AutoPlus GH · Privacy · Terms" 11px grey centred on white bottom bar.
```

---

## STORE 9 — BakeMaster GH (Bakery & Pastry)
### 4-page set: Homepage · Products Grid · Product Detail · Checkout

> **Design direction:** Premium artisan bakery. Think Tartine Manufactory meets Accra.
> Warm, editorial, ingredient-obsessed. Photography does the selling. Serif type is essential.
> Reference: tartinebakery.com, haeckelsuk.com, ottolenghi.co.uk
>
> **Anti-patterns:** No geometric rigidity. No cold white. No generic food stock imagery style.
> No 3-step "How It Works" strips. Custom cake form is the conversion hero.

---

### PAGE 1 — Homepage

```
Design a homepage for BakeMaster GH, an artisan bakery delivering fresh baked goods
daily to households and offices in Accra.

COLOUR SYSTEM:
- Background: #fdf7ef (warm baked cream)
- Surface: #f5ead8 (deeper cream for alternating sections)
- Text primary: #2b1a0f (dark espresso)
- Text secondary: #8a6347 (warm caramel-brown)
- Accent: #c97c3a (burnt caramel — interactive states only)
- Border: #dfc6a0

TYPOGRAPHY:
- Headings: Fraunces or Playfair Display, weight 400–600, generous leading
- Body: Source Serif 4 or DM Sans, 15px, #8a6347, leading 1.7
- Labels: DM Sans 11px weight-600 uppercase tracking-wide
- Prices: tabular-nums weight-600 DM Sans

1. HEADER — cream bg, 1px border #dfc6a0. 60px.
   Announcement bar above: caramel (#c97c3a) bg 32px height.
   "Order by 8pm · Baked fresh by 5am · Delivered by 9am" 12px cream centred.
   Left: "BakeMaster" Fraunces weight-500 espresso + "GH" small DM Sans beside it.
   Centre: "Breads · Cakes · Pastries · Custom Orders · Catering" 13px #8a6347.
   Right: cart icon, "Start a Custom Order" 13px caramel text link.

2. HERO — full viewport height. Warm cream background.
   Asymmetric layout. LEFT 48%: editorial product "stack" — 3 product cards arranged with
   organic rotation. Top card tilted +3deg, middle 0deg, bottom -2deg. Stacked, overlapping.
   Each card: white bg, 1px border #dfc6a0, product photo top, name + price bottom, 12px padding.
   No shadow — border contrast only.

   RIGHT 52%: vertically centred, generous left padding.
   Tag: "Baked Fresh Daily · Since 2019" 11px uppercase caramel.
   Headline Fraunces weight-500 60px: "Freshly Baked. / Delivered / to Your Door."
   "Your Door." in caramel. Body 15px: "Artisan breads, custom cakes, and pastries —
   made in small batches every morning in Accra."
   CTAs: "Order Now" espresso fill, cream text, sharp rect 44px.
   "Build a Custom Cake →" text link in caramel below.

3. SCHEDULE STRIP — caramel (#c97c3a) bg, 48px. Centred text cream weight-600 13px:
   "Morning Bake: 6–10am  ·  Afternoon: Cakes & Pastries  ·  Order Cutoff: 8pm"

4. CATEGORY GRID — 4 items, 2×2 grid. Cards: surface bg, no border, square aspect-ratio.
   Full-bleed image placeholder. Category label Fraunces 24px weight-500 bottom-left, cream.
   On hover: caramel tint overlay 15% opacity. Categories: Breads · Cakes · Pastries · Seasonal

5. BESTSELLERS — cream bg. Label "Customers Can't Get Enough" 11px uppercase.
   4-col desktop, 2-col mobile. Cards: cream bg, 1px border #dfc6a0. No shadow, no radius.
   Product image top 55%. Badge top-left: "Staff Fave" / "Best Seller" / "New" in caramel text
   (Fraunces italic, no pill/border — just italic text).
   Product name Fraunces 15px, subline 12px #8a6347, price DM Sans weight-600.
   On hover: border becomes caramel. "Order Now →" text link fades in.

6. CUSTOM CAKES — espresso (#2b1a0f) background. Generous padding (100px vertical).
   Headline Fraunces weight-500 48px cream: "Order a / Custom Cake."
   Body 15px cream 70%: "Birthdays, weddings, corporate events — we'll bake your vision."
   4 input fields: Occasion, Flavour, Size, Date Needed. Field style: cream bg, no border,
   1px bottom border caramel only (underline style). "Request a Quote" — caramel fill, cream text,
   sharp rect, 44px. This form is the conversion centrepiece.

7. FOOTER — espresso (#2b1a0f). BakeMaster GH logo cream Fraunces.
   "Delivering fresh across Accra every morning." 3 columns: Menu, Custom Orders, Help.
   Paystack badge. Instagram placeholder for food photography.
```

---

### PAGE 2 — Products Grid

```
Same colours. User browsed "Cakes" — 18 products.

1. HEADER same. 2. TITLE — "Cakes" Fraunces weight-500 40px espresso.
3. FILTERS — Row 1: "All · Birthday · Wedding · Custom · Cheesecake · Loaf Cakes"
   Row 2: "All Sizes · Personal (6in) · Small (8in) · Large (10in) · Custom"
   Pill: 1px border #dfc6a0, cream bg, 13px DM Sans, no radius. Active: espresso fill, cream text.

4. GRID — 3-col desktop (food suits portrait), 2-col mobile. Cards same as bestsellers style.
   "Staff Fave" italic badge is the ONLY badge type. No generic "Sale" or "New" on this store.
   On hover: caramel border, "Order Now →" text link.

5. LOAD MORE — outlined espresso button, Fraunces italic.
6. FOOTER same.
```

---

### PAGE 3 — Product Detail

```
Same colours. Example: "Classic Red Velvet Cake · 8-inch · ₵180"

1. HEADER same. Breadcrumb: "Cakes / Layer Cakes / Classic Red Velvet" 12px #8a6347.

2. PRODUCT MAIN — 55/45 split.
   LEFT 55%: large food photo, cream bg, aspect-ratio 4:3. 3 angle thumbnails horizontal.

   RIGHT 45%: sticky. "Layer Cake" Fraunces italic 13px caramel as category.
   H1 Fraunces weight-500 34px espresso. Subline: "Serves 10–12 · Cream cheese frosting" 14px #8a6347.
   Divider 1px. Price: ₵180 DM Sans weight-600 22px.
   "Available daily — Order by 8pm for next-day delivery" 12px caramel.
   Size selector: "6-inch (Serves 6–8) · ₵130" / "8-inch (Serves 10–12) · ₵180 ✓" / "10-inch (Serves 18+) · ₵250"
   — outlined pills, espresso on active.
   Message option: "Add a personalised message +₵0" toggle switch (caramel toggle).
   Quantity: − 1 +.
   CTAs: "Add to Cart" espresso fill, cream text, full-width 48px, sharp.
   "Customise This Cake →" text link below in caramel.
   Trust: "Baked same morning · Cream cheese frosting · Delivered by 9am" 12px #8a6347 · separator.

3. INGREDIENTS + ALLERGENS — Fraunces italic tabs: "Ingredients" / "Allergens" / "Storage."
   Allergens tab styled with small amber warning indicator — not red, not alarming. Body text.

4. RELATED — "You might also like" label. 3-col grid same card style.

5. FOOTER same.
```

---

### PAGE 4 — Checkout

```
Same colours. Warm, trustworthy. "Custom order" items need special notation.

1. HEADER — "BakeMaster GH" Fraunces serif left + "Secure Checkout" 12px #8a6347 right.
2. PROGRESS — Cart → Details → Payment. Caramel active step. Fraunces labels.

3. LEFT COLUMN (60%): cream bg. Fields: 1px border #dfc6a0, 44px, no radius.
   Focus: caramel border. Labels: 11px uppercase #8a6347.
   Contact + Delivery address standard. Note below address:
   "We deliver between 7am–11am. Please ensure someone is home." 12px #8a6347 italic.
   Delivery Zone:
     "Accra — Same Morning — ₵20" / "Accra — Next Morning — Free on orders over ₵200" / "Other Regions — ₵45"
   Custom order items in cart show "Made to order · Ready: [date]" inline 12px caramel.
   Discount: inline + "Apply" outlined caramel.
   CTA: "Continue to Payment" espresso fill, cream text, Fraunces italic 16px, 52px full-width, sharp.
   "Powered by Paystack" greyscale badge.

4. RIGHT COLUMN (40%): surface bg (#f5ead8), 1px border #dfc6a0. "Your Order" 11px uppercase.
   Product rows: 48px image, name Fraunces 13px, size/variant note 11px, qty, price.
   Totals rows. Total Fraunces weight-500 22px espresso.
   Below: "Baked Fresh · Delivered by 9am · Paystack Secured" 11px #8a6347 centred.

5. No footer. "© 2026 BakeMaster GH · Privacy · Terms" 11px #8a6347 centred on cream bottom bar.
```

---

## HOW TO USE THESE PROMPTS IN STITCH

1. Go to **[stitch.withgoogle.com](https://stitch.withgoogle.com)** and sign in with your Google account
2. Create a **new project** per store (e.g. "TechHub GH Homepage")
3. Paste the prompt for that store into the Stitch prompt input
4. Generate the homepage design — iterate with follow-up prompts like:
   - *"Make the hero taller and push the headline to the left edge"*
   - *"Change the product card hover state to show a quick-add button sliding up"*
   - *"Add a sticky header with the brand colours"*
5. Once satisfied, export the screen — the Stitch MCP will pull it into Claude Code

## HOW TO AUTHENTICATE (ONE-TIME SETUP)

Run this in your terminal (Warp or Terminal.app):

```bash
npx @_davideast/stitch-mcp init
```

This wizard will:
- Install `gcloud` CLI if needed
- Open your browser for Google OAuth
- Configure the MCP proxy for Claude Code

Once authenticated, the proxy runs via:
```bash
npx @_davideast/stitch-mcp proxy
```

And in Claude Code, the MCP is available — use `get_screen_code` or `build_site` tools to import your Stitch designs.
