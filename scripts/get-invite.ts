/**
 * Retrieves the current invite link for a tenant.
 * Use this if you need to resend the link and the token hasn't expired yet.
 *
 * Usage:
 *   npm run tenant:invite:get -- --slug=second-sight
 */

import "dotenv/config";
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
    console.error("Usage: npm run tenant:invite:get -- --slug=<store-slug>");
    process.exit(1);
  }

  const tenant = await prisma.tenant.findUnique({
    where: { slug },
    select: {
      name: true,
      inviteToken: true,
      inviteTokenExpiresAt: true,
      users: { select: { id: true }, take: 1 },
    },
  });

  if (!tenant) {
    console.error(`No tenant found with slug "${slug}".`);
    process.exit(1);
  }

  if (tenant.users.length > 0) {
    console.log(`\n  "${tenant.name}" has already been claimed. No pending invite.\n`);
    process.exit(0);
  }

  if (!tenant.inviteToken) {
    console.log(`\n  No invite token exists for "${tenant.name}".`);
    console.log(`  Run: npm run tenant:invite -- --slug=${slug}\n`);
    process.exit(0);
  }

  const expired =
    tenant.inviteTokenExpiresAt && tenant.inviteTokenExpiresAt < new Date();

  const domain = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost:3000";
  const protocol = domain.includes("localhost") ? "http" : "https";
  const inviteUrl = `${protocol}://${slug}.${domain}/auth/invite/${tenant.inviteToken}`;

  console.log("");
  console.log(`  Store: ${tenant.name} (${slug})`);
  console.log(`  Status: ${expired ? "⚠ EXPIRED" : "✓ Active"}`);
  console.log(`  Invite link: ${inviteUrl}`);
  if (tenant.inviteTokenExpiresAt) {
    console.log(`  Expires: ${tenant.inviteTokenExpiresAt.toLocaleDateString("en-GB", { dateStyle: "full" })}`);
  }
  console.log("");

  if (expired) {
    console.log(`  Token is expired. Run: npm run tenant:invite -- --slug=${slug}`);
    console.log("");
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
