export default function ProductsLoading() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="h-7 w-28 animate-pulse rounded-lg bg-[#E5E2DB]" />
        <div className="h-9 w-36 animate-pulse rounded-lg bg-[#E5E2DB]" />
      </div>
      <div className="overflow-hidden rounded-xl border border-[#E5E2DB] bg-white">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 border-b border-[#F5F3EE] px-4 py-3.5 last:border-b-0"
          >
            <div className="h-4 flex-1 animate-pulse rounded bg-[#E5E2DB]" />
            <div className="h-4 w-20 animate-pulse rounded bg-[#E5E2DB]" />
            <div className="h-4 w-16 animate-pulse rounded bg-[#E5E2DB]" />
            <div className="h-4 w-12 animate-pulse rounded bg-[#E5E2DB]" />
          </div>
        ))}
      </div>
    </div>
  );
}
