const TRUST_BADGES = [
  { icon: "🌿", title: "Farm Fresh", body: "Sourced directly from local farmers every morning" },
  { icon: "⚡", title: "Same-Day Delivery", body: "Order by noon, delivered to your door by evening" },
  { icon: "✅", title: "Quality Guarantee", body: "Not satisfied? We'll replace it or refund you" },
];

export function TrustBadges() {
  return (
    <section className="border-b bg-green-50">
      <div className="mx-auto grid max-w-6xl grid-cols-1 divide-y px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {TRUST_BADGES.map((badge) => (
          <div key={badge.title} className="flex items-start gap-4 px-6 py-6">
            <span className="text-3xl">{badge.icon}</span>
            <div>
              <p className="font-semibold text-green-900">{badge.title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{badge.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
