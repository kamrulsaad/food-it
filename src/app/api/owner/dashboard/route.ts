import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { subMonths, startOfMonth } from "date-fns";

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
  const totalEarnings = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const avgOrderValue = orders.length > 0 ? totalEarnings / orders.length : 0;

  // Monthly earnings (last 6 months)
  const monthlyEarnings = Array.from({ length: 6 })
    .map((_, i) => {
      const date = subMonths(startOfMonth(new Date()), i);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      const monthlyTotal = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return { month: label, total: monthlyTotal };
    })
    .reverse();

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

  return NextResponse.json({
    restaurant: {
      name: restaurant.name,
      address: restaurant.address,
    },
    stats: {
      totalEarnings,
      orderCount: orders.length,
      avgOrderValue,
    },
    monthlyEarnings,
    topItems,
    recentOrders: orders.slice(-5).reverse(),
  });
}
