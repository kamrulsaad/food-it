import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

const defaultMealTimes = {
  BREAKFAST: 8,
  LUNCH: 13,
  DINNER: 21,
};

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { startDate, days, selectedItems } = body;

    if (!startDate || !days || !selectedItems?.length)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const baseDate = new Date(startDate);
    const preOrdersToCreate = [];

    for (let d = 0; d < days; d++) {
      const dayDate = new Date(baseDate);
      dayDate.setDate(baseDate.getDate() + d);

      for (const item of selectedItems) {
        const hour =
          defaultMealTimes[item.mealSlot as keyof typeof defaultMealTimes];
        const scheduledDate = new Date(dayDate);
        scheduledDate.setHours(hour, 0, 0, 0);

        preOrdersToCreate.push({
          userId,
          restaurantId: item.restaurantId,
          mealSlot: item.mealSlot,
          scheduledDate,
          items: {
            create: [
              {
                menuItemId: item.itemId,
                quantity: item.quantity,
              },
            ],
          },
        });
      }
    }

    // Save all preorders
    await prisma.$transaction(
      preOrdersToCreate.map((preorder) =>
        prisma.preOrder.create({
          data: {
            userId: preorder.userId,
            restaurantId: preorder.restaurantId,
            mealSlot: preorder.mealSlot,
            scheduledDate: preorder.scheduledDate,
            PreOrderItem: preorder.items,
          },
        })
      )
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Pre-order error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
