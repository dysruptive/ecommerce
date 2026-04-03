"use client";

import { useActionState, useRef } from "react";
import { updateThemeSettings } from "@/actions/settings";
import type { Tenant } from "@/types";

export function ThemeForm({ tenant }: { tenant: Tenant }) {
  const [state, formAction, isPending] = useActionState(updateThemeSettings, null);
  const primaryTextRef = useRef<HTMLInputElement>(null);
  const accentTextRef = useRef<HTMLInputElement>(null);

  return (
    <div className="rounded-xl border border-[#E5E2DB] bg-white">
      <div className="border-b border-[#E5E2DB] px-5 py-4">
        <p className="text-sm font-semibold text-[#1C1917]">Theme</p>
        <p className="mt-0.5 text-xs text-[#78716C]">Customize colors for your storefront.</p>
      </div>
      <div className="px-5 py-5">
        <form action={formAction} className="space-y-5">
          {state?.success === false && (
            <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{state.error}</div>
          )}
          {state?.success === true && (
            <div className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Theme saved.</div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C1917]" htmlFor="primaryColor">
                Primary Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  defaultValue={tenant.primaryColor}
                  onChange={(e) => {
                    if (primaryTextRef.current) primaryTextRef.current.value = e.target.value;
                  }}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-[#E5E2DB] p-1"
                />
                <input
                  ref={primaryTextRef}
                  defaultValue={tenant.primaryColor}
                  readOnly
                  tabIndex={-1}
                  className="h-10 flex-1 rounded-lg border border-[#E5E2DB] bg-[#F8F7F4] px-3 font-mono text-sm text-[#78716C]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-[#1C1917]" htmlFor="accentColor">
                Accent Color
              </label>
              <div className="flex items-center gap-2">
                <input
                  id="accentColor"
                  name="accentColor"
                  type="color"
                  defaultValue={tenant.accentColor}
                  onChange={(e) => {
                    if (accentTextRef.current) accentTextRef.current.value = e.target.value;
                  }}
                  className="h-10 w-14 cursor-pointer rounded-lg border border-[#E5E2DB] p-1"
                />
                <input
                  ref={accentTextRef}
                  defaultValue={tenant.accentColor}
                  readOnly
                  tabIndex={-1}
                  className="h-10 flex-1 rounded-lg border border-[#E5E2DB] bg-[#F8F7F4] px-3 font-mono text-sm text-[#78716C]"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50"
          >
            {isPending ? "Saving..." : "Save Theme"}
          </button>
        </form>
      </div>
    </div>
  );
}
