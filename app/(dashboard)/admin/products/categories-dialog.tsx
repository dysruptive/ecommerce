"use client";

import { useState, useActionState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

function EditCategoryDialog({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  const boundUpdate = updateCategory.bind(null, category.id);
  const [state, formAction, isPending] = useActionState(boundUpdate, null);

  if (state?.success) {
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7">
          <Pencil className="h-3.5 w-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form action={formAction} className="space-y-3">
          {state?.success === false && (
            <div className="text-sm text-destructive">{state.error}</div>
          )}
          <div className="space-y-2">
            <Label htmlFor={`edit-name-${category.id}`}>Name</Label>
            <Input
              id={`edit-name-${category.id}`}
              name="name"
              defaultValue={category.name}
              required
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={isPending} size="sm">
              {isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function CategoriesDialog({
  categories,
}: {
  categories: Category[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, isPending] = useActionState(createCategory, null);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Categories</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {categories.length > 0 && (
            <div className="space-y-2">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
                >
                  <span>
                    {cat.name}{" "}
                    <span className="text-muted-foreground">
                      ({cat._count.products})
                    </span>
                  </span>
                  <div className="flex items-center gap-1">
                    <EditCategoryDialog category={cat} />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive"
                      onClick={async () => {
                        if (confirm(`Delete "${cat.name}"?`)) {
                          const result = await deleteCategory(cat.id);
                          if (!result.success) alert(result.error);
                        }
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <form action={formAction} className="space-y-3">
            {state?.success === false && (
              <div className="text-sm text-destructive">{state.error}</div>
            )}
            <div className="space-y-2">
              <Label htmlFor="cat-name">New Category</Label>
              <div className="flex gap-2">
                <Input
                  id="cat-name"
                  name="name"
                  placeholder="Category name"
                  required
                />
                <input type="hidden" name="description" value="" />
                <Button type="submit" disabled={isPending} size="sm">
                  {isPending ? "Adding..." : "Add"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
