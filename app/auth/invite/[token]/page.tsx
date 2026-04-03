import { Suspense } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InviteForm } from "./invite-form";

interface Props {
  params: Promise<{ token: string }>;
}

export const metadata = { title: "Set up your store" };

export default async function InvitePage({ params }: Props) {
  const { token } = await params;

  const tenant = await prisma.tenant.findUnique({
    where: { inviteToken: token },
    select: {
      id: true,
      name: true,
      inviteTokenExpiresAt: true,
      users: { select: { id: true }, take: 1 },
    },
  });

  if (!tenant) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-bold">Invalid invite link</h1>
          <p className="mt-2 text-muted-foreground">
            This link is invalid or has already been used. Please contact the
            platform admin.
          </p>
        </div>
      </main>
    );
  }

  if (
    tenant.inviteTokenExpiresAt &&
    tenant.inviteTokenExpiresAt < new Date()
  ) {
    return (
      <main className="flex min-h-svh items-center justify-center p-6">
        <div className="max-w-sm text-center">
          <h1 className="text-2xl font-bold">Invite expired</h1>
          <p className="mt-2 text-muted-foreground">
            This invite link expired on{" "}
            {tenant.inviteTokenExpiresAt.toLocaleDateString()}. Please request a
            new one.
          </p>
        </div>
      </main>
    );
  }

  if (tenant.users.length > 0) {
    redirect("/auth/login");
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Suspense>
        <InviteForm token={token} storeName={tenant.name} />
      </Suspense>
    </main>
  );
}
