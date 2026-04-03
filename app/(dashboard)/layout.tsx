import { Outfit } from "next/font/google";
import { getTenantFromSession } from "@/lib/tenant";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/dashboard/sidebar";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

const outfit = Outfit({ subsets: ["latin"], variable: "--font-outfit" });

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
    <div
      className={`${outfit.variable} flex min-h-svh bg-[#F8F7F4]`}
      style={{ fontFamily: "var(--font-outfit), system-ui, sans-serif" }}
    >
      {/* Desktop sidebar */}
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="fixed inset-y-0 left-0 w-56">
          <AdminSidebar
            storeName={tenant.name}
            primaryColor={tenant.primaryColor}
          />
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader
          storeName={tenant.name}
          userName={session.user.name ?? ""}
          userEmail={session.user.email ?? ""}
          primaryColor={tenant.primaryColor}
        />
        <main className="flex-1 p-5 lg:p-7">{children}</main>
      </div>
    </div>
  );
}
