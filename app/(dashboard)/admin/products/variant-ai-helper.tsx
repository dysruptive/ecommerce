"use client";

import { useState } from "react";
import { Sparkles, Copy, Check, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { VariantRow } from "./product-variants-section";

const PROMPT_TEMPLATE = `I'm adding product variants to my online store. I need you to read my description and output a structured JSON list — nothing else, just the JSON array.

Each variant must be an object with exactly these fields:
- "name": a short label combining all applicable options (e.g. "Blue / 128GB" or "Large / Red")
- "price": the price as a string with two decimal places (e.g. "1200.00")
- "sku": a SKU code string, or "" if I haven't mentioned one
- "stock": the quantity as a string integer (e.g. "5")

Example output format:
[
  { "name": "Blue / 128GB", "price": "1200.00", "sku": "", "stock": "5" },
  { "name": "Black / 128GB", "price": "1200.00", "sku": "", "stock": "1" },
  { "name": "Black / 256GB", "price": "1350.00", "sku": "", "stock": "7" },
  { "name": "Black / 512GB", "price": "1500.00", "sku": "", "stock": "2" },
  { "name": "White / 128GB", "price": "1200.00", "sku": "", "stock": "2" },
  { "name": "White / 256GB", "price": "1350.00", "sku": "", "stock": "3" }
]

Rules:
- One object per variant combination — do not merge combinations
- If a price isn't mentioned for a specific variant, use the base product price
- Output ONLY the JSON array, no explanation text before or after

Here is my product description:
[DESCRIBE YOUR PRODUCT AND VARIANTS HERE]`;

interface VariantAIHelperProps {
  onApply: (variants: VariantRow[]) => void;
}

export function VariantAIHelper({ onApply }: VariantAIHelperProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [pastedJson, setPastedJson] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  function handleCopy() {
    navigator.clipboard.writeText(PROMPT_TEMPLATE).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  function handleApply() {
    setParseError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(pastedJson.trim());
    } catch {
      setParseError("Couldn't parse that — make sure you pasted only the JSON array.");
      return;
    }

    if (!Array.isArray(parsed)) {
      setParseError("Expected a JSON array (starting with [). Paste just the array, nothing else.");
      return;
    }

    const rows: VariantRow[] = [];
    for (const item of parsed) {
      if (typeof item !== "object" || item === null) {
        setParseError("Each item must be an object with name, price, sku, and stock fields.");
        return;
      }
      const { name, price, sku, stock } = item as Record<string, unknown>;
      if (typeof name !== "string" || !name.trim()) {
        setParseError('Each variant needs a "name" field.');
        return;
      }
      rows.push({
        name: String(name).trim(),
        price: String(price ?? "0"),
        sku: String(sku ?? ""),
        stock: String(stock ?? "0"),
      });
    }

    onApply(rows);
    setOpen(false);
    setPastedJson("");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 rounded-lg border border-[#E5E2DB] bg-white px-2.5 py-1 text-xs font-medium text-[#78716C] hover:bg-[#F8F7F4] hover:text-[#1C1917]"
      >
        <Sparkles className="h-3 w-3" />
        Generate with AI
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-[#E5E2DB] bg-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#1C1917]">Generate variants with AI</DialogTitle>
          </DialogHeader>

          <div className="space-y-5 text-sm">
            {/* Step 1 */}
            <div className="space-y-2">
              <p className="font-medium text-[#1C1917]">Step 1 — Copy this prompt</p>
              <p className="text-[#78716C]">
                Paste it into ChatGPT, Claude, or any AI. Replace the last line with
                your actual product description.
              </p>
              <div className="relative rounded-lg border border-[#E5E2DB] bg-[#FAFAF9]">
                <pre className="max-h-48 overflow-y-auto p-3 text-xs text-[#44403C] whitespace-pre-wrap leading-relaxed">
                  {PROMPT_TEMPLATE}
                </pre>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-[#E5E2DB] bg-white px-2 py-1 text-xs font-medium text-[#78716C] hover:bg-[#F8F7F4]"
                >
                  {copied ? (
                    <>
                      <Check className="h-3 w-3 text-green-600" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2">
              <p className="font-medium text-[#1C1917]">Step 2 — Paste the AI's response</p>
              <p className="text-[#78716C]">
                The AI will return a JSON array. Paste it here and click Apply.
              </p>
              <textarea
                rows={6}
                value={pastedJson}
                onChange={(e) => {
                  setPastedJson(e.target.value);
                  setParseError(null);
                }}
                placeholder='[&#10;  { "name": "Blue / 128GB", "price": "1200.00", "sku": "", "stock": "5" },&#10;  ...&#10;]'
                className="w-full resize-none rounded-lg border border-[#E5E2DB] bg-white px-3 py-2.5 font-mono text-xs text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
              />
              {parseError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {parseError}
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                disabled={!pastedJson.trim()}
                onClick={handleApply}
                className="h-9 rounded-lg bg-[#1C1917] px-5 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-40"
              >
                Apply variants
              </button>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setPastedJson("");
                  setParseError(null);
                }}
                className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]"
              >
                Cancel
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
