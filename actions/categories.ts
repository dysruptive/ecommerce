"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { categorySchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";

type ActionResult = { success: true } | { success: false; error: string };
type CreateInlineResult =
  | { success: true; category: { id: string; name: string } }
  | { success: false; error: string };

async function getTenantId(): Promise<string> {
  const session = await auth();
  if (!session?.user?.tenantId) throw new Error("Unauthorized");
  return session.user.tenantId;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function createCategory(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const slug = slugify(parsed.data.name);
    const existing = await prisma.category.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    if (existing) {
      return { success: false, error: "A category with this name already exists." };
    }

    await prisma.category.create({
      data: {
        tenantId,
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("createCategory error:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function createCategoryInline(
  name: string,
): Promise<CreateInlineResult> {
  try {
    const tenantId = await getTenantId();
    const trimmed = name.trim();
    if (!trimmed) return { success: false, error: "Name is required." };

    const slug = slugify(trimmed);
    const existing = await prisma.category.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    if (existing) {
      return { success: false, error: "A category with this name already exists." };
    }

    const category = await prisma.category.create({
      data: { tenantId, name: trimmed, slug },
      select: { id: true, name: true },
    });

    revalidatePath("/admin/products");
    return { success: true, category };
  } catch (error) {
    console.error("createCategoryInline error:", error);
    return { success: false, error: "Failed to create category." };
  }
}

export async function updateCategory(
  categoryId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = categorySchema.safeParse({
      name: formData.get("name"),
      description: formData.get("description"),
    });

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const category = await prisma.category.findFirst({
      where: { id: categoryId, tenantId },
    });
    if (!category) {
      return { success: false, error: "Category not found." };
    }

    const slug = slugify(parsed.data.name);
    if (slug !== category.slug) {
      const existing = await prisma.category.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
      });
      if (existing) {
        return { success: false, error: "A category with this name already exists." };
      }
    }

    await prisma.category.update({
      where: { id: categoryId },
      data: {
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("updateCategory error:", error);
    return { success: false, error: "Failed to update category." };
  }
}

export async function deleteCategory(categoryId: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const category = await prisma.category.findFirst({
      where: { id: categoryId, tenantId },
      include: { _count: { select: { products: true } } },
    });
    if (!category) {
      return { success: false, error: "Category not found." };
    }
    if (category._count.products > 0) {
      return {
        success: false,
        error: `Cannot delete — ${category._count.products} products are in this category.`,
      };
    }

    await prisma.category.delete({ where: { id: categoryId } });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("deleteCategory error:", error);
    return { success: false, error: "Failed to delete category." };
  }
}
