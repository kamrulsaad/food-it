import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(
  _: Request,
  { params }: { params: Params["params"] }
) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const restaurant = await prisma.restaurant.findFirst({
      where: { ownerId: userId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "No restaurant found for owner" },
        { status: 403 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        restaurant: true,
        rider: true,
        user: true,
        OrderItem: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    if (!order || order.restaurantId !== restaurant.id) {
      return NextResponse.json(
        { error: "Order not found or unauthorized" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("GET /api/owner/orders/[id] ERROR:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
