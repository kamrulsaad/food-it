import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subDays, isSameDay, format, isToday } from "date-fns";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const restaurant = await prisma.restaurant.findFirst({
    where: { ownerId: userId },
    include: {
      Order: {
        where: { status: "DELIVERED" },
        include: {
          OrderItem: {
            include: { menuItem: true },
          },
        },
      },
    },
  });

  if (!restaurant) {
    return NextResponse.json(
      { error: "Restaurant not found" },
      { status: 404 }
    );
  }

  const orders = restaurant.Order;

  const calcRestaurantIncome = (order: (typeof orders)[number]) => {
    return (order.totalAmount - order.deliveryFee) * 0.9;
  };

  const totalEarnings = orders.reduce(
    (sum, o) => sum + calcRestaurantIncome(o),
    0
  );

  const todayIncome = orders
    .filter((o) => isToday(new Date(o.createdAt)))
    .reduce((sum, o) => sum + calcRestaurantIncome(o), 0);

  const dailyEarnings = Array.from({ length: 7 }).map((_, i) => {
    const day = subDays(new Date(), 6 - i);
    const label = format(day, "MMM d");

    const total = orders
      .filter((o) => isSameDay(new Date(o.createdAt), day))
      .reduce((sum, o) => sum + calcRestaurantIncome(o), 0);

    return { date: label, total };
  });

  // Top 5 selling items
  const itemMap = new Map<string, { name: string; quantity: number }>();
  for (const order of orders) {
    for (const item of order.OrderItem) {
      const key = item.menuItem.name;
      const existing = itemMap.get(key);
      itemMap.set(key, {
        name: key,
        quantity: (existing?.quantity || 0) + item.quantity,
      });
    }
  }

  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  // Recent orders
  const recentOrders = orders
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5)
    .map((o) => ({
      id: o.id,
      createdAt: o.createdAt,
      totalAmount: o.totalAmount,
    }));

  return NextResponse.json({
    restaurant: {
      name: restaurant.name,
      address: restaurant.address,
    },
    stats: {
      totalEarnings,
      orderCount: orders.length,
      todayIncome, // replaces avgOrderValue
    },
    dailyEarnings,
    topItems,
    recentOrders,
  });
}
