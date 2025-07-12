import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { authMiddleware } from "@/lib/auth";
import { OrderStatus } from "../../../../prisma/generated/prisma";

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
      name,
      phone,
    }: {
      restaurantId: string;
      items: CartItem[];
      totalAmount: number;
      deliveryFee: number;
      address: string;
      name?: string;
      phone?: string;
    } = await req.json();

    // Validate request body
    if (
      !restaurantId ||
      !items?.length ||
      !totalAmount ||
      typeof deliveryFee !== "number" ||
      !address
    ) {
      return NextResponse.json(
        { error: "Missing or invalid fields" },
        { status: 400 }
      );
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        userId: user.clerkId,
        name: name || "",
        phone: phone || "",
        restaurantId,
        status: OrderStatus.PLACED,
        placedAt: new Date(), // Set the order status to PLACED
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

    return NextResponse.json({
      success: true,
      message: "Order placed successfully",
      orderId: order.id,
    });
  } catch (error) {
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
