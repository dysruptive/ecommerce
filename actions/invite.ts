"use server";

import { hash } from "bcryptjs";
import { prisma } from "@/lib/db";
import { signIn } from "@/lib/auth";
import { InviteRegisterSchema } from "@/lib/validations/invite";

export type InviteState = {
  error?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password", string[]>>;
} | null;

export async function registerWithInvite(
  _prevState: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const parsed = InviteRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    token: formData.get("token"),
  });

  if (!parsed.success) {
    return {
      fieldErrors: parsed.error.flatten().fieldErrors as Partial<
        Record<"name" | "email" | "password", string[]>
      >,
    };
  }

  const { name, email, password, token } = parsed.data;

  const tenant = await prisma.tenant.findUnique({
    where: { inviteToken: token },
    select: {
      id: true,
      inviteTokenExpiresAt: true,
      users: { select: { id: true }, take: 1 },
    },
  });

  if (!tenant) {
    return { error: "This invite link is invalid or has already been used." };
  }

  if (tenant.inviteTokenExpiresAt && tenant.inviteTokenExpiresAt < new Date()) {
    return { error: "This invite link has expired. Please request a new one." };
  }

  if (tenant.users.length > 0) {
    return { error: "This store already has an owner account. Please sign in instead." };
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return { fieldErrors: { email: ["An account with this email already exists."] } };
  }

  const passwordHash = await hash(password, 12);

  await prisma.$transaction([
    prisma.user.create({
      data: { email, name, passwordHash, tenantId: tenant.id, role: "OWNER" },
    }),
    prisma.tenant.update({
      where: { id: tenant.id },
      data: { inviteToken: null, inviteTokenExpiresAt: null },
    }),
  ]);

  await signIn("credentials", { email, password, redirectTo: "/admin" });

  return null;
}
