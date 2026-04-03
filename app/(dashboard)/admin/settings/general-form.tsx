"use client";

import { useState, useActionState } from "react";
import Image from "next/image";
import { Loader2, X } from "lucide-react";
import { updateGeneralSettings, updateLogoUrl } from "@/actions/settings";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type { Tenant } from "@/types";

const inputCls = "h-10 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";
const labelCls = "block text-sm font-medium text-[#1C1917]";

export function GeneralForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(updateGeneralSettings, null);
  const [logoUrl, setLogoUrl] = useState(tenant.logoUrl ?? "");
  const [logoUploading, setLogoUploading] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  async function handleLogoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoUploading(true);
    setLogoError(null);
    try {
      const result = await uploadToCloudinary(file, `stores/${tenant.slug}/logo`);
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
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">General</p>
        <p className="mt-0.5 text-xs text-[#78716C]">Basic information about your store.</p>
      </div>
      <div className="px-5 py-5">
        <form action={formAction} className="space-y-5">
          {state?.success === false && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
          )}
          {state?.success === true && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Settings saved.</div>
          )}

          {/* Logo */}
          <div className="space-y-2">
            <label className={labelCls}>Store Logo</label>
            <div className="flex items-center gap-4">
              {logoUrl ? (
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#E5E2DB]">
                  <Image src={logoUrl} alt="Store logo" fill className="object-cover" sizes="64px" />
                  <button
                    type="button"
                    onClick={removeLogo}
                    className="absolute right-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-[#E5E2DB] bg-[#F8F7F4] text-xs text-[#A8A29E]">
                  No logo
                </div>
              )}
              <label className="cursor-pointer">
                <span className="inline-flex items-center gap-2 rounded-lg border border-[#E5E2DB] bg-white px-3 py-2 text-sm font-medium text-[#1C1917] hover:bg-[#F8F7F4]">
                  {logoUploading && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {logoUploading ? "Uploading..." : "Upload logo"}
                </span>
                <input type="file" accept="image/*" className="hidden" disabled={logoUploading} onChange={handleLogoChange} />
              </label>
              {logoError && <p className="text-xs text-red-600">{logoError}</p>}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="name">Store Name</label>
            <input id="name" name="name" className={inputCls} defaultValue={tenant.name} required />
          </div>

          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows={3}
              className="w-full rounded-lg border border-[#E5E2DB] bg-white px-3 py-2 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309] resize-none"
              defaultValue={tenant.description ?? ""}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="contactEmail">Contact Email</label>
              <input id="contactEmail" name="contactEmail" type="email" className={inputCls} defaultValue={tenant.contactEmail ?? ""} />
            </div>
            <div className="space-y-1.5">
              <label className={labelCls} htmlFor="contactPhone">Contact Phone</label>
              <input id="contactPhone" name="contactPhone" className={inputCls} defaultValue={tenant.contactPhone ?? ""} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className={labelCls} htmlFor="address">Address</label>
            <input id="address" name="address" className={inputCls} defaultValue={tenant.address ?? ""} />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
