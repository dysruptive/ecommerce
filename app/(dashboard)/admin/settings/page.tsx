import { PageHeader } from "@/components/dashboard/page-header";
import { getTenantFromSession } from "@/lib/tenant";
import { listBanks } from "@/lib/paystack";
import { SettingsTabs } from "./settings-tabs";

export default async function SettingsPage() {
  const [tenant, banks] = await Promise.all([
    getTenantFromSession(),
    listBanks(),
  ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your store settings" />
      <SettingsTabs tenant={JSON.parse(JSON.stringify(tenant))} banks={banks} />
    </div>
  );
}
