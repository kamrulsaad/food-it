import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Find the restaurant(s) owned by this user
  const restaurants = await prisma.restaurant.findMany({
    where: {
      ownerId: userId,
    },
    select: {
      id: true,
    },
  });

  const restaurantIds = restaurants.map((r) => r.id);

  if (restaurantIds.length === 0) {
    return NextResponse.json([], { status: 200 });
  }

  // Fetch upcoming preorders
  const preorders = await prisma.preOrder.findMany({
    where: {
      restaurantId: { in: restaurantIds },
      scheduledDate: {
        gte: new Date(),
      },
      status: {
        in: ["PENDING", "CONFIRMED"],
      },
    },
    include: {
      user: {
        select: {
          email: true,
        },
      },
      PreOrderItem: {
        include: {
          menuItem: {
            select: {
              name: true,
              price: true,
            },
          },
        },
      },
    },
    orderBy: {
      scheduledDate: "asc",
    },
  });

  const result = preorders.map((p) => ({
    id: p.id,
    scheduledDate: p.scheduledDate,
    mealSlot: p.mealSlot,
    status: p.status,
    customer: {
      email: p.user?.email || null,
      address: p.address || null,
    },
    items: p.PreOrderItem.map((item) => ({
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
    })),
  }));

  return NextResponse.json(result);
}
