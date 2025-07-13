import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  const preOrders = await prisma.preOrder.findMany({
    where: { userId },
    include: {
      PreOrderItem: {
        include: {
          menuItem: {
            select: {
              name: true,
              price: true,
              restaurant: {
                select: { name: true },
              },
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const enriched = preOrders.map((p) => ({
    id: p.id,
    status: p.status,
    scheduledDate: p.scheduledDate,
    mealSlot: p.mealSlot,
    restaurantName: p.PreOrderItem[0]?.menuItem.restaurant.name || "Unknown",
    createdAt: p.createdAt,
    items: p.PreOrderItem.map((i) => ({
      name: i.menuItem.name,
      price: i.menuItem.price,
      quantity: i.quantity,
    })),
  }));

  return NextResponse.json(enriched);
}
