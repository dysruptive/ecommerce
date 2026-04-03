"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const RANGES = [
  { key: "all", label: "All time" },
  { key: "today", label: "Today" },
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
];

export function RangeTabs({ current }: { current: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setRange(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (key === "all") params.delete("range");
    else params.set("range", key);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-0.5 rounded-lg border border-[#E5E2DB] bg-white p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.key}
          onClick={() => setRange(r.key)}
          className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            current === r.key
              ? "bg-[#FEF3C7] text-[#92400E]"
              : "text-[#78716C] hover:text-[#1C1917]"
          }`}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}
