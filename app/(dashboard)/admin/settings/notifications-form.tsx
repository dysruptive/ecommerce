"use client";

import { useActionState } from "react";
import { updateNotificationSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Tenant } from "@/types";

export function NotificationsForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(
    updateNotificationSettings,
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Configure email and SMS notifications for your store.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          {state?.success === false && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          )}
          {state?.success === true && (
            <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700">
              Notification settings saved.
            </div>
          )}

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="emailEnabled">Email Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send order confirmations and updates via email.
              </p>
            </div>
            <Switch
              id="emailEnabled"
              name="emailEnabled"
              defaultChecked={tenant.emailEnabled}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="smsEnabled">SMS Notifications</Label>
              <p className="text-sm text-muted-foreground">
                Send SMS via Arkesel. Requires an API key.
              </p>
            </div>
            <Switch
              id="smsEnabled"
              name="smsEnabled"
              defaultChecked={tenant.smsEnabled}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="arkeselApiKey">Arkesel API Key</Label>
            <Input
              id="arkeselApiKey"
              name="arkeselApiKey"
              type="password"
              defaultValue={tenant.arkeselApiKey ?? ""}
              placeholder="Enter your Arkesel API key"
            />
            <p className="text-xs text-muted-foreground">
              Required for SMS. Get your key from arkesel.com.
            </p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Notifications"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
