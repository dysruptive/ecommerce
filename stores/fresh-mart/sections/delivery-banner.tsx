import Link from "next/link";

export function DeliveryBanner() {
  return (
    <section className="bg-green-700 py-10 text-center text-white">
      <p className="text-xl font-bold">Free delivery on orders over GHS 150 🚚</p>
      <p className="mt-1 text-sm text-green-200">Accra Metro, Tema, and Greater Accra regions</p>
      <Link
        href="/products"
        className="mt-4 inline-block rounded-md bg-white px-6 py-2.5 text-sm font-semibold text-green-800 hover:opacity-90"
      >
        Start Shopping
      </Link>
    </section>
  );
}
