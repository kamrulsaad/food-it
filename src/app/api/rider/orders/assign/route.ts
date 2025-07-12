// File: /app/api/rider/orders/assign/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { OrderStatus } from "../../../../../../prisma/generated/prisma";

export async function POST(req: Request) {
  try {
    const user = await authMiddleware();

    if (!user || user.role !== "RIDER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId }: { orderId: string } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const rider = await prisma.rider.findUnique({
      where: { email: user.email ?? "" },
    });

    if (!rider) {
      return NextResponse.json(
        { error: "Rider profile not found" },
        { status: 404 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order || order.status !== OrderStatus.ACCEPTED_BY_RESTAURANT) {
      return NextResponse.json(
        { error: "Invalid order status" },
        { status: 400 }
      );
    }

    await prisma.order.update({
      where: { id: orderId },
      data: {
        riderId: rider.id,
        status: OrderStatus.RIDER_ASSIGNED,
        riderAssignedAt: new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Order assignment error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
