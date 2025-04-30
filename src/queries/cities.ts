"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function toggleCityStatus(formData: FormData) {
  const id = formData.get("id") as string;
  const city = await prisma.city.findUnique({ where: { id } });
  if (!city) return;

  await prisma.city.update({
    where: { id },
    data: { available: !city.available },
  });

  revalidatePath("/dash/admin/cities");
}

export async function deleteCityById(formData: FormData) {
  const id = formData.get("id") as string;
  await prisma.city.delete({ where: { id } });

  revalidatePath("/dash/admin/cities");
}

export async function cityExists(name: string) {
  const city = await prisma.city.findUnique({
    where: { name },
  });
  return !!city;
}