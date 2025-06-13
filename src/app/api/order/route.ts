import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";


type CartItem = {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
  note?: string;
};

export async function POST(req: Request) {
  try {
    const user = await authMiddleware();
    if (!user?.clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
      restaurantId,
      items,
      totalAmount,
      deliveryFee,
      address,
    }: {
      restaurantId: string;
      items: CartItem[];
      totalAmount: number;
      deliveryFee: number;
      address: string;
    } = await req.json();

    // Basic validation
    if (!restaurantId || !items?.length || !totalAmount || !address) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Create order with nested OrderItems
    const order = await prisma.order.create({
      data: {
        userId: user.clerkId,
        restaurantId,
        status: "PENDING",
        totalAmount,
        deliveryFee,
        address,
        OrderItem: {
          create: items.map((item) => ({
            menuItemId: item.itemId,
            quantity: item.quantity,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
