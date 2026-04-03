"use client";

import { useActionState } from "react";
import { Switch } from "@/components/ui/switch";
import { updateNotificationSettings } from "@/actions/settings";
import type { Tenant } from "@/types";

export function NotificationsForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(updateNotificationSettings, null);

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Notifications</p>
        <p className="mt-0.5 text-xs text-[#78716C]">
          Configure email and SMS notifications for your store.
        </p>
      </div>
      <div className="px-5 py-5">
        <form action={formAction} className="space-y-5">
          {state?.success === false && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
          )}
          {state?.success === true && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Notification settings saved.</div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-[#E5E2DB] px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-[#1C1917]">Email Notifications</p>
              <p className="text-xs text-[#78716C]">Send order confirmations and updates via email.</p>
            </div>
            <Switch id="emailEnabled" name="emailEnabled" defaultChecked={tenant.emailEnabled} />
          </div>

          <div className="flex items-center justify-between rounded-xl border border-[#E5E2DB] px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-[#1C1917]">SMS Notifications</p>
              <p className="text-xs text-[#78716C]">Send SMS via Arkesel. Requires an API key.</p>
            </div>
            <Switch id="smsEnabled" name="smsEnabled" defaultChecked={tenant.smsEnabled} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Notifications"}
          </button>
        </form>
      </div>
    </div>
  );
}
