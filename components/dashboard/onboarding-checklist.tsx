import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { prisma } from "@/lib/db";
import { getTenantFromSession } from "@/lib/tenant";
import { OnboardingDismissButton } from "./onboarding-dismiss-button";

const STEPS = [
  {
    key: "profile",
    label: "Complete store profile",
    description: "Add a description, contact email, and phone number",
    href: "/admin/settings",
  },
  {
    key: "categories",
    label: "Add product categories",
    description: "Organise your products before adding them",
    href: "/admin/products",
  },
  {
    key: "products",
    label: "Add your first product",
    description: "Create and publish at least one product",
    href: "/admin/products/new",
  },
  {
    key: "zones",
    label: "Set up delivery zones",
    description: "Configure where you ship and the delivery fees",
    href: "/admin/delivery-zones",
  },
  {
    key: "paystack",
    label: "Connect Paystack",
    description: "Add your subaccount code to accept payments",
    href: "/admin/settings",
  },
] as const;

type StepKey = (typeof STEPS)[number]["key"];

export async function OnboardingChecklist() {
  const tenant = await getTenantFromSession();

  if (tenant.onboardingDismissedAt) return null;

  const [categoryCount, productCount, zoneCount] = await Promise.all([
    prisma.category.count({ where: { tenantId: tenant.id } }),
    prisma.product.count({
      where: { tenantId: tenant.id, isPublished: true, isArchived: false },
    }),
    prisma.deliveryZone.count({ where: { tenantId: tenant.id, isActive: true } }),
  ]);

  const done: Record<StepKey, boolean> = {
    profile: !!(tenant.description && tenant.contactEmail),
    categories: categoryCount > 0,
    products: productCount > 0,
    zones: zoneCount > 0,
    paystack: !!tenant.paystackSubaccountCode,
  };

  const doneCount = Object.values(done).filter(Boolean).length;
  const allDone = doneCount === STEPS.length;

  if (allDone) return null;

  const progressPct = Math.round((doneCount / STEPS.length) * 100);

  return (
    <Card className="border-amber-200 bg-gradient-to-b from-amber-50/40 to-white">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div>
          <h2 className="text-sm font-semibold">Get {tenant.name} ready</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {doneCount} of {STEPS.length} steps complete
          </p>
        </div>
        <OnboardingDismissButton />
      </CardHeader>

      <CardContent className="pt-0">
        {/* Progress bar */}
        <div className="mb-4 h-1.5 w-full overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        <div className="space-y-0.5">
          {STEPS.map((step) => {
            const isDone = done[step.key];
            return (
              <div
                key={step.key}
                className="flex items-center gap-3 rounded-md px-1 py-2.5"
              >
                {isDone ? (
                  <CheckCircle2 className="h-4.5 w-4.5 shrink-0 text-green-500" />
                ) : (
                  <Circle className="h-4.5 w-4.5 shrink-0 text-stone-300" />
                )}

                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-none ${
                      isDone ? "text-muted-foreground" : "text-foreground"
                    }`}
                  >
                    {step.label}
                  </p>
                  {!isDone && (
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  )}
                </div>

                {!isDone && (
                  <Link
                    href={step.href}
                    className="shrink-0 text-xs font-semibold text-amber-600 underline-offset-2 hover:underline"
                  >
                    Set up →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
