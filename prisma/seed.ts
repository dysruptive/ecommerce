import "dotenv/config";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";
import { hash } from "bcryptjs";

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const passwordHash = await hash("Pass123$1", 12);

  await prisma.user.upsert({
    where: { email: "adujoel7@gmail.com" },
    update: { passwordHash, role: "PLATFORM_ADMIN", name: "Platform Admin" },
    create: {
      email: "adujoel7@gmail.com",
      name: "Platform Admin",
      passwordHash,
      tenantId: null,
      role: "PLATFORM_ADMIN",
    },
  });

  console.log("Done. Platform admin: adujoel7@gmail.com");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
