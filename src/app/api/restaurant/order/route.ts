import { NextResponse } from "next/server";
import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const user = await authMiddleware();
    if (!user || user.role !== "RESTATURANT_OWNER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const restaurant = await prisma.restaurant.findUnique({
      where: { ownerId: user.clerkId },
    });

    if (!restaurant) {
      return NextResponse.json(
        { error: "Restaurant not found" },
        { status: 404 }
      );
    }

    const orders = await prisma.order.findMany({
      where: { restaurantId: restaurant.id },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        OrderItem: {
          include: {
            menuItem: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("Owner Orders Fetch Error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
