"use client";

import { useState, useEffect, useActionState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { createCategory, updateCategory, deleteCategory } from "@/actions/categories";

interface Category {
  id: string;
  name: string;
  _count: { products: number };
}

const inputCls = "h-9 w-full rounded-lg border border-[#E5E2DB] bg-white px-3 text-sm text-[#1C1917] placeholder:text-[#A8A29E] outline-none focus:border-[#B45309]";

function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const boundUpdate = updateCategory.bind(null, category.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, null);

  if (state?.success) setOpen(false);

  useEffect(() => {
    if (state?.success === false) toast.error(state.error);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-[#F0EDE8] hover:text-[#1C1917]">
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </DialogTrigger>
      <DialogContent className="border-[#E5E2DB] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1C1917]">Edit Category</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#1C1917]">Name</label>
            <input name="name" className={inputCls} defaultValue={category.name} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50">
              {isPending ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setOpen(false)} className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#78716C] hover:bg-[#F8F7F4]">
              Cancel
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesDialog({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createCategory, null);

  useEffect(() => {
    if (!state) return;
    if (state.success) toast.success("Category created.");
    else toast.error(state.error);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="h-9 rounded-lg border border-[#E5E2DB] bg-white px-4 text-sm font-medium text-[#1C1917] hover:bg-[#F8F7F4]">
          Manage Categories
        </button>
      </DialogTrigger>
      <DialogContent className="border-[#E5E2DB] bg-white">
        <DialogHeader>
          <DialogTitle className="text-[#1C1917]">Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {categories.length > 0 && (
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-lg border border-[#E5E2DB] px-3 py-2 text-sm"
                >
                  <span className="text-[#1C1917]">
                    {cat.name}{" "}
                    <span className="text-[#A8A29E]">({cat._count.products})</span>
                  </span>
                  <div className="flex items-center gap-1">
                    <EditCategoryDialog category={cat} />
                    <button
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-[#A8A29E] hover:bg-red-50 hover:text-red-600"
                      onClick={async () => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          const result = await deleteCategory(cat.id);
                          if (!result.success) toast.error(result.error);
                          else toast.success(`"${cat.name}" deleted.`);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="border-t border-[#F5F3EE] pt-4">
            <form action={formAction} className="space-y-3">
              <label className="text-sm font-medium text-[#1C1917]">New Category</label>
              <div className="flex gap-2">
                <input name="name" className={inputCls} placeholder="Category name" required />
                <input type="hidden" name="description" value="" />
                <button type="submit" disabled={isPending} className="h-9 rounded-lg bg-[#1C1917] px-4 text-sm font-medium text-white hover:bg-[#292524] disabled:opacity-50 shrink-0">
                  {isPending ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
