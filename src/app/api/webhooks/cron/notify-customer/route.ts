// src/app/api/webhooks/preorder-reminder/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { sendPreOrderReminderEmail } from "@/lib/mail"; // We'll create this

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("key");

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);

  const upcomingPreOrders = await prisma.preOrder.findMany({
    where: {
      status: "PENDING",
      scheduledDate: {
        gte: now,
        lte: oneHourLater,
      },
    },
    include: {
      PreOrderItem: {
        include: {
          menuItem: true,
        },
      },
      user: {
        select: {
          email: true,
        },
      },
    },
  });
//   console.log("✉️ Running pre-order reminder cron job...");

  for (const preOrder of upcomingPreOrders) {
    if (!preOrder.user?.email) continue;

    await sendPreOrderReminderEmail(
      preOrder.user.email,
      preOrder.PreOrderItem.map(
        (item) => `${item.menuItem.name} × ${item.quantity}`
      ),
      preOrder.scheduledDate.toLocaleString()
    );
  }

  return NextResponse.json({
    notified: upcomingPreOrders.length,
  });
}
