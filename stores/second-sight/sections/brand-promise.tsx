const PROMISES = [
  {
    number: "01",
    title: "Premium Materials",
    body: "Acetate and stainless steel frames built to last years, not months.",
  },
  {
    number: "02",
    title: "Prices That Fit",
    body: "Quality eyewear shouldn't cost a fortune. Frames start from ₵299.",
  },
  {
    number: "03",
    title: "Prescription Ready",
    body: "Every frame can be fitted with your lenses. Just bring your prescription.",
  },
];

export function BrandPromise() {
  return (
    <section className="bg-stone-900 py-20 text-stone-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl font-bold tracking-tight">Why Second Sight</h2>
        </div>

        <div className="grid grid-cols-1 gap-0 sm:grid-cols-3 sm:divide-x sm:divide-stone-700">
          {PROMISES.map((promise) => (
            <div
              key={promise.number}
              className="border-t border-stone-700 py-8 sm:border-none sm:px-8 first:sm:pl-0 last:sm:pr-0"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500">
                {promise.number}
              </span>
              <h3 className="mt-4 text-lg font-semibold">{promise.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-400">
                {promise.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
