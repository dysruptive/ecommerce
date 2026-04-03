"use client";

import { useTransition } from "react";
import { X } from "lucide-react";
import { dismissOnboarding } from "@/actions/onboarding";

export function OnboardingDismissButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => dismissOnboarding())}
      disabled={isPending}
      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground disabled:opacity-50"
      aria-label="Dismiss setup checklist"
    >
      <X className="h-3.5 w-3.5" />
      Dismiss
    </button>
  );
}
