"use client";

import { useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";

export function ProductSearch({ current }: { current?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  function apply(q: string | undefined) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    if (q) params.set("q", q);
    else params.delete("q");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply(inputRef.current?.value || undefined);
      }}
      className="relative flex items-center"
    >
      <Search className="pointer-events-none absolute left-3 h-4 w-4 text-[#A8A29E]" />
      <input
        ref={inputRef}
        defaultValue={current ?? ""}
        placeholder="Search products…"
        className="h-9 w-full max-w-sm rounded-lg border border-[#E5E2DB] bg-white pl-9 pr-9 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]"
      />
      {current && (
        <button
          type="button"
          onClick={() => {
            if (inputRef.current) inputRef.current.value = "";
            apply(undefined);
          }}
          className="absolute left-[calc(theme(spacing.9)+theme(spacing.px))] right-auto text-[#A8A29E] hover:text-[#78716C]"
          style={{ left: "auto", right: "10px" }}
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </form>
  );
}
