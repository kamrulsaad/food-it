import { authMiddleware } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await authMiddleware();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const orders = await prisma.order.findMany({
      where: { userId: user.clerkId },
      orderBy: { createdAt: "desc" },
      include: {
        restaurant: true,
        OrderItem: {
          include: {
            menuItem: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Fetch user orders error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
