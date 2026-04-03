"use client";

import { useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Search } from "lucide-react";

export function StyleHubFilters({
  categories,
  filters,
}: {
  categories: { slug: string; name: string }[];
  filters: { category?: string; q?: string; sort?: string };
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(filters.q ?? "");

  function setParam(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) p.set(key, value);
    else p.delete(key);
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="mb-8 flex flex-wrap items-center gap-3">
      <button
        onClick={() => setParam("category", "")}
        className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${!filters.category ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"}`}
      >
        All
      </button>
      {categories.map((c) => (
        <button
          key={c.slug}
          onClick={() => setParam("category", c.slug)}
          className={`px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors ${filters.category === c.slug ? "bg-zinc-900 text-white" : "border border-zinc-200 text-zinc-500 hover:border-zinc-900 hover:text-zinc-900"}`}
        >
          {c.name}
        </button>
      ))}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setParam("q", query);
        }}
        className="relative ml-auto"
      >
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search..."
          className="border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none"
        />
      </form>
    </div>
  );
}
