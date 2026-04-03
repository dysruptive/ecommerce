"use client";

import Link from "next/link";
import { MoreHorizontal, Pencil, Archive } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { archiveProduct } from "@/actions/products";

interface Product {
  id: string;
  name: string;
  price: string | number;
  stock: number;
  isPublished: boolean;
  category: { name: string } | null;
}

export function ProductsTable({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-[#E5E2DB] bg-white p-10 text-center">
        <p className="text-sm text-[#A8A29E]">No products yet.</p>
        <Link
          href="/admin/products/new"
          className="mt-2 inline-block text-sm font-medium text-[#B45309] hover:underline underline-offset-2"
        >
          Add your first product →
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[#E5E2DB] bg-white">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#E5E2DB] bg-[#F8F7F4]">
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Category</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Price (₵)</th>
            <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Stock</th>
            <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[#A8A29E]">Status</th>
            <th className="w-10 px-4 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F5F3EE]">
          {products.map((product) => (
            <tr key={product.id} className="group hover:bg-[#FAFAF8]">
              <td className="px-4 py-3.5">
                <Link
                  href={`/admin/products/${product.id}`}
                  className="font-medium text-[#1C1917] hover:text-[#B45309]"
                >
                  {product.name}
                </Link>
              </td>
              <td className="px-4 py-3.5 text-[#78716C]">
                {product.category?.name ?? <span className="text-[#A8A29E]">—</span>}
              </td>
              <td className="px-4 py-3.5 text-right tabular-nums font-medium text-[#1C1917]">
                {Number(product.price).toFixed(2)}
              </td>
              <td className={`px-4 py-3.5 text-right tabular-nums font-medium ${product.stock <= 5 ? "text-red-600" : "text-[#1C1917]"}`}>
                {product.stock}
              </td>
              <td className="px-4 py-3.5">
                <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${product.isPublished ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"}`}>
                  {product.isPublished ? "Published" : "Draft"}
                </span>
              </td>
              <td className="px-4 py-3.5">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex h-8 w-8 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-[#F0EDE8] hover:text-[#1C1917]">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="border-[#E5E2DB]">
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/products/${product.id}`} className="cursor-pointer">
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={async () => {
                        if (confirm("Archive this product?")) {
                          await archiveProduct(product.id);
                        }
                      }}
                    >
                      <Archive className="mr-2 h-4 w-4" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
