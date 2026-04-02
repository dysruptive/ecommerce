"use client";

import { useState, useActionState } from "react";
import { updateGeneralSettings, updateLogoUrl } from "@/actions/settings";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import type { Tenant } from "@/types";

export function GeneralForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(
    updateGeneralSettings,
    null,
  );

  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl ?? "");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setLogoError(null);
    try {
      const result = await uploadToCloudinary(
        file,
        `stores/${tenant.slug}/logo`,
      );
      setLogoUrl(result.secure_url);
      const saveResult = await updateLogoUrl(result.secure_url);
      if (!saveResult.success) setLogoError(saveResult.error);
    } catch (err) {
      setLogoError(err instanceof Error ? err.message : "Logo upload failed.");
    } finally {
      setLogoUploading(false);
      e.target.value = "";
    }
  }

  async function removeLogo() {
    setLogoUrl("");
    await updateLogoUrl("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Basic information about your store.</CardDescription>
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
              Settings saved.
            </div>
          )}

          {/* Logo */}
          <div className="space-y-2">
            <Label>Store Logo</Label>
            <div className="flex items-center gap-3">
              {logoUrl ? (
                <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                  <Image
                    src={logoUrl}
                    alt="Store logo"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-md border bg-muted text-xs text-muted-foreground">
                  No logo
                </div>
              )}
              <div>
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                    {logoUploading && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    {logoUploading ? "Uploading..." : "Upload logo"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={logoUploading}
                    onChange={handleLogoChange}
                  />
                </label>
                {logoError && (
                  <p className="mt-1 text-xs text-destructive">{logoError}</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Store Name</Label>
            <Input id="name" name="name" defaultValue={tenant.name} required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              defaultValue={tenant.description ?? ""}
              rows={3}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                defaultValue={tenant.contactEmail ?? ""}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                defaultValue={tenant.contactPhone ?? ""}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              defaultValue={tenant.address ?? ""}
            />
          </div>

          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
