// src/app/(routes)/(landing)/preorder/page.tsx
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";
import PreOrderBuilder from "./_components/PreOrderBuilder";

export default async function PreOrderPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const restaurants = await prisma.restaurant.findMany({
    where: {
      approved: true,
      menuItems: {
        some: { available: true },
      },
    },
    select: {
      id: true,
      name: true,
      menuItems: {
        where: { available: true },
        select: {
          id: true,
          name: true,
          price: true,
        },
      },
    },
  });

  return <PreOrderBuilder availableRestaurants={restaurants} />;
}
