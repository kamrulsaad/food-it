import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json([], { status: 401 });

  // Fetch preorders for this user with schedule and restaurant/menu info
  const preOrders = await prisma.preOrder.findMany({
    where: { userId },
    include: {
      schedule: true,
      _count: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Get all unique menuItem IDs
  const allItems = preOrders.flatMap((p) =>
    p.schedule.flatMap((s) =>
      (s.menuItems as { itemId: string }[]).map((i) => i.itemId)
    )
  );

  const menuItems = await prisma.menuItem.findMany({
    where: { id: { in: allItems } },
    select: {
      id: true,
      name: true,
      price: true,
      restaurant: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });

  const priceMap = new Map(menuItems.map((i) => [i.id, i]));

  const enriched = preOrders.map((preOrder) => ({
    id: preOrder.id,
    status: preOrder.status,
    totalAmount: preOrder.totalAmount,
    discount: preOrder.discountAmount || 0,
    recurring: preOrder.recurring,
    days: preOrder.days,
    createdAt: preOrder.createdAt,
    schedule: preOrder.schedule.map((s) => ({
      id: s.id,
      scheduledFor: s.scheduledFor,
      mealSlot: s.mealSlot,
      restaurantId: s.restaurantId,
      restaurantName:
        menuItems.find((m) => m.restaurant.id === s.restaurantId)?.restaurant
          .name || "Unknown",
      items: (s.menuItems as { itemId: string; quantity: number }[]).map(
        (item) => {
          const details = priceMap.get(item.itemId);
          return {
            name: details?.name || "Item",
            price: details?.price || 0,
            quantity: item.quantity,
          };
        }
      ),
    })),
  }));

  return NextResponse.json(enriched);
}
