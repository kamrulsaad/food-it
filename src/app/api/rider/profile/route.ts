// /app/api/rider/profile/route.ts
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { startOfMonth, subMonths } from "date-fns";
import prisma from "@/lib/prisma";

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

  // Generate monthly income data (last 6 months)
  const monthlyData = Array.from({ length: 6 })
    .map((_, i) => {
      const date = subMonths(startOfMonth(new Date()), i);
      const label = date.toLocaleString("default", {
        month: "short",
        year: "2-digit",
      });

      const monthTotal = rider.Order.filter((o) => {
        const createdAt = new Date(o.createdAt);
        return (
          createdAt.getMonth() === date.getMonth() &&
          createdAt.getFullYear() === date.getFullYear()
        );
      }).reduce((sum, o) => sum + o.deliveryFee, 0);

      return { month: label, income: monthTotal };
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
    monthlyData,
  });
}
