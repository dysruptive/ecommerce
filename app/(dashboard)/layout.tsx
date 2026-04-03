import { Store } from "lucide-react";
import { getTenantFromSession } from "@/lib/tenant";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/auth/login");
  if (session.user.role === "PLATFORM_ADMIN") redirect("/platform");

  const tenant = await getTenantFromSession();

  return (
    <div className="flex min-h-svh">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r lg:block">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <Store className="h-5 w-5" />
          <span className="font-semibold">{tenant.name}</span>
        </div>
        <Sidebar />
      </aside>

      {/* Main area */}
      <div className="flex flex-1 flex-col">
        <DashboardHeader
          storeName={tenant.name}
          userName={session.user.name}
          userEmail={session.user.email}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
