"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { productSchema } from "@/lib/validations/product";
import { revalidatePath } from "next/cache";
import { z } from "zod";

type ActionResult = { success: true } | { success: false; error: string };

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

const imageSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  altText: z.string().optional(),
  position: z.number().int().min(0),
});

const variantSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1),
  sku: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().min(0),
});

function parseProductForm(formData: FormData) {
  return productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    compareAtPrice: formData.get("compareAtPrice") || undefined,
    sku: formData.get("sku"),
    stock: formData.get("stock"),
    trackStock: formData.get("trackStock") === "on",
    isPublished: formData.get("isPublished") === "on",
    categoryId: formData.get("categoryId") || undefined,
  });
}

function parseImagesJson(
  raw: FormDataEntryValue | null,
): z.infer<typeof imageSchema>[] {
  if (!raw || typeof raw !== "string" || raw === "[]" || raw === "") return [];
  try {
    return z.array(imageSchema).parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

function parseVariantsJson(
  raw: FormDataEntryValue | null,
): z.infer<typeof variantSchema>[] {
  if (!raw || typeof raw !== "string" || raw === "[]" || raw === "") return [];
  try {
    return z.array(variantSchema).parse(JSON.parse(raw));
  } catch {
    return [];
  }
}

export async function createProduct(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = parseProductForm(formData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const slug = slugify(parsed.data.name);
    const existing = await prisma.product.findUnique({
      where: { tenantId_slug: { tenantId, slug } },
    });
    if (existing) {
      return { success: false, error: "A product with this name already exists." };
    }

    const images = parseImagesJson(formData.get("imagesJson"));
    const variants = parseVariantsJson(formData.get("variantsJson"));

    await prisma.product.create({
      data: {
        tenantId,
        name: parsed.data.name,
        slug,
        description: parsed.data.description || null,
        price: parsed.data.price,
        compareAtPrice: parsed.data.compareAtPrice
          ? Number(parsed.data.compareAtPrice)
          : null,
        sku: parsed.data.sku || null,
        stock: parsed.data.stock,
        trackStock: parsed.data.trackStock,
        isPublished: parsed.data.isPublished,
        categoryId: parsed.data.categoryId || null,
        images: {
          create: images.map((img) => ({
            url: img.url,
            altText: img.altText || null,
            position: img.position,
          })),
        },
        variants: {
          create: variants.map((v) => ({
            name: v.name,
            sku: v.sku || null,
            price: v.price,
            stock: v.stock,
          })),
        },
      },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("createProduct error:", error);
    return { success: false, error: "Failed to create product." };
  }
}

export async function updateProduct(
  productId: string,
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const parsed = parseProductForm(formData);

    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0].message };
    }

    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId },
      include: { images: true, variants: true },
    });
    if (!product) {
      return { success: false, error: "Product not found." };
    }

    const slug = slugify(parsed.data.name);
    if (slug !== product.slug) {
      const existing = await prisma.product.findUnique({
        where: { tenantId_slug: { tenantId, slug } },
      });
      if (existing) {
        return { success: false, error: "A product with this name already exists." };
      }
    }

    const images = parseImagesJson(formData.get("imagesJson"));
    const variants = parseVariantsJson(formData.get("variantsJson"));

    // Determine which existing images to keep vs delete
    const keptImageIds = new Set(
      images.filter((img) => img.id).map((img) => img.id!),
    );
    const imageIdsToDelete = product.images
      .filter((img) => !keptImageIds.has(img.id))
      .map((img) => img.id);

    // Determine which existing variants to keep vs delete
    const keptVariantIds = new Set(
      variants.filter((v) => v.id).map((v) => v.id!),
    );
    const variantIdsToDelete = product.variants
      .filter((v) => !keptVariantIds.has(v.id))
      .map((v) => v.id);

    await prisma.$transaction([
      // Delete removed images
      ...(imageIdsToDelete.length > 0
        ? [prisma.productImage.deleteMany({ where: { id: { in: imageIdsToDelete } } })]
        : []),
      // Update/create images
      ...images.map((img) =>
        img.id
          ? prisma.productImage.update({
              where: { id: img.id },
              data: { position: img.position, altText: img.altText || null },
            })
          : prisma.productImage.create({
              data: {
                productId,
                url: img.url,
                altText: img.altText || null,
                position: img.position,
              },
            }),
      ),
      // Delete removed variants
      ...(variantIdsToDelete.length > 0
        ? [prisma.productVariant.deleteMany({ where: { id: { in: variantIdsToDelete } } })]
        : []),
      // Update/create variants
      ...variants.map((v) =>
        v.id
          ? prisma.productVariant.update({
              where: { id: v.id },
              data: {
                name: v.name,
                sku: v.sku || null,
                price: v.price,
                stock: v.stock,
              },
            })
          : prisma.productVariant.create({
              data: {
                productId,
                name: v.name,
                sku: v.sku || null,
                price: v.price,
                stock: v.stock,
              },
            }),
      ),
      // Update the product itself
      prisma.product.update({
        where: { id: productId },
        data: {
          name: parsed.data.name,
          slug,
          description: parsed.data.description || null,
          price: parsed.data.price,
          compareAtPrice: parsed.data.compareAtPrice
            ? Number(parsed.data.compareAtPrice)
            : null,
          sku: parsed.data.sku || null,
          stock: parsed.data.stock,
          trackStock: parsed.data.trackStock,
          isPublished: parsed.data.isPublished,
          categoryId: parsed.data.categoryId || null,
        },
      }),
    ]);

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("updateProduct error:", error);
    return { success: false, error: "Failed to update product." };
  }
}

export async function archiveProduct(productId: string): Promise<ActionResult> {
  try {
    const tenantId = await getTenantId();
    const product = await prisma.product.findFirst({
      where: { id: productId, tenantId },
    });
    if (!product) {
      return { success: false, error: "Product not found." };
    }

    await prisma.product.update({
      where: { id: productId },
      data: { isArchived: true, isPublished: false },
    });

    revalidatePath("/admin/products");
    return { success: true };
  } catch (error) {
    console.error("archiveProduct error:", error);
    return { success: false, error: "Failed to archive product." };
  }
}
