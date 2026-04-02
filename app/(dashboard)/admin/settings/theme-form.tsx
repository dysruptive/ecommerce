"use client";

import { useActionState } from "react";
import { updateThemeSettings } from "@/actions/settings";
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
import type { Tenant } from "@/types";

export function ThemeForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(
    updateThemeSettings,
    null,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Theme</CardTitle>
        <CardDescription>
          Customize colors for your storefront.
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
              Theme saved.
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="primaryColor">Primary Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  defaultValue={tenant.primaryColor}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  defaultValue={tenant.primaryColor}
                  className="flex-1"
                  readOnly
                  tabIndex={-1}
                  id="primaryColorText"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  defaultValue={tenant.accentColor}
                  className="h-10 w-14 cursor-pointer p-1"
                />
                <Input
                  defaultValue={tenant.accentColor}
                  className="flex-1"
                  readOnly
                  tabIndex={-1}
                  id="accentColorText"
                />
              </div>
            </div>
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Theme"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
