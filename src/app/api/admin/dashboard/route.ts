// /app/api/admin/dashboard/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, startOfDay } from "date-fns";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const orders = await prisma.order.findMany({
    where: { status: "DELIVERED" },
    include: {
      restaurant: true,
    },
  });

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalOrders = orders.length;
  const platformIncome = orders.reduce(
    (sum, o) => sum + (o.totalAmount - o.deliveryFee) * 0.1,
    0
  );

  // Top 5 restaurants by revenue
  const revenueByRestaurant = new Map<
    string,
    { name: string; revenue: number }
  >();

  for (const order of orders) {
    const r = order.restaurant;
    if (!r) continue;
    const prev = revenueByRestaurant.get(r.id);
    revenueByRestaurant.set(r.id, {
      name: r.name,
      revenue: (prev?.revenue || 0) + order.totalAmount,
    });
  }

  const topRestaurants = Array.from(revenueByRestaurant.values())
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const totalTopRevenue = topRestaurants.reduce((sum, r) => sum + r.revenue, 0);
  const topRestaurantShares = topRestaurants.map((r) => ({
    name: r.name,
    value: parseFloat(((r.revenue / totalTopRevenue) * 100).toFixed(2)),
  }));

  // Last 14 days daily revenue
  const dailyRevenue = Array.from({ length: 14 })
    .map((_, i) => {
      const date = startOfDay(subDays(new Date(), i));

      const label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      }); // e.g., "15 Jul"

      const dayTotal = orders
        .filter((o) => {
          const d = new Date(o.createdAt);
          return (
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          );
        })
        .reduce((sum, o) => sum + o.totalAmount, 0);

      return { day: label, total: dayTotal };
    })
    .reverse(); // So the latest day is last

  // Extra insights
  const largestOrder = orders.reduce(
    (max, o) => (o.totalAmount > max.totalAmount ? o : max),
    orders[0] || null
  );

  return NextResponse.json({
    stats: {
      totalRevenue,
      totalOrders,
      platformIncome,
      largestOrder: {
        id: largestOrder?.id,
        amount: largestOrder?.totalAmount,
        restaurant: largestOrder?.restaurant?.name,
      },
    },
    topRestaurantShares,
    dailyRevenue,
  });
}
