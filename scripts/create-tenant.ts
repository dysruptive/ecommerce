/**
 * Creates a new tenant and generates an invite link for the store owner.
 * Safe to run against production — only inserts, never touches other tenants.
 *
 * Usage:
 *   npm run tenant:create -- --slug=tech-hub-gh --name="Tech Hub Ghana"
 *
 * Optional flags:
 *   --primary-color=#1C1917
 *   --accent-color=#D97706
 *   --email=owner@techhub.com
 *   --phone=+233201234567
 *   --address="5 Ring Road, Accra"
 */

import "dotenv/config";
import { randomBytes } from "crypto";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function arg(name: string): string | undefined {
  const flag = `--${name}=`;
  const match = process.argv.find((a) => a.startsWith(flag));
  return match ? match.slice(flag.length) : undefined;
}

function requireArg(name: string): string {
  const value = arg(name);
  if (!value) {
    console.error(`Missing required argument: --${name}`);
    process.exit(1);
  }
  return value;
}

async function main() {
  const slug = requireArg("slug");
  const name = requireArg("name");
  const primaryColor = arg("primary-color") ?? "#1a1c1b";
  const accentColor = arg("accent-color") ?? "#6c5e06";
  const contactEmail = arg("email") ?? null;
  const contactPhone = arg("phone") ?? null;
  const address = arg("address") ?? null;

  // Check for slug collision
  const existing = await prisma.tenant.findUnique({ where: { slug } });
  if (existing) {
    console.error(`A tenant with slug "${slug}" already exists.`);
    console.error(`To regenerate their invite link, run: npm run tenant:invite -- --slug=${slug}`);
    process.exit(1);
  }

  const inviteToken = randomBytes(32).toString("hex");
  const inviteTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.tenant.create({
    data: {
      slug,
      name,
      primaryColor,
      accentColor,
      contactEmail,
      contactPhone,
      address,
      inviteToken,
      inviteTokenExpiresAt,
    },
  });

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const protocol = domain.includes("localhost") ? "http" : "https";
  const inviteUrl = `${protocol}://${slug}.${domain}/auth/invite/${inviteToken}`;

  console.log("");
  console.log(`✓ Tenant created: ${name} (${slug})`);
  console.log("");
  console.log("  Send this invite link to the store owner:");
  console.log(`  ${inviteUrl}`);
  console.log("");
  console.log(`  Expires: ${inviteTokenExpiresAt.toLocaleDateString("en-GB", { dateStyle: "full" })}`);
  console.log("");
  console.log("  Next steps for you:");
  console.log(`  1. Build the store design in stores/${slug}/`);
  console.log(`  2. Add the store to STORE_REGISTRY in stores/registry.ts`);
  console.log("  3. Send the invite link above to the store owner");
  console.log("");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
