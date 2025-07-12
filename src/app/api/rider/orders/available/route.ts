// File: /app/api/rider/orders/available/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { OrderStatus } from "../../../../../../prisma/generated/prisma";

export async function GET() {
  try {
    const user = await authMiddleware();

    if (!user || user.role !== "RIDER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rider = await prisma.rider.findUnique({
      where: { email: user.email ?? "" },
    });

    if (!rider) {
      return NextResponse.json({ error: "Rider not found" }, { status: 404 });
    }

    const activeOrder = await prisma.order.findFirst({
      where: {
        riderId: rider.id,
        status: {
          in: [
            OrderStatus.RIDER_ASSIGNED,
            OrderStatus.READY_FOR_PICKUP,
            OrderStatus.PICKED_UP_BY_RIDER,
            OrderStatus.ON_THE_WAY,
          ],
        },
      },
      include: {
        restaurant: true,
        user: true,
      },
    });

    if (activeOrder) {
      return NextResponse.json({ activeOrder });
    }

    const availableOrders = await prisma.order.findMany({
      where: {
        status: OrderStatus.ACCEPTED_BY_RESTAURANT,
        restaurant: {
          cityId: rider.cityId,
        },
      },
      include: {
        restaurant: true,
        user: true,
      },
    });

    return NextResponse.json({ availableOrders });
  } catch (error) {
    console.error("Fetch available rider orders error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
