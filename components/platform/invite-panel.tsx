"use client";

import { useState } from "react";
import { regenerateInvite } from "@/actions/platform";
import { Copy, Check, RefreshCw, AlertTriangle } from "lucide-react";

interface InvitePanelProps {
  slug: string;
  initialInviteUrl: string | null;
  expiresAt: string | null;
}

export function InvitePanel({ slug, initialInviteUrl, expiresAt }: InvitePanelProps) {
  const [inviteUrl, setInviteUrl] = useState(initialInviteUrl);
  const [currentExpiresAt, setCurrentExpiresAt] = useState(
    expiresAt ? new Date(expiresAt) : null,
  );
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isExpired = currentExpiresAt ? new Date() > currentExpiresAt : false;

  async function handleCopy() {
    if (!inviteUrl) return;
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  async function handleRegenerate() {
    setIsRegenerating(true);
    setError(null);
    const result = await regenerateInvite(slug);
    setIsRegenerating(false);
    if (result.success) {
      setInviteUrl(result.inviteUrl);
      setCurrentExpiresAt(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-zinc-900">Owner Invite</h2>
        {isExpired ? (
          <span className="flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-700">
            <AlertTriangle className="h-3 w-3" />
            Expired
          </span>
        ) : inviteUrl ? (
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
            Active
          </span>
        ) : null}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">{error}</p>}

      {inviteUrl ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2 rounded-md border border-zinc-200 bg-zinc-50 p-2.5">
            <code className="flex-1 truncate text-xs text-zinc-700">{inviteUrl}</code>
            <button
              type="button"
              onClick={handleCopy}
              className="shrink-0 rounded p-1.5 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600"
              title="Copy invite link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
          {currentExpiresAt && (
            <p className="text-xs text-zinc-400">
              {isExpired ? "Expired" : "Expires"}{" "}
              {currentExpiresAt.toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          )}
        </div>
      ) : (
        <p className="text-sm text-zinc-500">No invite link generated.</p>
      )}

      <button
        type="button"
        onClick={handleRegenerate}
        disabled={isRegenerating}
        className="mt-4 flex items-center gap-1.5 text-xs text-zinc-500 transition-colors hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <RefreshCw
          className={`h-3.5 w-3.5 ${isRegenerating ? "animate-spin" : ""}`}
        />
        {isRegenerating ? "Regenerating..." : "Regenerate Link"}
      </button>
    </div>
  );
}
