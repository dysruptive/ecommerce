"use client";

import { useActionState } from "react";
import { updatePaymentSettings } from "@/actions/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Tenant } from "@/types";

export function PaymentsForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(
    updatePaymentSettings,
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>
          Paystack subaccount configuration. The platform admin creates the
          subaccount on your behalf — paste the code here once it&apos;s ready.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.success === false && (
            <div className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {state.error}
            </div>
          )}
          {state?.success === true && (
            <div className="rounded-md bg-green-500/10 px-3 py-2 text-sm text-green-700">
              Payment settings saved.
            </div>
          )}

          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">Status</span>
            {tenant.paystackSubaccountCode ? (
              <Badge className="bg-green-500 hover:bg-green-500">
                Connected
              </Badge>
            ) : (
              <Badge variant="secondary">Not configured</Badge>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="paystackSubaccountCode">
              Paystack Subaccount Code
            </Label>
            <Input
              id="paystackSubaccountCode"
              name="paystackSubaccountCode"
              placeholder="ACCT_xxxxxxxxxxxxxxxxx"
              defaultValue={tenant.paystackSubaccountCode ?? ""}
            />
            <p className="text-xs text-muted-foreground">
              Found in your Paystack dashboard under Settings → Subaccounts.
              Payments from your store will be split to this subaccount.
            </p>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
