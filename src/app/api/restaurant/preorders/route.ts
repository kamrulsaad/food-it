// /api/restaurant/preorders/route.ts
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurant = await prisma.restaurant.findUnique({
    where: { ownerId: userId },
  });
  if (!restaurant)
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );

  const schedules = await prisma.preOrderSchedule.findMany({
    where: {
      restaurantId: restaurant.id,
      preOrder: { status: "CONFIRMED" },
      isDelivered: false,
    },
    include: { preOrder: true },
    orderBy: { scheduledFor: "asc" },
  });

  // Fetch user info
  const userIds = schedules.map((s) => s.preOrder.userId);
  const users = await prisma.user.findMany({
    where: { clerkId: { in: userIds } },
    select: { clerkId: true, address: true, email: true },
  });
  const userMap = new Map(users.map((u) => [u.clerkId, u]));

  // Collect all itemIds
  const allItemIds = schedules.flatMap((s) =>
    (s.menuItems as { itemId: string }[]).map((i) => i.itemId)
  );
  const items = await prisma.menuItem.findMany({
    where: { id: { in: allItemIds } },
    select: { id: true, name: true, price: true },
  });
  const itemMap = new Map(items.map((i) => [i.id, i]));

  const result = schedules.map((s) => ({
    ...s,
    user: userMap.get(s.preOrder.userId) || null,
    enrichedItems: (s.menuItems as { itemId: string; quantity: number }[]).map(
      (entry) => ({
        ...entry,
        name: itemMap.get(entry.itemId)?.name || "Item",
        price: itemMap.get(entry.itemId)?.price || 0,
        isDelivered: s.isDelivered,
      })
    ),
  }));

  return NextResponse.json(result);
}
