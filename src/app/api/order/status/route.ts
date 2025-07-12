import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { updateOrderStatus } from "@/lib/update-order-status";
import { OrderStatus } from "../../../../../prisma/generated/prisma";

export async function PATCH(req: Request) {
  try {
    const user = await authMiddleware();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, status }: { orderId: string; status: OrderStatus } =
      await req.json();

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { restaurant: true, rider: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const isOwner = order.restaurant.ownerId === user.clerkId;
    const isRider = order.rider?.email === user.email;

    if (!isOwner && !isRider) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // -------------------------
    // STATUS PERMISSION LOGIC
    // -------------------------

    // Restaurant restrictions
    const restaurantAllowed: OrderStatus[] = [
      "ACCEPTED_BY_RESTAURANT",
      "READY_FOR_PICKUP",
      "CANCELLED",
    ];

    // Rider restrictions
    const riderAllowed: OrderStatus[] = [
      "PICKED_UP_BY_RIDER",
      "ON_THE_WAY",
      "DELIVERED",
    ];

    if (isOwner && !restaurantAllowed.includes(status)) {
      return NextResponse.json(
        { error: "Restaurant cannot set this status" },
        { status: 403 }
      );
    }

    if (isRider && !riderAllowed.includes(status)) {
      return NextResponse.json(
        { error: "Rider cannot set this status" },
        { status: 403 }
      );
    }

    if (status === "READY_FOR_PICKUP" && !order.riderId) {
      return NextResponse.json(
        { error: "Cannot mark ready until a rider is assigned" },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatus(orderId, status);

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
