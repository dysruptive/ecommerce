export default function StoreProductsLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page header skeleton */}
      <div className="border-b border-gray-100 px-6 pt-24 pb-8 lg:px-8">
        <div className="mx-auto max-w-[1440px]">
          <div className="h-3 w-24 animate-pulse rounded bg-gray-200" />
          <div className="mt-3 h-10 w-48 animate-pulse rounded bg-gray-200" />
          <div className="mt-2 h-3 w-20 animate-pulse rounded bg-gray-200" />
        </div>
      </div>

      {/* Grid skeleton */}
      <div className="mx-auto max-w-[1440px] px-6 py-10 lg:px-8">
        <div className="h-10 w-full animate-pulse rounded bg-gray-100" />
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] animate-pulse rounded-none bg-gray-100" />
              <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-gray-100" />
              <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
