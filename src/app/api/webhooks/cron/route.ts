// src/app/api/webhooks/cron/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("key");

  // Optional: Secure the endpoint with a secret token
  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const preOrders = await prisma.preOrder.findMany({
    where: {
      scheduledDate: { lte: now },
      status: "PENDING",
    },
    include: {
      PreOrderItem: {
        include: {
          menuItem: true, // Needed to calculate totalAmount
        },
      },
    },
  });

  if (!preOrders.length) {
    return NextResponse.json({ message: "No pre-orders to convert." });
  }

  const results = [];

  for (const preorder of preOrders) {
    // Calculate total amount based on menu item price * quantity
    const totalAmount = preorder.PreOrderItem.reduce((sum, item) => {
      return sum + item.quantity * item.menuItem.price;
    }, 0);

    const order = await prisma.order.create({
      data: {
        userId: preorder.userId,
        restaurantId: preorder.restaurantId,
        address: preorder.address || "", // fallback if null
        status: "PLACED",
        isScheduled: true,
        scheduledAt: preorder.scheduledDate,
        totalAmount,
        deliveryFee: 0, // Adjust if needed
        OrderItem: {
          create: preorder.PreOrderItem.map((item) => ({
            menuItemId: item.menuItemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    await prisma.preOrder.update({
      where: { id: preorder.id },
      data: {
        status: "CONFIRMED",
      },
    });

    results.push({ preOrderId: preorder.id, orderId: order.id });
  }

  return NextResponse.json({
    converted: results.length,
    orders: results,
  });
}
