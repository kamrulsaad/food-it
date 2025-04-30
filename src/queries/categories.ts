"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCategoryStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const category = await prisma.category.findUnique({ where: { id } });
  if (!category) return;

  await prisma.category.update({
    where: { id },
    data: { available: !category.available },
  });

  revalidatePath("/dash/admin/categories");
}

export async function deleteCategoriesById(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.category.delete({ where: { id } });

  revalidatePath("/dash/admin/categories");
}

export async function categoryExists(name: string) {
  const category = await prisma.category.findUnique({
    where: { name },
  });
  return !!category;
}
