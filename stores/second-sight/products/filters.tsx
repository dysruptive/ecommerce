"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useState } from "react";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const triggerCls =
  "h-10 rounded-none border-[#cdc6b3]/60 bg-[#f9f9f7] text-sm text-[#1a1c1b] focus:ring-0 focus:border-[#6c5e06] data-[placeholder]:text-[#5f5e5e]/60";
const contentCls =
  "rounded-none border-[#cdc6b3]/60 bg-[#f9f9f7] p-0 shadow-sm backdrop-blur-none";
const itemCls =
  "rounded-none text-sm text-[#1a1c1b] cursor-pointer data-[highlighted]:!bg-[#f0ede8] data-[highlighted]:!text-[#1a1c1b] [&[data-highlighted]_*]:!text-[#1a1c1b]";

export function SecondSightFilters({
  categories,
  currentCategory,
  currentSort,
  currentQuery,
}: {
  categories: { slug: string; name: string }[];
  currentCategory?: string;
  currentSort?: string;
  currentQuery?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(currentQuery ?? "");

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <form
        className="relative flex-1"
        onSubmit={(e) => {
          e.preventDefault();
          updateParam("q", query);
        }}
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5f5e5e]" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search frames..."
          className="h-10 w-full border border-[#cdc6b3]/60 bg-[#f9f9f7] pl-9 pr-4 text-sm text-[#1a1c1b] placeholder:text-[#5f5e5e]/60 focus:border-[#6c5e06] focus:outline-none"
        />
      </form>

      {categories.length > 0 && (
        <Select
          value={currentCategory ?? "all"}
          onValueChange={(v) => updateParam("category", v === "all" ? "" : v)}
        >
          <SelectTrigger className={`w-full sm:w-44 ${triggerCls}`}>
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="all" className={itemCls}>
              All Categories
            </SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug} className={itemCls}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      <Select
          value={currentSort ?? "newest"}
          onValueChange={(v) => updateParam("sort", v === "newest" ? "" : v)}
        >
          <SelectTrigger className={`w-full sm:w-44 ${triggerCls}`}>
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className={contentCls}>
            <SelectItem value="newest" className={itemCls}>
              Newest
            </SelectItem>
            <SelectItem value="price-asc" className={itemCls}>
              Price: Low to High
            </SelectItem>
            <SelectItem value="price-desc" className={itemCls}>
              Price: High to Low
            </SelectItem>
          </SelectContent>
        </Select>
    </div>
  );
}
