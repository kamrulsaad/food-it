import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { OrderStatus } from "../../../../../prisma/generated/prisma";

// Step 1: Map each status to its timestamp field
type TimestampField =
  | "acceptedAt"
  | "riderAssignedAt"
  | "readyAt"
  | "pickedUpAt"
  | "onTheWayAt"
  | "deliveredAt"
  | "cancelledAt";

const statusTimestampMap: Record<OrderStatus, TimestampField | null> = {
  PLACED: null,
  ACCEPTED_BY_RESTAURANT: "acceptedAt",
  RIDER_ASSIGNED: "riderAssignedAt",
  READY_FOR_PICKUP: "readyAt",
  PICKED_UP_BY_RIDER: "pickedUpAt",
  ON_THE_WAY: "onTheWayAt",
  DELIVERED: "deliveredAt",
  CANCELLED: "cancelledAt",
};

// Step 2: API route handler
export async function PATCH(req: Request) {
  try {
    const user = await authMiddleware();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId, status }: { orderId: string; status: OrderStatus } = body;

    if (!orderId || !status) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const timestampField = statusTimestampMap[status];

    const updateData: {
      status: OrderStatus;
    } & Partial<Record<TimestampField, Date>> = {
      status,
    };

    if (timestampField) {
      updateData[timestampField] = new Date();
    }

    const updated = await prisma.order.update({
      where: { id: orderId },
      data: updateData,
    });

    return NextResponse.json({ success: true, order: updated });
  } catch (error) {
    console.error("Order status update error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
