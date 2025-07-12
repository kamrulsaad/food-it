// /api/user/orders/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

interface OrderParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  req: Request,
  { params }: { params: OrderParams["params"] }
) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      OrderItem: {
        include: {
          menuItem: true,
        },
      },
      restaurant: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
