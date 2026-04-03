/**
 * Regenerates an invite token for an existing tenant.
 * Use this when the original token has expired or the store owner lost the link.
 * Safe to run against production — only updates one tenant record.
 *
 * Usage:
 *   npm run tenant:invite -- --slug=second-sight
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

async function main() {
  const slug = arg("slug");
  if (!slug) {
    console.error("Missing required argument: --slug");
    console.error("Usage: npm run tenant:invite -- --slug=<store-slug>");
    process.exit(1);
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: { id: true, name: true, users: { select: { id: true }, take: 1 } },
  });

  if (!tenant) {
    console.error(`No tenant found with slug "${slug}".`);
    process.exit(1);
  }

  if (tenant.users.length > 0) {
    console.error(`The store owner for "${slug}" has already claimed this store.`);
    console.error("Regenerating the invite would have no effect — they already have an account.");
    console.error("If they need a password reset, that's a separate flow.");
    process.exit(1);
  }

  const inviteToken = randomBytes(32).toString("hex");
  const inviteTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await prisma.tenant.update({
    where: { slug },
    data: { inviteToken, inviteTokenExpiresAt },
  });

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const protocol = domain.includes("localhost") ? "http" : "https";
  const inviteUrl = `${protocol}://${slug}.${domain}/auth/invite/${inviteToken}`;

  console.log("");
  console.log(`✓ New invite generated for: ${tenant.name} (${slug})`);
  console.log("");
  console.log("  Send this invite link to the store owner:");
  console.log(`  ${inviteUrl}`);
  console.log("");
  console.log(`  Expires: ${inviteTokenExpiresAt.toLocaleDateString("en-GB", { dateStyle: "full" })}`);
  console.log("");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
