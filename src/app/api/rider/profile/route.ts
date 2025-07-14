// /app/api/rider/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { subDays, startOfDay } from "date-fns";

export async function GET() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rider = await prisma.rider.findUnique({
    where: { clerkId: userId },
    include: {
      city: true,
      Order: {
        where: { status: "DELIVERED" },
        include: { restaurant: true },
      },
    },
  });

  if (!rider) {
    return NextResponse.json({ error: "Rider not found" }, { status: 404 });
  }

  const totalIncome = rider.Order.reduce(
    (sum, order) => sum + order.deliveryFee,
    0
  );

  // ...

  // Generate daily income data (last 30 days)
  const today = startOfDay(new Date());
  const dailyData = Array.from({ length: 30 })
    .map((_, i) => {
      const date = subDays(today, i);
      const label = date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
      });

      const dayTotal = rider.Order.filter((o) => {
        const createdAt = new Date(o.createdAt);
        return (
          createdAt.getDate() === date.getDate() &&
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getFullYear() === date.getFullYear()
        );
      }).reduce((sum, o) => sum + o.deliveryFee, 0);

      return { date: label, income: dayTotal };
    })
    .reverse();

  return NextResponse.json({
    rider: {
      name: rider.name,
      email: rider.email,
      phone: rider.phone,
      vehicleType: rider.vehicleType,
      city: rider.city.name,
    },
    orders: rider.Order,
    totalIncome,
    dailyData,
  });
}
