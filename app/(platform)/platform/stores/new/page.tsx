import { CreateStoreForm } from "@/components/platform/create-store-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewStorePage() {
  return (
    <div className="p-6 lg:p-8">
      <Link
        href="/platform/stores"
        className="mb-6 flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900"
      >
        <ArrowLeft className="h-4 w-4" />
        Stores
      </Link>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-zinc-900">New Store</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Create a store and generate an invite link for the owner.
        </p>
      </div>
      <div className="max-w-2xl">
        <div className="rounded-lg border border-zinc-200 bg-white p-6">
          <CreateStoreForm />
        </div>
      </div>
    </div>
  );
}
