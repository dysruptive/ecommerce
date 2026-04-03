export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-44 animate-pulse rounded-lg bg-[#E5E2DB]" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-xl border border-[#E5E2DB] bg-white" />
        ))}
      </div>
      <div className="h-72 animate-pulse rounded-xl border border-[#E5E2DB] bg-white" />
    </div>
  );
}
