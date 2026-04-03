"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { createTenant } from "@/actions/platform";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Copy, Check } from "lucide-react";

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ColorField({
  name,
  label,
  defaultValue,
}: {
  name: string;
  label: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-9 w-12 cursor-pointer rounded border border-zinc-300 p-0.5"
        />
        <Input
          name={name}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="font-mono text-sm"
        />
      </div>
    </div>
  );
}

export function CreateStoreForm() {
  const [state, action, isPending] = useActionState(createTenant, null);
  const [copied, setCopied] = useState(false);
  const [slugValue, setSlugValue] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);

  async function handleCopy(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!slugEdited) {
      setSlugValue(toSlug(e.target.value));
    }
  }

  if (state?.success) {
    return (
      <div className="space-y-5">
        <div className="flex items-start gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          <div>
            <p className="font-medium text-emerald-900">Store created</p>
            <p className="mt-0.5 text-sm text-emerald-700">
              Share this invite link with the store owner. It expires in 7 days.
            </p>
          </div>
        </div>
        <div>
          <Label className="mb-1.5 block">Invite Link</Label>
          <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-3">
            <code className="flex-1 truncate text-xs text-zinc-700">
              {state.inviteUrl}
            </code>
            <button
              type="button"
              onClick={() => handleCopy(state.inviteUrl)}
              className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/platform/stores/${state.slug}`}>View Store</Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Create Another
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state && !state.success && !state.fieldErrors && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {state.error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">
            Store Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Fresh Mart"
            onChange={handleNameChange}
          />
          {state && !state.success && state.fieldErrors?.name && (
            <p className="text-xs text-red-600">{state.fieldErrors.name[0]}</p>
          )}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="slug">
            Slug <span className="text-red-500">*</span>
          </Label>
          <Input
            id="slug"
            name="slug"
            placeholder="fresh-mart"
            value={slugValue}
            onChange={(e) => {
              setSlugValue(e.target.value);
              setSlugEdited(true);
            }}
          />
          {state && !state.success && state.fieldErrors?.slug && (
            <p className="text-xs text-red-600">{state.fieldErrors.slug[0]}</p>
          )}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <ColorField name="primaryColor" label="Primary Color" defaultValue="#1a1c1b" />
        <ColorField name="accentColor" label="Accent Color" defaultValue="#6c5e06" />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="contactEmail">Contact Email</Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          placeholder="hello@store.com"
        />
        {state && !state.success && state.fieldErrors?.contactEmail && (
          <p className="text-xs text-red-600">
            {state.fieldErrors.contactEmail[0]}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="contactPhone">Phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            type="tel"
            placeholder="+233 20 123 4567"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            name="address"
            placeholder="23 Oxford Street, Osu"
          />
        </div>
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Creating Store..." : "Create Store & Generate Invite"}
      </Button>
    </form>
  );
}
