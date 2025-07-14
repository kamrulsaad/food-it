// src/app/api/webhooks/cron/order-convert/route.ts

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const CRON_SECRET = process.env.CRON_SECRET;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("key");

  if (!CRON_SECRET || token !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const preOrders = await prisma.preOrder.findMany({
    where: {
      scheduledDate: { lte: now },
      status: "CONFIRMED",
    },
    include: {
      restaurant: {
        select: {
          id: true,
          deliveryFee: true,
        },
      },
      PreOrderItem: {
        include: {
          menuItem: true,
        },
      },
    },
  });

  const notConfirmedPreOrders = await prisma.preOrder.findMany({
    where: {
      scheduledDate: { lte: now },
      status: "PENDING",
    },
  });

  // Update pending pre-orders to Cancelled by restaurant
  if (notConfirmedPreOrders.length > 0) {
    await prisma.preOrder.updateMany({
      where: { id: { in: notConfirmedPreOrders.map((po) => po.id) } },
      data: { status: "CANCELLED_BY_RESTAURANT" },
    });
  }

  if (!preOrders.length) {
    return NextResponse.json({ message: "No pre-orders to convert." });
  }

  const results = [];

  for (const preorder of preOrders) {
    const totalItemCost = preorder.PreOrderItem.reduce((sum, item) => {
      return sum + item.quantity * item.menuItem.price;
    }, 0);

    const deliveryFee = preorder.restaurant.deliveryFee || 0;
    const totalAmount = totalItemCost + deliveryFee;

    const order = await prisma.order.create({
      data: {
        userId: preorder.userId,
        restaurantId: preorder.restaurant.id,
        address: preorder.address || "",
        status: "PLACED",
        isScheduled: true,
        scheduledAt: preorder.scheduledDate,
        totalAmount,
        deliveryFee,
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
        status: "CONVERTED",
      },
    });

    results.push({ preOrderId: preorder.id, orderId: order.id });
  }

  return NextResponse.json({
    converted: results.length,
    orders: results,
  });
}
