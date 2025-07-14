import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { addDays, format, startOfDay, endOfDay } from "date-fns";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    select: { id: true },
  });

  const restaurantIds = restaurants.map((r) => r.id);
  if (!restaurantIds.length) return NextResponse.json({}, { status: 200 });

  const today = new Date();
  const daysMap: Record<string, unknown[]> = {};

  for (let i = 0; i < 7; i++) {
    const day = addDays(today, i);
    const label = format(day, "yyyy-MM-dd");

    const dayStart = startOfDay(day);
    const dayEnd = endOfDay(day);

    const preorders = await prisma.preOrder.findMany({
      where: {
        restaurantId: { in: restaurantIds },
        scheduledDate: {
          gte: dayStart,
          lte: dayEnd,
        },
        status: {
          in: ["PENDING", "CONFIRMED"],
        },
      },
      include: {
        user: {
          select: { email: true },
        },
        PreOrderItem: {
          include: {
            menuItem: {
              select: { name: true, price: true },
            },
          },
        },
      },
      orderBy: {
        scheduledDate: "asc",
      },
    });

    daysMap[label] = preorders.map((p) => ({
      id: p.id,
      scheduledDate: p.scheduledDate,
      mealSlot: p.mealSlot,
      status: p.status,
      customer: {
        email: p.user?.email || null,
        address: p.address || null,
      },
      items: p.PreOrderItem.map((item) => ({
        name: item.menuItem.name,
        price: item.menuItem.price,
        quantity: item.quantity,
      })),
    }));
  }

  return NextResponse.json(daysMap);
}
