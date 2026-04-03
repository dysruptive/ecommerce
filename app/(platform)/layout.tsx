import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PlatformSidebar } from "@/components/platform/sidebar";

export default async function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role !== "PLATFORM_ADMIN") redirect("/admin");

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-50">
      <div className="hidden w-56 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-56">
          <PlatformSidebar
            userName={session.user.name ?? "Admin"}
            userEmail={session.user.email ?? ""}
          />
        </div>
      </div>
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
