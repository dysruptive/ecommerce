import "dotenv/config";
import { randomBytes } from "crypto";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // ⚠️  LOCAL DEVELOPMENT ONLY — wipes and recreates all data.
  //     Never run this against a production database.
  //     To onboard a store in production, use: npm run tenant:create
  console.log("Seeding database...");

  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.deliveryZone.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.user.deleteMany();
  await prisma.tenant.deleteMany();

  const passwordHash = await hash("password123", 12);

  // ─── Platform Admin ─────────────────────────────────────

  await prisma.user.create({
    data: {
      email: "admin@platform.test",
      name: "Platform Admin",
      passwordHash,
      tenantId: null,
      role: "PLATFORM_ADMIN",
    },
  });

  // ─── Tenant 1: Fresh Mart ───────────────────────────────

  const freshMart = await prisma.tenant.create({
    data: {
      name: "Fresh Mart",
      slug: "fresh-mart",
      description:
        "Your one-stop shop for fresh fruits, vegetables, and beverages in Accra.",
      contactEmail: "hello@freshmart.test",
      contactPhone: "+233201234567",
      address: "23 Oxford Street, Osu, Accra",
      primaryColor: "#16A34A",
      accentColor: "#F59E0B",
    },
  });

  await prisma.user.create({
    data: {
      email: "owner@freshmart.test",
      name: "Kwame Asante",
      passwordHash,
      tenantId: freshMart.id,
      role: "OWNER",
    },
  });

  // Categories
  const [fruits, vegetables, beverages] = await Promise.all([
    prisma.category.create({
      data: {
        tenantId: freshMart.id,
        name: "Fruits",
        slug: "fruits",
        description: "Fresh tropical and imported fruits",
      },
    }),
    prisma.category.create({
      data: {
        tenantId: freshMart.id,
        name: "Vegetables",
        slug: "vegetables",
        description: "Farm-fresh vegetables delivered daily",
      },
    }),
    prisma.category.create({
      data: {
        tenantId: freshMart.id,
        name: "Beverages",
        slug: "beverages",
        description: "Refreshing drinks and juices",
      },
    }),
  ]);

  // Products
  const freshMartProducts = await Promise.all([
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Organic Mango Box",
        slug: "organic-mango-box",
        description: "Box of 6 premium Kent mangoes from Somanya farms.",
        price: 45.0,
        stock: 30,
        isPublished: true,
        categoryId: fruits.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Fresh Pineapple",
        slug: "fresh-pineapple",
        description: "Sweet Cayenne pineapple, hand-picked.",
        price: 18.0,
        compareAtPrice: 22.0,
        stock: 50,
        isPublished: true,
        categoryId: fruits.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Watermelon (Whole)",
        slug: "watermelon-whole",
        description: "Juicy seedless watermelon, perfect for the Accra heat.",
        price: 25.0,
        stock: 20,
        isPublished: true,
        categoryId: fruits.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Garden Eggs (1kg)",
        slug: "garden-eggs-1kg",
        description: "Fresh garden eggs, great for stews.",
        price: 12.0,
        stock: 40,
        isPublished: true,
        categoryId: vegetables.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Fresh Tomatoes (Crate)",
        slug: "fresh-tomatoes-crate",
        description: "A crate of vine-ripened tomatoes from Techiman.",
        price: 35.0,
        stock: 15,
        isPublished: true,
        categoryId: vegetables.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Kontomire Bundle",
        slug: "kontomire-bundle",
        description: "Fresh cocoyam leaves for your favourite kontomire stew.",
        price: 8.0,
        stock: 60,
        isPublished: true,
        categoryId: vegetables.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Sobolo (1L Bottle)",
        slug: "sobolo-1l",
        description: "Homemade hibiscus drink, chilled and ready.",
        price: 15.0,
        stock: 100,
        isPublished: true,
        categoryId: beverages.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Fresh Coconut Water (Pack of 4)",
        slug: "coconut-water-4pk",
        description: "Natural coconut water with no added sugar.",
        price: 32.0,
        compareAtPrice: 40.0,
        stock: 25,
        isPublished: true,
        categoryId: beverages.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Baobab Smoothie Mix",
        slug: "baobab-smoothie-mix",
        description: "Powdered baobab fruit mix for smoothies. 250g.",
        price: 28.0,
        stock: 35,
        isPublished: true,
        categoryId: beverages.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: freshMart.id,
        name: "Pepper Mix (Blended)",
        slug: "pepper-mix-blended",
        description: "Pre-blended pepper, tomato, and onion mix. 500ml.",
        price: 20.0,
        stock: 45,
        isPublished: true,
        categoryId: vegetables.id,
      },
    }),
  ]);

  // ─── Tenant 2: StyleHub GH ─────────────────────────────

  const styleHub = await prisma.tenant.create({
    data: {
      name: "StyleHub GH",
      slug: "stylehub-gh",
      description:
        "Trendy Ghanaian fashion for men and women. African prints meet modern style.",
      contactEmail: "info@stylehub.test",
      contactPhone: "+233501234567",
      address: "15 Spintex Road, Accra",
      primaryColor: "#7C3AED",
      accentColor: "#EC4899",
    },
  });

  await prisma.user.create({
    data: {
      email: "owner@stylehub.test",
      name: "Ama Serwaa",
      passwordHash,
      tenantId: styleHub.id,
      role: "OWNER",
    },
  });

  // Categories
  const [mensWear, womensWear, accessories] = await Promise.all([
    prisma.category.create({
      data: {
        tenantId: styleHub.id,
        name: "Men's Wear",
        slug: "mens-wear",
        description: "Stylish menswear with African prints",
      },
    }),
    prisma.category.create({
      data: {
        tenantId: styleHub.id,
        name: "Women's Wear",
        slug: "womens-wear",
        description: "Contemporary women's fashion",
      },
    }),
    prisma.category.create({
      data: {
        tenantId: styleHub.id,
        name: "Accessories",
        slug: "accessories",
        description: "Complete your look with our accessories",
      },
    }),
  ]);

  // Products
  const styleHubProducts = await Promise.all([
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Kente Shirt (Classic Fit)",
        slug: "kente-shirt-classic",
        description:
          "Premium cotton shirt with authentic Bonwire kente detailing.",
        price: 180.0,
        compareAtPrice: 220.0,
        stock: 20,
        isPublished: true,
        categoryId: mensWear.id,
        variants: {
          create: [
            { name: "Small", price: 180.0, stock: 5 },
            { name: "Medium", price: 180.0, stock: 8 },
            { name: "Large", price: 180.0, stock: 5 },
            { name: "XL", price: 185.0, stock: 2 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Ankara Print Trousers",
        slug: "ankara-print-trousers",
        description: "Slim-fit trousers with bold Ankara wax print.",
        price: 120.0,
        stock: 25,
        isPublished: true,
        categoryId: mensWear.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Dashiki Agbada Set",
        slug: "dashiki-agbada-set",
        description:
          "Full 3-piece agbada set. Perfect for special occasions.",
        price: 350.0,
        stock: 10,
        isPublished: true,
        categoryId: mensWear.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "African Print Maxi Dress",
        slug: "african-print-maxi-dress",
        description: "Flowing maxi dress with vibrant Ankara fabric.",
        price: 200.0,
        compareAtPrice: 250.0,
        stock: 15,
        isPublished: true,
        categoryId: womensWear.id,
        variants: {
          create: [
            { name: "Small", price: 200.0, stock: 4 },
            { name: "Medium", price: 200.0, stock: 6 },
            { name: "Large", price: 200.0, stock: 5 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Batik Wrap Skirt",
        slug: "batik-wrap-skirt",
        description: "Hand-dyed batik wrap skirt. One size fits most.",
        price: 85.0,
        stock: 30,
        isPublished: true,
        categoryId: womensWear.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Kente Clutch Bag",
        slug: "kente-clutch-bag",
        description: "Handwoven kente fabric clutch with leather trim.",
        price: 95.0,
        stock: 18,
        isPublished: true,
        categoryId: accessories.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Beaded Necklace Set",
        slug: "beaded-necklace-set",
        description:
          "Handcrafted Krobo bead necklace and earring set.",
        price: 65.0,
        stock: 40,
        isPublished: true,
        categoryId: accessories.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Smock Top (Northern)",
        slug: "smock-top-northern",
        description:
          "Traditional hand-woven fugu smock top from Bolgatanga.",
        price: 150.0,
        stock: 12,
        isPublished: true,
        categoryId: womensWear.id,
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Leather Sandals (Handmade)",
        slug: "leather-sandals-handmade",
        description: "Handcrafted leather sandals from Kumasi.",
        price: 75.0,
        stock: 22,
        isPublished: true,
        categoryId: accessories.id,
        variants: {
          create: [
            { name: "Size 38", price: 75.0, stock: 5 },
            { name: "Size 40", price: 75.0, stock: 7 },
            { name: "Size 42", price: 75.0, stock: 6 },
            { name: "Size 44", price: 75.0, stock: 4 },
          ],
        },
      },
    }),
    prisma.product.create({
      data: {
        tenantId: styleHub.id,
        name: "Polo Shirt (African Collar)",
        slug: "polo-shirt-african-collar",
        description: "Cotton polo with embroidered African-print collar.",
        price: 95.0,
        stock: 35,
        isPublished: true,
        categoryId: mensWear.id,
      },
    }),
  ]);

  // ─── Tenant 3: Second Sight ────────────────────────────
  // Minimal seed — owner registers via invite link, products added via dashboard

  const secondSightInviteToken = randomBytes(32).toString("hex");

  const secondSight = await prisma.tenant.create({
    data: {
      name: "Second Sight",
      slug: "second-sight",
      primaryColor: "#1C1917",
      accentColor: "#D97706",
      inviteToken: secondSightInviteToken,
      inviteTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // ─── Delivery Zones (same defaults for both tenants) ────

  const defaultZones = [
    {
      name: "Accra Metro",
      regions: "Accra Metropolitan, Tema",
      fee: 15.0,
      position: 0,
    },
    {
      name: "Greater Accra",
      regions: "Ga East, Ga West, Ga South, Adentan, La-Nkwantanang",
      fee: 25.0,
      position: 1,
    },
    {
      name: "Ashanti Region",
      regions: "Kumasi, Obuasi, Ejisu",
      fee: 40.0,
      position: 2,
    },
    {
      name: "Central & Western",
      regions: "Cape Coast, Takoradi, Sekondi",
      fee: 45.0,
      position: 3,
    },
    {
      name: "Nationwide",
      regions: "All other regions",
      fee: 55.0,
      position: 4,
    },
  ];

  const zoneMap: Record<string, string> = {};

  for (const tenant of [freshMart, styleHub, secondSight]) {
    for (const zone of defaultZones) {
      const created = await prisma.deliveryZone.create({
        data: { tenantId: tenant.id, ...zone },
      });
      if (tenant.id === freshMart.id && zone.name === "Accra Metro") {
        zoneMap["freshMart-accra"] = created.id;
      }
      if (tenant.id === styleHub.id && zone.name === "Greater Accra") {
        zoneMap["styleHub-greaterAccra"] = created.id;
      }
      if (tenant.id === secondSight.id && zone.name === "Accra Metro") {
        zoneMap["secondSight-accra"] = created.id;
      }
    }
  }

  // ─── Sample Customers & Orders ──────────────────────────

  const customer1 = await prisma.customer.create({
    data: {
      tenantId: freshMart.id,
      email: "kofi@example.com",
      name: "Kofi Mensah",
      phone: "+233241112233",
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      tenantId: freshMart.id,
      email: "abena@example.com",
      name: "Abena Osei",
      phone: "+233551234567",
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      tenantId: styleHub.id,
      email: "yaw@example.com",
      name: "Yaw Boateng",
      phone: "+233261234567",
    },
  });

  // Order 1: Fresh Mart — Paid & Confirmed
  await prisma.order.create({
    data: {
      tenantId: freshMart.id,
      orderNumber: "FM-001",
      customerId: customer1.id,
      subtotal: 63.0,
      deliveryFee: 15.0,
      total: 78.0,
      status: "CONFIRMED",
      paymentStatus: "PAID",
      paymentRef: "PSK_test_abc123",
      deliveryZoneId: zoneMap["freshMart-accra"],
      deliveryAddress: "12 Cantonments Rd, Accra",
      items: {
        create: [
          {
            productId: freshMartProducts[0].id,
            name: "Organic Mango Box",
            price: 45.0,
            quantity: 1,
          },
          {
            productId: freshMartProducts[1].id,
            name: "Fresh Pineapple",
            price: 18.0,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Order 2: Fresh Mart — Pending payment
  await prisma.order.create({
    data: {
      tenantId: freshMart.id,
      orderNumber: "FM-002",
      customerId: customer2.id,
      subtotal: 47.0,
      deliveryFee: 15.0,
      total: 62.0,
      status: "PENDING",
      paymentStatus: "UNPAID",
      deliveryZoneId: zoneMap["freshMart-accra"],
      deliveryAddress: "5 Labone Close, Accra",
      items: {
        create: [
          {
            productId: freshMartProducts[6].id,
            name: "Sobolo (1L Bottle)",
            price: 15.0,
            quantity: 2,
          },
          {
            productId: freshMartProducts[7].id,
            name: "Fresh Coconut Water (Pack of 4)",
            price: 32.0,
            quantity: 1,
          },
        ],
      },
      customerNote: "Please deliver before 5pm",
    },
  });

  // Order 3: Fresh Mart — Delivered
  await prisma.order.create({
    data: {
      tenantId: freshMart.id,
      orderNumber: "FM-003",
      customerId: customer1.id,
      subtotal: 35.0,
      deliveryFee: 15.0,
      total: 50.0,
      status: "DELIVERED",
      paymentStatus: "PAID",
      paymentRef: "PSK_test_def456",
      deliveryZoneId: zoneMap["freshMart-accra"],
      deliveryAddress: "12 Cantonments Rd, Accra",
      items: {
        create: [
          {
            productId: freshMartProducts[4].id,
            name: "Fresh Tomatoes (Crate)",
            price: 35.0,
            quantity: 1,
          },
        ],
      },
    },
  });

  // Order 4: StyleHub — Paid & Processing
  await prisma.order.create({
    data: {
      tenantId: styleHub.id,
      orderNumber: "SH-001",
      customerId: customer3.id,
      subtotal: 280.0,
      deliveryFee: 25.0,
      total: 305.0,
      status: "PROCESSING",
      paymentStatus: "PAID",
      paymentRef: "PSK_test_ghi789",
      deliveryZoneId: zoneMap["styleHub-greaterAccra"],
      deliveryAddress: "22 Spintex Rd, Accra",
      items: {
        create: [
          {
            productId: styleHubProducts[0].id,
            name: "Kente Shirt (Classic Fit)",
            price: 180.0,
            quantity: 1,
          },
          {
            productId: styleHubProducts[5].id,
            name: "Kente Clutch Bag",
            price: 95.0,
            quantity: 1,
          },
        ],
      },
    },
  });

  // ─── Sample Discounts ───────────────────────────────────

  await prisma.discount.create({
    data: {
      tenantId: freshMart.id,
      code: "FRESH10",
      type: "PERCENTAGE",
      value: 10,
      minPurchase: 50,
      maxUses: 100,
    },
  });

  await prisma.discount.create({
    data: {
      tenantId: styleHub.id,
      code: "STYLE20",
      type: "FIXED_AMOUNT",
      value: 20,
      minPurchase: 100,
      maxUses: 50,
    },
  });

  console.log("Seeding complete!");
  console.log(`  Platform Admin: admin@platform.test / password123`);
  console.log(`  Fresh Mart (${freshMart.id}): ${freshMartProducts.length} products, 3 orders`);
  console.log(`  StyleHub GH (${styleHub.id}): ${styleHubProducts.length} products, 1 order`);
  console.log(`  Second Sight (${secondSight.id}): tenant created, no products yet`);
  console.log(`\n  ── Second Sight invite link ──────────────────────────────`);
  console.log(`  http://second-sight.localhost:3000/auth/invite/${secondSightInviteToken}`);
  console.log(`  ─────────────────────────────────────────────────────────\n`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
