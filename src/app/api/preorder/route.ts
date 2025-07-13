import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { addDays, setHours, setMinutes, setSeconds } from "date-fns";

const MEAL_TIME_MAP = {
  BREAKFAST: { hour: 8, minute: 0 },
  LUNCH: { hour: 13, minute: 0 },
  DINNER: { hour: 21, minute: 0 },
};

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { recurring, days, startDate, selectedItems } = body;

  if (!Array.isArray(selectedItems) || days < 1 || days > 7) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  try {
    const preOrder = await prisma.preOrder.create({
      data: {
        userId,
        recurring,
        days,
        discountAmount: 10, // example static discount
        schedule: {
          create: selectedItems.flatMap((entry) => {
            const { restaurantId, mealSlot, items } = entry;

            const time = MEAL_TIME_MAP[mealSlot as keyof typeof MEAL_TIME_MAP];
            const schedules = [];

            for (let i = 0; i < days; i++) {
              const day = addDays(new Date(startDate), i);
              const scheduledFor = setSeconds(
                setMinutes(setHours(day, time.hour), time.minute),
                0
              );

              schedules.push({
                restaurantId,
                mealSlot,
                scheduledFor,
                menuItems: items,
              });
            }

            return schedules;
          }),
        },
      },
    });

    return NextResponse.json({
      message: "Pre-order placed",
      preOrderId: preOrder.id,
    });
  } catch (err) {
    console.error("Pre-order error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
